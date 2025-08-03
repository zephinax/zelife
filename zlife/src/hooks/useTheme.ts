import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme") as Theme | null;
  return stored ?? "system";
}

function getIsDark(theme: Theme): boolean {
  return (
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // اعمال کلاس‌ها روی <body>
  const applyTheme = (theme: Theme) => {
    const isDark = getIsDark(theme);
    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light", !isDark);
  };

  useEffect(() => {
    applyTheme(theme);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored === "system") applyTheme("system");
    };
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [theme]);

  return { theme, setTheme };
}
