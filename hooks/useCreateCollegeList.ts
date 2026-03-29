// hooks/useCreateCollegeList.ts

import { GENERATE_OPTION_FORM } from "@/constants/config";
import { useState } from "react";

interface GenerateListParams {
  rank: number;
  percentile: number;
  category: string;
  locations: string[];
  branches: string[];
  token: string | null;
  gender: string;
  home_university_id: number | null;
  tfws_pref: boolean;
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
    gender,
    home_university_id,
    tfws_pref,
  }: GenerateListParams) => {
    try {
      setLoading(true);
      setError(null);

      console.log("payload", {
        rank,
        percentile,
        category,
        locations,
        branches,
        gender,
        home_university_id,
        tfws_pref: tfws_pref ? true : false,
      })

      const response = await fetch(
        GENERATE_OPTION_FORM,
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
            gender,
            home_university_id,
            tfws_pref: tfws_pref ? true : false,
          }),
        }
      );

      const data = await response.json();

      console.log("response", data);
      return data.options || [];
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