-- Trip map pins. Either imported from a public Google My Map (source = 'mymap',
-- replaced wholesale on each sync) or added in the app (source null, never
-- touched by sync). Nothing here is country- or map-specific.
-- Safe to re-run.

create table if not exists places (
  id        uuid primary key default gen_random_uuid(),
  trip_id   uuid not null references trips(id) on delete cascade,
  position  int not null default 0,
  name      text not null default '',
  lat       double precision,
  lng       double precision,
  category  text,
  color     text,
  note      text,
  url       text,
  source    text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists places_trip_idx on places(trip_id);
drop trigger if exists places_updated on places;
create trigger places_updated before update on places for each row execute function set_updated_at();

alter table places enable row level security;
drop policy if exists places_all on places;
create policy places_all on places using (is_trip_member(trip_id)) with check (is_trip_member(trip_id));

do $$ begin
  alter publication supabase_realtime add table places;
exception when duplicate_object then null;
end $$;

-- config key rename: mapEmbedUrl -> mapSourceUrl (jsonb, in place)
update trips
   set config = (config - 'mapEmbedUrl') || jsonb_build_object('mapSourceUrl', config ->> 'mapEmbedUrl')
 where config ? 'mapEmbedUrl';
