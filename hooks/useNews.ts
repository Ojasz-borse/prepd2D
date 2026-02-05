import { CACHE_NEWS, CACHE_TTL } from "@/constants/cacheStorageConfig";
import { GET_NEWS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { fetchWithRetry } from "@/services/api";
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



export function useNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();


  const loadNews = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Load from cache first
      const cached = await AsyncStorage.getItem(CACHE_NEWS);
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
        await AsyncStorage.setItem(CACHE_NEWS, JSON.stringify(payload));
      } else {
        throw new Error("Failed to fetch news");
      }
    } catch (err) {
      console.error("Error loading news:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return { news, loading, error, reload: loadNews };
}
