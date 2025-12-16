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
