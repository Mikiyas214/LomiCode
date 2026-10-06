# Lomi Code — Marketing Website + Admin Dashboard

A responsive, accessible marketing website for a web design & software studio, built with React, Vite, React Router, and Lucide icons — now backed by a real Supabase database for the contact form, plus a secure admin dashboard for the two founders to manage inquiries.

**What's real in this version:**
- Contact form submissions are saved to a Postgres table in Supabase.
- A "Continue on WhatsApp" button opens WhatsApp with a pre-filled message summarizing the inquiry.
- A password-protected admin login (`/admin/login`) and dashboard (`/admin`) let the founders view, search, filter, and update the status of inquiries.

**What's intentionally NOT implemented yet:** email notifications. Sending a real email on submission needs a trusted server-side environment (e.g. a Supabase Edge Function or similar) so that an email-provider API key is never exposed in frontend code. That's a good next step, but it's out of scope for this practice version — don't wire up "notify by email" without adding that server-side piece first.

## Rebranding

Almost everything you'll want to change lives in **`src/config/site.js`**:

- `brand` — name, tagline, sub-tagline
- `contact` — email, phone, WhatsApp number, Telegram/Instagram/LinkedIn links, address
- `services` — the 7 service cards (title, summary, outcomes)
- `portfolio` — the 6 sample project cards
- `testimonials` — sample testimonial quotes
- `team` — the 2 founder placeholders
- `values` — the "why choose us" cards
- `process` — the 3-step "how we work" section
- `inquiryStatuses` — the 4 admin-dashboard statuses (new, contacted, in progress, closed)

Colors and type live as CSS custom properties at the top of `src/index.css` (`:root { ... }`) — change `--color-primary`, `--color-accent`, etc. to restyle the whole site (the admin dashboard reuses the same tokens).

Every placeholder in the code is marked with a `TODO:` comment or explicit "placeholder" label so it's easy to find and replace with real content later.

> **Note on `contact`:** the values in `src/config/site.js` are still the original
> unverified placeholders and are marked `// TODO: replace`. They were deliberately
> left untouched during the Lomi Code rebrand rather than swapped for invented
> details — replace them with the real Lomi Code email, phone, WhatsApp number and
> social links before launch.

## Brand assets

Official Lomi Code artwork lives in `public/brand/` and is referenced through
`brand.logo` / `brand.mark` in `src/config/site.js`:

| File | Used for |
| --- | --- |
| `public/brand/lomi-code-logo.svg` | Full lockup — navbar, footer, hero |
| `public/brand/lomi-code-mark.svg` | Compact contexts, apple-touch-icon |
| `public/favicon.svg` | Browser tab icon |

`src/components/BrandLogo.jsx` wraps them in a single `<img>` with a `variant`
prop (`nav`, `footer`, `hero`, `admin`, `mark`); sizes live in `src/index.css`
under `.brand-logo--*`. Always set the height only — never both width and
height — so the lockup keeps its aspect ratio.

The mark and wordmark are live `<text>` elements, so they render with the
fallback font if Sora is unavailable. Converting them to outlined paths would
make them render identically everywhere, and would also allow a real PNG to be
exported for `og:image` / `apple-touch-icon` (both currently point at SVGs,
which some social scrapers and iOS ignore).

## Theming

- Tokens are defined once for light (`:root`) and dark (`[data-theme='dark']`).
- An inline script in `index.html` applies the stored/system theme before first
  paint, so there is no light-to-dark flash on load.
- `ThemeContext` persists the choice to `localStorage` under `lomi-theme` and
  exposes `useTheme()`. With nothing stored it follows the OS preference and
  keeps following it until the visitor uses the sun/moon toggle.

## Project structure

```
src/
  components/     Reusable UI pieces (Header, Footer, Hero, ContactForm, RequireAuth, ...)
  pages/          One file per public route (Home, Services, Work, About, Contact, ...)
  pages/admin/    Admin login + dashboard, and their shared Admin.css
  context/        AuthContext.jsx — tracks the Supabase admin session
  lib/            supabase.js — the Supabase client (frontend-safe, anon key only)
  config/         site.js — single source of truth for brand/content/contact
  index.css       Design tokens (colors, type, spacing) + global styles
  App.jsx         Route definitions (public layout + admin routes)
  main.jsx        App entry point
supabase-schema.sql   Run this in the Supabase SQL editor — see below
.env.example          Copy to .env and fill in your own project values
```

## Setting up Supabase

This is the part that makes the contact form and admin dashboard actually work. It takes about 15 minutes. Steps 3 and 4 are what actually grant admin access — don't skip step 4.

### 1. Create a free Supabase project

1. Go to [supabase.com](https://supabase.com) and sign up (free tier is enough).
2. Click **New project**, choose an organization, name it (e.g. "lomi-code"), set a database password (save it somewhere safe — you won't need it for this app, but you might later), and pick a region close to you.
3. Wait for the project to finish provisioning (a couple of minutes).

### 2. Run `supabase-schema.sql`

1. In your Supabase project, open **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open `supabase-schema.sql` from this project, copy its entire contents, and paste it into the query editor.
4. Click **Run**.

This creates:
- The `inquiries` table.
- An `admin_users` allowlist table (empty for now — you'll add rows to it in step 4).
- An `is_admin()` function that checks whether the currently signed-in user's id is present in `admin_users`.
- Row Level Security (RLS) policies so that:
  - Anyone can submit a new inquiry (the public contact form) — the `anon` role can `INSERT` only.
  - **Only users listed in `admin_users` can view or update inquiries** — simply having a Supabase Auth account is not enough on its own.
  - Nobody can delete inquiries through the app — that's a deliberate safety default for this first version.

You can double-check it worked: go to **Table Editor** → you should see `inquiries` and `admin_users` tables.

### 3. Create two admin users

1. In Supabase, open **Authentication** → **Users** in the left sidebar.
2. Click **Add user** → **Create new user**.
3. Enter each founder's email and a password (or use "Send invite email" if you'd rather they set their own password). Repeat for the second founder.
4. For each user you just created, click into their row and copy their **User UID** (a UUID like `a1b2c3d4-...`) — you'll need both in the next step.

### 4. Add both founders to the `admin_users` allowlist — required for dashboard access

Creating a user in step 3 only lets someone sign in — it does **not**, by itself, grant access to inquiries. A user must also have a row in `admin_users`, or every `inquiries` query they make will correctly return nothing (that's the RLS policy working as intended).

1. Back in **SQL Editor**, open a new query.
2. For each founder, run:
   ```sql
   insert into public.admin_users (user_id, note)
   values ('paste-the-user-uid-here', 'Founder name, for your reference');
   ```
   Run it once per founder (twice total), pasting in the UUID you copied in step 3.
3. Alternatively, you can do this without SQL: open **Table Editor** → `admin_users` → **Insert row**, and paste each UUID into the `user_id` column.
4. Verify: `select * from public.admin_users;` in the SQL Editor should list both founders' UUIDs.

Only users with a row here can sign in to `/admin` and see any inquiries — everyone else's login will succeed (if they have valid Supabase Auth credentials) but the dashboard will show nothing, because RLS blocks the underlying query.

### 5. Disable public sign-ups

This app has no sign-up page of its own, but Supabase's default auth settings still allow anyone who discovers your project's URL and anon key to sign themselves up directly against the Supabase Auth API. Since dashboard access is now gated by `admin_users` (not just "is authenticated"), a stray sign-up on its own can't read inquiries — but it's still good practice to turn this off:

1. In Supabase, open **Authentication** → **Providers** (or **Authentication** → **Settings**, depending on your project's dashboard version).
2. Find **Allow new users to sign up** (under the Email provider settings) and turn it **off**.
3. Save. New accounts can now only be created by a project owner via **Authentication → Users**, as in step 3.

### 6. Get your API keys

1. In Supabase, open **Project Settings** → **API**.
2. Copy the **Project URL** and the **anon / public** key. (Do **not** copy the `service_role` key — it must never be used in this frontend app.)

### 7. Add environment variables and run locally

```bash
cp .env.example .env
```

Open `.env` and fill in the two values from step 6:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

Then install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and submit the contact form — the inquiry should appear in Supabase's **Table Editor** → `inquiries`. Then visit `http://localhost:5173/admin/login` and sign in with one of the admin accounts you created in step 3 (and added to `admin_users` in step 4).

> **Note:** the production build (`npm run build`) has been verified to compile
> cleanly in this environment. `npm install` and the Supabase setup steps above
> still need to be run on your own machine — and you should confirm the whole
> Supabase flow end-to-end, including that a user NOT in `admin_users` correctly
> cannot see any inquiries, before treating this as production-ready.

## Building for production

```bash
npm run build
```

Outputs a production-ready static build to `dist/`. Preview it locally with `npm run preview`.

## Deploying

Add your environment variables in your hosting provider **before** deploying, using the same two keys from your `.env` file (never commit `.env` — it's already git-ignored).

### Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repo (or use the Vercel CLI from this folder).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Before the first deploy, go to **Project Settings → Environment Variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Confirm build settings: **Build command** `npm run build`, **Output directory** `dist`.
5. Deploy.

### Netlify

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Before the first deploy, go to **Site configuration → Environment variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Confirm build settings: **Build command** `npm run build`, **Publish directory** `dist`.
5. Deploy.

### Client-side routing on either host

This site uses React Router with client-side routes, including `/admin` and `/admin/login`. Both hosts are already configured for this:

- `public/_redirects` (Netlify): `/*  /index.html  200`
- `vercel.json` (Vercel): rewrites all paths to `/index.html`

## Security notes

- The frontend only ever uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. The anon key is meant to be public — it has no special privileges by itself.
- Data access is enforced by **Row Level Security** in `supabase-schema.sql`, not by anything in the frontend code. Even if someone reads the frontend JavaScript bundle, they still can't read, update, or delete inquiries without both (a) signing in, **and** (b) having a row in `admin_users`.
- **Being authenticated is not the same as being an admin.** The `inquiries` SELECT/UPDATE policies check `public.is_admin()`, which looks up the signed-in user's id in `admin_users` — they do not grant access to the whole `authenticated` role. A Supabase account with no `admin_users` row can sign in successfully but will see zero inquiries, by design.
- `admin_users` itself has RLS enabled with no policies at all, so neither the `anon` nor `authenticated` role can query it directly through the API (not even to check their own membership) — the only way to consult it is through `is_admin()`, a `security definer` function that returns a boolean and never exposes row data. Rows are added to it manually, by a project owner, in the Supabase dashboard or SQL editor — never through the app.
- **Never** put a `service_role` key, database password, or any other secret into `src/`, `.env.example`, or a client-side environment variable. If you ever need the service_role key (e.g. for a future server-side email function), it belongs only in a trusted server environment (like a Supabase Edge Function's own secrets), never in code that ships to the browser.
- Admin routes are protected client-side by `RequireAuth` (redirects to `/admin/login` if not signed in) **and** server-side by RLS + `is_admin()` (so even a modified frontend, or a non-admin user who successfully signs in, can't read data). Both matter — the client-side check is for user experience, the RLS policy is what actually keeps the data safe.
- Disabling public sign-ups (see setup step 5) is a defense-in-depth measure, not the thing actually protecting your data — `admin_users` membership is. Even if sign-ups were left on, a self-signed-up account still couldn't read or update any inquiry.

## Admin dashboard

Once signed in at `/admin/login`, the dashboard (`/admin`) shows:

- Count cards for each status (New, Contacted, In Progress, Closed) — click one to filter the table by that status.
- A search box that filters by name, email, or business name.
- A status filter dropdown.
- A table of matching inquiries — click a row to open the detail panel.
- In the detail panel: full inquiry details and a dropdown to change status (saved to Supabase immediately).
- A **Log out** button in the header.

## Accessibility notes

- Skip-to-content link, visible focus states, and semantic landmarks throughout
- Mobile navigation is keyboard-operable and closes on link selection
- Animations respect `prefers-reduced-motion`; scroll-reveal content is also
  forced visible when scripting is unavailable, so nothing is ever hidden behind
  JavaScript
- Form fields are labeled and report errors via `aria-invalid` / `aria-describedby`
- Admin table rows are keyboard-operable (Enter opens the detail panel)

## Animations

There is no animation library — motion is hand-rolled so the bundle stays small.
Two primitives do most of the work:

- `src/components/Reveal.jsx` — wraps any element and adds `.is-visible` the
  first time it scrolls into view (via `IntersectionObserver`), so each element
  animates exactly once. Pass `delay` to stagger a grid of cards, and `as` to
  change the rendered tag.
- `src/index.css` — `.reveal-on-scroll` (the fade/rise), `--ease-out`, and the
  `prefers-reduced-motion` block that neutralises every animation site-wide.

