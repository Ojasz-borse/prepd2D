// hooks/useCreateCollegeList.ts

import { useState } from "react";

interface GenerateListParams {
  rank: number;
  percentile: number;
  category: string;
  locations: string[];
  branches: string[];
  token: string | null;
}

export function useCreateCollegeList() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateList = async ({
    rank,
    percentile,
    category,
    locations,
    branches,
    token,
  }: GenerateListParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://prep-academy-api.vercel.app/api/my-option-form/generate-option-form",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            rank,
            percentile,
            category,
            locations,
            branches,
          }),
        }
      );

      const data = await response.json();

      console.log(data);
      return data.data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate list");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateList,
    loading,
    error,
  };
}