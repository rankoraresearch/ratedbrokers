import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../i18n/LanguageContext";
import { useLocalePath } from "../i18n/useLocalePath";
import { useMedia } from "../hooks/useMedia";
import { getAllBrokers, getBrokerData } from "../data/brokers";
import { canonicalPair, FEATURED_PAIRS, POPULAR_PAIRS } from "../data/comparisons";
import ScoreBadge from "../components/ScoreBadge";
import BrokerLogo from "../components/BrokerLogo";
import Breadcrumb from "../components/Breadcrumb";
import Icon, { ArrowRight } from "../components/Icon";

export default function ComparePage() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { mob } = useMedia();
  const navigate = useNavigate();

  const allBrokers = getAllBrokers().sort((a, b) => b.score - a.score);
  const [pickA, setPickA] = useState("");
  const [pickB, setPickB] = useState("");

  useEffect(() => {
    document.title = "Compare Forex Brokers 2026 | Side-by-Side | RatedBrokers";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = "Compare 31 forex brokers side-by-side. Spreads, commissions, regulation, and platforms independently analyzed. Find the best broker for your trading style.";
  }, []);

  const handleCompare = () => {
    if (pickA && pickB && pickA !== pickB) {
      navigate(lp(`/compare/${canonicalPair(pickA, pickB)}`));
    }
  };

  const popularCount = POPULAR_PAIRS.length;
  const remainingPairs = FEATURED_PAIRS.slice(popularCount);
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", color: "#111827", minHeight: "100vh" }}>

      {/* Breadcrumbs */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "RatedBrokers", path: "/" },
          { label: "Forex Brokers", path: "/best-forex-brokers" },
          { label: t("comp.breadCompare") },
        ]} />
      </div>

      {/* Hero + Picker */}
      <section style={{ ...cn, marginBottom: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 28 : 42, lineHeight: 1.15, color: "#0f172a", margin: "0 0 12px" }}>
            {t("comp.indexH1")}
          </h1>
          <p style={{ fontSize: mob ? 15 : 18, color: "#1f2937", maxWidth: 600, margin: "0 auto" }}>
            {t("comp.indexDesc")}
          </p>
        </div>
        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1f2937", maxWidth: 800, margin: "0 auto 28px", textAlign: "center" }}>
          Every broker in our database has been independently analyzed across 130+ data points. Select any two from {allBrokers.length} brokers below to see how they stack up on spreads, execution speed, regulatory coverage, and total trading costs. Not sure where to start? Check our <Link to={lp("/best-forex-brokers")} style={{ color: "#059669", fontWeight: 600 }}>best forex brokers</Link> ranking first.
        </p>

        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", padding: mob ? "20px" : "32px",
          maxWidth: 700, margin: "0 auto",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr auto 1fr", gap: 16, alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", marginBottom: 6 }}>
                {t("comp.pickA")}
              </label>
              <select
                value={pickA}
                onChange={e => setPickA(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e2e8f0",
                  fontSize: 16, fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb",
                  color: pickA ? "#111827" : "#64748b", cursor: "pointer",
                }}
              >
                <option value="">{t("comp.pickA")}</option>
                {allBrokers.map(b => (
                  <option key={b.slug} value={b.slug} disabled={b.slug === pickB}>
                    {b.name} ({b.score})
                  </option>
                ))}
              </select>
            </div>

            {!mob && (
              <div style={{
                width: 40, height: 40, borderRadius: "50%", background: "#f1f5f9",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Outfit", fontWeight: 900, fontSize: 14, color: "#1f2937",
              }}>VS</div>
            )}

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1f2937", textTransform: "uppercase", marginBottom: 6 }}>
                {t("comp.pickB")}
              </label>
              <select
                value={pickB}
                onChange={e => setPickB(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #e2e8f0",
                  fontSize: 16, fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb",
                  color: pickB ? "#111827" : "#64748b", cursor: "pointer",
                }}
              >
                <option value="">{t("comp.pickB")}</option>
                {allBrokers.map(b => (
                  <option key={b.slug} value={b.slug} disabled={b.slug === pickA}>
                    {b.name} ({b.score})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleCompare}
            disabled={!pickA || !pickB || pickA === pickB}
            style={{
              display: "block", width: "100%", marginTop: 20, padding: "14px 32px", borderRadius: 10,
              background: pickA && pickB && pickA !== pickB
                ? "linear-gradient(135deg,#059669,#34d399)"
                : "#e2e8f0",
              color: pickA && pickB && pickA !== pickB ? "#fff" : "#64748b",
              fontWeight: 800, fontSize: 16, border: "none", cursor: pickA && pickB && pickA !== pickB ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans',system-ui,sans-serif",
              boxShadow: pickA && pickB && pickA !== pickB ? "0 4px 16px rgba(5,150,105,0.3)" : "none",
            }}
          >
            {t("comp.compareBtn")}
          </button>
        </div>
      </section>

      {/* Most Popular Comparisons */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 8, textAlign: "center" }}>
          {t("comp.featuredTitle")}
        </h2>
        <p style={{ fontSize: 16, color: "#1f2937", textAlign: "center", marginBottom: 20 }}>
          The most searched broker matchups — based on real trader interest.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {POPULAR_PAIRS.map((fp, i) => {
            const dA = getBrokerData(fp.slugA);
            const dB = getBrokerData(fp.slugB);
            if (!dA || !dB) return null;
            const cp = canonicalPair(fp.slugA, fp.slugB);
            return (
              <Link key={i} to={lp(`/compare/${cp}`)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "14px 18px", borderRadius: 12,
                background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#111827",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  <BrokerLogo slug={fp.slugA} name={dA.B.name} fallback={dA.B.logo} size={40} shape="wide" variant="gray" />
                  <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 12, color: "#1f2937" }}>vs</span>
                  <BrokerLogo slug={fp.slugB} name={dB.B.name} fallback={dB.B.logo} size={40} shape="wide" variant="gray" />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {dA.B.name} vs {dB.B.name}
                    </div>
                    <div style={{ fontSize: 14, color: "#1f2937" }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "#059669" }}>{dA.B.score}</span>
                      {" vs "}
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "#2563eb" }}>{dB.B.score}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight size={18} color="#cbd5e1" style={{ flexShrink: 0 }} />
              </Link>
            );
          })}
        </div>
      </section>

      {/* All Broker Comparisons */}
      <section style={{ ...cn, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 8, textAlign: "center" }}>
          All Broker Comparisons
        </h2>
        <p style={{ fontSize: 16, color: "#1f2937", textAlign: "center", marginBottom: 20 }}>
          {FEATURED_PAIRS.length} side-by-side comparisons across all brokers in our database.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 10 }}>
          {remainingPairs.map((fp, i) => {
            const dA = getBrokerData(fp.slugA);
            const dB = getBrokerData(fp.slugB);
            if (!dA || !dB) return null;
            const cp = canonicalPair(fp.slugA, fp.slugB);
            return (
              <Link key={i} to={lp(`/compare/${cp}`)} style={{
                display: "block", padding: "12px 14px", borderRadius: 10,
                background: "#fff", border: "1px solid #e2e8f0",
                textDecoration: "none", color: "#111827", textAlign: "center",
              }}>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 13 : 14, lineHeight: 1.4 }}>
                  {dA.B.name} <span style={{ color: "#1f2937", fontWeight: 400 }}>vs</span> {dB.B.name}
                </div>
                <div style={{ fontSize: 13, color: "#1f2937", marginTop: 4 }}>
                  <span style={{ color: "#059669", fontWeight: 700 }}>{dA.B.score}</span>
                  {" / "}
                  <span style={{ color: "#2563eb", fontWeight: 700 }}>{dB.B.score}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Compare Brokers? */}
      <section style={{ ...cn, marginBottom: 60 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 20, textAlign: "center" }}>
          {t("comp.whyTitle")}
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 20 }}>
          {[
            { icon: "shield", title: "Trustworthy Regulation", desc: "Compare licensing, safety measures, and regulatory coverage. Not all regulators offer the same level of protection — see which broker has stronger oversight." },
            { icon: "dollar-sign", title: "Trading Costs", desc: "Spreads, commissions, and hidden fees add up fast. Our side-by-side comparison shows the real cost per trade so you can pick the most cost-effective broker." },
            { icon: "monitor", title: "Platforms & Tools", desc: "MT4, MT5, cTrader, TradingView — not every broker supports every platform. Compare available tools to find the setup that matches your trading style." },
          ].map((card, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0",
              padding: "24px", textAlign: "center",
            }}>
              <div style={{ marginBottom: 12 }}><Icon name={card.icon} size={36} color="#059669" /></div>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, marginBottom: 8, marginTop: 0 }}>{card.title}</h3>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: "#1f2937", margin: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* How We Compare — SEO content */}
      <section style={{ ...cn, marginBottom: 60 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, marginBottom: 16, textAlign: "center" }}>
            How We Compare Forex Brokers
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", marginBottom: 12 }}>
            Our broker comparisons are built on independent research, not marketing claims. For every broker on RatedBrokers, our analyst team collects data from regulatory databases, broker websites, independent sources, and aggregated user reviews. This data powers every comparison on this page.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", marginBottom: 12 }}>
            Each broker is scored across six weighted categories: Regulation &amp; Safety (30%), Trading Costs (20%), User Reputation (15%), Broker Transparency (15%), Platforms &amp; Tools (15%), and Execution Model (5%). When you compare two brokers, you see exactly where each one wins, loses, or ties — backed by data, not opinion.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#1f2937", margin: 0 }}>
            All comparisons are updated quarterly to reflect the latest spreads, regulatory changes, and platform updates. Whether you're choosing between ECN brokers for scalping or looking for the safest regulated broker for long-term investing, our side-by-side tool helps you make an informed decision based on independently verified data. See our full <Link to={lp("/best-forex-brokers")} style={{ color: "#059669", fontWeight: 600 }}>best forex brokers</Link> ranking for 2026.
          </p>
        </div>
      </section>
    </div>
  );
}
