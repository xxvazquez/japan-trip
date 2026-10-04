-- When you're back at the hotel on a day (the plan's last row), as
-- "HH:MM". Safe to re-run.

alter table days add column if not exists back_at text;
