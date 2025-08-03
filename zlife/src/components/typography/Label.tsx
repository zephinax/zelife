import type { LabelPropsType } from "./types";

const Label: React.FC<LabelPropsType> = ({
  text,
  htmlFor,
  children,
  className,
  icon,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`flex items-center gap-2 font-medium text-text-secondary ${className}`}
    >
      {icon && <span className="w-5 h-5 text-text-secondary">{icon}</span>}
      <span className="text-secondary-800 text-nowrap 2xl:text-sm text-xs font-medium">
        {text}
      </span>
      {children && (
        <span className="2xl:text-sm text-xs text-text-secondary">
          {children}
        </span>
      )}
    </label>
  );
};

export default Label;
