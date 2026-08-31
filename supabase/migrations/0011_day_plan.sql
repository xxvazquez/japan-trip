-- The day's "Plan" is now a bullet list (one string per line), separate from the
-- free-text "Notes" field. Existing notes stay where they are — under Notes.
-- Safe to re-run.

alter table days add column if not exists plan jsonb not null default '[]';
