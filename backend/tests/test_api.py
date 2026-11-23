"""End-to-end API tests for UniForge FastAPI backend (JWT + SQLite + SQLAlchemy)."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.database import Base, get_db
from backend.main import app


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        future=True,
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


def _register_user(client: TestClient, email: str = "alikhan@sdu.edu.kz", password: str = "StrongPass123"):
    return client.post(
        "/api/auth/register",
        json={
            "full_name": "Alikhan Saparov",
            "email": email,
            "password": password,
            "university": "SDU",
            "role": "Backend",
            "skills": ["Python", "FastAPI", "PostgreSQL"],
        },
    )


def test_health_and_options(client: TestClient):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"

    opts = client.get("/api/auth/options")
    assert opts.status_code == 200
    assert "SDU" in opts.json()["universities"]
    assert "Python" in opts.json()["tech_stack"]


def test_register_login_and_me_profile_flow(client: TestClient):
    reg = _register_user(client)
    assert reg.status_code == 201
    data = reg.json()
    assert data["token_type"] == "bearer"
    assert data["access_token"]
    assert data["user"]["email"] == "alikhan@sdu.edu.kz"
    assert data["user"]["university"] == "SDU"

    # Duplicate registration rejected
    dup = _register_user(client)
    assert dup.status_code == 409

    # Wrong password rejected
    bad_login = client.post(
        "/api/auth/login",
        json={"email": "alikhan@sdu.edu.kz", "password": "wrongpassword"},
    )
    assert bad_login.status_code == 401

    # Valid login issues JWT
    login = client.post(
        "/api/auth/login",
        json={"email": "alikhan@sdu.edu.kz", "password": "StrongPass123"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Unauthenticated /me fails
    assert client.get("/api/auth/me").status_code == 401

    # Authenticated /me succeeds
    me = client.get("/api/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["full_name"] == "Alikhan Saparov"

    # Update profile
    updated = client.put(
        "/api/auth/me",
        headers=headers,
        json={
            "full_name": "Alikhan S.",
            "university": "KBTU",
            "role": "AI / ML",
            "about": "Building agentic student tools.",
            "skills": ["Python", "LangGraph"],
            "github": "https://github.com/alikhan",
            "linkedin": "",
            "telegram": "https://t.me/alikhan_dev",
        },
    )
    assert updated.status_code == 200
    assert updated.json()["university"] == "KBTU"
    assert updated.json()["skills"] == ["Python", "LangGraph"]


def test_static_validation_on_register(client: TestClient):
    res = client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": "test@sdu.edu.kz",
            "password": "StrongPass123",
            "university": "Random Fake Uni",
            "role": "Backend",
            "skills": ["Python"],
        },
    )
    assert res.status_code == 422


def test_listings_crud_like_and_contribute(client: TestClient):
    token1 = _register_user(client, "owner@sdu.edu.kz").json()["access_token"]
    token2 = _register_user(client, "peer@kbtu.kz").json()["access_token"]
    h1 = {"Authorization": f"Bearer {token1}"}
    h2 = {"Authorization": f"Bearer {token2}"}

    created = client.post(
        "/api/listings",
        headers=h1,
        json={
            "type": "project",
            "title": "Campus AI Helper",
            "desc": "An open-source student assistant for university courses.",
            "uni": "SDU",
            "roles": ["Frontend", "Backend"],
            "tech": ["Python", "React"],
            "github": "https://github.com/uniforge/campus-ai",
        },
    )
    assert created.status_code == 201
    listing_id = created.json()["id"]

    # Non-owner cannot edit or delete
    assert (
        client.put(f"/api/listings/{listing_id}", headers=h2, json={"title": "Hacked"}).status_code
        == 403
    )
    assert client.delete(f"/api/listings/{listing_id}", headers=h2).status_code == 403

    # Owner can update
    upd = client.put(
        f"/api/listings/{listing_id}", headers=h1, json={"title": "Campus AI Helper v2"}
    )
    assert upd.status_code == 200
    assert upd.json()["title"] == "Campus AI Helper v2"

    # Peer can toggle like on project
    like1 = client.post(f"/api/listings/{listing_id}/like", headers=h2)
    assert like1.status_code == 200
    assert like1.json()["liked"] is True
    assert like1.json()["likes"] == 1

    like2 = client.post(f"/api/listings/{listing_id}/like", headers=h2)
    assert like2.json()["liked"] is False
    assert like2.json()["likes"] == 0

    # Peer can send non-withdrawable contribution invite
    c1 = client.post(
        f"/api/listings/{listing_id}/contribute",
        headers=h2,
        json={"note": "Happy to help with React UI!"},
    )
    assert c1.status_code == 201
    c2 = client.post(
        f"/api/listings/{listing_id}/contribute",
        headers=h2,
        json={"note": "Duplicate click"},
    )
    assert c2.status_code == 201
    assert c2.json()["id"] == c1.json()["id"]

    detail = client.get(f"/api/listings/{listing_id}", headers=h2).json()
    assert detail["requested_by_me"] is True
    assert detail["contributors_count"] == 2

    # Owner can delete
    assert client.delete(f"/api/listings/{listing_id}", headers=h1).status_code == 204
    assert client.get(f"/api/listings/{listing_id}").status_code == 404
