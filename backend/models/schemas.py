from __future__ import annotations

from datetime import date, datetime
from typing import Any, Literal, Optional, Dict, List
from uuid import UUID

from pydantic import BaseModel, Field

QuestionDomain = Literal["sat_math", "sat_english", "python", "dsa"]
QuestionDifficulty = Literal["easy", "medium", "hard"]
AnswerChoice = Literal["A", "B", "C", "D"]


class UserProfileBase(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=120)
    target_score: Optional[int] = Field(default=None, ge=400, le=1600)
    test_date: Optional[date] = None


class UserProfileCreate(UserProfileBase):
    pass


class UserProfileUpdate(UserProfileBase):
    pass


class UserProfile(UserProfileBase):
    id: UUID
    email: Optional[str] = None
    streak_days: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class QuestionBase(BaseModel):
    domain: QuestionDomain
    topic: str = Field(min_length=1, max_length=120)
    skill: str = Field(min_length=1, max_length=160)
    difficulty: QuestionDifficulty = "medium"
    prompt: str = Field(min_length=1)
    choices: Dict[AnswerChoice, str]
    correct_answer: AnswerChoice
    explanation: Optional[str] = None
    solution_steps: List[str] = Field(default_factory=list)
    source_label: str = "original"
    metadata: Dict[str, Any] = Field(default_factory=dict)


class QuestionCreate(QuestionBase):
    pass


class Question(QuestionBase):
    id: UUID
    created_at: Optional[datetime] = None


class QuestionFilters(BaseModel):
    domain: Optional[QuestionDomain] = None
    topic: Optional[str] = None
    difficulty: Optional[QuestionDifficulty] = None
    limit: int = Field(default=10, ge=1, le=50)


class SubmitAnswerRequest(BaseModel):
    question_id: UUID
    selected_answer: AnswerChoice
    time_spent_seconds: int = Field(ge=0, le=600)


class Attempt(BaseModel):
    id: UUID
    user_id: UUID
    question_id: UUID
    selected_answer: AnswerChoice
    correct: bool
    time_spent_seconds: int
    attempted_at: datetime


class AnswerResult(BaseModel):
    correct: bool
    correct_answer: AnswerChoice
    explanation: Optional[str] = None
    solution_steps: List[str] = Field(default_factory=list)
    next_review_at: Optional[datetime] = None


class LessonProgressUpdate(BaseModel):
    course_slug: str = Field(min_length=1, max_length=80)
    lesson_index: int = Field(ge=0)
    percent_complete: int = Field(ge=0, le=100)
    completed: bool = False


class LessonProgress(BaseModel):
    id: UUID
    user_id: UUID
    course_slug: str
    lesson_index: int
    percent_complete: int
    completed: bool
    updated_at: Optional[datetime] = None


class CourseStats(BaseModel):
    course_slug: str
    lessons_completed: int
    total_lessons_seen: int
    average_percent_complete: float


class BookmarkRequest(BaseModel):
    question_id: UUID


class Bookmark(BaseModel):
    id: UUID
    user_id: UUID
    question_id: UUID
    created_at: Optional[datetime] = None


class ReviewQuestion(BaseModel):
    question: Question
    priority: float
    reason: str


class HintRequest(BaseModel):
    question_id: UUID
    student_work: str = Field(default="", max_length=3000)
    selected_answer: Optional[AnswerChoice] = None


class HintResponse(BaseModel):
    hint: str
