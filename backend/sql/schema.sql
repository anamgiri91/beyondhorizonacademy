create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  target_score integer check (target_score between 400 and 1600),
  test_date date,
  streak_days integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  domain text not null check (domain in ('sat_math', 'sat_english', 'python', 'dsa')),
  topic text not null,
  skill text not null,
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  prompt text not null,
  choices jsonb not null,
  correct_answer text not null check (correct_answer in ('A', 'B', 'C', 'D')),
  explanation text,
  solution_steps jsonb not null default '[]'::jsonb,
  source_label text not null default 'original',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_answer text not null check (selected_answer in ('A', 'B', 'C', 'D')),
  correct boolean not null,
  time_spent_seconds integer not null check (time_spent_seconds >= 0),
  attempted_at timestamptz not null default now(),
  next_review_at timestamptz
);

create table if not exists public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_index integer not null check (lesson_index >= 0),
  percent_complete integer not null default 0 check (percent_complete between 0 and 100),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, course_slug, lesson_index)
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create index if not exists questions_domain_topic_idx on public.questions(domain, topic);
create index if not exists questions_difficulty_idx on public.questions(difficulty);
create index if not exists attempts_user_attempted_idx on public.attempts(user_id, attempted_at desc);
create index if not exists attempts_user_review_idx on public.attempts(user_id, next_review_at);
create index if not exists progress_user_course_idx on public.progress(user_id, course_slug);
create index if not exists bookmarks_user_idx on public.bookmarks(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.attempts enable row level security;
alter table public.progress enable row level security;
alter table public.bookmarks enable row level security;

create policy "profiles owner read" on public.profiles for select using (auth.uid() = id);
create policy "profiles owner update" on public.profiles for update using (auth.uid() = id);
create policy "attempts owner read" on public.attempts for select using (auth.uid() = user_id);
create policy "progress owner read" on public.progress for select using (auth.uid() = user_id);
create policy "bookmarks owner read" on public.bookmarks for select using (auth.uid() = user_id);
