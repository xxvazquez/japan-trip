-- The OpenStreetMap feature a place is (`node/123`), matched by position
-- when it's added, so its opening hours can be read off it even when OSM
-- names it differently. Safe to re-run.

alter table places add column if not exists osm text;
