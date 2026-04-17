import { supabase } from "../config/supabaseClient";
import { getSaarthiInsights } from "./saarthiService";

const API_BASE_URL = "http://localhost:5000/api";

export const getDashboardData = async (userId: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Parallelize queries
    const [profileRes, saarthiRes, insightsRes, backendRes] = await Promise.all([
      supabase.from("users").select("*").eq("id", userId).single(),
      supabase.from("missions").select("*").eq("user_id", userId),
      getSaarthiInsights(userId),
      // Call our enhanced backend for holistic metrics
      fetch(`${API_BASE_URL}/dashboard/digital-twin`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      }).then(res => res.json()).catch(() => null)
    ]);

    if (profileRes.error) throw new Error(profileRes.error.message);

    return {
      success: true,
      data: {
        profile: profileRes.data,
        missions: saarthiRes.data || [],
        insights: insightsRes.success ? insightsRes.data : null,
        holistic: backendRes?.success ? backendRes.data : { holisticScore: 75, achievements: [], participation: [] },
      },
      error: null
    };
  } catch (error: any) {
    return { success: false, data: null, error: error.message };
  }
};
