const { createClient } = require("@supabase/supabase-js");
const config = require("./index");

if (!config.supabase.url || !config.supabase.anonKey) {
  console.warn("⚠️ Supabase credentials missing. Supabase client not initialized.");
}

const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
);

module.exports = supabase;
