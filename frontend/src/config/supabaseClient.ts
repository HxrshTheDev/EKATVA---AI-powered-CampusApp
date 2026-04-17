import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-placeholder-project.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.xxxxx";

if (supabaseUrl === "https://your-placeholder-project.supabase.co") {
  console.error("⚠️ CRITICAL: Missing VITE_SUPABASE_URL in .env file. Supabase is disconnected.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
