-- The Day trip box (getting there / getting back / last way back) is gone
-- from the app. Move whatever was written there to the end of the day's
-- notes, one paragraph per field, then empty the old columns. The app does
-- the same on load with the same text, so a day it already moved is skipped.
-- Safe to re-run. Columns are kept so an older build can still save a day.

update days d
   set notes = case when coalesce(btrim(d.notes, E' \t\r\n'), '') = '' then b.block
                    else d.notes || E'\n\n' || b.block end
  from (
    select id,
           concat_ws(E'\n\n',
             '**Getting there:** ' || nullif(btrim(get_there, E' \t\r\n'), ''),
             '**Getting back:** '  || nullif(btrim(get_back, E' \t\r\n'), ''),
             '**Last way back:** ' || nullif(btrim(last_train_back, E' \t\r\n'), '')
           ) as block
      from days
  ) b
 where b.id = d.id
   and b.block <> ''
   and position(b.block in coalesce(d.notes, '')) = 0;

update days
   set get_there = null, get_back = null, last_train_back = null
 where get_there is not null or get_back is not null or last_train_back is not null;
