-- Realtime only delivers a DELETE through a `trip_id` filter when the table
-- keeps the whole old row (replica identity full). Without it, something
-- deleted on one device stayed on the other until the trip was reloaded.
-- Safe to re-run.

alter table legs          replica identity full;
alter table hotels        replica identity full;
alter table journeys      replica identity full;
alter table segments      replica identity full;
alter table luggage       replica identity full;
alter table days          replica identity full;
alter table packing       replica identity full;
alter table docs          replica identity full;
alter table places        replica identity full;
alter table areas         replica identity full;
alter table area_places   replica identity full;
alter table scratch_notes replica identity full;
