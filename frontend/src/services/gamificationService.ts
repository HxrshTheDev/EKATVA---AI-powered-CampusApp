import { supabase } from "../config/supabaseClient";

export const getUserGamification = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("xp, level, streak")
    .eq("id", userId)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const getLeaderboard = async (limit = 6) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, first_name, last_name, role, xp")
    .order("xp", { ascending: false })
    .limit(limit);

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const calculateLevel = (xp: number) => {
  return Math.floor(xp / 1000) + 1;
};

export const updateXP = async (userId: string, points: number) => {
  const current = await getUserGamification(userId);
  if (!current.success) return current;

  const newXp = (current.data?.xp || 0) + points;
  const newLevel = calculateLevel(newXp);

  const { data, error } = await supabase
    .from("users")
    .update({ xp: newXp, level: newLevel })
    .eq("id", userId)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const updateStreak = async (userId: string) => {
  const current = await getUserGamification(userId);
  if (!current.success) return current;

  const newStreak = (current.data?.streak || 0) + 1;

  const { data, error } = await supabase
    .from("users")
    .update({ streak: newStreak })
    .eq("id", userId)
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};
