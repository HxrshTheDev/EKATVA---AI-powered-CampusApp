import { useState, useEffect } from "react";
import { supabase } from "../config/supabaseClient";
import { getCurrentUser } from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const fetchUser = async () => {
      setIsLoading(true);
      const res = await getCurrentUser();
      
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    fetchUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          // Re-fetch custom profile data alongside session
          fetchUser();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { 
    user, 
    isAuthenticated: !!user, 
    isLoading,
    profile: user?.profile || null 
  };
};
