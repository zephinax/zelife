import { useForm } from "react-hook-form";
import SelectBox from "../../components/inputs/SelectBox";
import { useTranslation } from "../../hooks/useTranslation";
import Button from "../../components/button/Button";

export default function TransactionForm() {
  const transactionOptions = ["income", "expense"];
  const { t } = useTranslation();
  const transactionForm = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = transactionForm;
  return (
    <form
      onSubmit={handleSubmit((data) => {
        console.log(data);
      })}
      className="pb-2 flex flex-col gap-4"
    >
      <SelectBox
        label={t("transaction.transactionType")}
        placeholder={t("transaction.choseOption")}
        options={transactionOptions}
        {...register("type", {
          required: `${t("transaction.transactionTypeRequired")}`,
        })}
        errorText={errors.type?.message as string}
        onChange={() => {}}
      />
      <Button className="w-full" type="submit">
        {t("dashboard.addTransaction")}
      </Button>
    </form>
  );
}
