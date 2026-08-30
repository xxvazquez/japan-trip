-- Data-model cleanup 2d: retire the trips.progress and trips.notes bags.
-- Their contents move onto the entities they describe:
--   progress.checks 'pack:<id>'   -> packing.done
--   progress.checks 'col:<c>:<p>' -> places.visited
--   notes 'notepad'               -> trips.scratch
--   notes 'today:<date>'          -> days.notes
-- Safe to re-run: the data moves only run while the old columns still exist.

alter table trips   add column if not exists scratch text;
alter table places  add column if not exists visited boolean;
alter table packing add column if not exists done    boolean;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
     where table_schema = 'public' and table_name = 'trips' and column_name = 'progress'
  ) then
    return;  -- already migrated
  end if;

  update packing p
     set done = true
    from trips t
   where t.id = p.trip_id
     and (t.progress -> 'checks' ->> ('pack:' || p.id::text))::boolean is true
     and p.done is distinct from true;

  update places pl
     set visited = true
    from trips t
    cross join lateral jsonb_each(t.progress -> 'checks') kv
   where t.id = pl.trip_id
     and kv.key like 'col:%:' || pl.id::text
     and kv.value::boolean is true
     and pl.visited is distinct from true;

  update trips
     set scratch = notes ->> 'notepad'
   where scratch is null
     and coalesce(notes ->> 'notepad', '') <> '';

  update days d
     set notes = t.notes ->> ('today:' || d.date::text)
    from trips t
   where t.id = d.trip_id
     and coalesce(d.notes, '') = ''
     and coalesce(t.notes ->> ('today:' || d.date::text), '') <> '';

  alter table trips drop column progress;
  alter table trips drop column notes;
end $$;
