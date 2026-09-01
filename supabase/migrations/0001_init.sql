-- Zuknesst Atlas — schema. Generic travel-planner tables: nothing here assumes a
-- country, destination or trip style. Run in the Supabase SQL editor (or via the
-- Supabase CLI). Safe to re-run.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────── helper: updated_at
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ─────────────────────────────────────────── trips
create table if not exists trips (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null default 'New trip',
  subtitle    text,
  archived    boolean not null default false,
  template_id text,
  position    int not null default 0,
  -- trip-level singletons (settings, not entities)
  config      jsonb not null default '{}',
  meta        jsonb not null default '{}',
  media       jsonb not null default '{"gallery":[]}',
  images      jsonb not null default '{}',
  progress    jsonb not null default '{"checks":{},"foliage":{}}',
  notes       jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists trips_user_idx on trips(user_id);
drop trigger if exists trips_updated on trips;
create trigger trips_updated before update on trips for each row execute function set_updated_at();

-- ─────────────────────────────────────────── generic entity tables
-- one table per travel concept; all scoped to a trip, all ordered by `position`.

create table if not exists legs (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  base text, name_alt text, start_date date, end_date date,
  hotel_id uuid, color text, blurb text, image text
);

create table if not exists hotels (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  place_id uuid, name text, name_alt text, address text, phone text, url text,
  check_in text, check_out text, wifi text, door_code text, reservation_ref text,
  notes text, access jsonb not null default '{}', gallery jsonb not null default '[]',
  nearby jsonb not null default '[]'
);

create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  name text, name_alt text, kind text, city text, area text,
  lat double precision, lng double precision,
  image text, blurb text, url text, gmaps_query text,
  collections jsonb not null default '[]'
);

create table if not exists journeys (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  label text, kind text, date date, from_leg_id uuid, to_leg_id uuid,
  luggage_id uuid, alert text, backup_route text, official_url text,
  gmaps_directions text, notes text,
  access jsonb not null default '{}', steps jsonb not null default '[]'
);

create table if not exists segments (
  id uuid primary key default gen_random_uuid(),
  journey_id uuid not null references journeys(id) on delete cascade,
  position int not null default 0,
  mode text, from_place text, to_place text, from_tz text, to_tz text,
  depart text, arrive text, carrier text, service text, seat text, platform text,
  fare text, booking_ref text, reserved boolean, note text
);

create table if not exists luggage (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  label text, from_hotel_id uuid, to_hotel_id uuid, carrier text,
  send_by date, expected_arrival date, tracking_no text, office_address text,
  status text, notes text
);

create table if not exists days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  date date, kind text, city text,
  leg_id uuid, hotel_id uuid, journey_id uuid, day_trip_id uuid,
  title text, summary text, packing_reminder text, notes text,
  morning jsonb not null default '[]', afternoon jsonb not null default '[]',
  evening jsonb not null default '[]',
  reservation_ids jsonb not null default '[]', checklist jsonb
);

create table if not exists day_trips (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  name text, name_alt text, city text, image text, blurb text,
  stats jsonb not null default '{}',
  get_there jsonb not null default '[]', return_options jsonb not null default '[]',
  see jsonb not null default '[]', eat jsonb not null default '[]',
  route text, map_ref text, checklist jsonb, notes text
);

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  title text, subtitle text, kind text, image text, blurb text
);

create table if not exists seasonal (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  date date, sunset text, temp_lo numeric, temp_hi numeric
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  title text, when_text text, book_by date, confirmation text, url text,
  place_id uuid, note text
);

create table if not exists packing (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  label text, phase text, group_name text
);

create table if not exists docs (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  title text, kind text, fields jsonb not null default '[]', note text
);

create table if not exists etiquette (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  title text, body text, context text
);

-- expenses — user-created, generic
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips(id) on delete cascade,
  position int not null default 0,
  date date, label text, amount numeric, category text, city text
);

-- ─────────────────────────────────────────── indexes
do $$ declare t text;
begin
  foreach t in array array['legs','hotels','places','journeys','luggage','days','day_trips','collections','seasonal','reservations','packing','docs','etiquette','expenses']
  loop execute format('create index if not exists %I_trip_idx on %I(trip_id)', t, t); end loop;
end $$;
create index if not exists segments_journey_idx on segments(journey_id);

-- ─────────────────────────────────────────── row-level security
-- every table: a row is visible / writable only to the owner of its trip.

alter table trips enable row level security;
drop policy if exists trips_owner on trips;
create policy trips_owner on trips using (user_id = auth.uid()) with check (user_id = auth.uid());

do $$ declare t text;
begin
  foreach t in array array['legs','hotels','places','journeys','luggage','days','day_trips','collections','seasonal','reservations','packing','docs','etiquette','expenses']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists %I_owner on %I', t, t);
    execute format($f$create policy %I_owner on %I using (
      exists (select 1 from trips where trips.id = %I.trip_id and trips.user_id = auth.uid())
    ) with check (
      exists (select 1 from trips where trips.id = %I.trip_id and trips.user_id = auth.uid())
    )$f$, t, t, t, t);
  end loop;
end $$;

alter table segments enable row level security;
drop policy if exists segments_owner on segments;
create policy segments_owner on segments using (
  exists (select 1 from journeys j join trips on trips.id = j.trip_id
          where j.id = segments.journey_id and trips.user_id = auth.uid())
) with check (
  exists (select 1 from journeys j join trips on trips.id = j.trip_id
          where j.id = segments.journey_id and trips.user_id = auth.uid())
);
