import { useTranslation } from "../i18n/LanguageContext";

export default function ScoreBadge({ score, size = "md" }) {
  const { t } = useTranslation();
  const color = score >= 9.0 ? "#059669" : score >= 8.0 ? "#2563eb" : "#d97706";
  const bg = score >= 9.0 ? "#ecfdf5" : score >= 8.0 ? "#eff6ff" : "#fffbeb";
  const label =
    score >= 9.5
      ? t("score.excellent")
      : score >= 9.0
      ? t("score.great")
      : score >= 8.5
      ? t("score.veryGood")
      : t("score.good");
  const s = size === "lg" ? 52 : 40;
  const fs = size === "lg" ? 18 : 14;
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: s,
          height: s,
          borderRadius: 10,
          background: bg,
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 800,
            fontSize: fs,
            color,
          }}
        >
          {score}
        </span>
      </div>
      <span style={{ fontSize: size === "lg" ? 12 : 11, color, fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}
