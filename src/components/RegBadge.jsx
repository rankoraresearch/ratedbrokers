import { Link } from "react-router-dom";
import { getRegulatorByName } from "../data/regulators";
import { useLocalePath } from "../i18n/useLocalePath";
import { Check } from "lucide-react";

export default function RegBadge({ reg }) {
  const lp = useLocalePath();
  const tier1 = ["FCA", "ASIC", "NFA", "FINMA", "BaFin", "CFTC", "MAS"];
  const isTier1 = tier1.includes(reg);
  const isFCA = reg === "FCA";
  const regData = getRegulatorByName(reg);

  const style = {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.5,
    background: isFCA ? "#dbeafe" : isTier1 ? "#ecfdf5" : "#f1f5f9",
    color: isFCA ? "#1e40af" : isTier1 ? "#059669" : "#64748b",
    border: `1px solid ${
      isFCA ? "#93c5fd" : isTier1 ? "#a7f3d0" : "#e2e8f0"
    }`,
    textDecoration: "none",
  };

  const content = <>{reg}{isFCA ? <Check size={10} style={{ marginLeft: 2, verticalAlign: "middle" }} /> : null}</>;

  if (!regData) return <span style={style}>{content}</span>;

  return <Link to={lp(`/regulator/${regData.slug}`)} style={style}>{content}</Link>;
}
