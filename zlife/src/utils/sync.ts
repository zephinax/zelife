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

function mergeData(
  localData: { [year: string]: YearData },
  remoteData: { [year: string]: YearData }
): { [year: string]: YearData } {
  const mergedData: { [year: string]: YearData } = {};

  // Helper to merge transactions or tasks
  const mergeItems = <
    T extends { id: string; updatedAt: number; deletedAt?: number }
  >(
    localItems: T[],
    remoteItems: T[]
  ): T[] => {
    const itemMap = new Map<string, T>();

    // Process local items
    for (const item of localItems) {
      itemMap.set(item.id, { ...item });
    }

    // Process remote items
    for (const remoteItem of remoteItems) {
      const localItem = itemMap.get(remoteItem.id);
      if (localItem) {
        // Item exists in both
        if (
          remoteItem.deletedAt &&
          (!localItem.deletedAt || remoteItem.deletedAt > localItem.deletedAt)
        ) {
          // Remote deletion is newer
          itemMap.set(remoteItem.id, { ...remoteItem });
        } else if (
          localItem.deletedAt &&
          (!remoteItem.deletedAt || localItem.deletedAt > remoteItem.deletedAt)
        ) {
          // Local deletion is newer
          itemMap.set(remoteItem.id, { ...localItem });
        } else if (remoteItem.updatedAt > localItem.updatedAt) {
          // Remote item is newer
          itemMap.set(remoteItem.id, { ...remoteItem });
        } else {
          // Local item is newer or equal
          itemMap.set(remoteItem.id, { ...localItem });
        }
      } else if (!remoteItem.deletedAt) {
        // Item only in remote and not deleted
        itemMap.set(remoteItem.id, { ...remoteItem });
      }
    }

    // Filter out deleted items
    return Array.from(itemMap.values()).filter((item) => !item.deletedAt);
  };

  // Get all years from both datasets
  const years = new Set([
    ...Object.keys(localData),
    ...Object.keys(remoteData),
  ]);

  for (const year of years) {
    mergedData[year] = {};
    const localYear = localData[year] || {};
    const remoteYear = remoteData[year] || {};

    // Get all months
    const months = new Set([
      ...Object.keys(localYear),
      ...Object.keys(remoteYear),
    ]);

    for (const month of months) {
      mergedData[year][month] = {};
      const localMonth = localYear[month] || {};
      const remoteMonth = remoteYear[month] || {};

      // Get all days
      const days = new Set([
        ...Object.keys(localMonth),
        ...Object.keys(remoteMonth),
      ]);

      for (const day of days) {
        const localDay = localMonth[day] || { transactions: [], tasks: [] };
        const remoteDay = remoteMonth[day] || { transactions: [], tasks: [] };

        // Merge transactions and tasks
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
    const backup = store.exportData();
    const content = JSON.stringify(backup, null, 2);

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

    // Validate backup version
    if (!remoteBackup.version) {
      console.warn("Backup has no version, assuming Version 0");
      remoteBackup.version = 0;
    }

    if (options.merge) {
      // Check for differences (only compare data, as other fields are preserved)
      const hasDifferences =
        JSON.stringify(localBackup.state.data) !==
        JSON.stringify(remoteBackup.state.data);

      if (hasDifferences) {
        const userChoice = window.confirm(
          "The remote data differs from your local data.\n" +
            'Click "OK" to MERGE the data (combining both with conflict resolution).\n' +
            'Click "Cancel" to REPLACE your local data with the remote data.'
        );

        if (userChoice) {
          // Merge
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
            version: CURRENT_DATA_VERSION, // Ensure merged data is current version
          });
          return { success: true, action: "merged" };
        } else {
          // Replace
          store.importData({
            ...remoteBackup,
            state: {
              ...remoteBackup.state,
              token: store.token,
              gistId: store.gistId,
              isSyncEnable: store.isSyncEnable,
            },
            version: CURRENT_DATA_VERSION, // Ensure replaced data is current version
          });
          return { success: true, action: "overwritten" };
        }
      } else {
        // No differences, no action needed
        return { success: true, action: "no_changes" };
      }
    } else {
      // Full overwrite
      store.importData({
        ...remoteBackup,
        state: {
          ...remoteBackup.state,
          token: store.token,
          gistId: store.gistId,
          isSyncEnable: store.isSyncEnable,
        },
        version: CURRENT_DATA_VERSION, // Ensure overwritten data is current version
      });
      return { success: true, action: "overwritten" };
    }
  } catch (error) {
    console.error("Load from gist failed:", error);
    return { success: false, error };
  }
}
