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
import Paragraph from "../../components/typography/Paragraph";

export default function TransactionForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
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
        onSuccess && onSuccess();
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
        {...register("amount", {
          required: `${t("transaction.amountRequired")}`,
          validate: (value) => {
            const numericValue = Number(removeCommas(value));
            if (isNaN(numericValue)) {
              return t("transaction.amountInvalid");
            }
            if (numericValue <= 0) {
              return t("transaction.amountMustBePositive");
            }
            return true;
          },
        })}
        onChange={(event) => {
          const raw = removeCommas(event.target.value);
          if (/^\d*\.?\d*$/.test(raw)) {
            setValue("amount", raw, { shouldValidate: true });
          }
        }}
      />

      <Input
        type="text"
        errorText={errors.description?.message as string}
        label={t("transaction.description")}
        {...register("description")}
      />
      <Input
        hidden
        {...register("type", {
          required: `${t("transaction.transactionTypeRequired")}`,
        })}
      />
      <div className="w-full flex flex-col gap-2">
        <div className="flex justify-evenly gap-2">
          {transactionOptions.map((item) => {
            return (
              <div
                onClick={() => {
                  setValue("type", item);
                }}
                className={`bg-background flex-1 justify-center items-center text-center border border-primary  text-text py-1 px-4 rounded-full text-[14px] ${
                  watch("type") === item
                    ? `${
                        watch("type") === "income"
                          ? "bg-green-500/40 !border-green-500"
                          : "bg-red-500/40 !border-red-500"
                      }`
                    : ""
                }`}
              >
                <span className="">{t(`transaction.${item}`)}</span>
              </div>
            );
          })}
        </div>
        {errors.type?.message && (
          <Paragraph theme="error">{errors.type?.message as string}</Paragraph>
        )}
      </div>
      <Button className="w-full mt-2" type="submit">
        {t("dashboard.addTransaction")}
      </Button>
    </form>
  );
}
