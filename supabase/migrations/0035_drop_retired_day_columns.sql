-- Drop the day columns the app no longer uses: the old Day trip text
-- (get_there / get_back / last_train_back, moved into notes by 0033) and
-- the single journey_id link (folded into journey_ids by 0034).
-- Apply only once the build that stopped writing journey_id is live — an
-- older build still sends it on every day save and would fail.
-- Re-runs the 0033 / 0034 moves first, so nothing an older build wrote in
-- the meantime is lost. Safe to re-run.

do $$
begin
  if exists (select 1 from information_schema.columns
              where table_schema = 'public' and table_name = 'days' and column_name = 'journey_id') then
    update days
       set journey_ids = journey_ids || jsonb_build_array(journey_id::text)
     where journey_id is not null
       and not journey_ids ? journey_id::text;
  end if;

  if exists (select 1 from information_schema.columns
              where table_schema = 'public' and table_name = 'days' and column_name = 'get_there') then
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
  end if;
end $$;

alter table days
  drop column if exists journey_id,
  drop column if exists get_there,
  drop column if exists get_back,
  drop column if exists last_train_back;
