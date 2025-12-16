-- 1. Add verification status to profiles
-- We use 'profiles' as it mirrors auth.users data for the frontend
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- 2. Create Ads Table
CREATE TABLE public.ads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    link TEXT, -- Optional external link
    title TEXT, -- Optional title/description
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS on Ads
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Ads
-- Everyone can view active ads
CREATE POLICY "Active ads are viewable by everyone." 
ON public.ads FOR SELECT 
USING (active = TRUE);

-- Only authenticated users (admins realistically, but we'll allow all auth users to insert for now if we don't have distinct roles, or just open it up since the admin login is hardcoded on frontend. 
-- Ideally, we'd use a service_role key or checking a specific admin flag, but for this 'hardcoded login' requirement, we might need to be loose or assume the frontend acts as the gatekeeper.
-- HOWEVER, to be safe, let's allow insert/update/delete only if the user is authenticated (we will rely on the hardcoded frontend gatekeeper).
-- A better production approach would be a separate 'admins' table or role.)

-- For now, let's allow all authenticated users to MANAGE ads because the "Admin" is just a regular user with a special shared password on the frontend.
-- Warning: This means any logged-in user technically *could* hit the Supabase API to delete ads if they knew how. 
-- Given the constraints, this is the trade-off.
CREATE POLICY "Authenticated users can manage ads." 
ON public.ads FOR ALL 
USING (auth.role() = 'authenticated');

-- 5. Storage Bucket for Ads
-- You will need to create a new public bucket named 'ads' in your Supabase Storage dashboard manually if you haven't.
-- Policy for storage objects in 'ads':
-- START TRANSACTION;
-- insert into storage.buckets (id, name, public) values ('ads', 'ads', true);
-- create policy "Ads images are publicly accessible." on storage.objects for select using ( bucket_id = 'ads' );
-- create policy "Authenticated users can upload ad images." on storage.objects for insert with check ( bucket_id = 'ads' and auth.role() = 'authenticated' );
-- COMMIT;
