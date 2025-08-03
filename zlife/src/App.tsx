import { Route, Routes } from "react-router-dom";
import { useTheme } from "./hooks/useTheme";
import { useFinanceStore } from "./store/store";
import InitialPages from "./pages/initialPages/InitialPages";
function App() {
  const { createYear, removeYear, userName } = useFinanceStore();
  const { theme, setTheme } = useTheme();
  return (
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
                  <div>{userName}sdsd</div>
                </div>
                <div className="bg-background text-content min-h-screen p-6 space-y-4">
                  <h1 className="text-xl font-bold">تم فعال: {theme}</h1>

                  <div className="space-x-2">
                    <button
                      onClick={() => setTheme("light")}
                      className="bg-secondary px-4 py-2 rounded"
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className="bg-primary text-white px-4 py-2 rounded"
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => setTheme("system")}
                      className="bg-tertiary text-white px-4 py-2 rounded"
                    >
                      System
                    </button>
                  </div>
                </div>
              </div>
            }
          />
        </>
      ) : (
        <>
          <Route path="/" element={<InitialPages />} />
        </>
      )}
    </Routes>
  );
}

export default App;
