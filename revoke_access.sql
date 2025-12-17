-- Function to revoke all upgrades (Subscription + Templates)
CREATE OR REPLACE FUNCTION public.revoke_user_upgrades(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET subscription_plan = 'free',
      subscription_expiry = NULL,
      unlocked_templates = '{}'
  WHERE id = target_user_id;

  -- Optional: If we want to downgrade all their cards to free too?
  -- UPDATE public.cards SET is_premium = FALSE WHERE user_id = target_user_id;
  -- For now, let's just do account level as requested.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
