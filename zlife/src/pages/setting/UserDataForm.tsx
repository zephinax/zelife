import { useForm } from "react-hook-form";
import { useTranslation } from "../../hooks/useTranslation";
import Button from "../../components/button/Button";
import Input from "../../components/inputs/Input";
import { useFinanceStore } from "../../store/store";
import type { Transaction } from "../../store/types";
import { useEffect } from "react";

export default function UserDataForm({
  onSuccess,
  targetTransaction,
}: {
  targetTransaction?: Transaction;
  onSuccess?: () => void;
}) {
  const { setGistId, setToken, setFilename, selectedDate, defaultDate } =
    useFinanceStore();
  const { t } = useTranslation();
  const userDataForm = useForm();
  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors },
  } = userDataForm;

  useEffect(() => {
    if (targetTransaction) {
      setValue("type", targetTransaction.type);
      setValue("amount", targetTransaction.amount);
      setValue("description", targetTransaction.description);
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        setFilename(data.filename);
        setToken(data.token);
        setGistId(data.gistId);
      })}
      className="pb-2 flex flex-col gap-4"
    >
      <Input
        type="text"
        errorText={errors.filename?.message as string}
        label={t("setting.filename")}
        {...register("filename", { required: "" })}
      />

      <Input
        type="text"
        errorText={errors.token?.message as string}
        label={t("setting.token")}
        {...register("token")}
      />
      <Input
        type="text"
        errorText={errors.gistId?.message as string}
        label={t("setting.gistId")}
        {...register("gistId")}
      />

      <Button className="w-full mt-2 my-2" type="submit">
        {Boolean(targetTransaction?.id)
          ? t("dashboard.editTransaction")
          : t("setting.syncData")}
      </Button>
    </form>
  );
}
