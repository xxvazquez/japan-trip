-- hotels.name_alt / legs.name_alt were already generalised from "name_jp"
-- (the app's TS field is catching up to nameAlt in this same change). This
-- gives hotels.address_jp the same treatment, matching that precedent.
-- Run this BEFORE deploying the code change that renames Hotel.addressJp to
-- Hotel.addressAlt — the app maps the field to a column of the same name
-- (camelCase -> snake_case), so the two need to move together or a local-
-- language address won't round-trip until both sides match.
-- Safe to re-run.

do $$ begin
  if exists (select 1 from information_schema.columns where table_name = 'hotels' and column_name = 'address_jp') then
    alter table hotels rename column address_jp to address_alt;
  end if;
end $$;
