create table if not exists public.feedback_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text not null check (char_length(btrim(email)) between 3 and 254),
  message text not null check (char_length(btrim(message)) between 1 and 4000),
  page text,
  user_id uuid references auth.users(id) on delete set null
);

alter table public.feedback_messages enable row level security;

drop policy if exists "Anyone can send feedback" on public.feedback_messages;

create policy "Anyone can send feedback"
on public.feedback_messages
for insert
to anon, authenticated
with check (
  user_id is null
  or user_id = auth.uid()
);
