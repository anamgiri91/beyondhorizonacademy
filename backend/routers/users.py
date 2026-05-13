from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from backend.db.queries import add_bookmark, get_bookmarks, get_profile, remove_bookmark, upsert_profile
from backend.db.supabase import CurrentUser, SupabaseClient
from backend.models.schemas import Bookmark, BookmarkRequest, UserProfile, UserProfileUpdate

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/me", response_model=UserProfile)
def me(db: SupabaseClient, user: CurrentUser):
    profile = get_profile(db, user.id)
    if profile:
        return profile

    return upsert_profile(db, user.id, user.email, UserProfileUpdate())


@router.put("/me", response_model=UserProfile)
def update_me(payload: UserProfileUpdate, db: SupabaseClient, user: CurrentUser):
    return upsert_profile(db, user.id, user.email, payload)


@router.get("/bookmarks")
def list_bookmarks(db: SupabaseClient, user: CurrentUser):
    return get_bookmarks(db, user.id)


@router.post("/bookmarks", response_model=Bookmark)
def save_bookmark(payload: BookmarkRequest, db: SupabaseClient, user: CurrentUser):
    return add_bookmark(db, user.id, payload.question_id)


@router.delete("/bookmarks/{question_id}")
def delete_bookmark(question_id: str, db: SupabaseClient, user: CurrentUser):
    removed = remove_bookmark(db, user.id, question_id)
    if not removed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bookmark not found")
    return removed
