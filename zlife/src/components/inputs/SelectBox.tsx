import { useState, forwardRef, useRef, useEffect } from "react";
import Paragraph from "../typography/Paragraph";
import Label from "../typography/Label";

export interface SelectBoxProps {
  options: string[];
  label?: string;
  errorText?: string;
  subLabel?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  dir?: "rtl" | "ltr" | "auto";
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

const inputBaseClass =
  "2xl:text-base text-sm bg-background rounded-3xl placeholder:text-sm !outline-none block w-full 2xl:py-[8px] py-2 px-3 border border-text-secondary focus:border-primary disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-secondary-200 text-text";

const SelectBox = forwardRef<HTMLDivElement, SelectBoxProps>(
  (
    {
      options,
      label,
      errorText,
      subLabel,
      value,
      onChange,
      disabled,
      dir = "auto",
      className,
      inputClassName,
      placeholder = "یک گزینه انتخاب کنید",
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(value || "");
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleOpen = () => {
      if (!disabled) setOpen(!open);
    };

    const handleSelect = (val: string) => {
      setSelected(val);
      setOpen(false);
      if (onChange) onChange(val);
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const textAlign =
      dir === "rtl" ? "text-right" : dir === "ltr" ? "text-left" : "";

    return (
      <div
        className={`flex flex-col gap-1 ${className || ""}`}
        dir={dir}
        ref={ref}
      >
        {label && <Label text={label}>{subLabel}</Label>}
        <div ref={dropdownRef} className="relative space-y-1 w-full">
          <div
            className={`${inputBaseClass} ${
              inputClassName || ""
            } ${textAlign} ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={toggleOpen}
          >
            {selected || (
              <Paragraph className="text-text-secondary">
                {placeholder}
              </Paragraph>
            )}
          </div>

          {open && (
            <ul className="absolute z-10 mt-1 w-full border rounded-xl border-text-secondary bg-background shadow-md max-h-60 overflow-auto">
              {options.map((option, index) => (
                <li
                  key={index}
                  className="px-4 py-2 text-text hover:bg-primary/50 cursor-pointer text-sm"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}

          {errorText && (
            <Paragraph size="xs" theme="error">
              {errorText}
            </Paragraph>
          )}
        </div>
      </div>
    );
  }
);

SelectBox.displayName = "SelectBox";

export default SelectBox;
