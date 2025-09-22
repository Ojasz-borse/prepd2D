import { GET_COLLEGE_BRANCHES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

interface CollegeBranch {
  branch_name: string;
  choice_code: string;
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  standard_cutoff_data: StandardCutoffData[];
}

interface StandardCutoffData {
  rank: number;
  category: string;
  percentile: number;
}


export function useAdvancedColleges() {
  const [branches, setBranches] = useState<CollegeBranch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const loadColleges = async () => {
      try {
        setBranchesLoading(true);

        // 1. Check cache first
        const cached = await AsyncStorage.getItem("college_branches");
        if (cached) {
          setBranches(JSON.parse(cached));
         
          setBranchesLoading(false);
          return; // ✅ stop here, no extra API calls
        }

        // 2. If no cache, fetch from API once
        const token = await getToken();
        const res = await fetch(GET_COLLEGE_BRANCHES, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (data.success && data.branches) {
         
          setBranches(data.branches);
          await AsyncStorage.setItem("college_branches", JSON.stringify(data.branches));
        } else {
          throw new Error("Failed to fetch colleges");
        }
      } catch (err) {
        console.error("Error loading colleges:", err);
        setBranchesError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setBranchesLoading(false);
      }
    };

    loadColleges();
  }, []);

  return { branches, branchesLoading, branchesError};
}
