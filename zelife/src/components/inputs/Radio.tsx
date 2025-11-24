import React from "react";
import type { RadioType } from "./types";

const Radio: React.FC<RadioType> = ({
  label,
  value,
  name,
  isDisabled,
  checked,
  onChange,
  onClick,
}) => {
  return (
    <div className="flex items-center gap-2">
      <input
        disabled={isDisabled}
        type="radio"
        id={`data-${value}`}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        onClick={onClick}
        className="peer hidden"
      />
      <label
        htmlFor={`data-${value}`}
        className={`cursor-pointer size-3.5 border-[1px] border-secondary-500 rounded-full flex items-center outline-secondary-500 justify-center outline-[1px] peer-checked:outline peer-checked:outline-primary outline-offset-2 peer-checked:border-primary peer-checked:bg-primary`}
      >
        <div className="size-2 bg-white rounded-full peer-checked:block hidden"></div>
      </label>
      <span className="cursor-pointer text-nowrap">{label}</span>
    </div>
  );
};

export default Radio;
