import React, { useRef } from "react";
import { inputClass } from "./Input";
export interface OtpInputTypes {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}
const OTPInput: React.FC<OtpInputTypes> = ({ otp, setOtp }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (index === otp.length - 1 && value) {
        inputRefs.current[index]?.blur();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData("Text");

    if (!isNaN(Number(pastedData)) && pastedData.length === otp.length) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);

      inputRefs.current[otp.length - 1]?.blur();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={`${inputClass} flex space-x-3 justify-center`} dir="ltr">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="tel"
          maxLength={1}
          autoComplete="one-time-code"
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-6 text-center border-b-2 rounded-none border-secondary-600 focus:border-primary-500 text-xl outline-none transition-colors duration-200"
        />
      ))}
    </div>
  );
};

export default OTPInput;
