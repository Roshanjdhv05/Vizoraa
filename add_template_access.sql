-- Add unlocked_templates column to profiles if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS unlocked_templates TEXT[] DEFAULT '{}';

-- Function to grant access to a specific template
CREATE OR REPLACE FUNCTION public.grant_template_access(target_user_id UUID, template_id TEXT)
RETURNS VOID AS $$
DECLARE
  current_templates TEXT[];
BEGIN
  -- Get current templates
  SELECT unlocked_templates INTO current_templates FROM public.profiles WHERE id = target_user_id;
  
  -- If null, initialize
  IF current_templates IS NULL THEN
    current_templates := '{}';
  END IF;

  -- Append if not exists
  IF NOT (template_id = ANY(current_templates)) THEN
    UPDATE public.profiles
    SET unlocked_templates = array_append(current_templates, template_id)
    WHERE id = target_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
