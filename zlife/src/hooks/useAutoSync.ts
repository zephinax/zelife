import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useFinanceStore } from "../store/store";
import { syncToGist, loadFromGist } from "../utils/sync";

export interface AutoSyncState {
  isLoading: boolean;
  lastSyncAt: Date | null;
  error: string | null;
  lastAction:
    | "created"
    | "updated"
    | "merged"
    | "overwritten"
    | "no_changes"
    | null;
}

export const useAutoSync = (
  debounceMs: number = 2000,
  pollIntervalMs: number = 15 * 60 * 1000
) => {
  const store = useFinanceStore();
  const { isSyncEnable, token, gistId, filename } = store;

  // Memoize the data to prevent unnecessary re-renders
  const data = useMemo(() => {
    if (!isSyncEnable) return null;
    return store.exportData();
  }, [store.exportData, isSyncEnable]);

  const timeoutRef = useRef<number | undefined>(undefined);
  const isInitialRender = useRef(true);
  const lastDataRef = useRef<string>("");

  const [syncState, setSyncState] = useState<AutoSyncState>(() => {
    const savedLastSync = localStorage.getItem("lastSyncAt");
    return {
      isLoading: false,
      lastSyncAt: savedLastSync ? new Date(savedLastSync) : null,
      error: null,
      lastAction: null,
    };
  });

  useEffect(() => {
    if (syncState.lastSyncAt) {
      localStorage.setItem("lastSyncAt", syncState.lastSyncAt.toISOString());
    }
  }, [syncState.lastSyncAt]);

  // Clear any error when sync is disabled
  useEffect(() => {
    if (!isSyncEnable) {
      setSyncState((prev) => ({ ...prev, error: null }));
    }
  }, [isSyncEnable]);

  // Manual sync function that can be called externally
  const triggerSync = useCallback(async () => {
    if (!isSyncEnable || !token || !filename) {
      return;
    }

    setSyncState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log("Manual sync triggered...");
      const result = await syncToGist(store);

      if (result?.success) {
        console.log(`Sync ${result.action} successfully`);
        const validAction:
          | "created"
          | "updated"
          | "merged"
          | "overwritten"
          | "no_changes"
          | null =
          result.action === "created" || result.action === "updated"
            ? result.action
            : null;

        setSyncState((prev) => ({
          ...prev,
          isLoading: false,
          lastSyncAt: new Date(),
          error: null,
          lastAction: validAction,
        }));

        // Update the last data reference
        if (data) {
          lastDataRef.current = JSON.stringify(data);
        }

        return result;
      } else {
        throw new Error("Sync failed");
      }
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Sync failed",
      }));
      throw error;
    }
  }, [isSyncEnable, token, filename, gistId, data]);

  // Auto-sync effect - monitors data changes
  useEffect(() => {
    // Skip if sync is disabled
    if (!isSyncEnable || !data) {
      return;
    }

    // Skip the initial render to avoid syncing on mount
    if (isInitialRender.current) {
      isInitialRender.current = false;
      lastDataRef.current = JSON.stringify(data);
      return;
    }

    // Skip if missing credentials
    if (!token || !filename) {
      return;
    }

    // Check if data actually changed
    const currentDataString = JSON.stringify(data);
    if (currentDataString === lastDataRef.current) {
      return; // No changes, skip sync
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear any previous errors since we're about to try again
    setSyncState((prev) => ({ ...prev, error: null }));

    // Set new debounced sync
    timeoutRef.current = window.setTimeout(async () => {
      setSyncState((prev) => ({ ...prev, isLoading: true }));

      try {
        console.log("Auto-syncing data...");
        const result = await syncToGist(store);

        if (result?.success) {
          console.log(`Auto-sync ${result.action} successfully`);
          const validAction:
            | "created"
            | "updated"
            | "merged"
            | "overwritten"
            | "no_changes"
            | null =
            result.action === "created" || result.action === "updated"
              ? result.action
              : null;

          setSyncState((prev) => ({
            ...prev,
            isLoading: false,
            lastSyncAt: new Date(),
            error: null,
            lastAction: validAction,
          }));

          // Update the last synced data reference
          lastDataRef.current = currentDataString;
        }
      } catch (error) {
        console.error("Auto-sync failed:", error);
        setSyncState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Auto-sync failed",
        }));
      }
    }, debounceMs);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, isSyncEnable, token, filename, debounceMs]);

  // Periodic pull effect
  useEffect(() => {
    if (!isSyncEnable || !token || !gistId || !filename) {
      return;
    }

    const intervalId = setInterval(async () => {
      setSyncState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        console.log("Polling remote data...");
        const result = await loadFromGist(store, { merge: true });
        if (result.success) {
          console.log(`Poll ${result.action} successfully`);
          setSyncState((prev) => ({
            ...prev,
            isLoading: false,
            lastSyncAt: new Date(),
            error: null,
            lastAction:
              result.action === "merged" ||
              result.action === "overwritten" ||
              result.action === "no_changes"
                ? result.action
                : prev.lastAction,
          }));
        } else {
          throw new Error(result.reason || "Poll failed");
        }
      } catch (error) {
        console.error("Poll failed:", error);
        setSyncState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Poll failed",
        }));
      }
    }, pollIntervalMs);

    return () => clearInterval(intervalId);
  }, [isSyncEnable, token, gistId, filename, pollIntervalMs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...syncState,
    triggerSync, // Manual sync function
  };
};
