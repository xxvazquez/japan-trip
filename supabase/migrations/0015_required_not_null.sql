-- Every column so far is nullable, even the ones core/types.ts marks required
-- (Leg.base, Hotel.name, Place.lat/lng, ...). A row that ends up NULL there
-- loads as an object silently missing the key (rowToEntity drops NULLs), and
-- the first unconditional read of it throws far from the real cause. This
-- backfills any existing NULL with the same default the app itself uses when
-- creating one (see Manage.tsx's blankFor / Journey.tsx's segment add), then
-- locks the column down so a future NULL is a clear insert-time error instead.
-- Safe to re-run. Skips leg_id/hotel_id (see note below).

-- legs
update legs set base = '' where base is null;
update legs set color = 'blue' where color is null;
alter table legs alter column base set default '';
alter table legs alter column base set not null;
alter table legs alter column color set default 'blue';
alter table legs alter column color set not null;
-- start_date / end_date: always set from the trip's own meta at creation,
-- and there's no sensible date to guess if one is ever missing — enforced
-- directly with no backfill. If this errors, tell me which leg and I'll
-- add a targeted fix instead of guessing a date.
alter table legs alter column start_date set not null;
alter table legs alter column end_date set not null;

-- hotels
update hotels set name = '' where name is null;
alter table hotels alter column name set default '';
alter table hotels alter column name set not null;

-- journeys
update journeys set label = '' where label is null;
update journeys set kind = 'transfer' where kind is null;
alter table journeys alter column label set default '';
alter table journeys alter column label set not null;
alter table journeys alter column kind set default 'transfer';
alter table journeys alter column kind set not null;

-- segments
update segments set mode = 'train' where mode is null;
update segments set from_place = '' where from_place is null;
update segments set to_place = '' where to_place is null;
alter table segments alter column mode set default 'train';
alter table segments alter column mode set not null;
alter table segments alter column from_place set default '';
alter table segments alter column from_place set not null;
alter table segments alter column to_place set default '';
alter table segments alter column to_place set not null;

-- days: date is always set from the trip's own meta at creation, same
-- reasoning as legs' start_date/end_date — enforced with no backfill.
alter table days alter column date set not null;

-- luggage
update luggage set title = '' where title is null;
alter table luggage alter column title set default '';
alter table luggage alter column title set not null;

-- packing
update packing set label = '' where label is null;
update packing set phase = 'bring' where phase is null;
update packing set group_name = 'Other' where group_name is null;
alter table packing alter column label set default '';
alter table packing alter column label set not null;
alter table packing alter column phase set default 'bring';
alter table packing alter column phase set not null;
alter table packing alter column group_name set default 'Other';
alter table packing alter column group_name set not null;

-- docs
update docs set title = '' where title is null;
update docs set kind = 'other' where kind is null;
alter table docs alter column title set default '';
alter table docs alter column title set not null;
alter table docs alter column kind set default 'other';
alter table docs alter column kind set not null;

-- places: name already NOT NULL default '' since 0010. lat/lng have no
-- meaningful "unset" coordinate, so 0/0 (a real point in the ocean, never a
-- real trip pin) is used purely as a visible placeholder, not a guess.
update places set lat = 0 where lat is null;
update places set lng = 0 where lng is null;
alter table places alter column lat set default 0;
alter table places alter column lat set not null;
alter table places alter column lng set default 0;
alter table places alter column lng set not null;

-- Not touched: legs.hotel_id and days.leg_id. Both are required in
-- core/types.ts too, but they're relationships (which hotel, which stay),
-- not scalar values — there's no safe default to backfill, and Manage.tsx
-- already refuses to create one without the other to point at (see the
-- "Add a hotel first" / "Add a stay first" gating). Leaving them nullable
-- at the DB level rather than guessing a wrong relationship.
