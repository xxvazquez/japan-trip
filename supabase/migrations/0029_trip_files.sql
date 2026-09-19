-- Private storage for document attachments. Safe to re-run.
--
-- One private bucket; objects are named `<trip_id>/<file_id>`, and access
-- follows trip membership (the same rule the trip's own tables use), so
-- everyone on a trip sees the same files. The app never deletes objects —
-- removing an attachment from a document only drops the reference — so there is
-- deliberately no delete or update policy.

insert into storage.buckets (id, name, public, file_size_limit)
values ('trip-files', 'trip-files', false, 26214400)  -- 25 MB
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit;

drop policy if exists trip_files_select on storage.objects;
drop policy if exists trip_files_insert on storage.objects;

create policy trip_files_select on storage.objects for select to authenticated
  using (bucket_id = 'trip-files' and is_trip_member(((storage.foldername(name))[1])::uuid));

create policy trip_files_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'trip-files' and is_trip_member(((storage.foldername(name))[1])::uuid));
