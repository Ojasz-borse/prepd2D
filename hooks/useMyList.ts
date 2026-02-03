// src/hooks/useMyList.ts
import { CACHE_MY_COLLEGES_LIST, CACHE_TTL } from "@/constants/cacheStorageConfig";
import { MY_LIST_API_URL } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, fetchWithRetry } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";



export function useMyList() {
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { getToken } = useAuth();


  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const cached = await AsyncStorage.getItem(CACHE_MY_COLLEGES_LIST);
      if (cached) {
        const parsed = JSON.parse(cached);
        setCodes(parsed.data);
        if (Date.now() - parsed.lastFetched < CACHE_TTL) {
          setLoading(false);
          return;
        }
      }

      const token = await getToken();
      const res = await fetchWithRetry(MY_LIST_API_URL, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setCodes(data.data);
        await AsyncStorage.setItem(
          CACHE_MY_COLLEGES_LIST,
          JSON.stringify({ data: data.data, lastFetched: Date.now() })
        );
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error loading my list:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const saveList = useCallback(
    async (newCodes: string[]) => {
      try {
        setSaving(true);
        const token = await getToken();

        await AsyncStorage.setItem(
          CACHE_MY_COLLEGES_LIST,
          JSON.stringify({ data: newCodes, lastFetched: Date.now() })
        );
        setCodes(newCodes);

        if (token) {
          await apiFetch(MY_LIST_API_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ option_form: newCodes }),
          });
        }
      } catch (err) {
        console.error("Error saving my list:", err);
      } finally {
        setSaving(false);
      }
    },
    [getToken]
  );

  const clearList = useCallback(async () => {
    await AsyncStorage.removeItem(CACHE_MY_COLLEGES_LIST);
    await saveList([]);
    setCodes([]);
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  return { codes, loading, saving, error, reload: loadList, saveList, clearList };
}
