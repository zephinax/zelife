import { TextTheme } from "./constants";
import type { Paraghrap_Props_Type } from "./types";

const Paragraph = ({
  children,
  className,
  theme = "default",
  size = "sm",
  onClick,
}: Paraghrap_Props_Type) => {
  return (
    <p
      className={`text-${size} max-sm:text-xs ${
        size === "md" ? "tetx-base" : ""
      } ${TextTheme(theme)} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </p>
  );
};

export default Paragraph;
