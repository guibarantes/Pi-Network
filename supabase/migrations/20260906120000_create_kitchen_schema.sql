begin;

create schema if not exists private;

create or replace function private.kitchen_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.kitchen_set_updated_at() from public, anon, authenticated;

create table public.kitchen_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(trim(display_name)) between 1 and 120),
  email text not null unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  state text check (state is null or state ~ '^[A-Z]{2}$'),
  municipality text,
  latitude double precision check (latitude is null or latitude between -90 and 90),
  longitude double precision check (longitude is null or longitude between -180 and 180),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kitchen_preferences (
  user_id uuid primary key references public.kitchen_profiles(id) on delete cascade,
  voice_enabled boolean not null default true,
  voice_language text not null default 'pt-BR' check (voice_language in ('pt-BR', 'en-US')),
  conversation_focus text not null default 'both' check (conversation_focus in ('local_politics', 'recipes', 'both')),
  meal_time_preferences jsonb not null default '[]'::jsonb check (jsonb_typeof(meal_time_preferences) = 'array'),
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kitchen_receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.kitchen_profiles(id) on delete cascade,
  store_name text not null check (char_length(trim(store_name)) between 1 and 200),
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  purchase_date timestamptz not null default now(),
  state_code text check (state_code is null or state_code ~ '^[A-Z]{2}$'),
  icms_potential jsonb not null default '[]'::jsonb check (jsonb_typeof(icms_potential) = 'array'),
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kitchen_receipt_items (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references public.kitchen_receipts(id) on delete cascade,
  user_id uuid not null references public.kitchen_profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 200),
  quantity numeric(12,3) not null default 1 check (quantity > 0),
  price numeric(12,2) not null default 0 check (price >= 0),
  category text,
  icms_rate numeric(5,2) check (icms_rate is null or icms_rate between 0 and 100),
  state text check (state is null or state ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now()
);

create table public.kitchen_inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.kitchen_profiles(id) on delete cascade,
  receipt_item_id uuid references public.kitchen_receipt_items(id) on delete set null,
  name text not null check (char_length(trim(name)) between 1 and 200),
  quantity numeric(12,3) not null default 1 check (quantity >= 0),
  unit text not null default 'unit' check (unit in ('kg', 'g', 'l', 'ml', 'unit')),
  category text,
  added_at timestamptz not null default now(),
  expiry_date date,
  source text not null default 'manual' check (source in ('manual', 'receipt', 'photo')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kitchen_recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.kitchen_profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 200),
  description text not null default '',
  ingredients jsonb not null default '[]'::jsonb check (jsonb_typeof(ingredients) = 'array'),
  instructions jsonb not null default '[]'::jsonb check (jsonb_typeof(instructions) = 'array'),
  preparation_time integer not null default 0 check (preparation_time >= 0),
  servings integer not null default 1 check (servings > 0),
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  tags text[] not null default '{}',
  rating numeric(2,1) check (rating is null or rating between 0 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kitchen_cooking_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.kitchen_profiles(id) on delete cascade,
  recipe_id uuid references public.kitchen_recipes(id) on delete set null,
  status text not null default 'active' check (status in ('active', 'completed', 'abandoned')),
  current_step integer not null default 1 check (current_step > 0),
  news_assignments jsonb not null default '{}'::jsonb check (jsonb_typeof(news_assignments) = 'object'),
  voice_active boolean not null default false,
  notes text[] not null default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.kitchen_conversation_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.kitchen_profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(trim(content)) > 0),
  context text check (context is null or context in ('recipe', 'local_politics', 'general', 'icms')),
  created_at timestamptz not null default now()
);

create index kitchen_receipts_user_id_idx on public.kitchen_receipts(user_id);
create index kitchen_receipts_purchase_date_idx on public.kitchen_receipts(user_id, purchase_date desc);
create index kitchen_receipt_items_receipt_id_idx on public.kitchen_receipt_items(receipt_id);
create index kitchen_receipt_items_user_id_idx on public.kitchen_receipt_items(user_id);
create index kitchen_inventory_items_user_id_idx on public.kitchen_inventory_items(user_id);
create index kitchen_inventory_items_expiry_date_idx on public.kitchen_inventory_items(user_id, expiry_date);
create index kitchen_inventory_items_receipt_item_id_idx on public.kitchen_inventory_items(receipt_item_id);
create index kitchen_recipes_user_id_idx on public.kitchen_recipes(user_id);
create index kitchen_cooking_sessions_user_id_idx on public.kitchen_cooking_sessions(user_id);
create index kitchen_cooking_sessions_recipe_id_idx on public.kitchen_cooking_sessions(recipe_id);
create index kitchen_conversation_messages_user_id_idx on public.kitchen_conversation_messages(user_id);
create index kitchen_conversation_messages_created_at_idx on public.kitchen_conversation_messages(user_id, created_at desc);

create trigger kitchen_profiles_set_updated_at before update on public.kitchen_profiles
for each row execute function private.kitchen_set_updated_at();
create trigger kitchen_preferences_set_updated_at before update on public.kitchen_preferences
for each row execute function private.kitchen_set_updated_at();
create trigger kitchen_receipts_set_updated_at before update on public.kitchen_receipts
for each row execute function private.kitchen_set_updated_at();
create trigger kitchen_inventory_items_set_updated_at before update on public.kitchen_inventory_items
for each row execute function private.kitchen_set_updated_at();
create trigger kitchen_recipes_set_updated_at before update on public.kitchen_recipes
for each row execute function private.kitchen_set_updated_at();
create trigger kitchen_cooking_sessions_set_updated_at before update on public.kitchen_cooking_sessions
for each row execute function private.kitchen_set_updated_at();

alter table public.kitchen_profiles enable row level security;
alter table public.kitchen_preferences enable row level security;
alter table public.kitchen_receipts enable row level security;
alter table public.kitchen_receipt_items enable row level security;
alter table public.kitchen_inventory_items enable row level security;
alter table public.kitchen_recipes enable row level security;
alter table public.kitchen_cooking_sessions enable row level security;
alter table public.kitchen_conversation_messages enable row level security;

revoke all on table public.kitchen_profiles from anon, authenticated;
revoke all on table public.kitchen_preferences from anon, authenticated;
revoke all on table public.kitchen_receipts from anon, authenticated;
revoke all on table public.kitchen_receipt_items from anon, authenticated;
revoke all on table public.kitchen_inventory_items from anon, authenticated;
revoke all on table public.kitchen_recipes from anon, authenticated;
revoke all on table public.kitchen_cooking_sessions from anon, authenticated;
revoke all on table public.kitchen_conversation_messages from anon, authenticated;

grant select, insert on table public.kitchen_profiles to authenticated;
grant update (display_name, state, municipality, latitude, longitude) on table public.kitchen_profiles to authenticated;
grant select, insert, update, delete on table public.kitchen_preferences to authenticated;
grant select, insert, update, delete on table public.kitchen_receipts to authenticated;
grant select, insert, update, delete on table public.kitchen_receipt_items to authenticated;
grant select, insert, update, delete on table public.kitchen_inventory_items to authenticated;
grant select, insert, update, delete on table public.kitchen_recipes to authenticated;
grant select, insert, update, delete on table public.kitchen_cooking_sessions to authenticated;
grant select, insert, delete on table public.kitchen_conversation_messages to authenticated;

create policy kitchen_profiles_select_own on public.kitchen_profiles
for select to authenticated using ((select auth.uid()) = id);
create policy kitchen_profiles_insert_own on public.kitchen_profiles
for insert to authenticated with check (
  (select auth.uid()) = id
  and role = 'user'
  and lower(email) = lower(((select auth.jwt()) ->> 'email'))
);
create policy kitchen_profiles_update_own on public.kitchen_profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy kitchen_preferences_own on public.kitchen_preferences
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy kitchen_receipts_own on public.kitchen_receipts
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy kitchen_receipt_items_own on public.kitchen_receipt_items
for all to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1 from public.kitchen_receipts
    where id = receipt_id and user_id = (select auth.uid())
  )
);
create policy kitchen_inventory_items_own on public.kitchen_inventory_items
for all to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    receipt_item_id is null
    or exists (
      select 1 from public.kitchen_receipt_items
      where id = receipt_item_id and user_id = (select auth.uid())
    )
  )
);
create policy kitchen_recipes_own on public.kitchen_recipes
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
create policy kitchen_cooking_sessions_own on public.kitchen_cooking_sessions
for all to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and (
    recipe_id is null
    or exists (
      select 1 from public.kitchen_recipes
      where id = recipe_id and user_id = (select auth.uid())
    )
  )
);
create policy kitchen_conversation_messages_own on public.kitchen_conversation_messages
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

commit;
