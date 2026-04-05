import socket
from urllib.parse import urlparse

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings


def _connect_args(database_url: str) -> dict:
    """TLS + IPv4 for Supabase; local Docker unchanged.

    Render (and similar) often has no IPv6 egress. Supabase DNS returns AAAA first,
    so psycopg2 tries IPv6 and fails with "Network is unreachable". Resolving an A
    record and passing hostaddr forces IPv4 while the URL host still satisfies TLS.
    """
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

    return args


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
