-- Major restructure: the app is now Plan · Map · Logbook, with a looser day
-- model (notes + places + day-trip fields) and no separate places / collections
-- / day-trips / reservations / etiquette entities.
--
-- The seed template also changed shape. The simplest path: run this, then in the
-- app delete your trip and reload to re-seed from the new template. Safe to
-- re-run.

drop table if exists expenses     cascade;
drop table if exists etiquette    cascade;
drop table if exists reservations cascade;
drop table if exists collections  cascade;
drop table if exists day_trips    cascade;
drop table if exists seasonal     cascade;
drop table if exists places       cascade;  -- hotels.place_id FK drops with it

-- days: new columns
alter table days add column if not exists places          jsonb not null default '[]';
alter table days add column if not exists to_do           jsonb not null default '[]';
alter table days add column if not exists get_there       text;
alter table days add column if not exists get_back        text;
alter table days add column if not exists last_train_back text;
alter table days add column if not exists day_trip        boolean;
-- days: retired columns
alter table days drop column if exists entries;
alter table days drop column if exists checklist;
alter table days drop column if exists sunset;
alter table days drop column if exists temp_lo;
alter table days drop column if exists temp_hi;
alter table days drop column if exists weather_note;
alter table days drop column if exists city;
alter table days drop column if exists kind;
alter table days drop column if exists morning;
alter table days drop column if exists afternoon;
alter table days drop column if exists evening;
alter table days drop column if exists reservation_ids;
alter table days drop column if exists summary;
alter table days drop column if exists packing_reminder;

-- hotels: new + retired
alter table hotels add column if not exists address_jp text;
alter table hotels add column if not exists directions text;
alter table hotels add column if not exists map_url    text;
alter table hotels drop column if exists place_id;
alter table hotels drop column if exists access;
alter table hotels drop column if exists nearby;
alter table hotels drop column if exists gallery;

-- luggage: now just a titled note (title + detail + url + date). Nothing
-- country-specific, nothing about shipping lifecycle.
alter table luggage add column if not exists title  text;
alter table luggage add column if not exists detail text;
alter table luggage add column if not exists url    text;
alter table luggage add column if not exists date   date;
update luggage set title  = coalesce(title, label);
update luggage set detail = coalesce(detail, notes);
alter table luggage drop column if exists label;
alter table luggage drop column if exists notes;
alter table luggage drop column if exists from_hotel_id;
alter table luggage drop column if exists to_hotel_id;
alter table luggage drop column if exists carrier;
alter table luggage drop column if exists send_by;
alter table luggage drop column if exists expected_arrival;
alter table luggage drop column if exists tracking_no;
alter table luggage drop column if exists office_address;
alter table luggage drop column if exists status;
alter table journeys drop column if exists luggage_id;

-- journeys: retired
alter table journeys drop column if exists access;
alter table journeys drop column if exists alert;
alter table journeys drop column if exists backup_route;
alter table journeys drop column if exists official_url;
alter table journeys drop column if exists steps;

-- legs / trips: retired media manifest
alter table legs  drop column if exists image;
alter table trips drop column if exists images;

-- rewrite any pre-restructure section config
update trips
   set config = jsonb_set(
     config,
     '{modules}',
     '[{"id":"plan","kind":"plan","label":"Plan","icon":"itinerary","enabled":true},
       {"id":"map","kind":"map","label":"Map","icon":"places","enabled":true},
       {"id":"logbook","kind":"logbook","label":"Logbook","icon":"vault","enabled":true}]'::jsonb
   )
 where not (config -> 'modules' @> '[{"kind":"plan"}]');
