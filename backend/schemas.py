"""Pydantic v2 request and response schemas for UniForge."""

import json
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from backend.config import (
    ALLOWED_LISTING_TYPES,
    ALLOWED_ROLES,
    ALLOWED_TECH_STACK,
    ALLOWED_UNIVERSITIES,
)

UniversityLiteral = Literal["SDU", "KBTU", "Nazarbayev University", "AITU"]
RoleLiteral = Literal[
    "Frontend", "Backend", "AI / ML", "UI/UX", "Mobile", "Security", "QA", "Algorithms"
]
ListingTypeLiteral = Literal["project", "hackathon", "competition"]


def _validate_subset(values: list[str], allowed: tuple[str, ...], field_name: str) -> list[str]:
    unique: list[str] = []
    for item in values:
        cleaned = item.strip()
        if cleaned not in allowed:
            raise ValueError(f"Unsupported {field_name}: '{cleaned}'")
        if cleaned not in unique:
            unique.append(cleaned)
    return unique


def _validate_https_host(value: str, allowed_hosts: tuple[str, ...], label: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        return ""
    if not cleaned.startswith("https://"):
        raise ValueError(f"{label} URL must start with https://")
    host_part = cleaned.removeprefix("https://").split("/", 1)[0].lower()
    if host_part not in allowed_hosts:
        raise ValueError(f"{label} URL must be on {', '.join(allowed_hosts)}")
    return cleaned


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    university: str = Field(..., min_length=2, max_length=100)
    role: str = Field(..., min_length=2, max_length=60)
    skills: list[str] = Field(default_factory=list)

    @field_validator("full_name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Full name must be at least 2 characters.")
        return cleaned

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: EmailStr) -> str:
        return str(v).strip().lower()

    @field_validator("university")
    @classmethod
    def validate_university(cls, v: str) -> str:
        if v not in ALLOWED_UNIVERSITIES:
            raise ValueError(f"University must be one of: {', '.join(ALLOWED_UNIVERSITIES)}")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ALLOWED_ROLES:
            raise ValueError(f"Role must be one of: {', '.join(ALLOWED_ROLES)}")
        return v

    @field_validator("skills")
    @classmethod
    def validate_skills(cls, v: list[str]) -> list[str]:
        return _validate_subset(v, ALLOWED_TECH_STACK, "skill")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: EmailStr) -> str:
        return str(v).strip().lower()


class ProfileUpdateRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    university: str = Field(..., min_length=2, max_length=100)
    role: str = Field(..., min_length=2, max_length=60)
    about: str = Field(default="", max_length=1000)
    skills: list[str] = Field(default_factory=list)
    github: str = Field(default="", max_length=255)
    linkedin: str = Field(default="", max_length=255)
    telegram: str = Field(default="", max_length=255)

    @field_validator("full_name")
    @classmethod
    def strip_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Full name must be at least 2 characters.")
        return cleaned

    @field_validator("university")
    @classmethod
    def validate_university(cls, v: str) -> str:
        if v not in ALLOWED_UNIVERSITIES:
            raise ValueError(f"University must be one of: {', '.join(ALLOWED_UNIVERSITIES)}")
        return v

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        if v not in ALLOWED_ROLES:
            raise ValueError(f"Role must be one of: {', '.join(ALLOWED_ROLES)}")
        return v

    @field_validator("skills")
    @classmethod
    def validate_skills(cls, v: list[str]) -> list[str]:
        return _validate_subset(v, ALLOWED_TECH_STACK, "skill")

    @field_validator("github")
    @classmethod
    def validate_github(cls, v: str) -> str:
        return _validate_https_host(v, ("github.com", "www.github.com"), "GitHub")

    @field_validator("linkedin")
    @classmethod
    def validate_linkedin(cls, v: str) -> str:
        return _validate_https_host(v, ("linkedin.com", "www.linkedin.com"), "LinkedIn")

    @field_validator("telegram")
    @classmethod
    def validate_telegram(cls, v: str) -> str:
        return _validate_https_host(v, ("t.me",), "Telegram")


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    full_name: str
    university: str
    role: str
    about: str
    skills: list[str]
    github: str
    linkedin: str
    telegram: str
    rating: int
    created_at: datetime

    @classmethod
    def from_orm_user(cls, user) -> "UserPublic":
        try:
            skills = json.loads(user.skills_json or "[]")
        except json.JSONDecodeError:
            skills = []
        return cls(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            university=user.university,
            role=user.role,
            about=user.about,
            skills=skills,
            github=user.github,
            linkedin=user.linkedin,
            telegram=user.telegram,
            rating=user.rating,
            created_at=user.created_at,
        )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic


class ListingCreate(BaseModel):
    type: str = Field(..., min_length=2, max_length=30)
    title: str = Field(..., min_length=2, max_length=150)
    desc: str = Field(..., min_length=5, max_length=2000)
    overview: str = Field(default="", max_length=4000)
    uni: str = Field(..., min_length=2, max_length=100)
    roles: list[str] = Field(..., min_length=1)
    tech: list[str] = Field(..., min_length=1)
    github: str = Field(default="", max_length=255)
    team_max: int | None = Field(default=None, ge=2, le=20)

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ALLOWED_LISTING_TYPES:
            raise ValueError(f"Type must be one of: {', '.join(ALLOWED_LISTING_TYPES)}")
        return v

    @field_validator("uni")
    @classmethod
    def validate_uni(cls, v: str) -> str:
        if v not in ALLOWED_UNIVERSITIES:
            raise ValueError(f"University must be one of: {', '.join(ALLOWED_UNIVERSITIES)}")
        return v

    @field_validator("roles")
    @classmethod
    def validate_roles(cls, v: list[str]) -> list[str]:
        return _validate_subset(v, ALLOWED_ROLES, "role")

    @field_validator("tech")
    @classmethod
    def validate_tech(cls, v: list[str]) -> list[str]:
        return _validate_subset(v, ALLOWED_TECH_STACK, "technology")

    @field_validator("github")
    @classmethod
    def validate_github(cls, v: str) -> str:
        return _validate_https_host(v, ("github.com", "www.github.com"), "GitHub")


class ListingUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=150)
    desc: str | None = Field(default=None, min_length=5, max_length=2000)
    overview: str | None = Field(default=None, max_length=4000)
    uni: str | None = Field(default=None, min_length=2, max_length=100)
    roles: list[str] | None = Field(default=None, min_length=1)
    tech: list[str] | None = Field(default=None, min_length=1)
    github: str | None = Field(default=None, max_length=255)

    @field_validator("uni")
    @classmethod
    def validate_uni(cls, v: str | None) -> str | None:
        if v is None:
            return v
        if v not in ALLOWED_UNIVERSITIES:
            raise ValueError(f"University must be one of: {', '.join(ALLOWED_UNIVERSITIES)}")
        return v

    @field_validator("roles")
    @classmethod
    def validate_roles(cls, v: list[str] | None) -> list[str] | None:
        if v is None:
            return v
        return _validate_subset(v, ALLOWED_ROLES, "role")

    @field_validator("tech")
    @classmethod
    def validate_tech(cls, v: list[str] | None) -> list[str] | None:
        if v is None:
            return v
        return _validate_subset(v, ALLOWED_TECH_STACK, "technology")

    @field_validator("github")
    @classmethod
    def validate_github(cls, v: str | None) -> str | None:
        if v is None:
            return v
        return _validate_https_host(v, ("github.com", "www.github.com"), "GitHub")


class ListingResponse(BaseModel):
    id: int
    owner_id: int
    leader: str
    type: str
    title: str
    desc: str
    overview: str
    uni: str
    roles: list[str]
    tech: list[str]
    github: str
    contributors_count: int
    team_current: int | None
    team_max: int | None
    likes: int
    liked_by_me: bool = False
    requested_by_me: bool = False
    created_at: datetime


class ContributionCreate(BaseModel):
    role: str = Field(default="", max_length=60)
    note: str = Field(default="", max_length=1000)


class ContributionResponse(BaseModel):
    id: int
    listing_id: int
    user_id: int
    role: str
    note: str
    status: str
    created_at: datetime


class LikeToggleResponse(BaseModel):
    listing_id: int
    liked: bool
    likes: int
