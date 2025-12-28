import * as Notifications from "expo-notifications";
import { useEffect } from "react";

// 🔔 Global notification handler (required for foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, // ✅ iOS 15+
    shouldShowList: true,   // ✅ iOS 15+
  }),
});

/**
 * Hook to listen for push notifications (foreground + tap)
 */
export function useNotificationListener() {
  useEffect(() => {
    // When a notification is received in foreground
    const notificationListener =
      Notifications.addNotificationReceivedListener(notification => {
        // console.log("📩 Notification Received:", notification);
      });

    // When user taps a notification
    const responseListener =
      Notifications.addNotificationResponseReceivedListener(response => {
        // console.log("👆 Notification tapped:", response);
      });

    // ✅ cleanup on unmount
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
}
