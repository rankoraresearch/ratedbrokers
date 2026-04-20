import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Globe, Shield } from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { useSEO } from "../hooks/useSEO";
import { useLocalePath } from "../i18n/useLocalePath";
import Breadcrumb, { breadcrumbSchema } from "../components/Breadcrumb";
import CountryFlag from "../components/CountryFlag";
import { getAllBrokersWithData } from "../data/brokers";
import {
  COUNTRY_VERTICALS,
  VERTICAL_META,
  getFeaturedCountries,
  getCountriesByRegion,
} from "../data/countryVerticals";

const REGION_ORDER = ["Europe", "Asia-Pacific", "Middle East & Africa", "Americas", "Eastern Europe"];

function VerticalChips({ verticals, country, lp, compact = false }) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: compact ? 4 : 6, alignItems: "center",
      width: "100%",
    }}>
      {verticals.map((v) => {
        const meta = VERTICAL_META[v.key];
        if (!meta) return null;
        return (
          <Link
            key={v.key}
            to={lp(v.path)}
            className="rb-link-rail"
            title={`${meta.label} ${meta.word} in ${country.name}`}
            style={{ fontSize: compact ? 12 : 13 }}
          >
            <span className="rb-dot" style={{ background: meta.color }} />
            {meta.label}
          </Link>
        );
      })}
    </div>
  );
}

function FeaturedCard({ country, lp, mob }) {
  const primaryPath = country.verticals[0]?.path;
  return (
    <div
      style={{
        display: "flex", flexDirection: "column",
        minHeight: mob ? "auto" : 180,
        borderRadius: 14, overflow: "hidden",
        background: "#fff", border: "1px solid #e8ecf1",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04)",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#cbd5e1";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e8ecf1";
        e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04)";
      }}
    >
      {/* Top: flag + name + regulator */}
      <Link
        to={primaryPath ? lp(primaryPath) : "#"}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: mob ? "16px 16px 0" : "18px 18px 0",
          textDecoration: "none", color: "inherit",
        }}
      >
        <CountryFlag code={country.code} size={mob ? 32 : 40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 700,
            fontSize: mob ? 16 : 18, color: "#0f172a", lineHeight: 1.2,
          }}>{country.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{
              display: "inline-block",
              padding: "2px 8px", borderRadius: 6,
              background: "#0f172a", color: "#fff",
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
            }}>{country.regulator}</span>
            <span style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 600 }}>
              {country.verticals.length} {country.verticals.length === 1 ? "vertical" : "verticals"}
            </span>
          </div>
        </div>
        <ArrowRight size={16} color="#cbd5e1" style={{ flexShrink: 0 }} />
      </Link>

      <div style={{ height: 1, background: "#f0f4f8", margin: mob ? "12px 16px 0" : "14px 18px 0" }} />

      <div style={{
        padding: mob ? "12px 14px 16px" : "12px 16px 16px",
        marginTop: "auto",
      }}>
        <VerticalChips verticals={country.verticals} country={country} lp={lp} />
      </div>
    </div>
  );
}

function RegionRow({ country, lp }) {
  const primaryPath = country.verticals[0]?.path;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px", borderRadius: 10,
        background: "#fff", border: "1px solid #e8ecf1",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#cbd5e1";
        e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e8ecf1";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <CountryFlag code={country.code} size={24} />
      <Link
        to={primaryPath ? lp(primaryPath) : "#"}
        style={{
          fontFamily: "'Outfit',sans-serif", fontWeight: 700,
          fontSize: 14, color: "#0f172a",
          textDecoration: "none", flexShrink: 0, minWidth: 120,
        }}
      >
        {country.name}
      </Link>
      <span style={{
        fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700,
        color: "#64748b", whiteSpace: "nowrap",
      }}>
        {country.regulator}
      </span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", justifyContent: "flex-end" }}>
        <VerticalChips verticals={country.verticals} country={country} lp={lp} compact />
      </div>
    </div>
  );
}

export default function OnlineBrokersByCountry() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();

  useSEO({
    title: "Online Brokers by Country — 2026 Rankings",
    description:
      "Find regulated brokers licensed by your country's financial authority. " +
      "Covers forex, CFD, stocks, options, futures, crypto, copy trading, and spread betting across 40+ countries.",
    path: "/brokers-by-country",
  });

  const featured = getFeaturedCountries();
  const regions = useMemo(
    () => REGION_ORDER.filter((r) => getCountriesByRegion(r).length > 0),
    [],
  );

  const totalCountries = COUNTRY_VERTICALS.length;
  const totalRankings = COUNTRY_VERTICALS.reduce((sum, c) => sum + c.verticals.length, 0);
  const totalBrokers = useMemo(() => getAllBrokersWithData().length, []);

  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ background: "#f8f9fb", minHeight: "100vh", color: "#0f172a" }}>
      {/* JSON-LD BreadcrumbList */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        breadcrumbSchema([
          { label: "RatedBrokers", path: "/" },
          { label: "Brokers", path: "/rankings" },
          { label: "By Country", path: "/brokers-by-country" },
        ])
      ) }} />

      {/* Breadcrumb */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: "Brokers", path: "/rankings" },
          { label: "By Country" },
        ]} />
      </div>

      {/* Hero */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 40 }}>
        <div style={{
          borderRadius: mob ? 14 : 20,
          padding: mob ? "32px 20px" : "52px 48px",
          background: "linear-gradient(135deg, #0f172a 0%, #065f46 55%, #047857 100%)",
          color: "#fff",
          marginBottom: mob ? 28 : 40,
          position: "relative",
          overflow: "hidden",
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 12px", borderRadius: 999,
            background: "rgba(251,191,36,0.15)", color: "#fbbf24",
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", marginBottom: 16,
          }}>
            <Globe size={13} /> Global Broker Directory
          </span>
          <h1 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 28 : tab ? 36 : 44,
            color: "#fff", margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em",
            maxWidth: 820,
          }}>
            Online Brokers by Country — 2026 Rankings
          </h1>
          <p style={{
            fontSize: mob ? 15 : 17, lineHeight: 1.55,
            color: "rgba(255,255,255,0.8)", maxWidth: 720,
            margin: mob ? "12px 0 0" : "16px 0 0",
          }}>
            Find brokers licensed by your country's regulator. We track rankings across eight
            verticals: forex, CFD, stocks, options, futures, crypto, copy trading, and spread betting —
            only showing the verticals that actually have broker coverage in each market.
          </p>
          <div style={{
            display: "flex", gap: mob ? 16 : 32, flexWrap: "wrap",
            marginTop: mob ? 24 : 32,
          }}>
            {[
              [totalCountries, "Countries"],
              [totalRankings, "Rankings"],
              [totalBrokers, "Brokers Tested"],
            ].map(([val, lbl]) => (
              <div key={lbl}>
                <div style={{
                  fontFamily: "'JetBrains Mono',monospace", fontWeight: 800,
                  fontSize: mob ? 22 : 28, color: "#fbbf24", lineHeight: 1,
                }}>{val}</div>
                <div style={{
                  fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: 600,
                  marginTop: 4,
                }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: mob ? 14 : 18 }}>
          <Shield size={18} color="#059669" />
          <h2 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 20 : 26, color: "#0f172a", margin: 0,
            letterSpacing: "-0.02em",
          }}>
            Top Regulated Markets
          </h2>
        </div>
        <p style={{
          fontSize: 14, color: "#64748b", margin: 0,
          marginBottom: mob ? 18 : 24, maxWidth: 680,
        }}>
          Markets where we cover multiple asset classes. Click a vertical to see the ranking.
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "repeat(4, 1fr)",
          gap: mob ? 12 : 14,
          marginBottom: mob ? 32 : 48,
        }}>
          {featured.map((c) => (
            <FeaturedCard key={c.slug} country={c} lp={lp} mob={mob} />
          ))}
        </div>

        {/* By region */}
        {regions.map((region) => {
          const countries = getCountriesByRegion(region);
          if (countries.length === 0) return null;
          return (
            <div key={region} style={{ marginBottom: mob ? 28 : 36 }}>
              <h2 style={{
                fontFamily: "'Outfit',sans-serif", fontWeight: 800,
                fontSize: mob ? 18 : 22, color: "#0f172a",
                margin: "0 0 12px",
              }}>
                {region}
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: mob ? "1fr" : tab ? "1fr" : "1fr 1fr",
                gap: 8,
              }}>
                {countries.map((c) => (
                  <RegionRow key={c.slug} country={c} lp={lp} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom CTA */}
      <section style={{ ...cn, paddingBottom: mob ? 48 : 72 }}>
        <div style={{
          borderRadius: mob ? 14 : 20,
          padding: mob ? "28px 20px" : "40px 48px",
          background: "#fff",
          border: "1px solid #e2e8f0",
          textAlign: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        }}>
          <h2 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: mob ? 20 : 26, color: "#0f172a", margin: 0,
          }}>
            Your country isn't listed?
          </h2>
          <p style={{
            fontSize: mob ? 14 : 16, color: "#64748b",
            margin: "10px auto 24px", maxWidth: 520, lineHeight: 1.5,
          }}>
            Browse our global broker rankings by vertical, or use the Find Your Broker tool
            to get a personalised match in 90 seconds.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to={lp("/rankings")}
              className="cta-primary"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 20px", borderRadius: 10,
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a",
                fontWeight: 700, fontSize: 15, textDecoration: "none",
                boxShadow: "0 2px 8px rgba(245,158,11,0.2)",
              }}
            >
              All broker rankings <ArrowRight size={15} />
            </Link>
            <Link
              to={lp("/find-your-broker")}
              className="cta-secondary"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 20px", borderRadius: 10,
                background: "#fff", color: "#047857",
                border: "2px solid #059669",
                fontWeight: 700, fontSize: 15, textDecoration: "none",
              }}
            >
              Find your broker <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
