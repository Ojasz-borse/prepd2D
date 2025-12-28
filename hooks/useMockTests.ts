import { CACHE_MOCK_TESTS, CACHE_TTL } from "@/constants/cacheStorageConfig";
import { GET_MOCK_TESTS, GET_MOCK_TEST_QUESTIONS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

interface MockTest {
  id: number;
  title: string;
  description: string;
  shift_time: string;
  shift_date: string;
  shift_year: number;
}

interface CachePayload {
  tests: MockTest[];
  lastFetched: number;
}

export function useMockTests() {
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  const fetchWithRetry = useCallback(
    async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
      try {
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
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

  const loadMockTests = useCallback(async () => {
    try {
      setLoading(true);

      // ✅ check cache
      const cached = await AsyncStorage.getItem(CACHE_MOCK_TESTS);
      if (cached) {
        const parsed: CachePayload = JSON.parse(cached);
        setTests(parsed.tests);

        if (Date.now() - parsed.lastFetched < CACHE_TTL) {
          setLoading(false);
          return;
        }
      }

      const token = await getToken();

      const res = await fetchWithRetry(
        GET_MOCK_TESTS,
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
      if (!data.success || !data.mock_tests)
        throw new Error("Failed to fetch mock tests");

      setTests(data.mock_tests);

      const payload: CachePayload = {
        tests: data.mock_tests,
        lastFetched: Date.now(),
      };

      await AsyncStorage.setItem(CACHE_MOCK_TESTS, JSON.stringify(payload));
    } catch (err) {
      console.error("Error fetching mock tests:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [getToken, fetchWithRetry]);

  // ✅ **NEW API — No cache, always fresh**
  const fetchMockTestQuestions = useCallback(
    async (testId: string) => {

      // console.log("fetching with",testId);
      try {
        const token = await getToken();

        // console.log("token", token);
        // console.log("API", GET_MOCK_TEST_QUESTIONS)

        const res = await fetchWithRetry(
          GET_MOCK_TEST_QUESTIONS,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({ id: testId }),
          },
          3,
          1000
        );

        // console.log("res", res);

        const data = await res.json();
        if (!data.success || !data.questions)
          throw new Error("Failed to fetch test questions");

        return data.questions; // ✅ return fresh results
      } catch (err) {
        console.error("Error fetching test questions:", err);
        throw err;
      }
    },
    [getToken, fetchWithRetry]
  );

  useEffect(() => {
    loadMockTests();
  }, [loadMockTests]);

  return {
    tests,
    loading,
    error,
    reload: loadMockTests,

    // ✅ exposed without caching
    fetchMockTestQuestions,
  };
}
