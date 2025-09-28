import { GET_COLLEGES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export interface College {
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  status: string;
}

interface CachePayload {
  colleges: College[];
  lastFetched: number; // timestamp
}

const CACHE_KEY = "colleges";
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

export function useNormalColleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setLoading(true);

      // 1. Load cache
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachePayload = JSON.parse(cached);
        setColleges(parsed.colleges);

        // If cache is fresh, stop here
        if (Date.now() - parsed.lastFetched < CACHE_TTL) {
          setLoading(false);
          return;
        }
      }

      // 2. Background refresh
      const token = await getToken();
      const res = await fetchWithRetry(
        GET_COLLEGES,
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
      if (data.success && data.colleges) {
        setColleges(data.colleges);

        const payload: CachePayload = {
          colleges: data.colleges,
          lastFetched: Date.now(),
        };
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      } else {
        throw new Error("Failed to fetch colleges");
      }
    } catch (err) {
      console.error("Error loading colleges:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [getToken, fetchWithRetry]);

  useEffect(() => {
    loadColleges();
  }, [loadColleges]);

  return { colleges, loading, error, reload: loadColleges };
}
