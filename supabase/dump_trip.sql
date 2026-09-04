-- ─────────────────────────────────────────────────────────────────────────────
-- Dump one trip's entire content as a single JSON document.
--
-- Read-only. Use it to eyeball a live trip, or to diff one against a reference
-- (save two runs and `diff` them, or pipe through `jq`).
--
-- HOW TO RUN
--   1. Supabase dashboard → SQL Editor → New query → paste this file.
--   2. Put the trip's uuid in the `params` CTE below (Table editor → `trips`
--      → copy the `id`).
--   3. Run. The single `trip_dump` cell is the whole trip.
--
-- Every table is schema-qualified (`public.trips`, …) on purpose: an unqualified
-- `from trips` throws `42P01: relation "trips" does not exist` when the query
-- runs with a `search_path` that doesn't include `public` — which is what you
-- get inside a `security definer` function or after a stray `set search_path`.
-- Qualifying every reference makes it run anywhere.
-- ─────────────────────────────────────────────────────────────────────────────

with params as (
  select '00000000-0000-0000-0000-000000000000'::uuid as trip_id  -- ← paste the trip id
)

select jsonb_pretty(jsonb_build_object(
  'trip', (
    select to_jsonb(t) - 'user_id'
    from public.trips t
    where t.id = (select trip_id from params)
  ),
  'legs', (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.position), '[]'::jsonb)
    from public.legs x where x.trip_id = (select trip_id from params)
  ),
  'hotels', (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.position), '[]'::jsonb)
    from public.hotels x where x.trip_id = (select trip_id from params)
  ),
  'days', (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.position), '[]'::jsonb)
    from public.days x where x.trip_id = (select trip_id from params)
  ),
  'journeys', (
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'journey', to_jsonb(j),
        'segments', (
          select coalesce(jsonb_agg(to_jsonb(s) order by s.position), '[]'::jsonb)
          from public.segments s where s.journey_id = j.id
        )
      ) order by j.position
    ), '[]'::jsonb)
    from public.journeys j where j.trip_id = (select trip_id from params)
  ),
  'luggage', (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.position), '[]'::jsonb)
    from public.luggage x where x.trip_id = (select trip_id from params)
  ),
  'packing', (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.position), '[]'::jsonb)
    from public.packing x where x.trip_id = (select trip_id from params)
  ),
  'docs', (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.position), '[]'::jsonb)
    from public.docs x where x.trip_id = (select trip_id from params)
  ),
  'places', (
    select coalesce(jsonb_agg(to_jsonb(x) order by x.position), '[]'::jsonb)
    from public.places x where x.trip_id = (select trip_id from params)
  ),
  'areas', (
    select coalesce(jsonb_agg(
      jsonb_build_object(
        'area', to_jsonb(a),
        'place_ids', (
          select coalesce(jsonb_agg(ap.place_id order by ap.place_id), '[]'::jsonb)
          from public.area_places ap where ap.area_id = a.id
        )
      ) order by a.position
    ), '[]'::jsonb)
    from public.areas a where a.trip_id = (select trip_id from params)
  )
)) as trip_dump;
