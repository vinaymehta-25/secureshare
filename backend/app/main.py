"""
App entrypoint. Wires together the database, routers, and middleware.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, notes
from app.config import settings

# Creates tables if they don't exist yet. Fine for local dev;
# in a real production setup you'd use Alembic migrations instead.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SecureShare API",
    description="A small notes app used to demonstrate a DevSecOps pipeline.",
    version="0.1.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(notes.router)


@app.get("/health")
def health_check():
    """Used later by Docker healthchecks and CI smoke tests."""
    return {"status": "ok"}
