-- Zuknesst Atlas — trip sharing + membership RLS.
-- Run AFTER 0001. Safe to re-run.
--
-- Changes:
--  * segments gains trip_id (uniform RLS + simpler queries) — backfilled.
--  * new trip_members(trip_id, user_id, role) — owner auto-added on trip insert;
--    existing trips backfilled so nobody loses access.
--  * every table's RLS switches from "owner" to "any member of the trip",
--    via SECURITY DEFINER helpers (no recursive policy evaluation).
--  * trip deletion + member management stay owner-only.

/* ---------- segments.trip_id ---------- */
alter table segments add column if not exists trip_id uuid references trips(id) on delete cascade;
update segments s set trip_id = j.trip_id from journeys j where j.id = s.journey_id and s.trip_id is null;
create index if not exists segments_trip_idx on segments(trip_id);

/* ---------- trip_members ---------- */
create table if not exists trip_members (
  trip_id    uuid not null references trips(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'editor' check (role in ('owner','editor','viewer')),
  created_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);
create index if not exists trip_members_user_idx on trip_members(user_id);

-- owner joins their own trip automatically
create or replace function add_owner_membership() returns trigger language plpgsql security definer as $$
begin
  insert into trip_members (trip_id, user_id, role) values (new.id, new.user_id, 'owner')
  on conflict do nothing;
  return new;
end $$;
drop trigger if exists trips_add_owner on trips;
create trigger trips_add_owner after insert on trips for each row execute function add_owner_membership();

-- backfill existing trips
insert into trip_members (trip_id, user_id, role)
select id, user_id, 'owner' from trips
on conflict do nothing;

/* ---------- helpers (bypass RLS to avoid recursion) ---------- */
create or replace function is_trip_member(tid uuid) returns boolean
  language sql security definer stable as $$
  select exists (select 1 from trip_members where trip_id = tid and user_id = auth.uid());
$$;

create or replace function is_trip_owner(tid uuid) returns boolean
  language sql security definer stable as $$
  select exists (select 1 from trip_members where trip_id = tid and user_id = auth.uid() and role = 'owner');
$$;

/* ---------- RLS: trips ---------- */
drop policy if exists trips_owner on trips;
drop policy if exists trips_select on trips;
drop policy if exists trips_insert on trips;
drop policy if exists trips_update on trips;
drop policy if exists trips_delete on trips;

create policy trips_select on trips for select using (is_trip_member(id));
create policy trips_insert on trips for insert with check (user_id = auth.uid());
create policy trips_update on trips for update using (is_trip_member(id)) with check (is_trip_member(id));
create policy trips_delete on trips for delete using (is_trip_owner(id));

/* ---------- RLS: every entity table ---------- */
do $$ declare t text;
begin
  foreach t in array array[
    'legs','hotels','places','journeys','segments','luggage','days','day_trips',
    'collections','seasonal','reservations','packing','docs','etiquette','expenses'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I_owner on %I', t, t);
    execute format('drop policy if exists %I_all on %I', t, t);
    execute format(
      'create policy %I_all on %I using (is_trip_member(trip_id)) with check (is_trip_member(trip_id))',
      t, t
    );
  end loop;
end $$;

/* ---------- RLS: trip_members ---------- */
alter table trip_members enable row level security;
drop policy if exists trip_members_select on trip_members;
drop policy if exists trip_members_write on trip_members;

-- you can see the membership list of any trip you belong to
create policy trip_members_select on trip_members for select
  using (user_id = auth.uid() or is_trip_member(trip_id));
-- only the owner can add / change / remove members
create policy trip_members_write on trip_members for all
  using (is_trip_owner(trip_id)) with check (is_trip_owner(trip_id));

/* ---------- invite by email ---------- */
-- owner-only; adds an existing user (they must have signed in once) as an editor.
create or replace function invite_trip_member(p_trip_id uuid, p_email text)
  returns boolean language plpgsql security definer as $$
declare uid uuid;
begin
  if not is_trip_owner(p_trip_id) then
    raise exception 'not authorised';
  end if;
  select id into uid from auth.users where lower(email) = lower(p_email) limit 1;
  if uid is null then
    return false;
  end if;
  insert into trip_members (trip_id, user_id, role) values (p_trip_id, uid, 'editor')
  on conflict (trip_id, user_id) do nothing;
  return true;
end $$;

/* ---------- realtime ---------- */
do $$ declare t text;
begin
  foreach t in array array[
    'trips','legs','hotels','places','journeys','segments','luggage','days','day_trips',
    'collections','seasonal','reservations','packing','docs','etiquette','expenses','trip_members'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table %I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
