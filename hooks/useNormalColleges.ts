import { GET_COLLEGES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export interface College {
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  status: string;
}

export function useNormalColleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const loadColleges = async () => {
      try {
        setLoading(true);

        // 1. Check cache first
        const cached = await AsyncStorage.getItem("colleges");
        if (cached) {
          setColleges(JSON.parse(cached));
          setLoading(false);
          return; // ✅ stop here, no extra API calls
        }

        // 2. If no cache, fetch from API once
        const token = await getToken();
        const res = await fetch(GET_COLLEGES, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        if (data.success && data.colleges) {
          setColleges(data.colleges);
          await AsyncStorage.setItem("colleges", JSON.stringify(data.colleges));
        } else {
          throw new Error("Failed to fetch colleges");
        }
      } catch (err) {
        console.error("Error loading colleges:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadColleges();
  }, []);

  return { colleges, loading, error };
}
