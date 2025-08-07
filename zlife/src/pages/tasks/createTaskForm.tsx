import { useForm } from "react-hook-form";
import { useTranslation } from "../../hooks/useTranslation";
import Button from "../../components/button/Button";
import Input from "../../components/inputs/Input";
import { useFinanceStore } from "../../store/store";
import { useEffect } from "react";
import Paragraph from "../../components/typography/Paragraph";

export default function createTaskForm({
  onSuccess,
  targetData,
}: {
  targetData?: {
    filename: string;
    token: string;
    gistId: string;
  };
  onSuccess?: () => void;
}) {
  const { setGistId, setToken, setFilename, setIsSyncEnable } =
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
    if (targetData) {
      setValue("filename", targetData.filename);
      setValue("gistId", targetData.gistId);
      setValue("token", targetData.token);
    }
  }, []);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        setFilename(data.filename);
        setToken(data.token);
        setGistId(data.gistId);
        setIsSyncEnable(true);
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
        {Boolean(targetData?.token)
          ? t("dashboard.editTransaction")
          : t("setting.syncData")}
      </Button>
    </form>
  );
}
