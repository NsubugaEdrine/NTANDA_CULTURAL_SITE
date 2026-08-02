-- ============================================================
-- NTANDA Cultural Heritage Site — Storage buckets & policies
-- Run after the schema file.
-- ============================================================

-- ---------- Buckets ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('content', 'content', true, null, null),
  ('avatars', 'avatars', true, null, null)
on conflict (id) do nothing;

-- ---------- Object policies ----------
create policy "Public can read content"
  on storage.objects for select
  using (bucket_id = any (array['content'::text, 'avatars'::text]));

create policy "Authenticated users can upload to content"
  on storage.objects for insert
  with check ((bucket_id = 'content'::text) and (auth.role() = 'authenticated'::text));

create policy "Owners can update their content"
  on storage.objects for update
  using (auth.role() = 'authenticated'::text);

create policy "Owners can delete their content"
  on storage.objects for delete
  using (auth.role() = 'authenticated'::text);
