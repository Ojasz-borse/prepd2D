import { GET_NOTES_CHAPTERS } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

// ✅ Cache keys and TTL (1 day here)
const CACHE_NOTES = "CACHE_CHAPTER_NOTES";
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

// ✅ Types
export interface Chapter {
    id: number;
    chapter_no: number;
    chapter_name: string;
    total_notes?: number;
    weightage: number;
    subject: number;
    class: number;
    notes_url?: string;
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
export function useNotes() {
    const [notes, setNotes] = useState<Chapter[]>([]);
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

    const loadNotes = useCallback(async () => {
        // console.log("called loadNotes");
        try {
            setLoading(true);

            // 1️⃣ Load from cache if available
            const cached = await AsyncStorage.getItem(CACHE_NOTES);
            if (cached) {
                const parsed: CachePayload = JSON.parse(cached);
                setNotes(parsed.chapters);
                // console.log("cached notes", parsed.chapters);

                // If cache still valid, skip API
                if (Date.now() - parsed.lastFetched < CACHE_TTL) {
                    setLoading(false);
                    return;
                }
            }

            // 2️⃣ Background refresh
            const token = await getToken();

            // console.log("token", token);
            // console.log("URL", GET_NOTES_CHAPTERS);
            const res = await fetchWithRetry(
                GET_NOTES_CHAPTERS,
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
            // console.log("Notes API response data:", data);

            if (data.success && Array.isArray(data.chapters)) {
                setNotes(data.chapters);
                // console.log("Notes chapters updated from API", data.chapters);

                // 3️⃣ Cache the new data
                const payload: CachePayload = {
                    chapters: data.chapters,
                    lastFetched: Date.now(),
                };
                await AsyncStorage.setItem(CACHE_NOTES, JSON.stringify(payload));
            } else {
                throw new Error("Invalid API response for Notes");
            }
        } catch (err) {
            console.error("Error loading Notes:", err);
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [getToken, fetchWithRetry]);

    // Auto-load on mount
    useEffect(() => {
        loadNotes();
    }, [loadNotes]);

    return { notes, loading, error, reload: loadNotes };
}
