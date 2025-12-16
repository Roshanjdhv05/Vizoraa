-- 1. Add Rating Columns to Cards table
ALTER TABLE cards 
ADD COLUMN IF NOT EXISTS rating_avg numeric(3,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_count integer DEFAULT 0;

-- 2. Create Function to Update Rating Stats
CREATE OR REPLACE FUNCTION update_card_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE cards
  SET 
    rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM card_ratings WHERE card_id = COALESCE(NEW.card_id, OLD.card_id)),
    rating_count = (SELECT COUNT(*) FROM card_ratings WHERE card_id = COALESCE(NEW.card_id, OLD.card_id))
  WHERE id = COALESCE(NEW.card_id, OLD.card_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Create Trigger on card_ratings
DROP TRIGGER IF EXISTS on_rating_change ON card_ratings;

CREATE TRIGGER on_rating_change
AFTER INSERT OR UPDATE OR DELETE ON card_ratings
FOR EACH ROW
EXECUTE FUNCTION update_card_rating_stats();

-- 4. Backfill existing data
UPDATE cards c
SET 
  rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM card_ratings WHERE card_id = c.id),
  rating_count = (SELECT COUNT(*) FROM card_ratings WHERE card_id = c.id);
