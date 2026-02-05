"use client";

import {
  AUTH_TOKEN,
  CACHE_COLLEGE_BRANCHES,
  CACHE_COLLEGES,
  CACHE_MY_COLLEGES_LIST,
  CACHE_NEWS,
  USER_SESSION,
} from "@/constants/cacheStorageConfig";
import {
  FORGOT_PASSWORD_REQUEST_OTP,
  FORGOT_PASSWORD_RESET,
  FORGOT_PASSWORD_VERIFY_OTP,
  LOGIN,
  SIGNUP_REQUEST_OTP,
  SIGNUP_VERIFY_OTP,
  VERIFY_LOGIN,
} from "@/constants/config";
import { registerForPushNotificationsAsync } from "@/services/notificationService";
import { apiFetch, setLogoutHandler } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  group: string;
  is_subscribed_before: boolean;
  is_subscribed_after: boolean;
};

type AuthContextType = {
  user: User | null;
  userToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerRequestOtp: (
    firstName: string,
    lastName: string,
    email: string,
    group: string,
    password: string
  ) => Promise<void>;
  registerVerifyOtp: (email: string, otp: string) => Promise<void>;
  forgotRequestOtp: (email: string) => Promise<void>;
  forgotVerifyOtp: (email: string, otp: string) => Promise<void>;
  forgotResetPassword: (email: string, newPassword: string) => Promise<void>;
  checkAuth: () => Promise<boolean>; // 👈 added
  getToken: () => Promise<string | null>;
  updateUserSubscription: (type: "before" | "after") => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadTokenAndUser = async () => {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN);
      const userData = await SecureStore.getItemAsync(USER_SESSION);

      if (token) setUserToken(token);
      if (userData) setUser(JSON.parse(userData));

      setLoading(false);
    };
    loadTokenAndUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiFetch(LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      if (data.token && data.user) {
        await SecureStore.setItemAsync(AUTH_TOKEN, data.token);
        await SecureStore.setItemAsync(USER_SESSION, JSON.stringify(data.user)); // 👈 save user
        setUserToken(data.token);
        setUser(data.user);

        // console.log("token", data.token);
        // console.log("user", data.user);

        router.replace("/home");
        registerForPushNotificationsAsync(data.token);
      } else {
        throw new Error("No token or user data received");
      }
    } catch (err: any) {
      throw new Error(err.message || "Login failed");
    }
  };

  const updateUserSubscription = async (type: "before" | "after") => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      is_subscribed_before:
        type === "before" ? true : user.is_subscribed_before,
      is_subscribed_after:
        type === "after" ? true : user.is_subscribed_after,
    };

    setUser(updatedUser);

    await SecureStore.setItemAsync(
      USER_SESSION,
      JSON.stringify(updatedUser)
    );
  };

  const registerRequestOtp = async (
    firstName: string,
    lastName: string,
    email: string,
    group: string,
    password: string
  ) => {
    const res = await apiFetch(SIGNUP_REQUEST_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        group,
        password,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send OTP");
  };

  const registerVerifyOtp = async (email: string, otp: string) => {
    const res = await apiFetch(SIGNUP_VERIFY_OTP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid OTP");

    if (data.token) {
      await SecureStore.setItemAsync(AUTH_TOKEN, data.token);
      await SecureStore.setItemAsync(USER_SESSION, JSON.stringify(data.user)); // 👈 save user
      setUserToken(data.token);
      setUser(data.user);

      // console.log("token", data.token);
      // console.log("user", data.user);

      router.replace("/home");
    } else {
      throw new Error("No token received");
    }
  };

  const forgotRequestOtp = async (email: string) => {
    try {
      const res = await apiFetch(FORGOT_PASSWORD_REQUEST_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Throwing error to be caught below
        throw new Error(data.message || "Failed to send OTP");
      }

      // Success
      // console.log("OTP sent:", data.message);
      return data; // optional, you can return the message or any other data
    } catch (error: any) {
      console.error("Error sending OTP:", error.message);
      throw error; // re-throw to handle in UI
    }
  };

  const forgotVerifyOtp = async (email: string, otp: string) => {
    try {
      const res = await apiFetch(FORGOT_PASSWORD_VERIFY_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      // console.log("OTP verified:", data.message);
      return data; // return success message
    } catch (error: any) {
      console.error("Error verifying OTP:", error.message);
      throw error; // re-throw for UI handling
    }
  };

  const forgotResetPassword = async (email: string, newPassword: string) => {
    try {
      const res = await apiFetch(FORGOT_PASSWORD_RESET, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      // console.log("Password reset successful:", data.message);
      return data; // return success message for UI
    } catch (error: any) {
      console.error("Error resetting password:", error.message);
      throw error; // re-throw for UI to catch
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(AUTH_TOKEN);
    await SecureStore.deleteItemAsync(USER_SESSION);

    await AsyncStorage.removeItem(CACHE_COLLEGES);
    await AsyncStorage.removeItem(CACHE_COLLEGE_BRANCHES);
    await AsyncStorage.removeItem(CACHE_MY_COLLEGES_LIST);
    await AsyncStorage.removeItem(CACHE_NEWS);

    setUserToken(null);
    router.replace("/login-user");
  };

  useEffect(() => {
    setLogoutHandler(logout);
  }, [logout]);

  const checkAuth = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync(AUTH_TOKEN);
      if (!token) {
        setUserToken(null);
        return false;
      }

      // Hit the API to verify the token
      const response = await apiFetch(VERIFY_LOGIN, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();



      if (response.ok && data.valid === true) {
        setUserToken(token);
        setLoading(false);
        return true; // ✅ signed in and valid
      } else {
        // Token is invalid or user logged in from another device
        console.warn("Session invalid, logging out:", data.message || "Unauthorized");
        await logout();
        setLoading(false);
        return false; // ❌ session invalid
      }
    } catch (error) {
      console.error("Error during checkAuth:", error);
      // In case of network error, we might want to stay logged in or logout.
      // Usually, it's safer to logout if we can't verify the session.
      // But for better UX during temporary network issues, we could return the current state.
      // However, the requirement says "if got valid false then... logout".
      // We'll treat errors as invalid session for now to be safe.
      await logout();
      setLoading(false);
      return false;
    }
  };

  const getToken = async (): Promise<string | null> => {
    const token = await SecureStore.getItemAsync(AUTH_TOKEN);
    return token ?? null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        loading,
        login,
        logout,
        registerRequestOtp,
        registerVerifyOtp,
        forgotRequestOtp,
        forgotVerifyOtp,
        forgotResetPassword,
        checkAuth,
        getToken,
        updateUserSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
