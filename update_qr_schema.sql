-- Add QR code fields to cards table
ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS qr_url text, -- The public URL of the card
ADD COLUMN IF NOT EXISTS qr_image text; -- Optional: Can store base64 or path if needed, but on-fly generation is preferred
