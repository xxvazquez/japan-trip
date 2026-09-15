-- Scratchpad becomes several independent notes instead of one long free-text
-- field. Same shape/RLS/realtime pattern as every other trip-owned list (see
-- 0012_areas.sql). Safe to re-run.

create table if not exists scratch_notes (
  id         uuid primary key default gen_random_uuid(),
  trip_id    uuid not null references trips(id) on delete cascade,
  position   int not null default 0,
  title      text not null default '',
  text       text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists scratch_notes_trip_idx on scratch_notes(trip_id);
drop trigger if exists scratch_notes_updated on scratch_notes;
create trigger scratch_notes_updated before update on scratch_notes for each row execute function set_updated_at();

alter table scratch_notes enable row level security;
drop policy if exists scratch_notes_all on scratch_notes;
create policy scratch_notes_all on scratch_notes using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));

do $$ begin
  alter publication supabase_realtime add table scratch_notes;
exception when duplicate_object then null;
end $$;

-- move any existing scratchpad text into a real note, then retire the column
insert into scratch_notes (trip_id, title, text)
select id, 'Untitled', scratch
  from trips
 where coalesce(scratch, '') <> '';

alter table trips drop column if exists scratch;
