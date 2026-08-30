-- Data-model cleanup 2a: fold the `seasonal` entity into `days`.
-- Each seasonal note was 1:1 with a day (same trip, same date); it becomes four
-- optional columns on the day. Safe to re-run.

alter table days add column if not exists sunset       text;
alter table days add column if not exists temp_lo      numeric;
alter table days add column if not exists temp_hi      numeric;
alter table days add column if not exists weather_note text;

update days d
   set sunset  = coalesce(d.sunset,  s.sunset),
       temp_lo = coalesce(d.temp_lo, s.temp_lo),
       temp_hi = coalesce(d.temp_hi, s.temp_hi)
  from seasonal s
 where s.trip_id = d.trip_id
   and s.date    = d.date;

drop table if exists seasonal;
