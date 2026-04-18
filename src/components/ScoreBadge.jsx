import { useTranslation } from "../i18n/LanguageContext";

export default function ScoreBadge({ score, size = "md" }) {
  const { t } = useTranslation();
  const isExcellent = score >= 9.0;
  const color = isExcellent ? "#059669" : "#64748b";
  const grad = isExcellent
    ? "linear-gradient(135deg, #047857, #065f46)"
    : "linear-gradient(135deg, #475569, #334155)";
  const label =
    score >= 9.5
      ? t("score.excellent")
      : score >= 9.0
      ? t("score.great")
      : score >= 8.5
      ? t("score.veryGood")
      : t("score.good");
  const w = size === "lg" ? 52 : 44;
  const h = size === "lg" ? 40 : 34;
  const fs = size === "lg" ? 16 : 14;
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: w,
          height: h,
          borderRadius: 10,
          background: grad,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          marginBottom: 2,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontWeight: 800,
            fontSize: fs,
            color: "#fff",
          }}
        >
          {score}
        </span>
      </div>
      <span style={{ fontSize: size === "lg" ? 12 : 10, color, fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}
