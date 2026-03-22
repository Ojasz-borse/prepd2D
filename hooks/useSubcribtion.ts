import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export type SubscriptionGate = "before" | "after";

export interface UseSubscriptionLockOptions {
  gate: SubscriptionGate; // which subscription to check
  delay?: number; // default 2000ms
  condition?: boolean; // only trigger lock if this is true
}

export function useSubscriptionLock({
  gate,
  delay = 2000,
  condition = true,
}: UseSubscriptionLockOptions) {
  const { user, loading } = useAuth();
  const [showLock, setShowLock] = useState(false);

  useEffect(() => {
    if (loading || !user || !condition) {
      setShowLock(false);
      return;
    }

    const hasAccess =
      gate === "before" ? user.is_subscribed_before : user.is_subscribed_after;

    if (!hasAccess) {
      const timer = setTimeout(() => {
        setShowLock(true);
      }, delay);

      return () => clearTimeout(timer);
    }

    setShowLock(false);
  }, [user, loading, gate, delay, condition]);

  return {
    showLock,
    closeLock: () => setShowLock(false),
    isAllowed:
      gate === "before"
        ? user?.is_subscribed_before ?? false
        : user?.is_subscribed_after ?? false,
  };
}
