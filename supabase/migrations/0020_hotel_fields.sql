-- Hotels get a free `fields` list (booking ref, phone, wifi, door code …), like
-- documents already have. The old fixed columns stay for the migration in
-- `normalizeTrip` (which folds them into `fields` on load) and are then unused.
-- Safe to re-run.

alter table hotels add column if not exists fields jsonb not null default '[]';
