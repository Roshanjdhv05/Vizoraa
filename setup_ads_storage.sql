-- Create the 'ads' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('ads', 'ads', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to all images in the 'ads' bucket
CREATE POLICY "Public Access Ads"
ON storage.objects FOR SELECT
USING ( bucket_id = 'ads' );

-- Policy: Allow authenticated users to upload images to the 'ads' bucket
CREATE POLICY "Authenticated Upload Ads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'ads' AND auth.role() = 'authenticated' );

-- Policy: Allow authenticated users to delete images from the 'ads' bucket
CREATE POLICY "Authenticated Delete Ads"
ON storage.objects FOR DELETE
USING ( bucket_id = 'ads' AND auth.role() = 'authenticated' );
