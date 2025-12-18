-- Function to safely increment card view count
-- SECURITY DEFINER allows this to run with elevated privileges (bypassing RLS for this specific operation)
-- This enables non-logged-in users to increment the view count.

create or replace function increment_card_view(card_id_input uuid)
returns void
language plpgsql
security definer
as $$
begin
  update cards
  set view_count = coalesce(view_count, 0) + 1
  where id = card_id_input;
end;
$$;
