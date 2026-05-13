from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status

from backend.db.queries import create_question, get_attempts, get_question, get_questions, log_attempt
from backend.db.supabase import CurrentUser, SupabaseClient
from backend.models.schemas import (
    AnswerResult,
    HintRequest,
    HintResponse,
    Question,
    QuestionCreate,
    QuestionDifficulty,
    QuestionDomain,
    ReviewQuestion,
    SubmitAnswerRequest,
)
from backend.services.hints import generate_hint
from backend.services.spaced_rep import review_priority, select_review_questions

router = APIRouter(prefix="/questions", tags=["questions"])


@router.get("", response_model=List[Question])
def list_questions(
    db: SupabaseClient,
    domain: Optional[QuestionDomain] = None,
    topic: Optional[str] = None,
    difficulty: Optional[QuestionDifficulty] = None,
    limit: int = Query(default=10, ge=1, le=50),
):
    try:
        return get_questions(db, domain=domain, topic=topic, difficulty=difficulty, limit=limit)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Could not load questions from Supabase: {exc}",
        ) from exc


@router.post("", response_model=Question, status_code=status.HTTP_201_CREATED)
def add_question(payload: QuestionCreate, db: SupabaseClient, user: CurrentUser):
    return create_question(db, payload)


@router.get("/review", response_model=List[ReviewQuestion])
def review_questions(db: SupabaseClient, user: CurrentUser, limit: int = Query(default=10, ge=1, le=25)):
    attempts = get_attempts(db, user.id, limit=250)
    due_attempts = select_review_questions(attempts, limit=limit)

    review_items = []
    for attempt in due_attempts:
        question = attempt.get("questions") or get_question(db, attempt["question_id"])
        if question:
            review_items.append(
                {
                    "question": question,
                    "priority": review_priority(attempt),
                    "reason": "Missed or due for spaced repetition review",
                }
            )

    return review_items


@router.get("/{question_id}", response_model=Question)
def retrieve_question(question_id: str, db: SupabaseClient):
    question = get_question(db, question_id)
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    return question


@router.post("/submit", response_model=AnswerResult)
def submit_answer(payload: SubmitAnswerRequest, db: SupabaseClient, user: CurrentUser):
    question = get_question(db, payload.question_id)
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    attempt = log_attempt(db, user.id, question, payload)

    return {
        "correct": attempt["correct"],
        "correct_answer": question["correct_answer"],
        "explanation": question.get("explanation"),
        "solution_steps": question.get("solution_steps") or [],
        "next_review_at": attempt.get("next_review_at"),
    }


@router.post("/{question_id}/hint", response_model=HintResponse)
async def question_hint(question_id: str, payload: HintRequest, db: SupabaseClient, user: CurrentUser):
    question = get_question(db, question_id)
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")

    hint = await generate_hint(question, payload)
    return {"hint": hint}
