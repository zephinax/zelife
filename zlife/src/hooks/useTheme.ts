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

function updateMetaThemeColor(isDark: boolean) {
  const color = isDark ? "#121212" : "#f7f7f7";
  let meta = document.querySelector(
    "meta[name=theme-color]"
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }

  meta.setAttribute("content", color);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const applyTheme = (theme: Theme) => {
    const isDark = getIsDark(theme);
    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light", !isDark);
    updateMetaThemeColor(isDark);
  };

  useEffect(() => {
    applyTheme(theme);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      const stored = localStorage.getItem("theme") as Theme | null;
      const currentTheme = stored ?? "system";
      if (currentTheme === "system") applyTheme("system");
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
