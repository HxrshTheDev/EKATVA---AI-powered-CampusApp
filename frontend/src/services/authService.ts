import { supabase } from "../config/supabaseClient";

export const signUpUser = async (email, password, metadata) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata, // Maps to raw_user_meta_data in trigger
    },
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true, data: null };
};

export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return { success: false, error: error?.message || "No session" };

  // Fetch detailed profile from public.users table
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (profileError) {
    console.warn("Profile fetch failed, using auth fallback:", profileError.message);
    return { success: true, data: { ...session.user, profile: null } };
  }

  return { success: true, data: { ...session.user, profile } };
};
