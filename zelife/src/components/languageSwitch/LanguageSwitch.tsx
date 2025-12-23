import { useFinanceStore } from "../../store/store";
import { MdOutlineTranslate } from "react-icons/md";

export default function LanguageSwitch({ className }: { className?: string }) {
  const { language, setLanguage } = useFinanceStore();
  const order = ["en", "fa", "ru", "de"];
  const nextLanguage = () => {
    const idx = order.indexOf(language);
    const next = idx === -1 ? "en" : order[(idx + 1) % order.length];
    setLanguage(next);
  };

  return (
    <div
      onClick={nextLanguage}
      className={`bg-background-secondary flex justify-center items-center h-10 w-10 p-3 text-primary border border-primary rounded-full ${
        className ? className : ""
      }`}
    >
      <MdOutlineTranslate className="size-4" />
    </div>
  );
}
