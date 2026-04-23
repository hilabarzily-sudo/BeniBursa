-- ============================================
-- Storage buckets + policies
-- ============================================

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('media', 'media', false, 5368709120),      -- 5GB max per file (raw uploads)
  ('outputs', 'outputs', true, 1073741824),   -- 1GB max, public (generated content)
  ('thumbnails', 'thumbnails', true, 10485760) -- 10MB max, public
on conflict (id) do nothing;

-- media: owner-only (private source uploads)
create policy "media_owner_select" on storage.objects
  for select using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "media_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "media_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'media'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- outputs: public read, owner write
create policy "outputs_public_select" on storage.objects
  for select using (bucket_id = 'outputs');

create policy "outputs_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'outputs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- thumbnails: public read, owner write
create policy "thumbnails_public_select" on storage.objects
  for select using (bucket_id = 'thumbnails');

create policy "thumbnails_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'thumbnails'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
