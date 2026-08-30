-- Missing journey columns (Journey.gmapsDirections / Journey.officialUrl).
-- Safe to re-run.
alter table journeys add column if not exists gmaps_directions text;
alter table journeys add column if not exists official_url text;
