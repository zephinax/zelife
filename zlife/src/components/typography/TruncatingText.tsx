import React from "react";

interface TruncatingTextProps {
  children: React.ReactNode;
  width: string;
  className?: string;
  tooltip?: boolean;
}

const TruncatingText: React.FC<TruncatingTextProps> = ({
  children,
  width,
  className = "",
  tooltip = true,
}) => {
  return (
    <div
      className={`truncate overflow-hidden whitespace-nowrap ${className}`}
      style={{ width }}
      title={
        tooltip
          ? typeof children === "string"
            ? children
            : undefined
          : undefined
      }
    >
      {children}
    </div>
  );
};

export default TruncatingText;
