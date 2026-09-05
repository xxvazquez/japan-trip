-- legs.hotel_id and days.hotel_id have always been plain uuids with no link to
-- hotels(id): deleting a hotel left every stay and day that pointed at it with
-- a dangling id, silently. Add the real foreign key with ON DELETE SET NULL --
-- a deleted hotel now detaches cleanly, the stay/day reads as "no hotel" and is
-- fixable with the picker on /leg/:id and /day/:id, and nothing is guessed at.
-- (Left nullable on purpose in 0015 for the same reason it stays nullable here:
-- a relationship has no safe default to backfill.)
-- Safe to re-run.

-- clear any id that already points at nothing, or the constraint won't validate
update legs set hotel_id = null
  where hotel_id is not null and hotel_id not in (select id from hotels);
update days set hotel_id = null
  where hotel_id is not null and hotel_id not in (select id from hotels);

alter table legs drop constraint if exists legs_hotel_id_fkey;
alter table legs add constraint legs_hotel_id_fkey
  foreign key (hotel_id) references hotels(id) on delete set null;

alter table days drop constraint if exists days_hotel_id_fkey;
alter table days add constraint days_hotel_id_fkey
  foreign key (hotel_id) references hotels(id) on delete set null;
