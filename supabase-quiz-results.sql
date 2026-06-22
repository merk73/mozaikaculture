create extension if not exists pgcrypto;

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  percent integer not null check (percent >= 0 and percent <= 100),
  answers jsonb not null,
  details jsonb not null,
  created_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.quiz_results enable row level security;

drop policy if exists "Users can read own quiz result" on public.quiz_results;
create policy "Users can read own quiz result"
on public.quiz_results
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own quiz result once" on public.quiz_results;
create policy "Users can insert own quiz result once"
on public.quiz_results
for insert
to authenticated
with check (auth.uid() = user_id);
