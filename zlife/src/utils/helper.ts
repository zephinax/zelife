import { QueryClient } from "@tanstack/react-query";
import type { ChangeEvent } from "react";

export const queryClient = new QueryClient();

export const activeItemHandler = ({ isActive }: { isActive: boolean }) => {
  return `flex 2xl:[&>svg]:w-6 [&>svg]:w-5 items-center gap-2 w-full transition-colors duration-300 px-1 py-3 ${
    isActive ? "!bg-background font-medium [&>div.badge]:bg-primary" : ""
  }`;
};

const numbersToWords: { [key: number]: string } = {
  0: "صفر",
  1: "یک",
  2: "دو",
  3: "سه",
  4: "چهار",
  5: "پنج",
  6: "شش",
  7: "هفت",
  8: "هشت",
  9: "نه",
  10: "ده",
  11: "یازده",
  12: "دوازده",
  13: "سیزده",
  14: "چهارده",
  15: "پانزده",
  16: "شانزده",
  17: "هفده",
  18: "هجده",
  19: "نوزده",
  20: "بیست",
  30: "سی",
  40: "چهل",
  50: "پنجاه",
  60: "شصت",
  70: "هفتاد",
  80: "هشتاد",
  90: "نود",
  100: "صد",
  200: "دویست",
  300: "سیصد",
  400: "چهارصد",
  500: "پانصد",
  600: "ششصد",
  700: "هفتصد",
  800: "هشتصد",
  900: "نهصد",
};

const scales: { [key: number]: string } = {
  1_000_000_000: "میلیارد",
  1_000_000: "میلیون",
  1_000: "هزار",
};

const convertNumberToWords = (num: number): string => {
  if (num === 0) return numbersToWords[0];

  let isNegative = num < 0;
  num = Math.abs(num);

  let result = "";

  for (const [scaleValue, scaleName] of Object.entries(scales).sort(
    (a, b) => parseInt(b[0]) - parseInt(a[0])
  )) {
    const scale = parseInt(scaleValue);
    if (num >= scale) {
      const scaleCount = Math.floor(num / scale);
      result += `${convertNumberToWords(scaleCount)} ${scaleName}`;
      num %= scale;
      if (num > 0) result += " و ";
    }
  }

  if (num >= 100) {
    const hundreds = Math.floor(num / 100) * 100;
    result += `${numbersToWords[hundreds]}`;
    num %= 100;
    if (num > 0) result += " و ";
  }

  if (num > 0) {
    if (num <= 20) {
      result += `${numbersToWords[num]}`;
    } else {
      const tens = Math.floor(num / 10) * 10;
      result += `${numbersToWords[tens]}`;
      const ones = num % 10;
      if (ones > 0) {
        result += ` و ${numbersToWords[ones]}`;
      }
    }
  }

  return isNegative ? `منفی ${result.trim()}` : result.trim();
};

export const convertPriceToWords = (price: number): string => {
  const amountInToman = Math.floor(price / 10);
  return `${convertNumberToWords(amountInToman)} تومان`;
};

export const numberWithCommas = (number: number | string) => {
  if (number == null || number === "") return "";
  const num =
    typeof number === "number"
      ? number
      : parseFloat(number.toString().replace(/,/g, ""));
  if (isNaN(num)) return "";

  return num.toLocaleString("en-US");
};

export const removeCommas = (input: string | number) => {
  if (input == null || input === "") return "";

  const sanitizedInput = typeof input === "string" ? input : input.toString();
  return sanitizedInput.replace(/,/g, "");
};

export function validateIranianNationalCode(input: string): boolean {
  if (!/^\d{10}$/.test(input) || /^(\d)\1{9}$/.test(input)) return false;

  const check = parseInt(input[9], 10);
  const sum =
    [...input]
      .slice(0, 9)
      .reduce(
        (acc, curr, index) => acc + parseInt(curr, 10) * (10 - index),
        0
      ) % 11;

  return (sum < 2 && check === sum) || (sum >= 2 && check === 11 - sum);
}

export const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(url);
};

export const enterJustNumber = (e: ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.replace(/[^0-9\s]/g, "");
  e.target.value = value;
};
export function convertTimeToObject(time: string): { h: number; m: number } {
  const [hours, minutes] = time?.split(":");
  return {
    h: parseInt(hours, 10),
    m: parseInt(minutes, 10),
  };
}
export function splitDateTime(input: string) {
  const createdAt = input;
  if (!createdAt) {
    return { time: "", date: "" };
  }
  const [time, date] = createdAt.split(" ");
  return {
    time: time.trim(),
    date: date.trim(),
  };
}

export const timeFormated = (time: { m: number; h: number }) => {
  return `${String(time?.h).padStart(2, "0")}:${String(time?.m).padStart(
    2,
    "0"
  )}`;
};

export const parseTime = (timeString: any) => {
  const [h, m] = timeString.split(":");
  return { h, m };
};
export const convertOptions = (array: any[]) => {
  return array?.length
    ? array?.map((item) => ({
        label: item.text,
        value: item.value,
      }))
    : [];
};

export function downloadFile(
  data: any,
  fileType = "application/octet-stream",
  fileName = `file_${new Date().toISOString()}.xlsx`
) {
  const blob = new Blob([data], { type: fileType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
}
export const convertEnums = (num: string) => {
  return num === "0" ? 0 : num === null ? null : Number(num);
};

export const installmentsNumberFormated = (input: string) => {
  const numbers = input.replace(/\D/g, "");

  let formatted = "";
  if (numbers.length > 0) formatted += numbers.substring(0, 3);
  if (numbers.length > 3) formatted += "." + numbers.substring(3, 7);
  if (numbers.length > 7) formatted += "." + numbers.substring(7, 15);
  if (numbers.length > 15) formatted += "." + numbers.substring(15, 16);

  return formatted;
};
export const removeSpace = (text: string) => {
  return text?.replace(/\s/g, "");
};
export const formatShebaNumber = (input: string) => {
  const numbers = input?.replace(/\D/g, "");

  return numbers?.replace(/(\d{4})/g, "$1 ").trim();
};
export const validateShebaNumber = (value: string) => {
  const sheba = value.replace(/\s/g, "");
  if (sheba.length !== 24) {
    return "شماره شبا باید  24 رقم باشد.";
  }
  return true;
};

export const convertShowPriceToWord = (value: string | number) => {
  return convertPriceToWords(Number(removeCommas(value)));
};
export const enterJustPersianCharacter = (
  event: React.FormEvent<HTMLInputElement>
) => {
  let value = event.currentTarget.value;

  value = value.replace(/[^آ-ی]/g, "");

  event.currentTarget.value = value;
};
export const blockNonPersianKeys = (
  event: React.KeyboardEvent<HTMLInputElement>
) => {
  const persianLettersRegex = /^[آ-ی]$/;
  if (!persianLettersRegex.test(event.key)) {
    event.preventDefault();
  }
};

export const blockNonPersianNumbers = (e: React.KeyboardEvent) => {
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
    e.preventDefault();
  }
};

export function subtractHalfHour(time: string) {
  let [hours, minutes] = time.split(":").map(Number);
  minutes -= 30;
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours = 23;
  }
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}`;
}
