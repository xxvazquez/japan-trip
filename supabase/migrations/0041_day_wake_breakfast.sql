-- When you get up and have breakfast on a day (the plan's Wake up and
-- Breakfast rows), as "HH:MM". Safe to re-run.

alter table days add column if not exists wake_at text;
alter table days add column if not exists breakfast_at text;
