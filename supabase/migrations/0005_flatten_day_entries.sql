-- Data-model cleanup 2b: one flat `entries` list per day instead of
-- morning/afternoon/evening, and no stored `kind` (it's derived from the day's
-- journey / day-trip links). Safe to re-run.

alter table days add column if not exists entries jsonb not null default '[]';

-- concatenate the three blocks, in order, into `entries`
update days
   set entries = coalesce(morning, '[]'::jsonb)
               || coalesce(afternoon, '[]'::jsonb)
               || coalesce(evening, '[]'::jsonb)
 where entries = '[]'::jsonb
   and (morning <> '[]'::jsonb or afternoon <> '[]'::jsonb or evening <> '[]'::jsonb);

-- arrival / departure days had `kind` set but no journey link; wire them to
-- their journey (matched by date) so the derived day-kind still works
update days d
   set journey_id = j.id
  from journeys j
 where j.trip_id = d.trip_id
   and j.date = d.date
   and j.kind in ('arrival', 'departure')
   and d.journey_id is null;

alter table days drop column if exists morning;
alter table days drop column if exists afternoon;
alter table days drop column if exists evening;
alter table days drop column if exists kind;
