import { useForm } from "react-hook-form";
import SelectBox from "../../components/inputs/SelectBox";
import { useTranslation } from "../../hooks/useTranslation";
import Button from "../../components/button/Button";
import Input from "../../components/inputs/Input";
import { useFinanceStore } from "../../store/store";
import {
  numberWithCommas,
  parseShamsiDate,
  removeCommas,
} from "../../utils/helper";

export default function TransactionForm() {
  const { addTransaction, selectedDate, defaultDate } = useFinanceStore();
  const DATE = selectedDate ? selectedDate : defaultDate;
  const PARSE_DATE = parseShamsiDate(DATE);
  const transactionOptions = ["income", "expense"];
  const { t } = useTranslation();
  const transactionForm = useForm();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = transactionForm;
  return (
    <form
      onSubmit={handleSubmit((data) => {
        const newTransaction = {
          amount: Number(removeCommas(data.amount)),
          type: data.type,
          description: data.description,
          date: DATE,
          labels: ["شارژ", "موبایل"],
        };
        addTransaction(
          String(PARSE_DATE.year),
          String(PARSE_DATE.month),
          String(PARSE_DATE.day),
          newTransaction
        );
        transactionForm.reset();
      })}
      className="pb-2 flex flex-col gap-2"
    >
      <Input
        value={numberWithCommas(watch("amount"))}
        inputMode="numeric"
        type="text"
        errorText={errors.amount?.message as string}
        label={t("transaction.amount")}
        onChange={(event) => {
          const raw = removeCommas(event.target.value);
          if (/^\d*\.?\d*$/.test(raw)) {
            setValue("amount", raw, { shouldValidate: true });
          }
        }}
      />
      <Input
        type="text"
        errorText={errors.amount?.message as string}
        label={t("transaction.description")}
        {...register("description")}
      />
      <SelectBox
        label={t("transaction.transactionType")}
        placeholder={t("transaction.choseOption")}
        options={transactionOptions}
        {...register("type", {
          required: `${t("transaction.transactionTypeRequired")}`,
        })}
        errorText={errors.type?.message as string}
        onChange={(value) => {
          setValue("type", value);
        }}
      />
      <Button className="w-full mt-2" type="submit">
        {t("dashboard.addTransaction")}
      </Button>
    </form>
  );
}
