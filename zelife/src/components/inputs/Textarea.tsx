import { forwardRef } from "react";

import Paragraph from "../typography/Paragraph";
import Label from "../typography/Label";
import { inputClass } from "./Input";
import type { TextareaProps } from "./types";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      icon,
      label,
      errorText,
      readOnlyMode,
      textAreaClassName,
      subLabel,
      ...rest
    },
    ref
  ) => {
    const classList = `${inputClass} ${
      readOnlyMode ? "!bg-secondary-200 opacity-80" : ""
    } `;

    return icon ? (
      <div className={`flex flex-col gap-1 ${className || ""}`}>
        {label && <Label text={label}>{subLabel && subLabel}</Label>}
        <div
          className={`my-0 flex items-center justify-between gap-2 ${classList}`}
        >
          {icon}
          <textarea
            {...rest}
            ref={ref}
            className={`w-full border-none !outline-none !resize-none ${
              textAreaClassName || ""
            }`}
          />
        </div>
        {errorText && <Paragraph theme="error">{errorText}</Paragraph>}
      </div>
    ) : label ? (
      <div className={`flex flex-col gap-1 ${className || ""}`}>
        {label && <Label text={label}>{subLabel && subLabel}</Label>}

        <textarea
          className={`!resize-none ${classList} ${textAreaClassName || ""}`}
          {...rest}
          ref={ref}
        />
        {errorText && <Paragraph theme="error">{errorText}</Paragraph>}
      </div>
    ) : (
      <div className={`${className || ""} gap-1 flex flex-col`}>
        <textarea
          className={` !resize-none ${classList} ${textAreaClassName || ""}`}
          {...rest}
          ref={ref}
        />
        {errorText && <Paragraph theme="error">{errorText}</Paragraph>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
