import { useForm } from "react-hook-form";
import SelectBox from "../../components/inputs/SelectBox";
import { useTranslation } from "../../hooks/useTranslation";

export default function TransactionForm() {
  const transactionOptions = ["income", "expense"];
  const { t } = useTranslation();
  const transactionForm = useForm();
  return (
    <form>
      <SelectBox
        label={t("transaction.transactionType")}
        placeholder={t("transaction.choseOption")}
        options={transactionOptions}
      />
    </form>
  );
}
