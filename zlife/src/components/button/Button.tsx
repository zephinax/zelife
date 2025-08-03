import type { IconType } from "react-icons";
import type { ReactNode } from "react";
import "./Button.css";

export default function Button(props: {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  Icon?: IconType;
  children?: ReactNode;
  className?: string;
  type?: "submit" | "reset" | "button";
}) {
  const {
    Icon,
    children,
    text,
    onClick,
    disabled,
    type = "button",
    loading = false,
    className,
  } = props;

  return (
    <button
      type={type}
      dir="rtl"
      onClick={onClick}
      disabled={disabled}
      className={`button ${className ? className : ""}`}
    >
      {loading ? (
        <div className="flex flex-row gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-bounce [animation-delay:-.5s]"></div>
        </div>
      ) : (
        <>
          {text}
          {children}
          {Icon && <Icon className="icon" />}
        </>
      )}
    </button>
  );
}
