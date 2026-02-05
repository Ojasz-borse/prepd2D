// ---------------- New Interface ----------------
export interface College {
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  status?: string; // optional for now
}
// ------------------------------------------------

import { CACHE_COLLEGE_BRANCHES, CACHE_TTL } from "@/constants/cacheStorageConfig";
import { GET_COLLEGE_BRANCHES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { fetchWithRetry } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

interface CollegeBranch {
  branch_name: string;
  choice_code: string;
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  status: string;
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
  lastFetched: number;
}

export function useAdvancedColleges() {
  const [branches, setBranches] = useState<CollegeBranch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState<string | null>(null);

  const [collegesLoading, setCollegesLoading] = useState(true);
  const { getToken } = useAuth();


  const loadColleges = useCallback(async () => {
    try {
      setBranchesLoading(true);
      setCollegesLoading(true)

      // 1. Load cache
      const cached = await AsyncStorage.getItem(CACHE_COLLEGE_BRANCHES);
      if (cached) {
        const parsed: CachePayload = JSON.parse(cached);
        setBranches(parsed.branches);

        if (Date.now() - parsed.lastFetched < CACHE_TTL) {
          setBranchesLoading(false);
          return;
        }
      }

      // 2. Background refresh
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
        await AsyncStorage.setItem(CACHE_COLLEGE_BRANCHES, JSON.stringify(payload));
      } else {
        throw new Error("Failed to fetch colleges");
      }
    } catch (err) {
      console.error("Error loading colleges:", err);
      setBranchesError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setBranchesLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadColleges();
  }, [loadColleges]);

  // ---------------- Extract Unique Colleges ----------------
  const colleges: College[] = useMemo(() => {
    setCollegesLoading(true);

    const map = new Map<string, College>();

    for (const b of branches) {
      if (!map.has(b.college_code)) {
        map.set(b.college_code, {
          college_code: b.college_code,
          district: b.district,
          is_autonomous: b.is_autonomous,
          is_government: b.is_government,
          name: b.name,
          status: b.status, // optional, empty for now
        });
      }
    }

    setCollegesLoading(false);
    return Array.from(map.values());
  }, [branches]);

  // ----------------------------------------------------------

  return {
    branches,
    branchesLoading,
    branchesError,

    colleges,          // unique colleges
    collegesLoading,   // only loads while extracting colleges

    reload: loadColleges,
  };
}
