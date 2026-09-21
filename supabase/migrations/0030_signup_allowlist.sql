-- Zuknesst Atlas — restrict who can create an account.
-- Run AFTER 0029. Safe to re-run.
--
-- Schema only — no emails live here. Add allowed addresses yourself in the
-- SQL Editor after running this:
--
--   insert into public.allowed_signup_emails (email) values
--     (lower('you@example.com')),
--     (lower('them@example.com'))
--   on conflict do nothing;
--
-- Wire the function below as Authentication → Hooks → "Before user created".
-- Check the Supabase docs for that hook's exact payload/return shape when
-- wiring it up (Authentication → Hooks → Before User Created → the built-in
-- template) and adjust the `event->...` path below to match if it differs —
-- the allowlist table and the reject-by-exception approach are what matters.

create table if not exists public.allowed_signup_emails (
  email text primary key
);
alter table public.allowed_signup_emails enable row level security;
-- no policies: unreachable via the API (anon/authenticated), editable only
-- from the SQL Editor or another trusted server-side connection.

create or replace function public.restrict_signup(event jsonb)
returns jsonb language plpgsql security definer as $$
begin
  if not exists (
    select 1 from public.allowed_signup_emails
    where email = lower(event->'user'->>'email')
  ) then
    raise exception 'signups are restricted';
  end if;
  return jsonb_build_object();
end $$;
