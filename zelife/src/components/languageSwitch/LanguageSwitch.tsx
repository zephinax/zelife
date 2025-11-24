import { useFinanceStore } from "../../store/store";
import { MdOutlineTranslate } from "react-icons/md";

export default function LanguageSwitch({ className }: { className?: string }) {
  const { language, setLanguage } = useFinanceStore();
  return (
    <div
      onClick={() => {
        setLanguage(language === "en" ? "fa" : "en");
      }}
      className={`bg-background-secondary flex justify-center items-center h-10 w-10 p-3 text-primary border border-primary rounded-full ${
        className ? className : ""
      }`}
    >
      {language === "en" ? <MdOutlineTranslate className="size-4" /> : "Fa"}
    </div>
  );
}
