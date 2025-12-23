declare module "@local/wheel-datepicker" {
  import type React from "react";

  type DatepickerButtonProps = {
    size?: "small" | "medium" | "large";
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    text?: string;
  };

  type DatepickerInputProps = {
    label?: string;
    error?: string;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    value?: string;
    name?: string;
    onClick?: () => void;
    rtl?: boolean;
  };

  type DatepickerModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    placement?: "bottom" | "center";
    children?: React.ReactNode;
    className?: string;
    rtl?: boolean;
    closeIcon?: React.ReactNode;
  };

  type WheelPickerProps = {
    items: string[];
    onChange?: (item: string) => void;
    value?: string;
    visibleCount?: 1 | 3 | 5 | 7;
    itemClassName?: string;
    containerClassName?: string;
    scrollContainerClassName?: string;
    indicatorClassName?: string;
    itemHeight?: number;
    indicatorBorderColor?: string;
    indicatorBorderWidth?: number;
  };

  type DatepickerProps = Omit<
    WheelPickerProps,
    "onChange" | "defaultValue" | "items" | "containerClassName"
  > & {
    value?: string;
    onChange?: (date: string) => void;
    minYear?: number;
    maxYear?: number;
    className?: string;
    calendarType?: "jalali" | "miladi";
    input?: Omit<DatepickerInputProps, "onChange" | "onClick" | "readOnly" | "value">;
    modal?: Omit<DatepickerModalProps, "isOpen" | "onClose" | "children">;
    button?: Omit<DatepickerButtonProps, "onClick" | "children">;
  };

  export const WheelDatePicker: React.FC<DatepickerProps>;
  export type {
    DatepickerButtonProps,
    DatepickerInputProps,
    DatepickerModalProps,
    DatepickerProps,
  };
}

declare module "@local/wheel-datepicker/css";
