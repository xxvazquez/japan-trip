-- Areas — a named geographic grouping of map places ("where"), orthogonal to a
-- place's category ("what"). Many-to-many via area_places. Nothing here assumes
-- a country or trip style. Run AFTER 0011. Safe to re-run.

create table if not exists areas (
  id         uuid primary key default gen_random_uuid(),
  trip_id    uuid not null references trips(id) on delete cascade,
  position   int not null default 0,
  name       text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists areas_trip_idx on areas(trip_id);
drop trigger if exists areas_updated on areas;
create trigger areas_updated before update on areas for each row execute function set_updated_at();

create table if not exists area_places (
  trip_id  uuid not null references trips(id) on delete cascade,
  area_id  uuid not null references areas(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  primary key (area_id, place_id)
);
create index if not exists area_places_trip_idx on area_places(trip_id);
create index if not exists area_places_place_idx on area_places(place_id);

-- RLS: any member of the trip (same model as every other entity table)
alter table areas enable row level security;
drop policy if exists areas_all on areas;
create policy areas_all on areas using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));

alter table area_places enable row level security;
drop policy if exists area_places_all on area_places;
create policy area_places_all on area_places using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));

-- realtime
do $$ begin
  alter publication supabase_realtime add table areas;
exception when duplicate_object then null;
end $$;
do $$ begin
  alter publication supabase_realtime add table area_places;
exception when duplicate_object then null;
end $$;
