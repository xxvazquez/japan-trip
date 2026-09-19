-- Restore points + a schema guard. Safe to re-run.
--
-- 1. trip_snapshots — immutable, checksummed copies of a whole trip, taken by
--    the app (automatically while editing, and always before something risky:
--    deleting a trip, restoring over one, replaying offline edits onto the
--    server). Deliberately NO foreign key to trips: a snapshot must outlive the
--    trip it was taken from, so a deleted trip can be brought back.
--    Visible only to the user who took it; snapshots are never updated.
--
-- 2. trips.schema_version — the app data shape the trip was last written with.
--    An older app that meets a higher number refuses to open the trip for
--    editing instead of rewriting data it doesn't understand.
--
-- Before applying any migration that rewrites existing data, open the app and
-- use Manage → Sharing → Data safety → "Back up now" for each trip.

create table if not exists trip_snapshots (
  id             uuid primary key default gen_random_uuid(),
  trip_id        uuid not null,
  user_id        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  trip_name      text,
  reason         text not null,
  schema_version int  not null,
  stats          jsonb not null default '{}',
  hash           text,
  data           jsonb not null,
  created_at     timestamptz not null default now()
);

create index if not exists trip_snapshots_trip_idx on trip_snapshots (user_id, trip_id, created_at desc);

alter table trip_snapshots enable row level security;

drop policy if exists trip_snapshots_select on trip_snapshots;
drop policy if exists trip_snapshots_insert on trip_snapshots;
drop policy if exists trip_snapshots_delete on trip_snapshots;
create policy trip_snapshots_select on trip_snapshots for select using (user_id = auth.uid());
create policy trip_snapshots_insert on trip_snapshots for insert with check (user_id = auth.uid());
create policy trip_snapshots_delete on trip_snapshots for delete using (user_id = auth.uid());
-- no update policy on purpose: a snapshot is a record, not a working copy

-- the app's data-shape version (current: 10). Existing trips are stamped 10;
-- the app raises it as it writes.
alter table trips add column if not exists schema_version int not null default 10;
