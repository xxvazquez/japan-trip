-- The hotel's coordinates, for anchoring the Map's city pills. Filled from the
-- pasted Maps link when it carries a lat/lng, otherwise geocoded from the
-- address once and cached. Safe to re-run.

alter table hotels add column if not exists lat double precision;
alter table hotels add column if not exists lng double precision;
