
import { LOG_USER_ACTION } from "../constants/config";
import { UserFeature } from "../constants/userActions";
import * as SecureStore from "expo-secure-store";
import { AUTH_TOKEN } from "@/constants/cacheStorageConfig";


type LogoutHandler = () => void;
let logoutHandler: LogoutHandler | null = null;

/**
 * Register a function to be called when a 401 Unauthorized response is received.
 */
export const setLogoutHandler = (handler: LogoutHandler) => {
    logoutHandler = handler;
};

/**
 * Enhanced fetch with an interceptor for 401 Unauthorized errors.
 */
export const apiFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    try {
        const response = await fetch(url, options);

        if (response.status === 401) {
            console.warn("401 Unauthorized detected. Triggering auto-logout...");
            if (logoutHandler) {
                logoutHandler();
            }
        }

        return response;
    } catch (error) {
        throw error;
    }
};

/**
 * Reusable fetch with retry logic, using the interceptor.
 */
export const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    retries = 3,
    delay = 1000
): Promise<Response> => {
    try {
        const res = await apiFetch(url, options);

        // If it's a 401, we don't retry as it's an auth issue
        if (res.status === 401) {
            return res;
        }

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res;
    } catch (err) {
        if (retries > 0) {
            // console.log(`Retrying API call: ${url}. Retries left: ${retries}`);
            await new Promise((r) => setTimeout(r, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        throw err;
    }
};

/**
 * Logs a user action to the server.
 */
export const logUserAction = async (userId: string | number | undefined, feature: UserFeature) => {
    if (!userId) return;
    
    try {
        const token = await SecureStore.getItemAsync(AUTH_TOKEN);
        
        await fetch(LOG_USER_ACTION, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
                user_id: userId,
                feature_visited: feature,
            }),
        });
    } catch (error) {

        console.error("Failed to log user action:", error);
    }
};

