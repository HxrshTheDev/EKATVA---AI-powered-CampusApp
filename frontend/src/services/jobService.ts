import { supabase } from "../config/supabaseClient";

export const getJobs = async () => {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const applyToJob = async (userId: string, jobId: string) => {
  const { data, error } = await supabase
    .from("applications")
    .insert([{ user_id: userId, job_id: jobId, status: "Applied" }])
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const getUserApplications = async (userId: string) => {
  const { data, error } = await supabase
    .from("applications")
    .select(`
      *,
      jobs:job_id (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};
