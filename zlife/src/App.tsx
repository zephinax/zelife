import { Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { useFinanceStore } from "./store/store";
import Auth from "./pages/createAccount/CreateAccount";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const { userName } = useFinanceStore();
  useTheme();
  return (
    <main className="text-text bg-background">
      <Routes>
        {userName ? (
          <>
            <Route path="/" element={<Dashboard />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Auth />} />
          </>
        )}
      </Routes>
    </main>
  );
}

export default App;
