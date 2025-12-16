-- Enable Storage Extension (if not enabled)
-- Note: Storage is usually enabled by default in Supabase projects

-- 1. Create the 'avatars' bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- 2. Set up RLS Policies for Storage
-- Allow public access to view avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Allow authenticated users to upload avatars
create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' AND auth.role() = 'authenticated' );

-- Allow users to update their own avatars
create policy "Users can update their own avatars."
  on storage.objects for update
  using ( auth.uid() = owner )
  with check ( bucket_id = 'avatars' );

-- 3. Ensure 'cards' table has necessary columns (Idempotent check)
-- These should already exist based on previous schema, but good to double check
alter table public.cards 
add column if not exists avatar_url text,
add column if not exists social_links jsonb default '{}'::jsonb,
add column if not exists view_count integer default 0;
