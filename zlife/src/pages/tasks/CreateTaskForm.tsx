import { useForm } from "react-hook-form";
import { useTranslation } from "../../hooks/useTranslation";
import Button from "../../components/button/Button";
import Input from "../../components/inputs/Input";
import { useFinanceStore } from "../../store/store";
import { useEffect } from "react";
import Paragraph from "../../components/typography/Paragraph";
import type { Task } from "../../store/types";
import { parseShamsiDate } from "../../utils/helper";
import { v4 as uuidv4 } from "uuid";

export default function CreateTaskForm({
  onSuccess,
  targetData,
}: {
  targetData?: Task;
  onSuccess?: () => void;
}) {
  const { addTask, defaultDate, selectedDate, editTask } = useFinanceStore();
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
      setValue("priority", targetData.priority);
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (targetData) {
          editTask(String(year), String(month), String(day), targetData.id, {
            title: data.title,
            isDone: false,
            priority: data.priority,
            updatedAt: Date.now(),
            description: data.description,
          });
        } else {
          addTask(String(year), String(month), String(day), {
            title: data.title,
            isDone: false,
            priority: data.priority,
            updatedAt: Date.now(),
            id: uuidv4(),
            description: data.description,
          });
        }
        userDataForm.reset();
        onSuccess && onSuccess();
      })}
      className="pb-2 flex flex-col gap-4"
    >
      <Input
        type="text"
        errorText={errors.title?.message as string}
        label={t("setting.title")}
        {...register("title", { required: "" })}
      />
      <Input
        type="text"
        errorText={errors.description?.message as string}
        label={t("setting.description")}
        {...register("description")}
      />
      <Input
        type="number"
        inputMode="numeric"
        errorText={errors.priority?.message as string}
        label={t("setting.priority")}
        {...register("priority")}
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
