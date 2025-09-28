import { GET_COLLEGE_BRANCHES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

interface CollegeBranch {
  branch_name: string;
  choice_code: string;
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  standard_cutoff_data: StandardCutoffData[];
  Open: number | null;
  considered_category_open: string | null;
  OBC: number | null;
  considered_category_obc: string | null;
  TFWS: number | null;
  considered_category_tfws: string | null;
  SC_ST: number | null;
  considered_category_sc_st: string | null;
  VJ_NT: number | null;
  considered_category_vj_nt: string | null;
}

interface StandardCutoffData {
  rank: number;
  category: string;
  percentile: number;
}

interface CachePayload {
  branches: CollegeBranch[];
  lastFetched: number; // timestamp
}

const CACHE_KEY = "college_branches";
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

export function useAdvancedColleges() {
  const [branches, setBranches] = useState<CollegeBranch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const { getToken } = useAuth();

  // Retry helper
  const fetchWithRetry = useCallback(
    async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
      try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
        return res;
      } catch (err) {
        if (retries > 0) {
          await new Promise((r) => setTimeout(r, delay));
          return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        throw err;
      }
    },
    []
  );

  const loadColleges = useCallback(async () => {
    try {
      setBranchesLoading(true);

      // 1. Load cache
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachePayload = JSON.parse(cached);
        setBranches(parsed.branches);

        // If cache is fresh enough, stop here
        if (Date.now() - parsed.lastFetched < CACHE_TTL) {
          setBranchesLoading(false);
          return;
        }
      }

      // 2. Always try background refresh
      const token = await getToken();
      const res = await fetchWithRetry(
        GET_COLLEGE_BRANCHES,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        3,
        1000
      );

      const data = await res.json();
      if (data.success && data.branches) {
        setBranches(data.branches);

        const payload: CachePayload = {
          branches: data.branches,
          lastFetched: Date.now(),
        };
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      } else {
        throw new Error("Failed to fetch colleges");
      }
    } catch (err) {
      console.error("Error loading colleges:", err);
      setBranchesError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBranchesLoading(false);
    }
  }, [getToken, fetchWithRetry]);

  useEffect(() => {
    loadColleges();
  }, [loadColleges]);

  return {
    branches,
    branchesLoading,
    branchesError,
    reload: loadColleges, // manual refresh (pull-to-refresh support)
  };
}
