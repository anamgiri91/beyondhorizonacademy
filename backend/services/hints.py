from __future__ import annotations

import os

import httpx

from backend.models.schemas import HintRequest

ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"


async def generate_hint(question: dict, payload: HintRequest) -> str:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    model = os.getenv("ANTHROPIC_MODEL", "claude-3-5-haiku-latest")

    if not api_key:
        return fallback_hint(question)

    prompt = f"""
You are a careful SAT tutor. Give one helpful nudge, not the full answer.
Do not reveal the correct option. Help the student notice the next reasoning step.

Question:
{question.get("prompt")}

Choices:
{question.get("choices")}

Student work:
{payload.student_work or "No work provided."}

Selected answer, if any: {payload.selected_answer or "None"}
""".strip()

    body = {
        "model": model,
        "max_tokens": 180,
        "messages": [{"role": "user", "content": prompt}],
    }
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(ANTHROPIC_URL, json=body, headers=headers)
        response.raise_for_status()
        data = response.json()

    return "".join(block.get("text", "") for block in data.get("content", [])).strip()


def fallback_hint(question: dict) -> str:
    skill = question.get("skill", "this skill")
    return (
        f"Start by naming what the question is testing: {skill}. "
        "Before checking the choices again, predict what the correct answer must prove or calculate."
    )
