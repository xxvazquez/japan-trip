-- Zuknesst Atlas — who a trip is shared with, by name.
-- Run AFTER 0030. Safe to re-run.
--
-- trip_members only holds user ids, and auth.users isn't readable from the
-- app, so the Sharing list could only show a slice of each id. This returns
-- the email + Google display name of every member of a trip — and only to
-- someone who is themselves a member of that trip.

create or replace function trip_member_profiles(p_trip_id uuid)
  returns table (user_id uuid, email text, name text)
  language sql security definer stable
  set search_path = public
as $$
  select m.user_id,
         u.email::text,
         coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name')
  from trip_members m
  join auth.users u on u.id = m.user_id
  where m.trip_id = p_trip_id
    and is_trip_member(p_trip_id);
$$;

revoke all on function trip_member_profiles(uuid) from public, anon;
grant execute on function trip_member_profiles(uuid) to authenticated;
