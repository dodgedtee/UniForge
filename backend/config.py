"""Application configuration and static platform catalogs."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"

DATABASE_URL = os.getenv(
    "UNIFORGE_DATABASE_URL",
    f"sqlite:///{(BASE_DIR / 'uniforge.db').as_posix()}",
)

SECRET_KEY = os.getenv(
    "UNIFORGE_SECRET_KEY",
    "uniforge-dev-secret-change-in-production-7c4d9f1a2b8e5a0c3f6e1d9b",
)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("UNIFORGE_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7))
)

ALLOWED_UNIVERSITIES = (
    "SDU",
    "KBTU",
    "Nazarbayev University",
    "AITU",
)

ALLOWED_ROLES = (
    "Frontend",
    "Backend",
    "AI / ML",
    "UI/UX",
    "Mobile",
    "Security",
    "QA",
    "Algorithms",
)

ALLOWED_TECH_STACK = (
    "Python",
    "React",
    "FastAPI",
    "LangGraph",
    "Node.js",
    "Java",
    "PostgreSQL",
    "Docker",
    "Go",
    "C++",
    "Flutter",
)

ALLOWED_LISTING_TYPES = ("project", "hackathon", "competition")
