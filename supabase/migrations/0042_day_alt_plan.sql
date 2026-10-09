-- A day's second plan (Plan B — a rainy-day version, say) and whether the
-- day has been switched over to it. The plan that's on always lives in
-- `plan`; switching swaps the two. Safe to re-run.

alter table days add column if not exists alt_plan jsonb;
alter table days add column if not exists on_alt_plan boolean;
