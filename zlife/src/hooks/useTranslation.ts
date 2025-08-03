import { useEffect, useState } from "react";
import { useFinanceStore } from "../store/store";

const translations = import.meta.glob("../locales/*.json", { eager: true });

type Messages = {
  [key: string]: string | Messages;
};

function getValueByPath(obj: Messages, path: string): string | undefined {
  return path.split(".").reduce<string | Messages | undefined>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj) as string | undefined;
}

export const useTranslation = () => {
  const { language } = useFinanceStore();
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    const load = async () => {
      const path = `../locales/${language}.json`;
      const file = translations[path] as { default: Messages };
      setMessages(file?.default || {});
    };

    load();
  }, [language]);

  const t = (key: string): string => {
    const value = getValueByPath(messages, key);
    return typeof value === "string" ? value : key;
  };

  return { t };
};
