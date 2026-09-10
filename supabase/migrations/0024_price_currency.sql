-- Per-item currency for every price on the trip. A stay's price and a fare are
-- bare numbers in the trip's primary currency by default; these columns hold an
-- override when an item is in a different one. `segments.fare_currency` and
-- `journeys.fare_currency` back a picker that already shipped in the UI without
-- its columns. Day-spending rows and custom "Price" fields carry their own
-- currency inside their jsonb, so nothing is needed there. Safe to re-run.

alter table hotels    add column if not exists price_currency text;
alter table journeys  add column if not exists fare_currency  text;
alter table segments  add column if not exists fare_currency  text;
