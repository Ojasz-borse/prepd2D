import { GET_NEWS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export interface News {
  created_at: string;
  news_desc: string;
  news_heading: string;
  news_url: string;
}

interface CachePayload {
  news: News[];
  lastFetched: number;
}

const CACHE_KEY = "news_cache";
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

export function useNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  // Retry helper with exponential backoff
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

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Load from cache first
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: CachePayload = JSON.parse(cached);
        setNews(parsed.news);

        // Stop if cache is still fresh
        if (Date.now() - parsed.lastFetched < CACHE_TTL) {
          setLoading(false);
          return;
        }
      }

      // 2. Background refresh
      const token = await getToken();
      const res = await fetchWithRetry(
        GET_NEWS,
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

      const data = await res.json();
      if (data.success && Array.isArray(data.news)) {
        setNews(data.news);

        const payload: CachePayload = {
          news: data.news,
          lastFetched: Date.now(),
        };
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
      } else {
        throw new Error("Failed to fetch news");
      }
    } catch (err) {
      console.error("Error loading news:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [getToken, fetchWithRetry]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return { news, loading, error, reload: loadNews };
}
