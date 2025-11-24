import type { UseFormReturn } from "react-hook-form";
import Input from "./Input";

const PasswordComponent = ({
  form,
  isNew,
  label = "رمز عبور را وارد کنید",
  isConfirm,
  noRequired,
}: {
  form: UseFormReturn<any>;
  isNew?: boolean;
  label?: string;
  isConfirm?: boolean;
  noRequired?: boolean;
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  return (
    <Input
      maxLength={50}
      type="password"
      autoComplete={isNew ? "new-password" : "current-password"}
      label={label}
      {...register(isConfirm ? "confirmPassword" : "password", {
        required: noRequired
          ? false
          : isConfirm
          ? "تکرار رمز عبور الزامی است"
          : "رمز عبور را وارد کنید",
        pattern: {
          value: /^.{8,}$/,
          message: "رمز عبور باید حداقل ۸ کاراکتر داشته باشد",
        },
        validate: (value) => {
          if (isConfirm) {
            return value === watch("password") || "رمز عبور مطابقت ندارد";
          }
          return true;
        },
      })}
      dir="ltr"
      errorText={
        isConfirm
          ? (errors.confirmPassword?.message as string)
          : (errors.password?.message as string)
      }
      className="w-full"
    />
  );
};

export default PasswordComponent;
