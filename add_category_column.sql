-- Add category column to cards table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cards' AND column_name = 'category') THEN
        ALTER TABLE cards 
        ADD COLUMN category TEXT DEFAULT 'Personal' CHECK (category IN ('Personal', 'Business', 'Freelancer'));
    END IF;
END $$;
