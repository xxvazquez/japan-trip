-- Data-model cleanup 2c: checklists become [{id,text,done}] instead of [string],
-- and the tick state moves out of trips.progress.checks onto the item itself
-- (so ticking a box syncs between trip members). Safe to re-run — the string
-- guard makes it a no-op once converted.

-- days: carry over any existing ticks from progress.checks ("day:<id>:<index>")
update days d
   set checklist = built.list
  from (
    select x.id,
           jsonb_agg(
             jsonb_build_object(
               'id',   'k' || (e.ord - 1),
               'text', e.val,
               'done', coalesce(
                 (t.progress #>> array['checks', 'day:' || x.id::text || ':' || (e.ord - 1)::text])::boolean,
                 false)
             )
             order by e.ord
           ) as list
      from days x
      join trips t on t.id = x.trip_id
      cross join lateral jsonb_array_elements_text(x.checklist) with ordinality as e(val, ord)
     where jsonb_typeof(x.checklist) = 'array'
       and jsonb_array_length(x.checklist) > 0
       and jsonb_typeof(x.checklist -> 0) = 'string'
     group by x.id
  ) built
 where built.id = d.id;

-- day_trips: these were never tickable, so just reshape the strings
update day_trips d
   set checklist = built.list
  from (
    select x.id,
           jsonb_agg(jsonb_build_object('id', 'k' || (e.ord - 1), 'text', e.val) order by e.ord) as list
      from day_trips x
      cross join lateral jsonb_array_elements_text(x.checklist) with ordinality as e(val, ord)
     where jsonb_typeof(x.checklist) = 'array'
       and jsonb_array_length(x.checklist) > 0
       and jsonb_typeof(x.checklist -> 0) = 'string'
     group by x.id
  ) built
 where built.id = d.id;

-- drop the now-migrated day checklist ticks from the progress bag
update trips
   set progress = jsonb_set(
     progress,
     '{checks}',
     coalesce(
       (select jsonb_object_agg(key, value)
          from jsonb_each(progress -> 'checks')
         where key not like 'day:%'),
       '{}'::jsonb)
   )
 where progress -> 'checks' <> '{}'::jsonb;
