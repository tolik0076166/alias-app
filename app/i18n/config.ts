import * as Localization from "expo-localization";
import { I18n } from "i18n-js";          // <-- именованный импорт

import en from "./locales/en.json";
import uk from "./locales/uk.json";

// 1️⃣ создаём экземпляр
const i18n = new I18n({
  en,
  uk,
});

// 2️⃣ настраиваем
i18n.defaultLocale = "en";
i18n.enableFallback = true;
i18n.locale = Localization.locale;  // пример: "en-US" или "uk-UA"

// 3️⃣ экспорт удобных обёрток
export const t = (
  key: string,
  options: Parameters<I18n["t"]>[1] = {}
) => i18n.t(key, options);

export const setLocale = (locale: "en" | "uk") => {
  i18n.locale = locale;
};

export { i18n };                    // если где‑то нужен сам экземпляр
