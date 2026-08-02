-- ============================================================
-- NTANDA Cultural Heritage Site — Schema
-- Apply in the Supabase SQL Editor on the target project.
-- Run order: 1) schema  2) storage  3) seed
-- ============================================================

-- ---------- Helper: auto-update updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = 'public'
as $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

-- ---------- Helper: profile auto-create on signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = 'public'
as $function$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end;
$function$;

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_name text,
  full_name text,
  email text,
  avatar_url text,
  bio text,
  role text not null default 'user' check (role in ('user', 'admin')),
  personal_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- regalia ----------
create table public.regalia (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tribe text,
  category text check (category in ('Garments', 'Jewelry', 'Headwear', 'Footwear', 'Ceremonial')),
  description text,
  full_details text,
  image text,
  era text,
  material text,
  origin_region text,
  spiritual_significance text,
  is_featured boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text unique
);

-- ---------- artifacts ----------
create table public.artifacts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  culture text,
  ref_number text,
  estimated_age text,
  location text,
  image text,
  description text,
  material text,
  added_time text,
  significance_details text,
  historical_context text,
  audio_track text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text unique
);

-- ---------- communities ----------
create table public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  region text,
  description text,
  full_history text,
  avatar_image text,
  banner_image text,
  population text,
  language text,
  royalty_leader text,
  totems jsonb not null default '[]'::jsonb,
  key_traditions jsonb not null default '[]'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text unique
);

-- ---------- posts ----------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text unique,
  excerpt text,
  content text,
  content_type text not null check (content_type in ('post', 'blog', 'vlog')),
  cover_image text,
  media_urls text[] not null default '{}'::text[],
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- pages ----------
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text unique,
  description text,
  content text,
  cover_image text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- saved_items ----------
create table public.saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  item_ref text not null,
  item_type text not null check (item_type in ('regalia', 'artifact', 'community', 'post', 'page')),
  created_at timestamptz not null default now(),
  unique (user_id, item_ref, item_type)
);

-- ---------- Helper: is_admin() (defined after tables) ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = 'public'
as $function$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$function$;

-- ---------- updated_at triggers ----------
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger regalia_set_updated_at before update on public.regalia
  for each row execute function public.set_updated_at();
create trigger artifacts_set_updated_at before update on public.artifacts
  for each row execute function public.set_updated_at();
create trigger communities_set_updated_at before update on public.communities
  for each row execute function public.set_updated_at();
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();
create trigger pages_set_updated_at before update on public.pages
  for each row execute function public.set_updated_at();

-- ---------- profile auto-create on signup ----------
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.regalia enable row level security;
alter table public.artifacts enable row level security;
alter table public.communities enable row level security;
alter table public.posts enable row level security;
alter table public.pages enable row level security;
alter table public.saved_items enable row level security;

-- profiles
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);
create policy "Admins can update any profile"
  on public.profiles for update
  using (public.is_admin());

-- regalia
create policy "Regalia is viewable by everyone"
  on public.regalia for select using (true);
create policy "Authenticated users can add regalia"
  on public.regalia for insert
  with check (auth.uid() = created_by);
create policy "Users can update their own regalia"
  on public.regalia for update using (auth.uid() = created_by);
create policy "Users can delete their own regalia"
  on public.regalia for delete using (auth.uid() = created_by);
create policy "Admins can manage all regalia"
  on public.regalia for all using (public.is_admin());

-- artifacts
create policy "Artifacts are viewable by everyone"
  on public.artifacts for select using (true);
create policy "Authenticated users can add artifacts"
  on public.artifacts for insert
  with check (auth.uid() = created_by);
create policy "Users can update their own artifacts"
  on public.artifacts for update using (auth.uid() = created_by);
create policy "Users can delete their own artifacts"
  on public.artifacts for delete using (auth.uid() = created_by);
create policy "Admins can manage all artifacts"
  on public.artifacts for all using (public.is_admin());

-- communities
create policy "Communities are viewable by everyone"
  on public.communities for select using (true);
create policy "Authenticated users can add communities"
  on public.communities for insert
  with check (auth.uid() = created_by);
create policy "Users can update their own communities"
  on public.communities for update using (auth.uid() = created_by);
create policy "Users can delete their own communities"
  on public.communities for delete using (auth.uid() = created_by);
create policy "Admins can manage all communities"
  on public.communities for all using (public.is_admin());

-- posts
create policy "Published posts are viewable by everyone"
  on public.posts for select
  using ((status = 'published'::text) or (auth.uid() = author_id) or public.is_admin());
create policy "Users can create posts"
  on public.posts for insert
  with check (auth.uid() = author_id);
create policy "Users can update their own posts"
  on public.posts for update using (auth.uid() = author_id);
create policy "Users can delete their own posts"
  on public.posts for delete using (auth.uid() = author_id);
create policy "Admins can manage all posts"
  on public.posts for all using (public.is_admin());

-- pages
create policy "Public pages are viewable by everyone"
  on public.pages for select
  using ((is_public = true) or (auth.uid() = author_id) or public.is_admin());
create policy "Users can create pages"
  on public.pages for insert
  with check (auth.uid() = author_id);
create policy "Users can update their own pages"
  on public.pages for update using (auth.uid() = author_id);
create policy "Users can delete their own pages"
  on public.pages for delete using (auth.uid() = author_id);
create policy "Admins can manage all pages"
  on public.pages for all using (public.is_admin());

-- saved_items
create policy "Users can read their own saved items"
  on public.saved_items for select using (auth.uid() = user_id);
create policy "Users can save items"
  on public.saved_items for insert
  with check (auth.uid() = user_id);
create policy "Users can delete their own saved items"
  on public.saved_items for delete using (auth.uid() = user_id);

-- ---------- Grants (match Supabase defaults) ----------
grant all on public.profiles to anon, authenticated, service_role;
grant all on public.regalia to anon, authenticated, service_role;
grant all on public.artifacts to anon, authenticated, service_role;
grant all on public.communities to anon, authenticated, service_role;
grant all on public.posts to anon, authenticated, service_role;
grant all on public.pages to anon, authenticated, service_role;
grant all on public.saved_items to anon, authenticated, service_role;
