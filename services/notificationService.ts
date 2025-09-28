import { SAVE_PUSH_TOKEN } from "@/constants/config";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync(authToken: string | null) {
  if (!authToken) {
    console.error("Authentication token is missing, cannot save push token.");
    return;
  }

  // Android channel setup
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  // Permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.warn("Push notification permission not granted.");
    return;
  }

  try {
    // Get Expo project ID (works in dev + build)
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      throw new Error("Expo Project ID not found. Add it in app.json under extra.eas.projectId");
    }

    

    // Get Expo Push Token
    const expoPushToken = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    console.log("Got Expo Push Token:", expoPushToken);


    console.log("📱 Expo Project ID:", Constants?.expoConfig?.extra?.eas?.projectId);
console.log("📲 Got Expo Push Token:", expoPushToken);

console.log("auth token", authToken);

    // Send token to backend
    const response = await fetch(SAVE_PUSH_TOKEN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ token: expoPushToken }),
    });

    console.log("response", response);

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to save push token");
    }

    console.log("Token saved successfully:", result.message);
    return expoPushToken;
  } catch (error) {
    console.error("Error in registerForPushNotificationsAsync:", error);
  }
}
