-- ═══════════════════════════════════════════════════════════════════════
-- Lomi Code — Supabase schema for the contact form + admin dashboard
-- ═══════════════════════════════════════════════════════════════════════
--
-- HOW TO USE THIS FILE
--   1. Create a free project at https://supabase.com
--   2. Open your project → SQL Editor → New query
--   3. Paste this entire file and click "Run"
--   4. Then follow the README section "Setting up Supabase" for creating
--      admin users, adding them to the admin allowlist, and setting up
--      environment variables.
--
-- WHAT THIS FILE DOES
--   - Creates the `inquiries` table that stores contact-form submissions
--   - Creates an `admin_users` allowlist table + an `is_admin()` helper
--   - Enables Row Level Security (RLS) on both tables
--   - Adds policies so that:
--       * Anyone (including anonymous website visitors) can INSERT a new
--         inquiry — this is what lets the public contact form work.
--       * Only users listed in `admin_users` — NOT just any signed-in
--         Supabase user — can SELECT or UPDATE inquiries. Being
--         authenticated is necessary but not sufficient: an account must
--         also be explicitly added to the allowlist below.
--       * Nobody is granted DELETE — inquiries can only be removed
--         manually by a project owner via the Supabase dashboard/SQL
--         editor, as a deliberate safety choice for this first version.
--
-- SECURITY NOTE ON THE PREVIOUS VERSION OF THIS FILE
--   An earlier version of this schema granted SELECT/UPDATE to the
--   `authenticated` role directly, using `using (true)`. That meant
--   *any* signed-in Supabase user — not just the two founders — could
--   read and edit every inquiry, including a self-service sign-up if
--   public sign-ups were ever enabled. This version fixes that by
--   requiring membership in `admin_users`, checked via `is_admin()`.
--
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Inquiries table ---------------------------------------------------

create table if not exists public.inquiries (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  full_name        text not null,
  business_name    text,
  email            text not null,
  phone            text,
  service_needed   text not null,
  budget_range     text,
  project_details  text not null,
  status           text not null default 'new'
                     check (status in ('new', 'contacted', 'in_progress', 'closed'))
);

comment on table public.inquiries is
  'Contact-form submissions from the Lomi Code marketing website.';

-- Helpful indexes for the admin dashboard's search/filter/sort.
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_email_idx on public.inquiries (email);

-- 2. Admin allowlist -----------------------------------------------------
--
-- Membership in this table — not just having a Supabase Auth account —
-- is what grants admin access to inquiries. Rows here are keyed by the
-- user's `auth.users.id` (a UUID). You add rows for your two founders
-- manually after creating their accounts in Supabase Authentication —
-- see the README for the exact steps.

create table if not exists public.admin_users (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now(),
  note        text  -- optional, e.g. the admin's name, for your own reference
);

comment on table public.admin_users is
  'Allowlist of auth.users.id values permitted to act as admins. Add rows manually in the SQL editor or Table Editor after creating each founder''s account in Authentication — see README.';

-- Lock this table down completely from the client. Nobody — anonymous
-- or authenticated — gets any direct access to it via the API; it is
-- only ever read through the security-definer function below, and only
-- ever written to by a project owner via the Supabase dashboard/SQL
-- editor (which uses elevated privileges, not the anon/authenticated
-- roles governed by these policies).
alter table public.admin_users enable row level security;
-- Intentionally no policies are created for admin_users: with RLS
-- enabled and zero policies, the anon and authenticated roles have no
-- access to it at all (not even to check their own membership) except
-- through is_admin(), which runs with the privileges of its owner.

-- 3. is_admin() helper ----------------------------------------------------
--
-- `security definer` means this function runs with the privileges of
-- the user who created it (a superuser-ish role in Supabase's setup),
-- not the privileges of whoever calls it. That's what lets an ordinary
-- authenticated user's RLS check consult `admin_users` — a table they
-- otherwise have zero access to — without that function becoming a way
-- to read the allowlist's contents directly. It only ever returns a
-- boolean, never any row data.

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

comment on function public.is_admin() is
  'Returns true only if the currently authenticated user''s id is present in admin_users. Used in RLS policies; never exposes row data directly.';

-- Explicitly restrict who can even call this function, and revoke the
-- broad default grant Postgres gives to PUBLIC on new functions.
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 4. Row Level Security on inquiries --------------------------------------

alter table public.inquiries enable row level security;

-- Public visitors (the "anon" role, used by the anon key in the frontend)
-- may INSERT a new inquiry. This is the only thing the anon role can do
-- on this table — it cannot read, update, or delete anything.
drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries"
  on public.inquiries
  for insert
  to anon
  with check (true);

-- Only admins (rows present in admin_users) may read inquiries — being
-- merely authenticated is not enough. This replaces the earlier, overly
-- broad `using (true)` policy.
drop policy if exists "Authenticated users can view inquiries" on public.inquiries;
drop policy if exists "Admins can view inquiries" on public.inquiries;
create policy "Admins can view inquiries"
  on public.inquiries
  for select
  to authenticated
  using (public.is_admin());

-- Only admins may update inquiries (used for changing `status` from the
-- dashboard). Same fix as above — checked via is_admin(), not `true`.
drop policy if exists "Authenticated users can update inquiries" on public.inquiries;
drop policy if exists "Admins can update inquiries" on public.inquiries;
create policy "Admins can update inquiries"
  on public.inquiries
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- No insert policy exists for the `authenticated` role and no delete
-- policy exists for any role — by design. Admins submitting inquiries
-- through the same public form will simply use the `anon`-role insert
-- policy above like any other visitor. If you want admins to also
-- delete inquiries later, add an explicit `for delete` policy gated by
-- `public.is_admin()`, mirroring the select/update policies above.

-- ═══════════════════════════════════════════════════════════════════════
-- End of schema. See README.md for:
--   - creating the two founders' accounts in Supabase Authentication
--   - adding their user ids to admin_users (the step that actually
--     grants them dashboard access)
--   - disabling public sign-ups so nobody else can create an account
--   - wiring up your .env file
-- ═══════════════════════════════════════════════════════════════════════
