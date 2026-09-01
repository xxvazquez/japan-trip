-- A day can reference areas. Its map view then shows the union of the day's
-- explicit places and every place in those areas — a live relationship, so
-- editing an area updates the day's map, but never rewrites the written plan.
-- Run AFTER 0012. Safe to re-run.

alter table days add column if not exists area_ids jsonb not null default '[]';
