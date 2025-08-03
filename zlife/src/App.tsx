import { Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { useFinanceStore } from "./store/store";
import Auth from "./pages/initialPages/Auth";

function App() {
  const { createYear, removeYear, userName } = useFinanceStore();
  const {} = useTheme();
  return (
    <main className="text-text bg-background">
      <Routes>
        {userName ? (
          <>
            <Route
              path="/"
              element={
                <div>
                  <div className="bg-background text-content p-6">
                    <button
                      onClick={() => createYear("1404")}
                      className="bg-primary text-white px-4 py-2 rounded m-2"
                    >
                      create year
                    </button>
                    <button
                      onClick={() => removeYear("1404")}
                      className="bg-tertiary text-white px-4 py-2 rounded m-2"
                    >
                      delete year
                    </button>
                    <div>
                      {window.matchMedia("(prefers-color-scheme: dark)").matches
                        ? "dark"
                        : "light"}
                    </div>
                  </div>
                  <div className="bg-background text-content min-h-screen p-6 space-y-4"></div>
                </div>
              }
            />
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
