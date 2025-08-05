import { useEffect, useRef } from "react";
import { useFinanceStore } from "../store/store";
import { syncToGist } from "../utils/sync";

export const useAutoSync = (debounceMs: number = 2000) => {
  const store = useFinanceStore();
  const timeoutRef = useRef<number | undefined>(undefined);
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Skip the initial render to avoid syncing on mount
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    // Only proceed if sync is enabled
    if (!store.isSyncEnable || !store.token) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new debounced sync
    timeoutRef.current = window.setTimeout(async () => {
      try {
        console.log("Auto-syncing data...");
        const result = await syncToGist(store);
        if (result?.success) {
          console.log(`Auto-sync ${result.action} successfully`);
        }
      } catch (error) {
        console.error("Auto-sync failed:", error);
      }
    }, debounceMs);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }); // No dependency array - runs on every render when state changes

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
