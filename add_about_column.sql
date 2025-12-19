-- Add 'about' column to 'cards' table
ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS about text;
