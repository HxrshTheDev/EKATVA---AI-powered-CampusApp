import { useState, useEffect } from "react";
import { getDigitalTwin, getSaarthiInsights } from "../services/saarthiService";
import { useAuth } from "./useAuth";

export const useSaarthi = () => {
  const { user } = useAuth();
  const [digitalTwin, setDigitalTwin] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaarthiData = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      // Fetch concurrently
      const [twinRes, insightsRes] = await Promise.all([
        getDigitalTwin(user.id),
        getSaarthiInsights(user.id),
      ]);

      if (!twinRes.success || !insightsRes.success) {
        setError(twinRes.error || insightsRes.error);
      } else {
        setDigitalTwin(twinRes.data);
        setInsights(insightsRes.data);
      }
      setIsLoading(false);
    };

    fetchSaarthiData();
  }, [user]);

  return { digitalTwin, insights, isLoading, error };
};
