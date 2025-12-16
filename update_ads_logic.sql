-- Add new columns for Enhanced Ad Logic
ALTER TABLE public.ads
ADD COLUMN IF NOT EXISTS is_important BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS repeat_interval INTEGER DEFAULT 0;

-- repeat_interval:
-- 0 or NULL = Standard rotation (appears once per cycle of all ads)
-- N > 0 = If is_important is TRUE, this ad appears every N ad slots.
-- Example: interval=2 means: Ad, Ad, [Important Ad], Ad, Ad, [Important Ad]...
