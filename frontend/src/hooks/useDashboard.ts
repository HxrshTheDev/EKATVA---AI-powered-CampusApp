import { useState, useEffect } from "react";
import { getDashboardData } from "../services/dashboardService";
import { useAuth } from "./useAuth";

export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      const res = await getDashboardData(user.id);
      
      if (res.success) {
        setDashboardData(res.data);
        setError(null);
      } else {
        setError(res.error);
        setDashboardData(null);
      }
      setIsLoading(false);
    };

    fetchDashboard();
  }, [user]);

  return { dashboardData, isLoading, error };
};
