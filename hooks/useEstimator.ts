import { PREDICT_PERCENTILE, PREDICT_RANK } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function useEstimator() {
  const [percentile, setPercentile] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();

  // ✅ Predict Percentile Function
  const predictPercentile = async (score: number, shift: string) => {
    const token = await getToken();

    try {
      setLoading(true);
      setError(null);

      console.log("PREDICT_PERCENTILE", PREDICT_PERCENTILE);

      const res = await fetch(PREDICT_PERCENTILE, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "", },
        body: JSON.stringify({ score, shift }),
      });

      if (!res.ok) throw new Error("Failed to predict percentile");
      const data = await res.json();

      setPercentile(data.estimatedPercentile);
      return data;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Predict Rank Function
  const predictRank = async (overallPercentile: number, physicsPercentile: number, chemPercentile: number, mathPercentile:number) => {
    const token = await getToken();
    try {
      setLoading(true);
      setError(null);

    const res = await fetch(PREDICT_RANK, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "", },
        body: JSON.stringify({ overallPercentile, mathPercentile, physicsPercentile, chemPercentile }),
    });


      if (!res.ok) throw new Error("Failed to predict rank");
      const data = await res.json();

      setRank(data.predictedMeritNumber);
      return data;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    percentile,
    rank,
    loading,
    error,
    predictPercentile,
    predictRank,
  };
}
