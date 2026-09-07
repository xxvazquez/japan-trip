-- Packing items can be assigned to a traveller (a `config.people` id) or
-- "shared". Unset = anyone. Safe to re-run.

alter table packing add column if not exists assignee text;
