import { useAuth } from "@/context/AuthContext";
import { fetchWithRetry } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

// ✅ Cache keys and TTL (5 hours here)
const CACHE_PYQS = "CACHE_CHAPTER_PYQS";
const CACHE_TTL = 1000 * 60 * 60 * 24; // 5 hours

// ✅ Types
export interface Chapter {
  id: number;
  chapter_no: number;
  chapter_name: string;
  total_pyqs: number;
  weightage: number;
  subject: number;
  class: number;
  notes_url: string;
}

interface CachePayload {
  chapters: Chapter[];
  lastFetched: number; // timestamp
}

interface ApiResponse {
  success: boolean;
  chapters: Chapter[];
}

// ✅ Hook
export function usePYQS() {
  const [pyqs, setPyqs] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();


  const loadPYQS = useCallback(async () => {
    // console.log("called loadPYQs");
    try {
      setLoading(true);

      // 1️⃣ Load from cache if available
      const cached = await AsyncStorage.getItem(CACHE_PYQS);
      if (cached) {
        const parsed: CachePayload = JSON.parse(cached);
        setPyqs(parsed.chapters);
        // console.log("cached", parsed.chapters);

        // If cache still valid, skip API
        if (Date.now() - parsed.lastFetched < CACHE_TTL) {
          setLoading(false);
          return;
        }
      }

      // 2️⃣ Background refresh
      const token = await getToken();

      // console.log("token", token);
      // console.log("URL", GET_PYQ_CHAPTERS);
      const res = await fetchWithRetry(
        GET_PYQ_CHAPTERS,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
        3,
        1000
      );

      const data: ApiResponse = await res.json();
      // console.log("data", data);
      if (data.success && Array.isArray(data.chapters)) {
        setPyqs(data.chapters);
        // console.log("res", data.chapters);

        // 3️⃣ Cache the new data
        const payload: CachePayload = {
          chapters: data.chapters,
          lastFetched: Date.now(),
        };
        await AsyncStorage.setItem(CACHE_PYQS, JSON.stringify(payload));
      } else {
        throw new Error("Invalid API response");
      }
    } catch (err) {
      console.error("Error loading PYQs:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Auto-load on mount
  useEffect(() => {
    loadPYQS();
  }, [loadPYQS]);

  return { pyqs, loading, error, reload: loadPYQS };
}