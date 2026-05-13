# Beyond Horizon Academy Learning Dashboard

A frontend-first React learning platform for SAT preparation and computer science foundations, now paired with a FastAPI backend foundation for questions, progress tracking, bookmarks, spaced repetition, and AI hints.

## Product Goal

Beyond Horizon Academy helps students move from passive studying to active reasoning. The app combines structured lessons, SAT-style practice, visual tools, and step-by-step explanations so students can understand why an answer works instead of memorizing answer keys.

## What Recruiters Should Notice

- React single-page application with reusable components and route-driven views.
- Professional SAT practice UI with timed mode, bookmarks, adaptive difficulty, formula sheets, and step-by-step solution reveal.
- FastAPI backend scaffold with Supabase-ready auth, PostgreSQL tables, reusable DB query functions, and automatic API docs.
- Data-driven course catalog, topic pages, lesson viewer, and SAT question modules.
- Clear path from frontend prototype to full-stack learning product.

## Current Frontend Features

- Homepage with product positioning, learning workflow, feature highlights, and project roadmap.
- Course catalog for SAT and Computer Science tracks.
- Lesson viewer with progress rings, lesson completion, and sidebar badges.
- SAT English practice organized by official-style skill categories.
- SAT Math practice with graph visualizer, formula sheet, timed mode, bookmarks, adaptive questions, and solution reveal.
- DSA array/search/sort visualizer.
- Python code stepper with execution and memory notes.

## Backend Features

- FastAPI app in `backend/`.
- Supabase Auth token verification.
- PostgreSQL schema for `profiles`, `questions`, `attempts`, `progress`, and `bookmarks`.
- `/questions` endpoints for fetching questions, submitting answers, review queues, and AI hints.
- `/progress` endpoints for lesson completion and analytics summaries.
- `/user` endpoints for profile and bookmarks.
- Spaced repetition service using a simple SM-2-inspired schedule.
- Claude hint service with a safe fallback if no API key is configured.

## Tech Stack

- React + Vite
- Vanilla CSS split by responsibility
- Python + FastAPI
- Supabase PostgreSQL + Supabase Auth
- Anthropic Claude API for hints

## Project Structure

- `src/components`: reusable UI pieces such as cards, header, footer, practice UI, and visualizers.
- `src/pages`: page-level views for Home, Courses, Topics, About, and Course Detail.
- `src/data`: editable course catalog, practice content, routes, and showcase data.
- `src/hooks`: reusable React state logic.
- `src/styles`: CSS split by base, header, cards, pages, course detail, and interactive features.
- `backend/routers`: FastAPI route groups.
- `backend/models`: Pydantic request/response schemas.
- `backend/db`: Supabase client setup and reusable queries.
- `backend/services`: spaced repetition and AI hint logic.
- `backend/sql`: Supabase SQL schema.

## Frontend Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Backend Setup

```bash
python -m venv backend/.venv
source backend/.venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
uvicorn backend.main:app --reload --port 8000
```

Then open `http://127.0.0.1:8000/docs`.

## Required Backend Keys

Create a Supabase project and add these to `backend/.env`:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY` optional for Claude hints

Run `backend/sql/schema.sql` in the Supabase SQL editor.

## Build

```bash
npm run build
```

## Note on Practice Content

The public project uses original SAT-style questions and explanations. Licensed or official question sets should be imported only when usage rights are clear.

## Connect Frontend To Backend

Run both servers:

```bash
# Terminal 1
cd /Users/anamgiri/Downloads/BeyondHorizonAcademy-main
source backend/.venv/bin/activate
uvicorn backend.main:app --reload --port 8000
```

```bash
# Terminal 2
cd /Users/anamgiri/Downloads/BeyondHorizonAcademy-main
npm run dev
```

The React app uses `http://127.0.0.1:8000` by default. To override it, create `.env` in the project root:

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

To test backend-loaded questions, run `backend/sql/seed_sample_questions.sql` in Supabase SQL Editor after running the main schema.

The frontend will show one of these states inside SAT practice:

- `Backend connected`: questions are loading from FastAPI/Supabase.
- `Backend connected - using local fallback`: API works, but the questions table is empty.
- `Backend offline - using local fallback`: backend is not reachable.

## Deployment

Recommended current setup:

- Frontend: Vercel
- Backend: Render Web Service
- Database/Auth: Supabase

### 1. Deploy the Backend on Render

Use the included `render.yaml`, or create a Render Web Service manually with:

```bash
Build Command: pip install -r backend/requirements.txt
Start Command: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

Add these Render environment variables:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CORS_ORIGINS=https://your-vercel-app.vercel.app
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-5-haiku-latest
```

Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never put it in Vercel.

After deployment, confirm:

```text
https://your-render-api.onrender.com/health
```

### 2. Deploy the Frontend on Vercel

Vercel settings:

```bash
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Add these Vercel environment variables:

```env
VITE_API_URL=https://your-render-api.onrender.com
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The included `vercel.json` keeps React routes working after refresh.

### 3. Update Supabase Auth URLs

In Supabase, go to `Authentication > URL Configuration`:

- Site URL: `https://your-vercel-app.vercel.app`
- Redirect URLs: `https://your-vercel-app.vercel.app`

For Google login, also make sure the Google provider callback URL from Supabase is added in Google Cloud under Authorized redirect URIs.

### 4. Update CORS After Frontend Deploys

Once Vercel gives you the final frontend URL, update Render:

```env
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

For local + deployed testing, use comma-separated origins:

```env
CORS_ORIGINS=http://127.0.0.1:5174,http://localhost:5174,https://your-vercel-app.vercel.app
```

### 5. Seed Questions

Run `backend/sql/schema.sql` in the Supabase SQL editor first. Then seed starter questions with `backend/sql/seed_sample_questions.sql`.

For the expanded seed set, run from the project root:

```bash
source backend/.venv/bin/activate
python -m backend.seed_more_questions
```

### Deployment Checklist

- `npm run build` passes locally.
- `backend.main` imports locally.
- Supabase tables exist and RLS is enabled.
- Render `/health` returns `{"status":"ok"}`.
- Vercel `VITE_API_URL` points to the deployed Render URL.
- Render `CORS_ORIGINS` includes the deployed Vercel URL.
- Supabase Auth Site URL and Redirect URLs include the deployed Vercel URL.
