-- A place's page on a restaurant guide (Tabelog for places in Japan), found
-- by the app's lookup or pasted. Safe to re-run.

alter table places add column if not exists review_url text;
