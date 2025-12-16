-- Add google_map_link column to cards table
ALTER TABLE public.cards 
ADD COLUMN IF NOT EXISTS google_map_link text;

-- Comment on column
COMMENT ON COLUMN public.cards.google_map_link IS 'URL to Google Maps location';
