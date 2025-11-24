import { TextTheme } from "./constants";
import type { Paraghrap_Props_Type } from "./types";

const Paragraph = ({
  children,
  className,
  theme = "default",
  size = "xs",
  onClick,
}: Paraghrap_Props_Type) => {
  return (
    <p
      className={`text-${size} ${TextTheme(theme)} ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </p>
  );
};

export default Paragraph;
