from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List


def next_review_date(correct: bool, previous_correct_count: int = 0) -> datetime:
    """Small SM-2-inspired schedule for SAT review.

    Wrong answers come back soon. Repeated correct answers spread out.
    This is intentionally simple so it can be explained to students and tuned later.
    """

    now = datetime.now(timezone.utc)

    if not correct:
        return now + timedelta(days=2)

    intervals = [3, 7, 14, 30]
    interval_days = intervals[min(previous_correct_count, len(intervals) - 1)]
    return now + timedelta(days=interval_days)


def review_priority(attempt: Dict[str, Any]) -> float:
    attempted_at = datetime.fromisoformat(attempt["attempted_at"].replace("Z", "+00:00"))
    age_days = max((datetime.now(timezone.utc) - attempted_at).total_seconds() / 86400, 0)
    missed_bonus = 2.5 if not attempt.get("correct") else 1.0
    time_bonus = min((attempt.get("time_spent_seconds") or 0) / 90, 2.0)
    return round(age_days * missed_bonus + time_bonus, 3)


def select_review_questions(attempts: List[Dict[str, Any]], limit: int = 10) -> List[Dict[str, Any]]:
    due: Dict[str, Dict[str, Any]] = {}
    now = datetime.now(timezone.utc)

    for attempt in attempts:
      next_review_at = attempt.get("next_review_at")
      if next_review_at:
          review_at = datetime.fromisoformat(next_review_at.replace("Z", "+00:00"))
      else:
          review_at = datetime.fromisoformat(attempt["attempted_at"].replace("Z", "+00:00")) + timedelta(days=2)

      if review_at > now:
          continue

      question_id = attempt["question_id"]
      existing = due.get(question_id)
      if existing is None or review_priority(attempt) > review_priority(existing):
          due[question_id] = attempt

    return sorted(due.values(), key=review_priority, reverse=True)[:limit]
