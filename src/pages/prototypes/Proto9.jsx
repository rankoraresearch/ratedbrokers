/**
 * PROTO 9: "Search Hub" (Google-like)
 * Giant search bar dominates. Ultra-clean.
 * Minimal above fold, categories and content below.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, COUNTRIES } from "./shared";
import CountryFlag from "../../components/CountryFlag";
import { Search, ArrowRight, TrendingUp } from "lucide-react";

export default function Proto9() {
  const { mob } = useMedia();
  const lp = useLocalePath();
  const navigate = useNavigate();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const blue = "#2563eb";
  const [query, setQuery] = useState("");
  const suggestions = query.length > 0
    ? brokers.filter(b => b.B.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Hero — search-centric */}
      <section style={{ ...cn, padding: mob ? "80px 16px 60px" : "140px 24px 100px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 28 : 44, color: "#0f172a", marginBottom: 12 }}>
          Find Your Perfect Broker
        </h1>
        <p style={{ fontSize: 16, color: "#64748b", marginBottom: 36 }}>
          Search {brokers.length} independently tested forex brokers
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "flex", alignItems: "center", border: "2px solid #e2e8f0",
            borderRadius: 16, padding: "4px 4px 4px 20px", background: "#fff",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            borderColor: query ? blue : "#e2e8f0",
          }}>
            <Search size={22} color="#94a3b8" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type a broker name... e.g. IC Markets"
              style={{
                flex: 1, border: "none", outline: "none", fontSize: 17, padding: "16px 12px",
                fontFamily: "inherit", background: "transparent",
              }}
            />
            <button style={{
              padding: "14px 28px", borderRadius: 12, background: blue, color: "#fff",
              fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer",
            }}>Search</button>
          </div>

          {/* Dropdown suggestions */}
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8,
              background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)", overflow: "hidden", zIndex: 10,
            }}>
              {suggestions.map(br => (
                <Link key={br.slug} to={lp(`/review/${br.slug}`)} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 20px",
                  textDecoration: "none", color: "#0f172a", borderBottom: "1px solid #f1f5f9",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  onClick={() => setQuery("")}
                >
                  <BrokerLogo slug={br.slug} name={br.B.name} size={28} shape="wide" />
                  <span style={{ flex: 1, fontWeight: 600 }}>{br.B.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, color: blue }}>{br.B.score}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick tags */}
        <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Trending:</span>
          {["IC Markets", "Pepperstone", "IG", "eToro"].map((name, i) => {
            const br = brokers.find(b => b.B.name === name);
            return br ? (
              <Link key={i} to={lp(`/review/${br.slug}`)} style={{
                padding: "6px 14px", borderRadius: 100, background: "#f1f5f9",
                fontSize: 13, fontWeight: 600, color: "#475569", textDecoration: "none",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <TrendingUp size={12} color={blue} /> {name}
              </Link>
            ) : null;
          })}
        </div>
      </section>

      {/* Categories */}
      <section style={{ background: "#f8fafc", padding: mob ? "48px 0" : "72px 0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 24, textAlign: "center" }}>
            Browse by Category
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
            {RANKINGS.map((r, i) => (
              <Link key={i} to={lp(r.path)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 18px", borderRadius: 12, background: "#fff",
                border: "1px solid #e2e8f0", textDecoration: "none", color: "#0f172a",
                fontWeight: 600, fontSize: 14, transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = blue}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                {r.title}
                <ArrowRight size={14} color="#94a3b8" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top rated - compact */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, margin: 0 }}>Top Rated Brokers</h2>
          <Link to={lp("/best-forex-brokers")} style={{ fontSize: 14, fontWeight: 600, color: blue, textDecoration: "none" }}>View All →</Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
          {brokers.slice(0, 6).map((br, i) => (
            <Link key={br.slug} to={lp(`/review/${br.slug}`)} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
              borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#0f172a",
            }}>
              <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: 14, color: "#94a3b8", width: 24 }}>{i + 1}</span>
              <BrokerLogo slug={br.slug} name={br.B.name} size={36} shape="wide" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{br.B.name}</div>
                <div style={{ fontSize: 13, color: "#94a3b8" }}>{br.B.type} · {br.B.spread} pips</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 18, color: blue }}>{br.B.score}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Countries */}
      <section style={{ ...cn, padding: mob ? "0 16px 48px" : "0 24px 72px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 24, textAlign: "center" }}>
          By Country
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {COUNTRIES.map((c, i) => (
            <Link key={i} to={lp(c.path)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "14px 16px",
              borderRadius: 10, background: "#fff", border: "1px solid #e2e8f0",
              textDecoration: "none", color: "#0f172a",
            }}>
              <CountryFlag code={c.code} size={24} />
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{c.reg}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
