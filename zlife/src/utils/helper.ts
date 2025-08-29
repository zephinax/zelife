import type { ChangeEvent } from "react";

function persianToEnglishDigits(str: string): string {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return str.replace(/[۰-۹]/g, (d) => persianDigits.indexOf(d).toString());
}

function toJalali(gy: number, gm: number, gd: number) {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];

  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;

  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  const jm =
    days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);

  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);

  return { jy, jm, jd };
}

export function formatJalali(timestamp: string | number | Date): string {
  const date = new Date(timestamp);
  const gy = date.getFullYear();
  const gm = date.getMonth() + 1;
  const gd = date.getDate();
  const { jy, jm, jd } = toJalali(gy, gm, gd);
  return `${jy}/${jm}/${jd}`;
}

export function getCurrentShamsiDate(): {
  year: number;
  month: number;
  day: number;
} {
  const now = new Date();

  const shamsiFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const parts = shamsiFormatter.formatToParts(now);
  const dateParts: Record<string, number> = {};

  for (const part of parts) {
    if (part.type === "year" || part.type === "month" || part.type === "day") {
      const english = persianToEnglishDigits(part.value);
      dateParts[part.type] = parseInt(english, 10);
    }
  }

  if (isNaN(dateParts.year) || isNaN(dateParts.month) || isNaN(dateParts.day)) {
    throw new Error("Shamsi date parsing failed due to non-numeric input");
  }

  return {
    year: dateParts.year,
    month: dateParts.month,
    day: dateParts.day,
  };
}

export function formatShamsiDate(
  year: number,
  month: number,
  day: number
): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${year}/${pad(month)}/${pad(day)}`;
}

// تبدیل رشته "YYYY/MM/DD" به آبجکت {year, month, day}
export function parseShamsiDate(dateStr: string): {
  year: number;
  month: number;
  day: number;
} {
  const parts = dateStr.split("/");
  if (parts.length !== 3) throw new Error("Invalid date format");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  return { year, month, day };
}

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
