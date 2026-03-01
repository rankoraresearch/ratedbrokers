import { useCallback } from "react";
import { useTranslation } from "./LanguageContext";
import { DEFAULT_LANG } from "./config";

export function useLocalePath() {
  const { lang } = useTranslation();

  const lp = useCallback(
    (path) => {
      if (lang === DEFAULT_LANG) return path;
      if (path === "/") return `/${lang}`;
      return `/${lang}${path}`;
    },
    [lang]
  );

  return lp;
}
