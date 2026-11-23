"""Listings CRUD, likes, and contribution/team-join endpoints."""

import json

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import ContributionRequest, Listing, ListingLike, User
from backend.schemas import (
    ContributionCreate,
    ContributionResponse,
    LikeToggleResponse,
    ListingCreate,
    ListingResponse,
    ListingUpdate,
)
from backend.security import get_current_user, get_optional_current_user

router = APIRouter(prefix="/api/listings", tags=["Listings"])


def _serialize_listing(
    listing: Listing,
    db: Session,
    current_user: User | None = None,
) -> ListingResponse:
    try:
        roles = json.loads(listing.roles_json or "[]")
    except json.JSONDecodeError:
        roles = []
    try:
        tech = json.loads(listing.tech_json or "[]")
    except json.JSONDecodeError:
        tech = []

    liked_by_me = False
    requested_by_me = False
    if current_user:
        liked_by_me = (
            db.scalar(
                select(ListingLike.id).where(
                    ListingLike.user_id == current_user.id,
                    ListingLike.listing_id == listing.id,
                )
            )
            is not None
        )
        requested_by_me = (
            db.scalar(
                select(ContributionRequest.id).where(
                    ContributionRequest.user_id == current_user.id,
                    ContributionRequest.listing_id == listing.id,
                )
            )
            is not None
        )

    leader_name = listing.owner.full_name if listing.owner else "Student"
    return ListingResponse(
        id=listing.id,
        owner_id=listing.owner_id,
        leader=leader_name,
        type=listing.type,
        title=listing.title,
        desc=listing.desc,
        overview=listing.overview or listing.desc,
        uni=listing.uni,
        roles=roles,
        tech=tech,
        github=listing.github,
        contributors_count=listing.contributors_count,
        team_current=listing.team_current,
        team_max=listing.team_max,
        likes=listing.likes_count,
        liked_by_me=liked_by_me,
        requested_by_me=requested_by_me,
        created_at=listing.created_at,
    )


@router.get("", response_model=list[ListingResponse])
def list_listings(
    type: str | None = Query(default=None),
    uni: str | None = Query(default=None),
    role: str | None = Query(default=None),
    tech: str | None = Query(default=None),
    q: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    """List projects, hackathons, and competitions with optional filters."""
    stmt = select(Listing).order_by(desc(Listing.created_at), desc(Listing.id))
    if type and type != "all":
        stmt = stmt.where(Listing.type == type)
    if uni:
        stmt = stmt.where(Listing.uni == uni)

    rows = db.scalars(stmt).all()
    results = [_serialize_listing(row, db, current_user) for row in rows]

    if role:
        results = [item for item in results if role in item.roles]
    if tech:
        results = [item for item in results if tech in item.tech]
    if q:
        needle = q.strip().lower()
        results = [
            item
            for item in results
            if needle
            in " ".join(
                [item.title, item.desc, item.uni, item.leader, *item.roles, *item.tech]
            ).lower()
        ]
    return results


@router.get("/mine", response_model=list[ListingResponse])
def list_my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return listings created by the authenticated student."""
    rows = db.scalars(
        select(Listing)
        .where(Listing.owner_id == current_user.id)
        .order_by(desc(Listing.created_at), desc(Listing.id))
    ).all()
    return [_serialize_listing(row, db, current_user) for row in rows]


@router.get("/{listing_id}", response_model=ListingResponse)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    """Get a single listing by ID."""
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")
    return _serialize_listing(listing, db, current_user)


@router.post("", response_model=ListingResponse, status_code=status.HTTP_201_CREATED)
def create_listing(
    payload: ListingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new project, hackathon, or competition listing."""
    is_project = payload.type == "project"
    default_max = 3 if payload.type == "competition" else 4
    listing = Listing(
        owner_id=current_user.id,
        type=payload.type,
        title=payload.title.strip(),
        desc=payload.desc.strip(),
        overview=(payload.overview or payload.desc).strip(),
        uni=payload.uni,
        roles_json=json.dumps(payload.roles),
        tech_json=json.dumps(payload.tech),
        github=payload.github if is_project else "",
        contributors_count=1,
        team_current=None if is_project else 1,
        team_max=None if is_project else (payload.team_max or default_max),
        likes_count=0,
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return _serialize_listing(listing, db, current_user)


@router.put("/{listing_id}", response_model=ListingResponse)
def update_listing(
    listing_id: int,
    payload: ListingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a listing owned by the authenticated student."""
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")
    if listing.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own listings.",
        )

    if payload.title is not None:
        listing.title = payload.title.strip()
    if payload.desc is not None:
        listing.desc = payload.desc.strip()
    if payload.overview is not None:
        listing.overview = payload.overview.strip()
    if payload.uni is not None:
        listing.uni = payload.uni
    if payload.roles is not None:
        listing.roles_json = json.dumps(payload.roles)
    if payload.tech is not None:
        listing.tech_json = json.dumps(payload.tech)
    if payload.github is not None and listing.type == "project":
        listing.github = payload.github

    db.add(listing)
    db.commit()
    db.refresh(listing)
    return _serialize_listing(listing, db, current_user)


@router.delete("/{listing_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_listing(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a listing owned by the authenticated student."""
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")
    if listing.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own listings.",
        )
    db.delete(listing)
    db.commit()


@router.post("/{listing_id}/like", response_model=LikeToggleResponse)
def toggle_like(
    listing_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle a like on a project listing."""
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")
    if listing.type != "project":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Likes are only supported on projects.",
        )

    existing = db.scalar(
        select(ListingLike).where(
            ListingLike.user_id == current_user.id,
            ListingLike.listing_id == listing.id,
        )
    )
    if existing:
        db.delete(existing)
        listing.likes_count = max(0, listing.likes_count - 1)
        liked = False
    else:
        db.add(ListingLike(user_id=current_user.id, listing_id=listing.id))
        listing.likes_count += 1
        liked = True

    db.add(listing)
    db.commit()
    db.refresh(listing)
    return LikeToggleResponse(listing_id=listing.id, liked=liked, likes=listing.likes_count)


@router.post(
    "/{listing_id}/contribute",
    response_model=ContributionResponse,
    status_code=status.HTTP_201_CREATED,
)
def send_contribution_invite(
    listing_id: int,
    payload: ContributionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a non-withdrawable contribution / team-join request."""
    listing = db.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")

    existing = db.scalar(
        select(ContributionRequest).where(
            ContributionRequest.user_id == current_user.id,
            ContributionRequest.listing_id == listing.id,
        )
    )
    if existing:
        return ContributionResponse(
            id=existing.id,
            listing_id=existing.listing_id,
            user_id=existing.user_id,
            role=existing.role,
            note=existing.note,
            status=existing.status,
            created_at=existing.created_at,
        )

    req = ContributionRequest(
        user_id=current_user.id,
        listing_id=listing.id,
        role=payload.role.strip(),
        note=payload.note.strip(),
        status="sent",
    )
    db.add(req)

    if listing.type == "project":
        listing.contributors_count += 1
    elif listing.team_current is not None:
        listing.team_current += 1

    db.add(listing)
    db.commit()
    db.refresh(req)
    return ContributionResponse(
        id=req.id,
        listing_id=req.listing_id,
        user_id=req.user_id,
        role=req.role,
        note=req.note,
        status=req.status,
        created_at=req.created_at,
    )
