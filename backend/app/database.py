import os
import re
import socket
from urllib.parse import parse_qsl, quote_plus, unquote, urlencode, urlparse, urlunparse

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.pool import NullPool, QueuePool

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


def _merge_query_params(url: str, extra: dict[str, str]) -> str:
    parsed = urlparse(url)
    pairs = list(parse_qsl(parsed.query, keep_blank_values=True))
    keys_lower = {k.lower() for k, _ in pairs}
    for k, v in extra.items():
        if k.lower() not in keys_lower:
            pairs.append((k, v))
            keys_lower.add(k.lower())
    return urlunparse(parsed._replace(query=urlencode(pairs)))


def _finalize_supabase_url(url: str) -> str:
    """Supavisor transaction mode (6543) needs pgbouncer=true; SQLAlchemy+psycopg needs prepare_threshold=None."""
    try:
        parsed = urlparse(url)
    except Exception:
        return url
    host = (parsed.hostname or "").lower()
    port = parsed.port
    if not host:
        return url

    is_supabase = (
        host.endswith(".supabase.co")
        or ".pooler.supabase.com" in host
    )
    if not is_supabase:
        return url

    extra: dict[str, str] = {}
    if port == 6543 and "pgbouncer=true" not in (parsed.query or "").lower():
        extra["pgbouncer"] = "true"
    if "sslmode=" not in (parsed.query or "").lower():
        extra["sslmode"] = "require"

    if not extra:
        return url
    return _merge_query_params(url, extra)


def _sqlalchemy_driver_url(url: str) -> str:
    """Use psycopg3 so we can set prepare_threshold=None for Supabase transaction pooler (port 6543)."""
    u = url.strip()
    if u.startswith("postgres://"):
        u = "postgresql://" + u[len("postgres://") :]
    scheme0 = u.split("://", 1)[0]
    if "+" in scheme0:
        return u
    if u.startswith("postgresql://"):
        return "postgresql+psycopg://" + u[len("postgresql://") :]
    return u


def _is_supabase_transaction_pooler(url: str) -> bool:
    try:
        p = urlparse(url)
    except Exception:
        return False
    host = (p.hostname or "").lower()
    if p.port != 6543:
        return False
    return host.endswith(".supabase.co") or ".pooler.supabase.com" in host


def _connect_args(database_url: str) -> dict:
    """TLS + optional IPv4 hostaddr; disable prepared statements for PgBouncer transaction mode."""
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

    if _is_supabase_transaction_pooler(database_url):
        args["prepare_threshold"] = None

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


_raw_url = _effective_database_url(settings.database_url)
_db_url = _finalize_supabase_url(_raw_url)
_engine_url = _sqlalchemy_driver_url(_db_url)

_pool_cls = NullPool if _is_supabase_transaction_pooler(_db_url) else QueuePool
_pool_kw: dict = {"poolclass": _pool_cls}
if _pool_cls is QueuePool:
    _pool_kw.update({"pool_pre_ping": True, "pool_size": 5, "max_overflow": 10})
else:
    _pool_kw["pool_pre_ping"] = False

engine = create_engine(_engine_url, connect_args=_connect_args(_db_url), **_pool_kw)

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
