import { Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { useFinanceStore } from "./store/store";
import Auth from "./pages/createAccount/CreateAccount";
import { useEffect } from "react";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  const { userName, language } = useFinanceStore();
  useEffect(() => {
    if (language === "fa") {
      document.body.setAttribute("dir", "rtl");
    } else {
      document.body.setAttribute("dir", "ltr");
    }
  }, [language]);
  const {} = useTheme();
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
