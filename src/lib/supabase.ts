// supabase.ts — Supabase client bootstrap.
// Responsibilities:
//   - Reads the project URL and anon key from VITE_* environment variables
//     (provided in .env / .env.local — never committed to the repo).
//   - Fails fast with a clear error if the variables are missing.
//   - Creates a single shared client instance used by the whole app.
//   - Auth is configured with the PKCE flow: the session is persisted in
//     localStorage, auto-refreshed when it expires, and detected when the
//     user is redirected back after an OAuth or email-confirmation link.
//   - NOTE: the anon key is public-by-design; Row Level Security (RLS) on
//     the Supabase tables is what actually protects the data.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase environment variables are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
  },
});
