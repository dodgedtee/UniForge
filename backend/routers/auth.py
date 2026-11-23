"""Authentication and student profile endpoints."""

import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.config import ALLOWED_ROLES, ALLOWED_TECH_STACK, ALLOWED_UNIVERSITIES
from backend.database import get_db
from backend.models import User
from backend.schemas import (
    LoginRequest,
    ProfileUpdateRequest,
    RegisterRequest,
    TokenResponse,
    UserPublic,
)
from backend.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.get("/options")
def get_auth_options():
    """Return static platform options for universities, roles, and tech stack."""
    return {
        "universities": list(ALLOWED_UNIVERSITIES),
        "roles": list(ALLOWED_ROLES),
        "tech_stack": list(ALLOWED_TECH_STACK),
    }


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new student account and issue a JWT access token."""
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        university=payload.university,
        role=payload.role,
        about="",
        skills_json=json.dumps(payload.skills),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user_id=user.id, email=user.email)
    return TokenResponse(access_token=token, user=UserPublic.from_orm_user(user))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a student with email and password and issue a JWT token."""
    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(user_id=user.id, email=user.email)
    return TokenResponse(access_token=token, user=UserPublic.from_orm_user(user))


@router.get("/me", response_model=UserPublic)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated student's profile."""
    return UserPublic.from_orm_user(current_user)


@router.put("/me", response_model=UserPublic)
def update_me(
    payload: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the currently authenticated student's profile."""
    current_user.full_name = payload.full_name
    current_user.university = payload.university
    current_user.role = payload.role
    current_user.about = payload.about
    current_user.skills_json = json.dumps(payload.skills)
    current_user.github = payload.github
    current_user.linkedin = payload.linkedin
    current_user.telegram = payload.telegram

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return UserPublic.from_orm_user(current_user)


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    """Stateless JWT logout acknowledgement."""
    return {"message": f"Signed out {current_user.email}."}
