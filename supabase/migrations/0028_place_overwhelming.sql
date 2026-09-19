-- Sensory-overwhelming flag on a place (crowds, noise, light) — lets a day's
-- plan show at a glance how many of its stops are like that. Null/false both
-- mean "not flagged". Safe to re-run.

alter table places add column if not exists overwhelming boolean;
