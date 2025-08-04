import LanguageSwitch from "../../components/languageSwitch/LanguageSwitch";
import Silk from "../../components/react-bits/Silk";
import Paragraph from "../../components/typography/Paragraph";
import Title from "../../components/typography/Title";
import { useTranslation } from "../../hooks/useTranslation";
import { useFinanceStore } from "../../store/store";
import CreateAccountForm from "./CreateAccountForm";

export default function Auth() {
  const { t } = useTranslation();
  const { language } = useFinanceStore();
  return (
    <div className="w-screen h-screen bg-accent/10 lg:bg-background relative p-2 px-4 gap-10 lg:gap-20 flex justify-center items-center">
      <div
        style={{
          maskImage: "url('/img/mask.webp')",
          WebkitMaskImage: "url('/img/mask.webp')",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "contain",
          WebkitMaskSize: "contain",
        }}
        className="flex-1 h-[85vh] absolute top-[-30%] w-full lg:static flex items-center justify-center"
      >
        <Silk
          speed={5}
          scale={1}
          color="#d24670"
          noiseIntensity={1.5}
          rotation={0}
        />
        <Title
          className={`absolute text-4xl top-[35vh] lg:top-[10vh] !text-white max-w-[280px] ${
            language === "fa"
              ? "right-[6vw] sm:right-[18vw] md:right-[24vw] lg:right-[8vw]"
              : "left-[6vw] sm:left-[18vw] md:left-[24vw] lg:left-[8vw] leading-12"
          }`}
        >
          {t("auth.startJourney")}
        </Title>
      </div>
      <div className=" flex-1 flex items-center justify-center">
        <CreateAccountForm />
      </div>
      <LanguageSwitch className="fixed bottom-4 left-4" />
      <Paragraph className="fixed bottom-4 right-4 !text-primary">
        Zlife – Take Control of Your Life
      </Paragraph>
    </div>
  );
}
