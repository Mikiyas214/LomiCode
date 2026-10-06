import { createClient } from '@supabase/supabase-js'

// ─────────────────────────────────────────────────────────────────────────
// Supabase clients (frontend-safe)
//
// Only the public URL and the "anon" (public) key are used here. The anon
// key is designed to be exposed in frontend code — it has no special
// privileges on its own. What actually protects your data is Row Level
// Security (RLS), configured in `supabase-schema.sql`:
//   - Anyone can INSERT a new inquiry (the public contact form).
//   - Only authenticated admin users can SELECT or UPDATE inquiries.
//
// NEVER put your Supabase "service_role" key, a database password, or any
// other secret in this file or anywhere else in `src/`. The service_role
// key bypasses RLS entirely and must only ever be used in a trusted
// server environment (e.g. a Supabase Edge Function), never in code that
// ships to the browser.
//
// There are deliberately TWO clients here:
//
//   1. `supabase`        — the authenticated client. Keeps a normal, shared
//                          session (localStorage), so it powers admin sign-in,
//                          `RequireAuth`, the dashboard, and every
//                          authenticated database operation.
//
//   2. `supabasePublic`  — an anonymous client for public contact-form
//                          submissions only. It is created with
//                          `persistSession: false`, so it neither reads nor
//                          writes the admin session and never holds a user
//                          session in memory.
//
// Why the split matters: RLS is evaluated by Postgres against the role in
// the request's JWT, not against which client object made the call. If the
// contact form shared the authenticated client, then a founder signed in at
// /admin would have their session attached to the public inquiry INSERT —
// the request would run as `authenticated` rather than `anon`, and since the
// schema grants INSERT only to `anon`, the insert would be rejected with
// `42501: new row violates row-level security policy`. The form would work
// in a private window and fail for exactly the people who are logged in.
// `persistSession: false` guarantees the public client always sends the
// plain anon key, so the `anon` INSERT policy applies in every case.
//
// Note: auth-js logs a "Multiple GoTrueClient instances detected in the same
// browser context" warning at startup. That is expected and harmless here —
// the public client uses an isolated in-memory storage instead of
// localStorage, so the two clients never contend for the same session key.
// ─────────────────────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev/build rather than silently making broken requests.
  console.error(
    'Missing Supabase environment variables. Copy .env.example to .env and ' +
    'fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Public/anonymous client used for contact-form submissions. `persistSession:
// false` keeps it from reading or writing the admin session in localStorage,
// and `autoRefreshToken: false` is its companion setting (there is no session
// to refresh). Every request it makes therefore carries only the anon key.
export const supabasePublic = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
})
