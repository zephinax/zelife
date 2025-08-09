import { useForm } from "react-hook-form";
import { useTranslation } from "../../hooks/useTranslation";
import Button from "../../components/button/Button";
import Input from "../../components/inputs/Input";
import { useFinanceStore } from "../../store/store";
import { useEffect } from "react";
import Paragraph from "../../components/typography/Paragraph";
import type { Task } from "../../store/types";
import { parseShamsiDate } from "../../utils/helper";

export default function CreateTaskForm({
  onSuccess,
  targetData,
}: {
  targetData?: Task;
  onSuccess?: () => void;
}) {
  const { addTask, defaultDate, selectedDate } = useFinanceStore();
  const { t } = useTranslation();
  const DATE = selectedDate ? selectedDate : defaultDate;
  const PARSE_DATE = parseShamsiDate(DATE);
  const { year, month, day } = PARSE_DATE;
  const userDataForm = useForm();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = userDataForm;

  useEffect(() => {
    if (targetData) {
      setValue("title", targetData.title);
      setValue("description", targetData.description);
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        addTask(String(year), String(month), String(day), {
          title: data.title,
          isDone: false,
          updatedAt: 232,
          id: "3434234sdfs342",
          description: "",
        });
        onSuccess && onSuccess();
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
      <Paragraph>{t("setting.explain")}</Paragraph>

      <Button className="w-full mt-2 my-2" type="submit">
        {Boolean(targetData?.id)
          ? t("dashboard.editTransaction")
          : t("setting.syncData")}
      </Button>
    </form>
  );
}
