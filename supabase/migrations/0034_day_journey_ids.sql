-- A day can hold any number of journeys (a bus, a train, a flight), kept in
-- order in `journey_ids`. The old single `journey_id` link is copied in.
-- The app reads both and empties `journey_id` whenever it saves a day, so
-- `journey_id` stays only for builds from before this change. Safe to re-run.

alter table days add column if not exists journey_ids jsonb not null default '[]';

update days
   set journey_ids = journey_ids || jsonb_build_array(journey_id::text)
 where journey_id is not null
   and not journey_ids ? journey_id::text;
