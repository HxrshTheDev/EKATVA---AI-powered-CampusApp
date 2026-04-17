import { supabase } from "../config/supabaseClient";

export const getClubs = async () => {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, data: [] };
  return { success: true, data };
};

export const getUserClubs = async (userId: string) => {
  const { data, error } = await supabase
    .from("club_members")
    .select("club_id")
    .eq("user_id", userId);

  if (error) return { success: false, data: [] };
  return { success: true, data: data.map(d => d.club_id) };
};

export const joinClub = async (userId: string, clubId: string) => {
  const { data, error } = await supabase
    .from("club_members")
    .insert([{ user_id: userId, club_id: clubId }])
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};
