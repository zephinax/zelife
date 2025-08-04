import { forwardRef, useState } from "react";
import Paragraph from "../typography/Paragraph";
import Label from "../typography/Label";
import { FiEye, FiEyeOff } from "react-icons/fi";
import type { InputProps } from "./types";

export const inputClass =
  "2xl:text-base text-sm bg-background rounded-3xl h-[38px] placeholder:text-sm !outline-none block w-full 2xl:py-[8px] py-2 px-3 border border-text-secondary focus:border-primary disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-secondary-200";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      icon,
      label,
      border = true,
      errorText,
      readOnlyMode,
      inputClassName,
      subLabel,
      showPriceInWords,
      type = "text",
      dir = "auto",
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const classList = `${inputClass} ${
      border === false ? "!border-none" : ""
    } ${readOnlyMode ? "!bg-secondary-200 opacity-80" : ""} ${
      dir === "rtl" ? "text-right" : dir === "ltr" ? "text-left" : ""
    }`;

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return icon ? (
      <div className={`flex flex-col gap-1 ${className || ""}`} dir={dir}>
        {label && <Label text={label} />}
        <div
          className={`my-0 flex items-center justify-between gap-2 ${classList}`}
          dir={dir}
        >
          {icon}
          <input
            {...rest}
            ref={ref}
            type={showPassword ? "text" : type}
            className={`w-full border-none !outline-none ${
              inputClassName || ""
            }`}
            dir={dir}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute ${
                dir === "rtl" ? "left-3" : "right-3"
              } top-[50%] translate-y-[-50%] cursor-pointer`}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          )}
        </div>
        {errorText && <Paragraph theme="error">{errorText}</Paragraph>}
        {showPriceInWords && (
          <Paragraph theme="blue" className="mt-1 text-blue-500">
            {showPriceInWords}
          </Paragraph>
        )}
      </div>
    ) : label ? (
      <div className={`flex flex-col gap-1 ${className || ""}`} dir={dir}>
        <Label text={label}>{subLabel && subLabel}</Label>
        <div className="space-y-1 w-full">
          <div className="relative">
            <input
              type={showPassword ? "text" : type}
              className={`${classList} ${inputClassName || ""}`}
              {...rest}
              ref={ref}
              dir={dir}
            />
            {type === "password" && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute ${
                  dir === "rtl" ? "left-3" : "right-3"
                } top-[50%] translate-y-[-50%] cursor-pointer`}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            )}
          </div>
          {errorText && <Paragraph theme="error">{errorText}</Paragraph>}
          {showPriceInWords && (
            <Paragraph theme="blue" className="mt-1 text-blue-500">
              {showPriceInWords}
            </Paragraph>
          )}
        </div>
      </div>
    ) : (
      <div className={`${className || ""}`} dir={dir}>
        <div className="relative">
          <input
            type={showPassword ? "text" : type}
            className={`${classList} ${inputClassName || ""}`}
            {...rest}
            ref={ref}
            dir={dir}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute ${
                dir === "rtl" ? "left-3" : "right-3"
              } top-[50%] translate-y-[-50%] cursor-pointer`}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          )}
        </div>
        {errorText && <Paragraph theme="error">{errorText}</Paragraph>}
        {showPriceInWords && (
          <Paragraph theme="blue" className="mt-1 text-blue-500">
            {showPriceInWords}
          </Paragraph>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
