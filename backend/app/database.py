from urllib.parse import urlparse

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings


def _connect_args(database_url: str) -> dict:
    """Supabase (and other remote Postgres) requires TLS; local Docker typically does not."""
    args: dict = {"connect_timeout": 10}
    try:
        parsed = urlparse(database_url)
    except Exception:
        return args
    query = (parsed.query or "").lower()
    if "sslmode=" in query:
        return args
    host = (parsed.hostname or "").lower()
    if host.endswith(".supabase.co") or ".pooler.supabase.com" in host:
        args["sslmode"] = "require"
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
