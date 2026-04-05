import os
import re
import socket
from urllib.parse import urlparse

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

# Direct DB host is IPv6-only (AAAA only in DNS). Hosts like Render have no IPv6 egress.
_DIRECT_SUPABASE_DB = re.compile(r"^db\.([^.]+)\.supabase\.co$", re.IGNORECASE)


def _raise_if_direct_supabase_on_render(database_url: str) -> None:
    if not os.environ.get("RENDER"):
        return
    try:
        parsed = urlparse(database_url)
    except Exception:
        return
    host = (parsed.hostname or "").lower()
    m = _DIRECT_SUPABASE_DB.match(host)
    if not m:
        return
    ref = m.group(1)
    raise RuntimeError(
        f"DATABASE_URL uses Supabase direct host {host!r}, which is IPv6-only. "
        "Render cannot reach it, so startup will always fail with 'Network is unreachable'.\n\n"
        "Use the Session pooler URI instead: Supabase Dashboard → Connect → Session pooler → copy.\n"
        "It looks like:\n"
        f"  postgresql://postgres.{ref}:PASSWORD@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require\n"
        "Match <region> to your project (e.g. West US / N. California → aws-0-us-west-1). "
        f"The username must include your project ref: postgres.{ref}"
    )


def _connect_args(database_url: str) -> dict:
    """TLS for Supabase; optional IPv4 hostaddr when an A record exists (dual-stack hosts)."""
    args: dict = {"connect_timeout": 10}
    try:
        parsed = urlparse(database_url)
    except Exception:
        return args

    hostname = parsed.hostname
    if not hostname:
        return args

    host = hostname.lower()
    is_supabase = host.endswith(".supabase.co") or ".pooler.supabase.com" in host
    if not is_supabase:
        return args

    query = (parsed.query or "").lower()
    if "sslmode=" not in query:
        args["sslmode"] = "require"

    try:
        infos = socket.getaddrinfo(
            hostname,
            None,
            family=socket.AF_INET,
            type=socket.SOCK_STREAM,
        )
    except OSError:
        infos = []
    if infos:
        args["hostaddr"] = infos[0][4][0]
    else:
        try:
            args["hostaddr"] = socket.gethostbyname(hostname)
        except OSError:
            pass

    return args


_raise_if_direct_supabase_on_render(settings.database_url)

engine = create_engine(
    settings.database_url,
    connect_args=_connect_args(settings.database_url),
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    from app import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
