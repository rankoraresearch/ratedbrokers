import { Link } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { getAllCountries } from "../data/countries/index";
import { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import Icon, { ArrowRight } from "../components/Icon";
import { Globe, Star } from "lucide-react";
import CountryFlag from "../components/CountryFlag";

function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

const REGIONS = {
  "Featured": ["uk", "australia", "usa", "germany", "singapore", "uae", "canada", "south-africa"],
  "Europe": ["uk", "germany", "france", "netherlands", "italy", "spain", "sweden", "switzerland", "poland", "cyprus", "ireland", "austria", "greece", "romania", "czech-republic"],
  "Asia-Pacific": ["australia", "singapore", "new-zealand", "japan", "india", "indonesia", "malaysia", "thailand", "philippines", "hong-kong"],
  "Middle East & Africa": ["uae", "saudi-arabia", "bahrain", "israel", "south-africa", "kenya", "nigeria", "ghana"],
  "Americas": ["usa", "canada", "brazil", "mexico", "argentina", "colombia", "chile"],
  "Eastern Europe": ["turkey", "russia", "ukraine"],
};

export default function CountryHubPage() {
  const { mob, tab } = useMedia();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const allCountries = getAllCountries();
  const countryMap = {};
  allCountries.forEach(c => { countryMap[c.slug] = c; });

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const featured = REGIONS["Featured"].map(s => countryMap[s]).filter(Boolean);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#1e293b", minHeight: "100vh" }}>

      {/* ===== BREADCRUMBS ===== */}
      <div style={{ ...cn, padding: mob ? "12px 16px" : "16px 24px" }}>
        <Breadcrumb items={[
          { label: t("nav.home"), path: "/" },
          { label: "Best Forex Brokers by Country" },
        ]} />
      </div>

      {/* ===== HERO ===== */}
      <section style={{
        ...cn, paddingBottom: mob ? 24 : 40,
      }}>
        <div style={{
          borderRadius: mob ? 14 : 20, padding: mob ? "32px 20px" : "48px 48px",
          background: "linear-gradient(135deg,#1e3a5f 0%,#2d5a8e 100%)",
          textAlign: "center", marginBottom: mob ? 24 : 40,
        }}>
          <span style={{ display: "block", marginBottom: 12 }}><Globe size={mob ? 36 : 52} color="#fff" /></span>
          <h1 style={{
            fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 26 : tab ? 32 : 40,
            color: "#fff", margin: "0 0 12px", lineHeight: 1.15,
          }}>
            Best Forex Brokers by Country {"\u2014"} 2026 Rankings
          </h1>
          <p style={{
            fontSize: mob ? 15 : 17, color: "rgba(255,255,255,0.75)",
            maxWidth: 560, margin: "0 auto 20px", lineHeight: 1.6,
          }}>
            We test brokers in {allCountries.length}+ countries with real money accounts. Find the best regulated forex broker for your location.
          </p>
          <div style={{
            display: "flex", justifyContent: "center", gap: mob ? 16 : 32,
            flexWrap: "wrap",
          }}>
            {[
              [allCountries.length + "+", "Countries"],
              ["54", "Brokers Tested"],
              ["500+", "Hours Research"],
            ].map(([val, label], i) => (
              <div key={i}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#34d399" }}>{val}</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FEATURED COUNTRIES ===== */}
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 16 }}>
          <Star size={20} color="#f59e0b" fill="#f59e0b" style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />Top Regulated Forex Markets
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr 1fr" : tab ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
          gap: mob ? 10 : 14,
          marginBottom: mob ? 32 : 48,
        }}>
          {featured.map(c => (
            <Link key={c.slug} to={lp(`/best-forex-brokers-${c.slug}`)} style={{
              background: "#fff", borderRadius: 14, padding: mob ? "16px 14px" : "20px",
              border: "1px solid #e2e8f0", textDecoration: "none", color: "#1e293b",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}>
              <div style={{ marginBottom: 8 }}><CountryFlag code={c.code} size={mob ? 28 : 36} /></div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 14 : 16, marginBottom: 4, lineHeight: 1.3 }}>
                Best Forex Brokers in {c.name}
              </div>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                {c.regulator}-regulated {"\u2022"} {c.brokersCount} brokers tested
              </div>
            </Link>
          ))}
        </div>

        {/* ===== BY REGION ===== */}
        {Object.entries(REGIONS).filter(([r]) => r !== "Featured").map(([region, slugs]) => {
          const countries = slugs.map(s => countryMap[s]).filter(Boolean);
          if (countries.length === 0) return null;
          return (
            <div key={region} style={{ marginBottom: mob ? 28 : 40 }}>
              <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 14 }}>
                Best Forex Brokers in {region}
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : tab ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                gap: mob ? 8 : 10,
              }}>
                {countries.map(c => (
                  <Link key={c.slug} to={lp(`/best-forex-brokers-${c.slug}`)} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: mob ? "10px 12px" : "12px 14px", borderRadius: 10,
                    background: "#fff", border: "1px solid #e2e8f0", textDecoration: "none", color: "#1e293b",
                  }}>
                    <CountryFlag code={c.code} size={mob ? 20 : 24} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: mob ? 13 : 14 }}>Best Forex Brokers in {c.name}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{c.regulator}-regulated {"\u2022"} {c.brokersCount} brokers</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ===== CTA ===== */}
      <section style={{ ...cn, paddingBottom: 48 }}>
        <div style={{
          borderRadius: mob ? 14 : 20, padding: mob ? "24px 16px" : "36px 48px",
          background: "#fff", border: "1px solid #e2e8f0", textAlign: "center",
        }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 24, marginBottom: 8 }}>
            Can't Find Your Country?
          </h2>
          <p style={{ fontSize: mob ? 14 : 16, color: "#64748b", marginBottom: 20, maxWidth: 480, margin: "0 auto 20px" }}>
            Check our global broker rankings or compare any of our 54 tested brokers head-to-head.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link to={lp("/rankings")} style={{
              padding: "12px 24px", borderRadius: 10,
              background: "linear-gradient(135deg,#059669,#34d399)",
              color: "#fff", fontWeight: 700, fontSize: 15, textDecoration: "none",
            }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>View All Broker Rankings <ArrowRight size={16} /></span></Link>
            <Link to={lp("/compare")} style={{
              padding: "12px 24px", borderRadius: 10,
              background: "#f1f5f9", color: "#1e293b",
              fontWeight: 700, fontSize: 15, textDecoration: "none",
            }}>Compare Forex Brokers</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
