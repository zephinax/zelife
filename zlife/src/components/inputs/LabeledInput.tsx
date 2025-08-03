import { forwardRef } from "react";
import Label from "../typography/Label";
import Input from "./Input";
import type { LabeledInputProps } from "./types";

const LabeledInput = forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ label, labelClassName, htmlFor, icon, className, ...rest }, ref) => {
    return (
      <div className="relative flex flex-col">
        <Label
          text={label}
          htmlFor={htmlFor}
          className={`absolute z-10 -top-1 mr-1 bg-white px-1 ${labelClassName}`}
          icon={icon}
        />
        <Input id={htmlFor} ref={ref} className={className} {...rest} />
      </div>
    );
  }
);

export default LabeledInput;
