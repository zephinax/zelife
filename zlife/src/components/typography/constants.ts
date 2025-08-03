import type { ThemeType } from "./types";

export const TextTheme = (theme: ThemeType) => {
  return theme === "black"
    ? "text-black"
    : theme === "blue"
    ? "text-blue-500"
    : theme === "error"
    ? "text-red-600"
    : theme === "primary"
    ? "text-blue-600"
    : theme === "secondary"
    ? "text-gray-700"
    : theme === "success"
    ? "text-green-600"
    : theme === "orange"
    ? "text-orange-500"
    : theme === "darkRed"
    ? "text-red-800"
    : theme === "purple"
    ? "text-purple-500"
    : theme === "teal"
    ? "text-teal-500"
    : theme === "cyan"
    ? "text-cyan-500"
    : theme === "default"
    ? "text-text"
    : "";
};
