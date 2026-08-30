-- Data-model cleanup 2e: retire the images manifest (trips.images). Entities
-- keep their `image` column, but it now holds the id of an uploaded media item
-- (TripData media.gallery), not a manifest key. The seeded values were manifest
-- keys that no longer resolve, so clear them; where there's no image the app
-- falls back to a generated tonal panel. Safe to re-run.

update legs        set image = null where image is not null;
update places      set image = null where image is not null;
update day_trips   set image = null where image is not null;
update collections set image = null where image is not null;

alter table trips drop column if exists images;
