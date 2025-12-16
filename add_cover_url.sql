-- Add cover_url column to cards table
alter table cards 
add column cover_url text;

-- Ensure it's public (if needed, though usually handled by storage policies)
-- This file is for the user to run in the Supabase SQL Editor.
