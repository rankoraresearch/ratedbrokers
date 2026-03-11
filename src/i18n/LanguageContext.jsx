import en from "./ui/en";

function t(key, vars) {
  let str = en[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
    });
  }
  return str;
}

const value = { lang: "en", t, tc: () => null };

export function useTranslation() {
  return value;
}

export function LanguageProvider({ children }) {
  return children;
}
