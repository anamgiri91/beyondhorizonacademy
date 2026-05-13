from __future__ import annotations

from typing import Dict, List, Optional

from fastapi import APIRouter

from backend.db.queries import get_attempts, get_progress, upsert_progress
from backend.db.supabase import CurrentUser, SupabaseClient
from backend.models.schemas import CourseStats, LessonProgress, LessonProgressUpdate

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("", response_model=List[LessonProgress])
def list_progress(db: SupabaseClient, user: CurrentUser, course_slug: Optional[str] = None):
    return get_progress(db, user.id, course_slug=course_slug)


@router.put("/lesson", response_model=LessonProgress)
def update_lesson_progress(payload: LessonProgressUpdate, db: SupabaseClient, user: CurrentUser):
    return upsert_progress(db, user.id, payload)


@router.get("/stats", response_model=List[CourseStats])
def progress_stats(db: SupabaseClient, user: CurrentUser):
    rows = get_progress(db, user.id)
    grouped: Dict[str, List[dict]] = {}

    for row in rows:
        grouped.setdefault(row["course_slug"], []).append(row)

    return [
        {
            "course_slug": course_slug,
            "lessons_completed": sum(1 for row in course_rows if row.get("completed")),
            "total_lessons_seen": len(course_rows),
            "average_percent_complete": round(
                sum(row.get("percent_complete", 0) for row in course_rows) / max(len(course_rows), 1),
                2,
            ),
        }
        for course_slug, course_rows in grouped.items()
    ]


@router.get("/attempt-summary")
def attempt_summary(db: SupabaseClient, user: CurrentUser):
    attempts = get_attempts(db, user.id, limit=500)
    total = len(attempts)
    correct = sum(1 for attempt in attempts if attempt.get("correct"))

    by_skill: Dict[str, Dict[str, int]] = {}
    for attempt in attempts:
        question = attempt.get("questions") or {}
        skill = question.get("skill", "Unknown")
        by_skill.setdefault(skill, {"total": 0, "correct": 0})
        by_skill[skill]["total"] += 1
        by_skill[skill]["correct"] += int(bool(attempt.get("correct")))

    return {
        "total_attempts": total,
        "correct_attempts": correct,
        "accuracy": round(correct / total, 3) if total else 0,
        "by_skill": by_skill,
    }


@router.get("/analytics")
def learning_analytics(db: SupabaseClient, user: CurrentUser):
    attempts = list(reversed(get_attempts(db, user.id, limit=500)))
    daily: Dict[str, Dict[str, int]] = {}
    by_topic: Dict[str, Dict[str, int]] = {}

    for attempt in attempts:
        attempted_at = str(attempt.get("attempted_at", ""))[:10] or "Practice"
        question = attempt.get("questions") or {}
        topic = question.get("topic") or "Mixed Practice"
        is_correct = bool(attempt.get("correct"))

        daily.setdefault(attempted_at, {"attempts": 0, "correct": 0})
        daily[attempted_at]["attempts"] += 1
        daily[attempted_at]["correct"] += int(is_correct)

        by_topic.setdefault(topic, {"total": 0, "wrong": 0})
        by_topic[topic]["total"] += 1
        by_topic[topic]["wrong"] += int(not is_correct)

    score_trend = []
    running_attempts = 0
    running_correct = 0
    for day, row in daily.items():
        running_attempts += row["attempts"]
        running_correct += row["correct"]
        accuracy = running_correct / max(running_attempts, 1)
        score_trend.append(
            {
                "date": day,
                "attempts": row["attempts"],
                "accuracy": round(accuracy, 3),
                "estimated_score": round(400 + accuracy * 1200),
            }
        )

    weak_areas = [
        {
            "topic": topic,
            "total": row["total"],
            "wrong": row["wrong"],
            "percent_wrong": round(row["wrong"] / max(row["total"], 1), 3),
        }
        for topic, row in by_topic.items()
    ]
    weak_areas.sort(key=lambda item: item["percent_wrong"], reverse=True)

    return {
        "score_trend": score_trend,
        "weak_areas": weak_areas,
    }
