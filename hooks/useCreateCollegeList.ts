// hooks/useCreateCollegeList.ts

import { GENERATE_OPTION_FORM } from "@/constants/config";
import { useState } from "react";
import { Alert } from "react-native";

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
  user_id: string | undefined;
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
    user_id,
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
        user_id,
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
            user_id,
          }),
        }
      );

      const data = await response.json();

      console.log("response", data);

      if (data.success === false) {
        setLoading(false);
        setError(data.message || "Failed to generate list");
        return null;
      }

      return data.options || [];
    } catch (err) {
      setLoading(false);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate list";
      setError(errorMessage);
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