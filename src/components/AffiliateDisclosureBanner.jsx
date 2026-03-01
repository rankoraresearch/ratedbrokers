import { Link } from "react-router-dom";
import { useLocalePath } from "../i18n/useLocalePath";
import { useTranslation } from "../i18n/LanguageContext";

export default function AffiliateDisclosureBanner({ crypto }) {
  const lp = useLocalePath();
  const { t } = useTranslation();

  return (
    <div style={{
      padding: "16px 20px", borderRadius: 12,
      background: "#f8fafc", border: "1px solid #f1f5f9",
      display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 4,
    }}>
      <p style={{ fontSize: 11, lineHeight: 1.7, color: "#94a3b8", margin: 0 }}>
        <strong>{t("disclosure.label")}</strong>{" "}
        {t("disclosure.text")}{crypto ? " " + t("disclosure.crypto") : ""}{" "}
        <Link to={lp("/how-we-make-money")} style={{
          color: "#059669", fontWeight: 600, textDecoration: "none",
          fontSize: 11,
        }}>{t("disclosure.link")}</Link>
      </p>
    </div>
  );
}
