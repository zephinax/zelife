import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useTheme } from "./hooks/useTheme";
import { useFinanceStore } from "./store/store";
import Dashboard from "./pages/dashboard/Dashboard";
import Tasks from "./pages/tasks/Tasks";
import Setting from "./pages/setting/Setting";
import BottomNavigation from "./components/navigation/topNavigation/BottomNavigation";
import { useEffect, type JSX } from "react";
import { loadFromGist } from "./utils/sync";
import { useAutoSync } from "./hooks/useAutoSync";
import CreateAccount from "./pages/createAccount/CreateAccount";

function App(): JSX.Element {
  const location = useLocation();
  const { userName, isSyncEnable, setSelectedDate } = useFinanceStore();
  const {
    isLoading: isSyncing,
    error,
    lastSyncAt,
    lastAction,
    triggerSync,
  } = useAutoSync(15 * 60 * 1000);

  const fetch = async (): Promise<void> => {
    if (isSyncEnable) {
      await loadFromGist(useFinanceStore.getState(), { merge: true });
    }
  };

  useEffect(() => {
    fetch();
    setSelectedDate("");
  }, []);

  useTheme();

  useEffect(() => {
    if (isSyncEnable) {
      triggerSync();
    }
  }, [isSyncEnable]);

  return (
    <main className="text-text bg-background">
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          {userName ? (
            <>
              <Route
                path="/"
                element={
                  <Dashboard
                    triggerSync={triggerSync}
                    error={error}
                    isLoading={isSyncing}
                  />
                }
              />
              <Route path="/tasks" element={<Tasks />} />
              <Route
                path="/setting"
                element={
                  <Setting
                    lastAction={lastAction}
                    triggerSync={triggerSync}
                    isLoading={isSyncing}
                    error={error}
                    lastSyncAt={lastSyncAt}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<CreateAccount />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </AnimatePresence>
      {userName && <BottomNavigation />}
    </main>
  );
}

export default App;
