-- Manual override for a place's "home city" (leg) — lets a pin be assigned to
-- a stay directly when the auto nearest-stay guess has nothing to go on yet
-- (a stay with no hotel coordinates, or no days pulling places in). Null
-- means "auto", same as every other place. Safe to re-run.

alter table places add column if not exists leg_id uuid references legs(id) on delete set null;
