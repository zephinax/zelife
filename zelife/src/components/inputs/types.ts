import type { InputHTMLAttributes } from "react";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "className"
> & {
  border?: boolean;
  className?: string;
  inputClassName?: string;
  icon?: React.ReactNode;
  label?: string;
  errorText?: string;
  readOnlyMode?: boolean;
  subLabel?: string | React.ReactNode;
  showPriceInWords?: string; // New Prop
};

export interface LabeledInputProps extends InputProps {
  label: string;
  labelClassName?: string;
  htmlFor?: string;
  icon?: React.ReactNode;
}

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  textAreaClassName?: string;
  icon?: React.ReactNode;
  label?: string;
  errorText?: string;
  subLabel?: string | React.ReactNode;
  readOnlyMode?: boolean;
}

export interface RadioType extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string;
  isDisabled?: boolean;
}

export type CheckBoxType = {
  label?: string;
  value?: string;
  className?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  defaultChecked?: boolean;
};

export interface CheckboxInputPropsType {
  checkboxValue?: boolean;
  errorText?: InputProps["errorText"];
  readOnlyMode?: InputProps["readOnlyMode"];
  register?: any;
  name?: string;
  value?: string;
  label?: InputProps["label"];
  coustomInput?: React.ReactNode;
}
export type SwitchButtonProps = {
  label: string;
  onClickLabel?: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  className?: string;
  isChecked?: boolean;
  isDisabled?: boolean;
};

export type phone = {
  phone: string;
};

export type PhoneNumberInputProps = {
  phoneNumber: phone[] | null;
};
