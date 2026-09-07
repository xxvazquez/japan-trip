-- Per-day spending: one row per amount (a museum, lunch, a taxi), free-text
-- `amount` parsed into the Budget roll-up at read time. Safe to re-run.

alter table days add column if not exists costs jsonb not null default '[]';
