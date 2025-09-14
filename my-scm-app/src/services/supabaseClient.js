import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "❌ Missing Supabase environment variables. Check your .env file:\n" +
    "VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY"
  );
}

// ✅ Create a single Supabase client instance
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
