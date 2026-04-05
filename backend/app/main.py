import logging
import sys
import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

from app.config import settings
from app.database import init_db
from app.routes import analyses, analyze, users
from app.schemas import HealthResponse

_log = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await run_in_threadpool(init_db)
    except Exception:
        _log.exception(
            "Database init failed (check DATABASE_URL and TLS for Supabase; see README)"
        )
        traceback.print_exc(file=sys.stdout)
        sys.stdout.flush()
        raise
    yield


app = FastAPI(
    title="HealthSync API",
    description="Lab report PDF analysis with structured AI output and history.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(analyses.router)
app.include_router(analyze.router)


@app.get("/api/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok", service="healthsync-api")
