import type { FinanceActions, FinanceState } from "../store/types";
import {
  fetchGistContent,
  updateGistContent,
  createNewGist,
} from "./gistController";

export async function syncToGist(store: FinanceState & FinanceActions) {
  if (!store.isSyncEnable || !store.token) {
    console.log("Sync disabled or no token");
    return;
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

    const remoteData = JSON.parse(content);

    if (options.merge) {
      // Simple merge strategy - keep remote data but preserve critical local settings
      store.importData({
        ...remoteData,
        state: {
          ...remoteData.state,
          token: store.token, // Keep local token
          gistId: store.gistId, // Keep local gistId
          isSyncEnable: store.isSyncEnable, // Keep sync setting
        },
      });
      return { success: true, action: "merged" };
    } else {
      // Full overwrite
      store.importData(remoteData);
      return { success: true, action: "overwritten" };
    }
  } catch (error) {
    console.error("Load from gist failed:", error);
    return { success: false, error };
  }
}
