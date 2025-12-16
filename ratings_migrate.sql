-- Create card_ratings table
create table if not exists public.card_ratings (
  id uuid default gen_random_uuid() primary key,
  card_id uuid references public.cards(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(card_id, user_id)
);

-- Enable RLS
alter table public.card_ratings enable row level security;

-- Policies
create policy "Users can read all ratings"
  on public.card_ratings for select
  using ( true );

create policy "Users can insert their own rating"
  on public.card_ratings for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own rating"
  on public.card_ratings for update
  using ( auth.uid() = user_id );

-- Helper to get text summary if needed, but we will likely query directly.
