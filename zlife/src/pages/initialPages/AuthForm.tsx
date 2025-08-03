import { useForm } from "react-hook-form";
import Button from "../../components/button/Button";

import Input from "../../components/inputs/Input";
import SubTitle from "../../components/typography/SubTitle";
import Title from "../../components/typography/Title";
import { useTranslation } from "../../hooks/useTranslation";
import Checkbox from "../../components/inputs/CheckBox";
import Paragraph from "../../components/typography/Paragraph";

export default function AuthForm() {
  const { t } = useTranslation();
  const form = useForm();
  const {} = form;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="w-full lg:mr-20 p-6 lg:p-8 rounded-3xl z-30 bg-background-secondary max-w-[500px]"
    >
      <div className="p-2">
        <Title>{t("auth.wellcome")}</Title>
        <SubTitle>{t("auth.createYourAccount")}</SubTitle>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <Input label={t("auth.userName")} />
      </div>
      <Button type="submit" className="w-full mt-8">
        {t("auth.createAccount")}
      </Button>
    </form>
  );
}
