// Modified sync.ts with inline cleanup - no changes to actions needed

import {
  CURRENT_DATA_VERSION,
  type FinanceActions,
  type FinanceState,
  type YearData,
} from "../store/types";
import {
  fetchGistContent,
  updateGistContent,
  createNewGist,
} from "./gistController";

const DELETED_ITEM_RETENTION_DAYS = 30; // Keep deleted items for 30 days

function cleanupOldDeletedItems(data: { [year: string]: YearData }): {
  [year: string]: YearData;
} {
  const cutoffTime =
    Date.now() - DELETED_ITEM_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const cleanedData = { ...data };
  let cleanupCount = 0;

  // Iterate through all years/months/days
  for (const year in cleanedData) {
    for (const month in cleanedData[year]) {
      for (const day in cleanedData[year][month]) {
        const dayData = cleanedData[year][month][day];

        // Clean up old deleted transactions
        dayData.transactions = dayData.transactions.filter((tx) => {
          if (tx.deletedAt && tx.deletedAt < cutoffTime) {
            cleanupCount++;
            return false; // Remove this old deleted item
          }
          return true; // Keep this item
        });

        // Clean up old deleted tasks
        dayData.tasks = dayData.tasks.filter((task) => {
          if (task.deletedAt && task.deletedAt < cutoffTime) {
            cleanupCount++;
            return false; // Remove this old deleted task
          }
          return true; // Keep this task
        });
      }
    }
  }

  if (cleanupCount > 0) {
    console.log(`Cleaned up ${cleanupCount} old deleted items before sync`);
  }

  return cleanedData;
}

function mergeData(
  localData: { [year: string]: YearData },
  remoteData: { [year: string]: YearData }
): { [year: string]: YearData } {
  const mergedData: { [year: string]: YearData } = {};

  const mergeItems = <
    T extends { id: string; updatedAt: number; deletedAt?: number }
  >(
    localItems: T[],
    remoteItems: T[]
  ): T[] => {
    const itemMap = new Map<string, T>();

    // Add all local items (including deleted ones for merge comparison)
    for (const item of localItems) {
      itemMap.set(item.id, { ...item });
    }

    // Process remote items
    for (const remoteItem of remoteItems) {
      const localItem = itemMap.get(remoteItem.id);

      if (localItem) {
        // Both items exist - compare timestamps to decide which version wins
        const remoteIsDeleted = remoteItem.deletedAt != null;
        const localIsDeleted = localItem.deletedAt != null;

        if (remoteIsDeleted && localIsDeleted) {
          // Both deleted - keep the one with latest deletion timestamp
          if (remoteItem.deletedAt! >= localItem.deletedAt!) {
            itemMap.set(remoteItem.id, { ...remoteItem });
          }
        } else if (remoteIsDeleted && !localIsDeleted) {
          // Remote deleted, local not - remote deletion wins if it's newer than local update
          if (remoteItem.deletedAt! >= localItem.updatedAt) {
            itemMap.set(remoteItem.id, { ...remoteItem });
          }
        } else if (!remoteIsDeleted && localIsDeleted) {
          // Local deleted, remote not - local deletion wins if it's newer than remote update
          if (localItem.deletedAt! >= remoteItem.updatedAt) {
            // Keep local (already in map)
          } else {
            // Remote update is newer than local deletion - restore item
            itemMap.set(remoteItem.id, { ...remoteItem });
          }
        } else {
          // Neither deleted - normal timestamp comparison
          if (remoteItem.updatedAt >= localItem.updatedAt) {
            itemMap.set(remoteItem.id, { ...remoteItem });
          }
        }
      } else {
        // Item doesn't exist locally - add it (even if deleted, for sync purposes)
        itemMap.set(remoteItem.id, { ...remoteItem });
      }
    }

    // Return ALL items including deleted ones (filtering happens in UI)
    return Array.from(itemMap.values());
  };

  const years = new Set([
    ...Object.keys(localData),
    ...Object.keys(remoteData),
  ]);

  for (const year of years) {
    mergedData[year] = {};
    const localYear = localData[year] || {};
    const remoteYear = remoteData[year] || {};

    const months = new Set([
      ...Object.keys(localYear),
      ...Object.keys(remoteYear),
    ]);

    for (const month of months) {
      mergedData[year][month] = {};
      const localMonth = localYear[month] || {};
      const remoteMonth = remoteYear[month] || {};

      const days = new Set([
        ...Object.keys(localMonth),
        ...Object.keys(remoteMonth),
      ]);

      for (const day of days) {
        const localDay = localMonth[day] || { transactions: [], tasks: [] };
        const remoteDay = remoteMonth[day] || { transactions: [], tasks: [] };

        mergedData[year][month][day] = {
          transactions: mergeItems(
            localDay.transactions,
            remoteDay.transactions
          ),
          tasks: mergeItems(localDay.tasks, remoteDay.tasks),
        };
      }
    }
  }

  return mergedData;
}

export async function syncToGist(store: FinanceState & FinanceActions) {
  if (!store.isSyncEnable || !store.token) {
    console.log("Sync disabled or no token");
    return { success: false, reason: "not_enabled" };
  }

  try {
    // Get current data and clean up old deleted items
    const backup = store.exportData();
    const cleanedData = cleanupOldDeletedItems(backup.state.data);

    // Create backup with cleaned data
    const cleanedBackup = {
      ...backup,
      state: {
        ...backup.state,
        data: cleanedData,
      },
    };

    const content = JSON.stringify(cleanedBackup, null, 2);

    if (store.gistId) {
      await updateGistContent(
        {
          token: store.token,
          gistId: store.gistId,
          filename: store.filename,
        },
        content
      );
      console.log("Data synced to existing gist");
      return { success: true, action: "updated" };
    } else {
      const { id, url } = await createNewGist(
        store.token,
        store.filename,
        content,
        false
      );
      store.setGistId(id);
      console.log("Created new gist:", url);
      return { success: true, action: "created", gistId: id, url };
    }
  } catch (error) {
    console.error("Sync failed:", error);
    return { success: false, error };
  }
}

export async function loadFromGist(
  store: FinanceState & FinanceActions,
  options: { merge?: boolean } = { merge: false }
) {
  if (!store.isSyncEnable || !store.token || !store.gistId) {
    console.log("Sync disabled or missing credentials");
    return { success: false, reason: "not_enabled" };
  }

  try {
    const content = await fetchGistContent({
      token: store.token,
      gistId: store.gistId,
      filename: store.filename,
    });

    if (!content) return { success: false, reason: "no_content" };

    const remoteBackup = JSON.parse(content);
    const localBackup = store.exportData();

    if (!remoteBackup.version) {
      console.warn("Backup has no version, assuming Version 0");
      remoteBackup.version = 0;
    }

    if (options.merge) {
      const hasDifferences =
        JSON.stringify(localBackup.state.data) !==
        JSON.stringify(remoteBackup.state.data);

      if (hasDifferences) {
        const mergedData = mergeData(
          localBackup.state.data,
          remoteBackup.state.data
        );

        store.importData({
          ...remoteBackup,
          state: {
            ...remoteBackup.state,
            data: mergedData,
            token: store.token,
            gistId: store.gistId,
            isSyncEnable: store.isSyncEnable,
          },
          version: CURRENT_DATA_VERSION,
        });

        return { success: true, action: "merged" };
      } else {
        return { success: true, action: "no_changes" };
      }
    } else {
      store.importData({
        ...remoteBackup,
        state: {
          ...remoteBackup.state,
          token: store.token,
          gistId: store.gistId,
          isSyncEnable: store.isSyncEnable,
        },
        version: CURRENT_DATA_VERSION,
      });
      return { success: true, action: "overwritten" };
    }
  } catch (error) {
    console.error("Load from gist failed:", error);
    return { success: false, error };
  }
}
