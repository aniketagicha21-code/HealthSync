import os
import re
import socket
from urllib.parse import quote_plus, unquote, urlparse, urlunparse

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings

# Direct DB host is IPv6-only in DNS. Render has no IPv6 egress — rewrite to session pooler on deploy.
_DIRECT_SUPABASE_DB = re.compile(r"^db\.([^.]+)\.supabase\.co$", re.IGNORECASE)


def _effective_database_url(url: str) -> str:
    """On Render, map direct db.<ref>.supabase.co URLs to IPv4-capable session pooler."""
    if not os.environ.get("RENDER"):
        return url
    try:
        parsed = urlparse(url)
    except Exception:
        return url
    host = (parsed.hostname or "").lower()
    m = _DIRECT_SUPABASE_DB.match(host)
    if not m:
        return url

    ref = m.group(1)
    region = (os.environ.get("SUPABASE_POOLER_REGION") or "us-west-1").strip() or "us-west-1"
    pooler = f"aws-0-{region}.pooler.supabase.com"
    user = f"postgres.{ref}"
    pw = unquote(parsed.password) if parsed.password else ""
    port = parsed.port or 5432
    netloc = f"{quote_plus(user)}:{quote_plus(pw)}@{pooler}:{port}"

    query = parsed.query or ""
    if "sslmode=" not in query.lower():
        query = f"{query}&sslmode=require" if query else "sslmode=require"

    new_url = urlunparse(
        (
            parsed.scheme,
            netloc,
            parsed.path or "/postgres",
            parsed.params,
            query,
            parsed.fragment,
        )
    )
    print(
        f"healthsync: using Supabase session pooler {pooler} (direct db host is IPv6-only on Render). "
        f"Set SUPABASE_POOLER_REGION if the pool region is not {region}.",
        flush=True,
    )
    return new_url


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


_db_url = _effective_database_url(settings.database_url)

engine = create_engine(
    _db_url,
    connect_args=_connect_args(_db_url),
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
