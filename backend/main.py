import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import progress, questions, users

DEFAULT_CORS_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:5173",
    "http://localhost:5174",
]


def get_allowed_origins():
    origins = os.getenv("CORS_ORIGINS", "")
    configured_origins = [origin.strip() for origin in origins.split(",") if origin.strip()]
    return configured_origins or DEFAULT_CORS_ORIGINS


app = FastAPI(
    title="Beyond Horizon Academy API",
    description="FastAPI backend for SAT practice, progress tracking, spaced repetition, and AI hints.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions.router)
app.include_router(progress.router)
app.include_router(users.router)


@app.get("/health", tags=["system"])
def health():
    return {"status": "ok"}
