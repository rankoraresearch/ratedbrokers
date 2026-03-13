import { useState } from "react";
import { Link } from "react-router-dom";
import CountryFlag from "./CountryFlag";
import { useMedia } from "../hooks/useMedia";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import {
  ArrowRight,
  Shield,
  FlaskConical,
  CalendarCheck,
  AlertTriangle,
  Info,
} from "lucide-react";

/* ── Data arrays (outside component for perf) ── */

const FOOTER_RANKINGS = [
  { label: "Best Forex Brokers", path: "/best-forex-brokers" },
  { label: "Best Brokers for Beginners", path: "/best-forex-brokers-for-beginners" },
  { label: "Best Brokers for Scalping", path: "/best-forex-brokers-for-scalping" },
  { label: "Best Brokers for Day Trading", path: "/best-forex-brokers-for-day-trading" },
  { label: "Lowest Spread Forex Brokers", path: "/lowest-spread-forex-brokers" },
  { label: "Best ECN Forex Brokers", path: "/best-ecn-forex-brokers" },
  { label: "Best High Leverage Brokers", path: "/best-high-leverage-forex-brokers" },
  { label: "Best Copy Trading Platforms", path: "/best-copy-trading-platforms" },
  { label: "Best Forex Trading Apps", path: "/best-forex-trading-apps" },
  { label: "Best CFD Brokers", path: "/best-cfd-brokers" },
];

const FOOTER_REVIEWS = [
  { label: "IC Markets Review", path: "/review/ic-markets" },
  { label: "Pepperstone Review", path: "/review/pepperstone" },
  { label: "IG Review", path: "/review/ig" },
  { label: "FP Markets Review", path: "/review/fp-markets" },
  { label: "CMC Markets Review", path: "/review/cmc-markets" },
  { label: "Exness Review", path: "/review/exness" },
  { label: "XTB Review", path: "/review/xtb" },
  { label: "eToro Review", path: "/review/etoro" },
  { label: "Saxo Bank Review", path: "/review/saxo-bank" },
  { label: "Interactive Brokers Review", path: "/review/interactive-brokers" },
];

const FOOTER_GUIDES = [
  { label: "What Is Forex Trading?", path: "/guide/what-is-forex-trading" },
  { label: "How to Start Forex Trading", path: "/guide/how-to-start-forex-trading" },
  { label: "How to Choose a Broker", path: "/guide/how-to-choose-a-forex-broker" },
  { label: "Spreads & Fees Explained", path: "/guide/understanding-spreads-and-fees" },
  { label: "ECN vs Market Maker", path: "/guide/ecn-vs-market-maker" },
  { label: "Forex Regulation Guide", path: "/guide/forex-regulation-guide" },
  { label: "Risk Management Guide", path: "/guide/risk-management-guide" },
  { label: "Day Trading Guide", path: "/guide/day-trading-guide" },
];

const FOOTER_PLATFORMS = [
  { label: "MetaTrader 4 Guide", path: "/platform/metatrader-4" },
  { label: "MetaTrader 5 Guide", path: "/platform/metatrader-5" },
  { label: "cTrader Guide", path: "/platform/ctrader" },
  { label: "TradingView Guide", path: "/platform/tradingview" },
  { label: "MT4 vs MT5", path: "/guide/mt4-vs-mt5" },
  { label: "Best MT4 Brokers", path: "/best-metatrader-4-brokers" },
  { label: "Best MT5 Brokers", path: "/best-metatrader-5-brokers" },
  { label: "Best TradingView Brokers", path: "/best-tradingview-brokers" },
];

const FOOTER_COUNTRIES = [
  { code: "GB", label: "UK", path: "/best-forex-brokers-uk" },
  { code: "AU", label: "Australia", path: "/best-forex-brokers-australia" },
  { code: "US", label: "USA", path: "/best-forex-brokers-usa" },
  { code: "AE", label: "UAE", path: "/best-forex-brokers-uae" },
  { code: "DE", label: "Germany", path: "/best-forex-brokers-germany" },
  { code: "SG", label: "Singapore", path: "/best-forex-brokers-singapore" },
  { code: "CA", label: "Canada", path: "/best-forex-brokers-canada" },
  { code: "ZA", label: "South Africa", path: "/best-forex-brokers-south-africa" },
  { code: "IN", label: "India", path: "/best-forex-brokers-india" },
  { code: "JP", label: "Japan", path: "/best-forex-brokers-japan" },
];

const FOOTER_COMPANY = [
  { label: "methodology", path: "/methodology", isLink: true },
  { label: "trustScore", path: "/trust-score", isLink: true },
  { label: "howWeMakeMoney", path: "/how-we-make-money", isLink: true },
  { label: "allRankings", path: "/best-forex-brokers", isLink: true },
  { label: "aboutUs", path: "/about", isLink: true },
  { label: "contact", path: "/contact", isLink: true },
  { label: "privacy", path: "#", isLink: false },
  { label: "terms", path: "#", isLink: false },
];

/* ── Styles ── */

const sectionHeadingStyle = {
  fontFamily: "Inter, sans-serif",
  fontWeight: 700,
  fontSize: 13,
  color: "#e2e8f0",
  marginBottom: 12,
  textTransform: "uppercase",
  letterSpacing: 1,
};

const baseLinkStyle = {
  fontSize: 15,
  color: "#94a3b8",
  textDecoration: "none",
  display: "block",
  padding: "4px 0",
  transition: "color 0.2s",
};

/* ── Hoverable link wrapper ── */

function HoverLink({ to, href, children, style, ...rest }) {
  const [hovered, setHovered] = useState(false);
  const merged = { ...baseLinkStyle, ...style, color: hovered ? "#34d399" : (style?.color || baseLinkStyle.color) };

  if (href) {
    return (
      <a
        href={href}
        style={merged}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      style={merged}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {children}
    </Link>
  );
}

/* ── Footer Component ── */

export default function Footer() {
  const { mob } = useMedia();
  const { t } = useTranslation();
  const lp = useLocalePath();

  const tablet = typeof window !== "undefined" && window.innerWidth >= 640 && window.innerWidth < 1024;
  const isMobile = mob && !tablet;

  const arrowIcon = <ArrowRight size={12} style={{ verticalAlign: "middle", marginLeft: 4 }} />;

  return (
    <footer style={{ background: "#0f172a", padding: isMobile ? "40px 16px" : "60px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ── ROW 1: Main link grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr 1fr"
              : tablet
                ? "1fr 1fr 1fr"
                : "2fr 1.5fr 1.5fr 1fr 1.5fr 1fr",
            gap: isMobile ? 24 : 40,
            marginBottom: 40,
          }}
        >
          {/* A. Brand + Trust Stats */}
          <div style={{ gridColumn: isMobile ? "1 / -1" : tablet ? "1 / -1" : "auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", marginBottom: 12 }}>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: 18, color: "#fff", letterSpacing: "-1px" }}>rated</span>
              <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: 18, color: "#34d399", letterSpacing: "-1px" }}>brokers</span>
              <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#fbbf24", marginLeft: 2, marginBottom: 1 }} />
            </div>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 280, marginBottom: 16 }}>
              {t("footer.desc")}
            </p>

            {/* Trust stats */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
              {[
                { Icon: Shield, text: "36 Brokers Tested" },
                { Icon: FlaskConical, text: "500+ Real Trades" },
                { Icon: CalendarCheck, text: "Updated Q1 2026" },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon size={14} color="#34d399" />
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{text}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "#64748b", fontStyle: "italic", margin: 0 }}>
              Independent & Expert-Led Reviews
            </p>
          </div>

          {/* B. Popular Rankings */}
          <div>
            <div style={sectionHeadingStyle}>{t("footer.popularRankings")}</div>
            {FOOTER_RANKINGS.map(({ label, path }) => (
              <HoverLink key={path} to={lp(path)}>{label}</HoverLink>
            ))}
            <HoverLink to={lp("/best-forex-brokers")} style={{ color: "#34d399", fontWeight: 600, marginTop: 4 }}>
              {t("footer.allRankings")} {arrowIcon}
            </HoverLink>
          </div>

          {/* C. Top Broker Reviews */}
          <div>
            <div style={sectionHeadingStyle}>{t("footer.topBrokerReviews")}</div>
            {FOOTER_REVIEWS.map(({ label, path }) => (
              <HoverLink key={path} to={lp(path)}>{label}</HoverLink>
            ))}
            <HoverLink to={lp("/compare")} style={{ color: "#34d399", fontWeight: 600, marginTop: 4 }}>
              {t("footer.compareBrokers")} {arrowIcon}
            </HoverLink>
          </div>

          {/* D. Trading Guides */}
          <div>
            <div style={sectionHeadingStyle}>{t("footer.tradingGuides")}</div>
            {FOOTER_GUIDES.map(({ label, path }) => (
              <HoverLink key={path} to={lp(path)}>{label}</HoverLink>
            ))}
            <HoverLink to={lp("/guides")} style={{ color: "#34d399", fontWeight: 600, marginTop: 4 }}>
              {t("footer.allGuides")} {arrowIcon}
            </HoverLink>
          </div>

          {/* E. Countries */}
          <div>
            <div style={sectionHeadingStyle}>{t("footer.countries")}</div>
            {FOOTER_COUNTRIES.map(({ code, label, path }) => (
              <HoverLink key={path} to={lp(path)}>
                <CountryFlag code={code} size={15} /><span style={{ marginLeft: 6 }}>{label}</span>
              </HoverLink>
            ))}
            <HoverLink to={lp("/best-forex-brokers-by-country")} style={{ color: "#34d399", fontWeight: 600, marginTop: 4 }}>
              {t("footer.allCountries")} {arrowIcon}
            </HoverLink>
          </div>

          {/* F. Company */}
          <div>
            <div style={sectionHeadingStyle}>{t("footer.company")}</div>
            {FOOTER_COMPANY.map(({ label, path, isLink }) =>
              isLink ? (
                <HoverLink key={label} to={lp(path)}>
                  {t(`footer.${label}`)}
                </HoverLink>
              ) : (
                <HoverLink key={label} href={path}>
                  {t(`footer.${label}`)}
                </HoverLink>
              )
            )}
          </div>
        </div>

        {/* ── ROW 2: Platforms bar ── */}
        <div
          style={{
            borderTop: "1px solid #1e293b",
            borderBottom: "1px solid #1e293b",
            padding: "16px 0",
            marginBottom: 32,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: isMobile ? 8 : 4,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", textTransform: "uppercase", letterSpacing: 1, marginRight: 8 }}>
            {t("footer.platforms")}:
          </span>
          {FOOTER_PLATFORMS.map(({ label, path }, i) => (
            <span key={path} style={{ display: "inline-flex", alignItems: "center" }}>
              <HoverLink to={lp(path)} style={{ fontSize: 14, display: "inline", padding: 0 }}>
                {label}
              </HoverLink>
              {i < FOOTER_PLATFORMS.length - 1 && (
                <span style={{ color: "#334155", margin: "0 8px", fontSize: 14 }}>&middot;</span>
              )}
            </span>
          ))}
        </div>

        {/* ── ROW 3: Risk Warning + Affiliate Disclosure ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: 20,
            marginBottom: 32,
          }}
        >
          {/* Risk Warning */}
          <div
            style={{
              borderLeft: "3px solid #f59e0b",
              background: "rgba(245,158,11,0.04)",
              padding: "16px 20px",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <AlertTriangle size={14} color="#f59e0b" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {t("footer.riskTitle")}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
              CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. Between{" "}
              <strong style={{ color: "#94a3b8" }}>62% and 82%</strong>{" "}
              of retail investor accounts lose money when trading CFDs. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
            </p>
          </div>

          {/* Affiliate Disclosure */}
          <div
            style={{
              borderLeft: "3px solid #3b82f6",
              background: "rgba(59,130,246,0.03)",
              padding: "16px 20px",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Info size={14} color="#3b82f6" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {t("footer.affTitle")}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: 0 }}>
              {t("footer.affText")}
            </p>
          </div>
        </div>

        {/* ── ROW 4: Copyright + trust tagline ── */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "baseline",
            gap: 8,
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <span style={{ fontSize: 13, color: "#475569" }}>
            {t("footer.copy")}
          </span>
          <span style={{ fontSize: 13, color: "#475569" }}>
            36 brokers independently researched and expert-scored
          </span>
        </div>
      </div>
    </footer>
  );
}
