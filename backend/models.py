"""SQLAlchemy ORM models for UniForge."""

from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(100), nullable=False)
    university: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[str] = mapped_column(String(60), nullable=False)
    about: Mapped[str] = mapped_column(Text, default="", nullable=False)
    skills_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    github: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    linkedin: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    telegram: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    rating: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    listings: Mapped[list["Listing"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )
    requests: Mapped[list["ContributionRequest"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    likes: Mapped[list["ListingLike"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    type: Mapped[str] = mapped_column(String(30), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    desc: Mapped[str] = mapped_column(Text, nullable=False)
    overview: Mapped[str] = mapped_column(Text, default="", nullable=False)
    uni: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    roles_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    tech_json: Mapped[str] = mapped_column(Text, default="[]", nullable=False)
    github: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    contributors_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    team_current: Mapped[int | None] = mapped_column(Integer, nullable=True)
    team_max: Mapped[int | None] = mapped_column(Integer, nullable=True)
    likes_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    owner: Mapped["User"] = relationship(back_populates="listings")
    requests: Mapped[list["ContributionRequest"]] = relationship(
        back_populates="listing", cascade="all, delete-orphan"
    )
    likes: Mapped[list["ListingLike"]] = relationship(
        back_populates="listing", cascade="all, delete-orphan"
    )


class ContributionRequest(Base):
    __tablename__ = "contribution_requests"
    __table_args__ = (
        UniqueConstraint("user_id", "listing_id", name="uq_user_listing_request"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    listing_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("listings.id", ondelete="CASCADE"), index=True, nullable=False
    )
    role: Mapped[str] = mapped_column(String(60), default="", nullable=False)
    note: Mapped[str] = mapped_column(Text, default="", nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="sent", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="requests")
    listing: Mapped["Listing"] = relationship(back_populates="requests")


class ListingLike(Base):
    __tablename__ = "listing_likes"
    __table_args__ = (
        UniqueConstraint("user_id", "listing_id", name="uq_user_listing_like"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    listing_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("listings.id", ondelete="CASCADE"), index=True, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="likes")
    listing: Mapped["Listing"] = relationship(back_populates="likes")
