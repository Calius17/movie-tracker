create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  tmdb_id integer not null,
  status text not null default 'plan_to_watch' check (status in ('watched', 'watching', 'plan_to_watch')),
  rating numeric(2,1) check (rating between 0 and 10),
  review text,
  unique(user_id, tmdb_id)
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  movie_name text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed'))
);
