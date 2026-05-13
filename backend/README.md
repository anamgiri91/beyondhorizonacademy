# Beyond Horizon Academy Backend

FastAPI backend for SAT questions, progress tracking, bookmarks, spaced repetition, and AI hints.

## Stack

- Python + FastAPI
- Supabase PostgreSQL + Supabase Auth
- Anthropic Claude API for hints

## Setup

```bash
python -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
uvicorn backend.main:app --reload --port 8000
```

API docs will be available at `http://127.0.0.1:8000/docs`.

## Environment Variables

- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: public anon key, useful for token verification fallback
- `SUPABASE_SERVICE_ROLE_KEY`: server-only key for backend DB operations
- `ANTHROPIC_API_KEY`: optional; without it, hints use a safe fallback nudge
- `ANTHROPIC_MODEL`: optional, defaults to `claude-3-5-haiku-latest`

## Database

Run `backend/sql/schema.sql` in the Supabase SQL editor. For sample data, also run `backend/sql/seed_sample_questions.sql`.

## Route Groups

- `GET /health`
- `GET /questions`
- `POST /questions`
- `POST /questions/submit`
- `GET /questions/review`
- `POST /questions/{question_id}/hint`
- `GET /progress`
- `PUT /progress/lesson`
- `GET /progress/stats`
- `GET /progress/attempt-summary`
- `GET /progress/analytics`
- `GET /user/me`
- `PUT /user/me`
- `GET /user/bookmarks`
- `POST /user/bookmarks`
- `DELETE /user/bookmarks/{question_id}`

Most routes expect `Authorization: Bearer <supabase_access_token>`.

## Production

Use Python 3.11 for deployment.

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

Set `CORS_ORIGINS` to the deployed frontend URL:

```env
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

Use `backend/.env.example` as the deployment environment checklist. Keep `SUPABASE_SERVICE_ROLE_KEY` on the backend only.
