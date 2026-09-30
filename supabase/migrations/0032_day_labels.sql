-- A day's own free-text labels ("chill day", "walking"), shown on its row
-- in Plan. Safe to re-run.

alter table days add column if not exists labels jsonb not null default '[]';
