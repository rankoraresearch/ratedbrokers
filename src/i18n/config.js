export const LANGUAGES = [
  { code: "en", name: "English", flag: "\ud83c\uddec\ud83c\udde7", dir: "ltr" },
  // { code: "ru", name: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", flag: "\ud83c\uddf7\ud83c\uddfa", dir: "ltr" },
  // { code: "es", name: "Espa\u00f1ol", flag: "\ud83c\uddea\ud83c\uddf8", dir: "ltr" },
  // { code: "de", name: "Deutsch", flag: "\ud83c\udde9\ud83c\uddea", dir: "ltr" },
  // { code: "fr", name: "Fran\u00e7ais", flag: "\ud83c\uddeb\ud83c\uddf7", dir: "ltr" },
  // { code: "pt", name: "Portugu\u00eas", flag: "\ud83c\udde7\ud83c\uddf7", dir: "ltr" },
  // { code: "ar", name: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", flag: "\ud83c\uddf8\ud83c\udde6", dir: "rtl" },
  // { code: "zh", name: "\u4e2d\u6587", flag: "\ud83c\udde8\ud83c\uddf3", dir: "ltr" },
  // { code: "ja", name: "\u65e5\u672c\u8a9e", flag: "\ud83c\uddef\ud83c\uddf5", dir: "ltr" },
  // { code: "tr", name: "T\u00fcrk\u00e7e", flag: "\ud83c\uddf9\ud83c\uddf7", dir: "ltr" },
];

export const DEFAULT_LANG = "en";
export const LANG_CODES = LANGUAGES.map((l) => l.code);

export function getLangConfig(code) {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}

export function isValidLang(code) {
  return LANG_CODES.includes(code);
}
