import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_LANG, getLangConfig, isValidLang } from "./config";
import en from "./ui/en";

const LanguageContext = createContext();

const uiCache = { en };

async function loadUI(lang) {
  if (uiCache[lang]) return uiCache[lang];
  try {
    const mod = await import(`./ui/${lang}.js`);
    uiCache[lang] = mod.default;
    return mod.default;
  } catch {
    return {};
  }
}

const contentCache = {};

async function loadContent(lang) {
  if (lang === "en") return null;
  if (contentCache[lang]) return contentCache[lang];
  try {
    const mod = await import(`./content/${lang}.js`);
    contentCache[lang] = mod.default;
    return mod.default;
  } catch {
    return null;
  }
}

export function LanguageProvider({ lang = DEFAULT_LANG, children }) {
  const [uiStrings, setUiStrings] = useState(lang === "en" ? en : en);
  const [contentStrings, setContentStrings] = useState(null);
  const config = getLangConfig(lang);

  useEffect(() => {
    if (lang === "en") {
      setUiStrings(en);
      setContentStrings(null);
      return;
    }
    loadUI(lang).then((strings) => setUiStrings(strings));
    loadContent(lang).then((content) => setContentStrings(content));
  }, [lang]);

  const t = useCallback(
    (key, vars) => {
      let str = uiStrings[key] ?? en[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        });
      }
      return str;
    },
    [uiStrings]
  );

  const tc = useCallback(
    (brokerSlug, field) => {
      if (!contentStrings || !contentStrings[brokerSlug]) return null;
      const brokerContent = contentStrings[brokerSlug];
      if (field) return brokerContent[field] ?? null;
      return brokerContent;
    },
    [contentStrings]
  );

  return (
    <LanguageContext.Provider value={{ lang, config, t, tc }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) return { lang: DEFAULT_LANG, config: getLangConfig(DEFAULT_LANG), t: (k) => k, tc: () => null };
  return ctx;
}
