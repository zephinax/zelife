import { useTranslation } from "../../hooks/useTranslation";
import Button from "../../components/button/Button";
import Input from "../../components/inputs/Input";
import { useFinanceStore } from "../../store/store";
import { useEffect } from "react";
import type { Task } from "../../store/types";
import { parseShamsiDate } from "../../utils/helper";
import { v4 as uuidv4 } from "uuid";

export default function CreateTaskForm({
  onSuccess,
  targetData,
  userDataForm,
}: {
  targetData?: Task;
  onSuccess?: () => void;
  userDataForm: any;
}) {
  const { addTask, defaultDate, selectedDate, editTask } = useFinanceStore();
  const { t } = useTranslation();
  const DATE = selectedDate ? selectedDate : defaultDate;
  const PARSE_DATE = parseShamsiDate(DATE);
  const { year, month, day } = PARSE_DATE;

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
      onSubmit={handleSubmit((data: any) => {
        if (targetData) {
          editTask(String(year), String(month), String(day), targetData.id, {
            title: data.title,
            isDone: targetData.isDone,
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
        label={t("tasks.title")}
        {...register("title", { required: "" })}
      />
      <Input
        type="text"
        errorText={errors.description?.message as string}
        label={t("tasks.description")}
        {...register("description")}
      />
      <Input
        type="number"
        inputMode="numeric"
        errorText={errors.priority?.message as string}
        label={t("tasks.priority")}
        {...register("priority")}
      />
      <Button className="w-full mt-2 my-2" type="submit">
        {Boolean(targetData?.id) ? t("tasks.editTask") : t("tasks.createTask")}
      </Button>
    </form>
  );
}
