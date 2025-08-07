import { Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { useFinanceStore } from "./store/store";
import Dashboard from "./pages/dashboard/Dashboard";
import Tasks from "./pages/tasks/Tasks";
import Setting from "./pages/setting/Setting";
import BottomNavigation from "./components/navigation/topNavigation/BottomNavigation";
import { useEffect } from "react";
import { loadFromGist } from "./utils/sync";
import { useAutoSync } from "./hooks/useAutoSync";
import CreateAccount from "./pages/createAccount/CreateAccount";

function App() {
  const { userName, isSyncEnable } = useFinanceStore();

  const {
    isLoading: isSyncing,
    error,
    lastSyncAt,
    lastAction,
    triggerSync,
  } = useAutoSync(15 * 60 * 1000);

  const fetch = async () => {
    if (isSyncEnable) {
      await loadFromGist(useFinanceStore.getState());
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  useTheme();

  return (
    <main className="text-text bg-background">
      <Routes>
        {userName ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route
              path="/setting"
              element={
                <Setting
                  lastAction={"created"}
                  triggerSync={triggerSync}
                  isLoading={isSyncing}
                  error={error}
                  lastSyncAt={lastSyncAt}
                />
              }
            />
          </>
        ) : (
          <>
            <Route path="/" element={<CreateAccount />} />
          </>
        )}
      </Routes>
      {userName && <BottomNavigation />}
    </main>
  );
}

export default App;
