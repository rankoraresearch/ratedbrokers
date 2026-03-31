import quotex from "./quotex";

const ALL_WARNINGS = [quotex];

const WARNING_MAP = {};
ALL_WARNINGS.forEach((w) => { WARNING_MAP[w.slug] = w; });

export function getWarningData(slug) {
  return WARNING_MAP[slug] || null;
}

export function getAllWarnings() {
  return ALL_WARNINGS;
}
