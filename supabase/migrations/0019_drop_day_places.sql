-- The day's separate "places" list folded into Day.plan (jsonb) in the app —
-- each place is now a plan step with a `placeId`. `normalizeTrip` does the
-- fold on load and no longer reads or writes this column. Drop it.
-- Safe to re-run.

alter table days drop column if exists places;
