-- Create Offer Tables

-- Offers Table
create table if not exists public.offers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  title text,
  description text check (char_length(description) <= 500),
  image_url text not null,
  show_on_card boolean default true,
  show_on_home boolean default false
);

-- Offer Likes Table
create table if not exists public.offer_likes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  offer_id uuid references public.offers not null,
  unique(user_id, offer_id)
);

-- RLS Policies
alter table public.offers enable row level security;
alter table public.offer_likes enable row level security;

-- Offers Policies
create policy "Enable read access for all users"
on public.offers for select
using (true);

create policy "Enable insert for authenticated users only"
on public.offers for insert
with check (auth.uid() = user_id);

create policy "Enable update for users based on user_id"
on public.offers for update
using (auth.uid() = user_id);

create policy "Enable delete for users based on user_id"
on public.offers for delete
using (auth.uid() = user_id);

-- Likes Policies
create policy "Enable read access for all users"
on public.offer_likes for select
using (true);

create policy "Enable insert for authenticated users only"
on public.offer_likes for insert
with check (auth.uid() = user_id);

create policy "Enable delete for users based on user_id"
on public.offer_likes for delete
using (auth.uid() = user_id);

-- Storage Bucket for Offer Images
insert into storage.buckets (id, name, public) 
values ('offer-images', 'offer-images', true)
on conflict (id) do nothing;

create policy "Give public access to offer-images"
on storage.objects for select
using ( bucket_id = 'offer-images' );

create policy "Enable upload for authenticated users to offer-images"
on storage.objects for insert
with check ( bucket_id = 'offer-images' and auth.role() = 'authenticated' );

create policy "Enable update for users to their own images"
on storage.objects for update
using ( bucket_id = 'offer-images' and auth.uid() = owner );

create policy "Enable delete for users to their own images"
on storage.objects for delete
using ( bucket_id = 'offer-images' and auth.uid() = owner );
