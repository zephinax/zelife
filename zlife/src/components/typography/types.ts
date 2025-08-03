import type { ReactNode } from "react";

export type ThemeType =
  | "secondary"
  | "error"
  | "success"
  | "primary"
  | "blue"
  | "black"
  | "darkRed"
  | "purple"
  | "orange"
  | "teal"
  | "cyan"
  | "default";

export interface Paraghrap_Props_Type {
  children: ReactNode;
  className?: string;
  theme?: ThemeType;
  size?: "lg" | "sm" | "md";
  onClick?: () => void;
}
export interface Title_Props_Type {
  children: ReactNode;
  className?: string;
}

export interface LabelPropsType {
  text: string;
  children?: ReactNode;
  htmlFor?: string;
  className?: string;
  icon?: ReactNode;
}
