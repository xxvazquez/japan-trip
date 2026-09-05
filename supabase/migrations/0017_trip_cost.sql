-- Trip cost roll-up, phase 1: the two new price fields. Both free text, same
-- style as Segment.fare already is — the roll-up (built separately) does its
-- own parsing at read time rather than forcing a strict money type on input.
-- Safe to re-run.

alter table hotels add column if not exists price text;
alter table journeys add column if not exists fare text;
