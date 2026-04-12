import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export function useTrialUsage(storageKey: string, limit: number = 3) {
  const [usageCount, setUsageCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsage();
  }, [storageKey]);

  const loadUsage = async () => {
    try {
      const storedCount = await SecureStore.getItemAsync(storageKey);
      if (storedCount !== null) {
        setUsageCount(parseInt(storedCount, 10));
      } else {
        setUsageCount(0);
      }
    } catch (error) {
      console.error('Error loading usage count:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementUsage = async () => {
    try {
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      await SecureStore.setItemAsync(storageKey, newCount.toString());
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  };

  const hasRemainingTrials = usageCount < limit;

  return {
    usageCount,
    incrementUsage,
    hasRemainingTrials,
    loadingUsage: loading,
    resetUsage: async () => {
        setUsageCount(0);
        await SecureStore.deleteItemAsync(storageKey);
    }
  };
}
