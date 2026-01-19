import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export type SubscriptionGate = "before" | "after";

interface UseSubscriptionLockOptions {
  gate: SubscriptionGate;   // which subscription to check
  delay?: number;           // default 2s
}

export function useSubscriptionLock({
  gate,
  delay = 2000,
}: UseSubscriptionLockOptions) {
  const { user, loading } = useAuth();
  const [showLock, setShowLock] = useState(false);

  useEffect(() => {
    if (loading || !user) return;

    const hasAccess =
      gate === "before"
        ? user.is_subscribed_before
        : user.is_subscribed_after;

    if (!hasAccess) {
      const timer = setTimeout(() => {
        setShowLock(true);
      }, delay);

      return () => clearTimeout(timer);
    }

    setShowLock(false);
  }, [user, loading, gate, delay]);

  return {
    showLock,
    closeLock: () => setShowLock(false),
    isAllowed:
      gate === "before"
        ? user?.is_subscribed_before ?? false
        : user?.is_subscribed_after ?? false,
  };
}
