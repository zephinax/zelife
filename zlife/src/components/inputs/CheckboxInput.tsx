import React from "react";
import Input from "./Input";
import Label from "../typography/Label";
import type { CheckboxInputPropsType } from "./types";

export const CheckboxInput = React.forwardRef<
  HTMLInputElement,
  CheckboxInputPropsType
>((props, ref) => {
  const {
    checkboxValue = false,
    errorText,
    readOnlyMode = false,
    register,
    name,
    label,
    value,
    coustomInput,
  } = props;

  return (
    <div className="flex flex-col gap-1">
      <Label text={label || ""} className="text-nowrap" />
      <div
        className={`flex items-center border rounded-lg border-secondary-500 pr-3 ${
          readOnlyMode ? "!bg-secondary-200 opacity-80" : ""
        }`}
      >
        <input
          disabled={readOnlyMode}
          readOnly={readOnlyMode}
          type="checkbox"
          defaultChecked={checkboxValue}
          className="accent-primary cursor-pointer !relative size-5 disabled:!accent-gray-600"
          ref={ref}
          {...register(`${name}.checkboxValue`)}
        />
        {coustomInput ? (
          coustomInput
        ) : (
          <Input
            readOnly={readOnlyMode}
            border={false}
            errorText={errorText}
            readOnlyMode={readOnlyMode}
            value={value}
            className="!rounded-none [&>input]:!my-0"
            {...register(`${name}.textInput`)}
          />
        )}
      </div>
    </div>
  );
});
