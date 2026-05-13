from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional
from uuid import UUID

from supabase import Client

from backend.models.schemas import (
    AnswerChoice,
    LessonProgressUpdate,
    QuestionCreate,
    QuestionDifficulty,
    QuestionDomain,
    SubmitAnswerRequest,
    UserProfileUpdate,
)
from backend.services.spaced_rep import next_review_date


def _data(response):
    return response.data or []


def get_questions(
    db: Client,
    domain: Optional[QuestionDomain] = None,
    topic: Optional[str] = None,
    difficulty: Optional[QuestionDifficulty] = None,
    limit: int = 10,
):
    query = db.table("questions").select("*").limit(limit)

    if domain:
        query = query.eq("domain", domain)
    if topic:
        query = query.ilike("topic", f"%{topic}%")
    if difficulty:
        query = query.eq("difficulty", difficulty)

    return _data(query.execute())


def get_question(db: Client, question_id: UUID):
    response = db.table("questions").select("*").eq("id", str(question_id)).single().execute()
    return response.data


def create_question(db: Client, payload: QuestionCreate):
    response = db.table("questions").insert(payload.model_dump(mode="json")).execute()
    return _data(response)[0]


def log_attempt(db: Client, user_id: str, question: dict, payload: SubmitAnswerRequest):
    correct = payload.selected_answer == question["correct_answer"]
    review_at = next_review_date(correct=correct, previous_correct_count=0)
    row = {
        "user_id": user_id,
        "question_id": str(payload.question_id),
        "selected_answer": payload.selected_answer,
        "correct": correct,
        "time_spent_seconds": payload.time_spent_seconds,
        "attempted_at": datetime.now(timezone.utc).isoformat(),
        "next_review_at": review_at.isoformat(),
    }
    response = db.table("attempts").insert(row).execute()
    return _data(response)[0]


def get_attempts(db: Client, user_id: str, limit: int = 200):
    response = (
        db.table("attempts")
        .select("*, questions(*)")
        .eq("user_id", user_id)
        .order("attempted_at", desc=True)
        .limit(limit)
        .execute()
    )
    return _data(response)


def upsert_profile(db: Client, user_id: str, email: Optional[str], payload: UserProfileUpdate):
    row = {"id": user_id, "email": email, **payload.model_dump(mode="json", exclude_unset=True)}
    response = db.table("profiles").upsert(row, on_conflict="id").execute()
    return _data(response)[0]


def get_profile(db: Client, user_id: str):
    response = db.table("profiles").select("*").eq("id", user_id).maybe_single().execute()
    return response.data


def upsert_progress(db: Client, user_id: str, payload: LessonProgressUpdate):
    row = {"user_id": user_id, **payload.model_dump(mode="json")}
    response = db.table("progress").upsert(
        row,
        on_conflict="user_id,course_slug,lesson_index",
    ).execute()
    return _data(response)[0]


def get_progress(db: Client, user_id: str, course_slug: Optional[str] = None):
    query = db.table("progress").select("*").eq("user_id", user_id).order("course_slug").order("lesson_index")
    if course_slug:
        query = query.eq("course_slug", course_slug)
    return _data(query.execute())


def add_bookmark(db: Client, user_id: str, question_id: UUID):
    response = db.table("bookmarks").upsert(
        {"user_id": user_id, "question_id": str(question_id)},
        on_conflict="user_id,question_id",
    ).execute()
    return _data(response)[0]


def remove_bookmark(db: Client, user_id: str, question_id: UUID):
    db.table("bookmarks").delete().eq("user_id", user_id).eq("question_id", str(question_id)).execute()
    return {"removed": True}


def get_bookmarks(db: Client, user_id: str):
    response = (
        db.table("bookmarks")
        .select("*, questions(*)")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )
    return _data(response)
