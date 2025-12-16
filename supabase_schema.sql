-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Handled by Supabase Auth usually, but explicit table helps)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- CARDS
create table public.cards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null, -- e.g. "My Business Card"
  name text not null,
  profession text,
  company text,
  bio text,
  location text,
  country text,
  state text,
  area text,
  phone text,
  email text,
  website text,
  theme_color text default '#6366f1',
  template_id text default 'modern',
  avatar_url text,
  banner_url text,
  social_links jsonb default '{}'::jsonb, -- { "instagram": "url", "linkedin": "url" }
  view_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SAVED CARDS
create table public.saved_cards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  card_id uuid references public.cards(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, card_id)
);

-- CARD LIKES
create table public.card_likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  card_id uuid references public.cards(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, card_id)
);

-- CARD RATINGS
create table public.card_ratings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  card_id uuid references public.cards(id) on delete cascade not null,
  rating float check (rating >= 0.5 and rating <= 5.0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, card_id)
);

-- RLS POLICIES (Row Level Security)
alter table public.profiles enable row level security;
alter table public.cards enable row level security;
alter table public.saved_cards enable row level security;
alter table public.card_likes enable row level security;
alter table public.card_ratings enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Policies for Cards
create policy "Cards are viewable by everyone." on public.cards for select using (true);
create policy "Users can insert their own cards." on public.cards for insert with check (auth.uid() = user_id);
create policy "Users can update their own cards." on public.cards for update using (auth.uid() = user_id);
create policy "Users can delete their own cards." on public.cards for delete using (auth.uid() = user_id);

-- Policies for Saved Cards
create policy "Users can view their own saved cards." on public.saved_cards for select using (auth.uid() = user_id);
create policy "Users can save cards." on public.saved_cards for insert with check (auth.uid() = user_id);
create policy "Users can unsave cards." on public.saved_cards for delete using (auth.uid() = user_id);

-- Policies for Likes
create policy "Likes are viewable by everyone." on public.card_likes for select using (true);
create policy "Users can like cards." on public.card_likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike cards." on public.card_likes for delete using (auth.uid() = user_id);

-- Policies for Ratings
create policy "Ratings are viewable by everyone." on public.card_ratings for select using (true);
create policy "Users can rate cards." on public.card_ratings for insert with check (auth.uid() = user_id);
create policy "Users can update their rating." on public.card_ratings for update using (auth.uid() = user_id);

-- Trigger to handle new user signup (Optional but recommended)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
