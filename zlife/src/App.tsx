import { Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { useFinanceStore } from "./store/store";
import Auth from "./pages/createAccount/CreateAccount";
import Dashboard from "./pages/dashboard/Dashboard";
import Tasks from "./pages/tasks/Tasks";
import Setting from "./pages/setting/Setting";
import BottomNavigation from "./components/navigation/topNavigation/BottomNavigation";
import { useEffect } from "react";
import { loadFromGist } from "./utils/sync";
import { useAutoSync } from "./hooks/useAutoSync";

function App() {
  const { userName, isSyncEnable } = useFinanceStore();

  isSyncEnable && useAutoSync(15 * 60 * 1000);
  const fetch = async () => {
    await loadFromGist(useFinanceStore.getState());
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
            <Route path="/setting" element={<Setting />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Auth />} />
          </>
        )}
      </Routes>
      <BottomNavigation />
    </main>
  );
}

export default App;
