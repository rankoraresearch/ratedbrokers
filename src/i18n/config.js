export const LANGUAGES = [
  { code: "en", name: "English", countryCode: "GB", dir: "ltr" },
  // { code: "ru", name: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", countryCode: "RU", dir: "ltr" },
  // { code: "es", name: "Espa\u00f1ol", countryCode: "ES", dir: "ltr" },
  // { code: "de", name: "Deutsch", countryCode: "DE", dir: "ltr" },
  // { code: "fr", name: "Fran\u00e7ais", countryCode: "FR", dir: "ltr" },
  // { code: "pt", name: "Portugu\u00eas", countryCode: "BR", dir: "ltr" },
  // { code: "ar", name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", countryCode: "SA", dir: "rtl" },
  // { code: "zh", name: "\u4e2d\u6587", countryCode: "CN", dir: "ltr" },
  // { code: "ja", name: "\u65e5\u672c\u8a9e", countryCode: "JP", dir: "ltr" },
  // { code: "tr", name: "T\u00fcrk\u00e7e", countryCode: "TR", dir: "ltr" },
];

export const DEFAULT_LANG = "en";
export const LANG_CODES = LANGUAGES.map((l) => l.code);

export function getLangConfig(code) {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

export function isValidLang(code) {
  return LANG_CODES.includes(code);
}
