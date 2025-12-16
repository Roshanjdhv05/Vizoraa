-- Add is_public column to cards table if it doesn't exist
ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;
