import { useState } from "react";
import { Link } from "react-router-dom";
import { getRegulatorByName } from "../data/regulators";
import { useLocalePath } from "../i18n/useLocalePath";
import { Check } from "lucide-react";

export default function RegBadge({ reg, onDark = false }) {
  const lp = useLocalePath();
  const [imgErr, setImgErr] = useState(false);
  const tier1 = ["FCA", "ASIC", "NFA", "FINMA", "BaFin", "CFTC", "MAS"];
  const isTier1 = tier1.includes(reg);
  const isFCA = reg === "FCA";
  const regData = getRegulatorByName(reg);

  const style = onDark ? {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
    background: isFCA ? "rgba(59,130,246,0.2)" : isTier1 ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.1)",
    color: isFCA ? "#93c5fd" : isTier1 ? "#6ee7b7" : "rgba(255,255,255,0.7)",
    border: `1px solid ${
      isFCA ? "rgba(147,197,253,0.3)" : isTier1 ? "rgba(110,231,183,0.3)" : "rgba(255,255,255,0.15)"
    }`,
    textDecoration: "none",
  } : {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
    background: isFCA ? "#dbeafe" : isTier1 ? "#ecfdf5" : "#f1f5f9",
    color: isFCA ? "#1e40af" : isTier1 ? "#059669" : "#1f2937",
    border: `1px solid ${
      isFCA ? "#93c5fd" : isTier1 ? "#a7f3d0" : "#e2e8f0"
    }`,
    textDecoration: "none",
  };

  const logoSize = 14;
  const logoSlug = regData?.slug;
  const showLogo = logoSlug && !imgErr;

  const content = (
    <>
      {showLogo && (
        <img
          src={`${import.meta.env.BASE_URL}regulators/${logoSlug}.svg`}
          alt=""
          width={logoSize}
          height={logoSize}
          loading="lazy"
          onError={() => setImgErr(true)}
          style={{ width: logoSize, height: logoSize, borderRadius: 2, flexShrink: 0, objectFit: "contain" }}
        />
      )}
      {reg}
      {isFCA ? <Check size={10} style={{ marginLeft: 1, verticalAlign: "middle" }} /> : null}
    </>
  );

  if (!regData) return <span style={style}>{content}</span>;

  return <Link to={lp(`/regulator/${regData.slug}`)} style={style}>{content}</Link>;
}
