-- Migration: baseline
-- Created: 2026-03-09

begin;

create extension if not exists "uuid-ossp";

create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  short_bio text,
  is_discoverable boolean default false,
  discover_mode text default 'unlisted' check (discover_mode in ('all','professional','personal','unlisted')),
  contact_links jsonb default '[]',
  created_at timestamptz default now()
);

create table public.vault_sections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  domain text not null check (domain in ('professional','personal','custom')),
  section_type text not null,
  label text not null,
  content text default '',
  visibility text default 'public' check (visibility in ('public','discoverable_only','private')),
  last_confirmed_at timestamptz default now(),
  source text default 'manual' check (source in ('manual','file_extracted','chat_extracted')),
  updated_at timestamptz default now()
);

create table public.uploaded_files (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  file_name text not null,
  file_url text not null,
  extracted_text text default '',
  extraction_confirmed boolean default false,
  created_at timestamptz default now()
);

create table public.visitor_query_log (
  id uuid default uuid_generate_v4() primary key,
  profile_user_id uuid references public.users(id) on delete cascade not null,
  topic_cluster text not null,
  count integer default 1,
  surfaced_to_owner boolean default false,
  created_at timestamptz default now()
);

create table public.connection_interests (
  id uuid default uuid_generate_v4() primary key,
  from_user_id uuid references public.users(id) on delete cascade not null,
  to_user_id uuid references public.users(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending','owner_opened','matched','declined')),
  compatibility_summary text,
  created_at timestamptz default now()
);

create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  type text not null check (type in ('gap_detection','query_surfacing','temporal_refresh','connection_match','connection_interest')),
  message text not null,
  metadata jsonb,
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.vault_sections enable row level security;
alter table public.uploaded_files enable row level security;
alter table public.visitor_query_log enable row level security;
alter table public.connection_interests enable row level security;
alter table public.notifications enable row level security;

create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.users for insert with check (auth.uid() = id);
create policy "Public profiles viewable by anyone" on public.users for select using (true);
create policy "Users manage own vault" on public.vault_sections for all using (auth.uid() = user_id);
create policy "Public vault sections viewable" on public.vault_sections for select using (visibility = 'public');
create policy "Users manage own files" on public.uploaded_files for all using (auth.uid() = user_id);
create policy "Users manage own notifications" on public.notifications for all using (auth.uid() = user_id);
create policy "Users manage own connections" on public.connection_interests for all using (auth.uid() = from_user_id or auth.uid() = to_user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, display_name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'New User'),
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

commit;