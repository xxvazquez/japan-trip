-- When you leave the hotel on a day (the plan's first row), as "HH:MM".
-- Safe to re-run.

alter table days add column if not exists leave_at text;
