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
      className="w-full lg:mr-20 p-4 rounded-3xl z-30 bg-background-secondary max-w-[500px]"
    >
      <div className="p-2">
        <Title>{t("auth.wellcome")}</Title>
        <SubTitle>{t("auth.signInToYourAccount")}</SubTitle>
      </div>
      <div className="flex flex-col gap-4 mt-5">
        <Input label={t("auth.email")} />
        <Input type="password" label={t("auth.password")} />
      </div>
      <div className="flex my-4 mx-1.5 items-center ">
        <Checkbox onChange={() => {}} />
        <Paragraph>{t("auth.remeberMe")}</Paragraph>
      </div>
      <Button type="submit" className="w-full mt-2">
        {t("auth.signIn")}
      </Button>
      <div className="w-full flex items-center gap-2 my-2">
        <div className="h-[1px] w-full rounded-full bg-accent/20 mt-2"></div>
        <div className="text-accent">or</div>
        <div className="h-[1px] w-full rounded-full bg-accent/20 mt-2"></div>
      </div>
      <div className="flex text-center items-center justify-center gap-1">
        <Paragraph>Don’t have an account?</Paragraph>
        <a className="text-accent " href="#">
          <Paragraph className="!text-accent">Sign up</Paragraph>
        </a>
      </div>
    </form>
  );
}
