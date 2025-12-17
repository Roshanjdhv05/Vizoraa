-- FUNCTIONS FOR ADMIN ACTIONS
-- These functions use SECURITY DEFINER to bypass RLS policies.
-- In a production environment, you should add logic to check if auth.uid() belongs to an admin.
-- For this prototype, we will trust the caller (assuming only the Admin Panel calls this).

-- 1. Toggle Verification
CREATE OR REPLACE FUNCTION public.toggle_user_verification(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET is_verified = NOT COALESCE(is_verified, FALSE)
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Delete Card (Admin)
CREATE OR REPLACE FUNCTION public.admin_delete_card(target_card_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.cards
  WHERE id = target_card_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Delete Profile (and cascading cards/data)
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Deleting from profiles should cascade to cards, likes, ratings etc via foreign keys
  DELETE FROM public.profiles
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Grant Premium Access (Admin)
CREATE OR REPLACE FUNCTION public.grant_premium_access(target_user_id UUID, duration_months INTEGER)
RETURNS VOID AS $$
DECLARE
  new_expiry TIMESTAMPTZ;
BEGIN
  -- Set expiry to now + months (or extend existing if already valid? For simplicity, we just set from NOW)
  -- Actually, if they are already premium, maybe we should extend? 
  -- Requirement says "grant free premium cards and gold plan 1month, 6month...". 
  -- Let's just set/overwrite for simplicity as "Grant" implies setting it.
  
  new_expiry := NOW() + (duration_months || ' months')::INTERVAL;
  
  UPDATE public.profiles
  SET subscription_plan = 'gold',
      subscription_expiry = new_expiry
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
