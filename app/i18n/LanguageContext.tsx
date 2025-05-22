// app/i18n/LanguageContext.tsx
import React, { createContext, useContext, useState } from "react";
import { setLocale, t, i18n } from "./config";   // 👈 добавили i18n

type Lang = "en" | "uk";

interface LanguageContextProps {
  lang: Lang;
  changeLang: (l: Lang) => void;
  t: typeof t;
}

const LanguageContext = createContext<LanguageContextProps | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // определяем стартовый язык во время первого рендера
  const initialLang: Lang = i18n.locale.startsWith("uk") ? "uk" : "en";
  const [lang, setLang] = useState<Lang>(initialLang);

  const changeLang = (l: Lang) => {
    setLang(l);
    setLocale(l);          // меняем язык в i18n
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
