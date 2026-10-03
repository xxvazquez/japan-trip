-- A restaurant's "Good to know" (hours, closed days, reservations, queue,
-- price), looked up by the app and when it was checked. Safe to re-run.

alter table places add column if not exists facts jsonb;
