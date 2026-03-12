/**
 * Direction A: "Clean Authority" — Broker Review Page
 * White bg, green accent #059669, professional authority feel.
 * 3-column layout: TOC | Content | Score Sidebar.
 * Clean score breakdowns, elegant tables, minimal decoration.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useLocalePath } from "../../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../../data/brokers";
import BrokerLogo from "../../../components/BrokerLogo";
import { visitUrl } from "../shared";
import { Shield, Star, Check, X as XIcon, ArrowRight, ExternalLink, ChevronRight, Award } from "lucide-react";

export default function ReviewA() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData();
  const br = brokers[0]; // demo with first broker
  if (!br) return null;
  const { B } = br;
  const green = "#059669";
  const cn = { maxWidth: 1200, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const scores = [
    { name: "Fees & Spreads", score: 9.8, weight: 30 },
    { name: "Platforms & Tools", score: 9.5, weight: 20 },
    { name: "Regulation & Safety", score: 9.7, weight: 15 },
    { name: "Tradable Instruments", score: 9.2, weight: 15 },
    { name: "Customer Support", score: 8.8, weight: 15 },
    { name: "Broker Transparency", score: 9.4, weight: 5 },
  ];

  const pros = ["Raw spreads from 0.0 pips", "30ms average execution speed", "Regulated by ASIC & CySEC", "No restrictions on scalping or EAs"];
  const cons = ["No FCA regulation", "$200 minimum deposit", "Limited educational content"];

  const TOC = ["Overview", "Scoring Breakdown", "Pros & Cons", "Account Types", "Regulation", "Trading Costs", "Platforms", "Verdict"];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb", minHeight: "100vh" }}>

      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf1", padding: "10px 0" }}>
        <div style={{ ...cn, display: "flex", gap: 6, fontSize: 14, color: "#94a3b8" }}>
          <Link to={lp("/")} style={{ color: "#64748b", textDecoration: "none" }}>RatedBrokers</Link>
          <ChevronRight size={14} />
          <Link to={lp("/best-forex-brokers")} style={{ color: "#64748b", textDecoration: "none" }}>Forex Brokers</Link>
          <ChevronRight size={14} />
          <span style={{ color: "#0f172a", fontWeight: 600 }}>{B.name} Review</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: "#fff", borderBottom: "1px solid #e8ecf1", padding: "28px 0" }}>
        <div style={{ ...cn, display: "flex", flexDirection: mob ? "column" : "row", justifyContent: "space-between", gap: mob ? 20 : 32 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <BrokerLogo slug={br.slug} name={B.name} size={mob ? 52 : 64} shape="wide" borderRadius={12} />
              <div>
                <h1 style={{ fontFamily: "Outfit", fontSize: mob ? 22 : 28, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
                  {B.name} Review 2026
                </h1>
                <p style={{ fontSize: 14, color: "#64748b" }}>{B.type} Broker · Est. 2007</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ background: "#ecfdf5", border: "2px solid " + green, borderRadius: 8, padding: "3px 10px", fontFamily: "'JetBrains Mono'", fontSize: 17, fontWeight: 800, color: green }}>{B.score}</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: green }}>Excellent</span>
              </div>
              <div style={{ width: 1, height: 20, background: "#e2e8f0" }} />
              {B.regs?.slice(0, 2).map((r, i) => (
                <span key={i} style={{ padding: "3px 10px", borderRadius: 5, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 12, fontWeight: 600, color: "#065f46" }}>
                  <Shield size={10} style={{ verticalAlign: "-1px" }} /> {r.name}
                </span>
              ))}
              {B.badge && <span style={{ background: "#ecfdf5", color: green, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 5, border: "1px solid #a7f3d0" }}>🏆 {B.badge}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: mob ? "repeat(3,1fr)" : "repeat(5,auto)", gap: mob ? 8 : 20 }}>
              {[
                { l: "Spread", v: `${B.spread} pips` },
                { l: "Commission", v: B.commission || "$7/lot" },
                { l: "Min Deposit", v: `$${B.minDep}` },
                ...(!mob ? [{ l: "Leverage", v: B.leverage || "1:500" }, { l: "Instruments", v: B.instruments || "2,100+" }] : []),
              ].map((x, i) => (
                <div key={i} style={mob ? { textAlign: "center", padding: "6px", background: "#f8fafc", borderRadius: 6 } : {}}>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>{x.l}</div>
                  <div style={{ fontSize: 15, color: "#1e293b", fontWeight: 700 }}>{x.v}</div>
                </div>
              ))}
            </div>

            {mob && (
              <a href={visitUrl(br.slug)} target="_blank" rel="nofollow sponsored" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: `linear-gradient(135deg, ${green}, #047857)`, color: "#fff",
                fontSize: 15, fontWeight: 700, textDecoration: "none", padding: 12, borderRadius: 10, marginTop: 14,
              }}>Visit {B.name} <ArrowRight size={14} /></a>
            )}
          </div>

          {/* Score card (desktop) */}
          {!mob && (
            <div style={{
              width: tab ? 220 : 260, flexShrink: 0, background: "#f0fdf4",
              border: "2px solid #86efac", borderRadius: 14, padding: "22px", textAlign: "center",
            }}>
              <div style={{ fontSize: 13, color: "#065f46", fontWeight: 600, marginBottom: 4 }}>Our Rating</div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 42, fontWeight: 800, color: green, lineHeight: 1 }}>{B.score}</div>
              <div style={{ fontSize: 13, color: green, fontWeight: 600, marginBottom: 12 }}>Excellent</div>
              <a href={visitUrl(br.slug)} target="_blank" rel="nofollow sponsored" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                background: `linear-gradient(135deg, ${green}, #047857)`, color: "#fff",
                fontSize: 16, fontWeight: 700, textDecoration: "none", padding: "13px 24px",
                borderRadius: 10, width: "100%", boxShadow: "0 4px 12px rgba(5,150,105,0.3)",
              }}>Visit {B.name} <ExternalLink size={14} /></a>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>74-89% of retail CFD accounts lose money</div>
            </div>
          )}
        </div>
      </section>

      {/* 3-column layout */}
      <div style={{
        ...cn,
        display: mob ? "flex" : "grid",
        flexDirection: "column",
        gridTemplateColumns: mob ? "1fr" : tab ? "1fr 220px" : "200px 1fr 260px",
        gap: mob ? 16 : 24,
        paddingTop: mob ? 20 : 28, paddingBottom: mob ? 40 : 64,
      }}>

        {/* TOC sidebar (desktop only) */}
        {!mob && !tab && (
          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Contents</div>
            {TOC.map((item, i) => (
              <a key={i} href={`#${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} style={{
                display: "block", fontSize: 13, color: "#64748b", textDecoration: "none",
                padding: "5px 10px", borderLeft: "2px solid #e2e8f0", marginBottom: 1, lineHeight: 1.4,
              }}>{item}</a>
            ))}
          </aside>
        )}

        {/* Main content */}
        <main>
          {/* Author credits */}
          <div style={{
            display: "flex", gap: 16, alignItems: "center", marginBottom: 24,
            padding: "12px 16px", background: "#fff", borderRadius: 10, border: "1px solid #e8ecf1",
          }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e2e8f0" }} />
            <div style={{ fontSize: 14 }}>
              <span style={{ fontWeight: 600, color: "#0f172a" }}>Marcus Chen</span>
              <span style={{ color: "#94a3b8" }}> · Senior Forex Analyst · Updated March 2026</span>
            </div>
          </div>

          {/* Overview */}
          <h2 id="overview" style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 0 }}>
            {B.name} Overview
          </h2>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, marginBottom: 14 }}>
            {B.name} is a leading {B.type.toLowerCase()} broker offering raw spreads from {B.spread} pips with direct market access.
            Founded in 2007, it has become one of the most popular choices for active traders, processing over $18.9 billion in daily volume.
          </p>

          {/* CTA block */}
          <div style={{
            background: "#f0fdf4", border: "2px solid #86efac", borderRadius: 14, padding: "20px 24px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, margin: "20px 0",
          }}>
            <div>
              <div style={{ fontSize: 13, color: "#065f46", fontWeight: 600 }}>Ready to trade with {B.name}?</div>
            </div>
            <a href={visitUrl(br.slug)} target="_blank" rel="nofollow sponsored" style={{
              background: `linear-gradient(135deg, ${green}, #047857)`, color: "#fff", fontSize: 14,
              fontWeight: 700, textDecoration: "none", padding: "12px 28px", borderRadius: 8,
              boxShadow: "0 2px 8px rgba(5,150,105,0.25)", display: "inline-flex", alignItems: "center", gap: 6,
              whiteSpace: "nowrap", flexShrink: 0,
            }}>Visit {B.name} <ExternalLink size={14} /></a>
          </div>

          {/* Scoring Breakdown */}
          <h2 id="scoring-breakdown" style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>
            Scoring Breakdown
          </h2>
          <div style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 12, padding: "22px", marginBottom: 16 }}>
            {scores.map((s, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b" }}>{s.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{s.weight}%</span>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 15, fontWeight: 800, color: s.score >= 9.5 ? green : "#0d9488" }}>{s.score}</span>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "#e8ecf1" }}>
                  <div style={{ height: "100%", borderRadius: 3, background: `linear-gradient(90deg, ${green}, ${green}aa)`, width: `${(s.score / 10) * 100}%` }} />
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #e8ecf1", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Outfit", fontSize: 16, fontWeight: 700 }}>Overall Score</span>
              <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 24, fontWeight: 800, color: green }}>{B.score}/10</span>
            </div>
          </div>

          {/* Pros & Cons */}
          <h2 id="pros-&-cons" style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>
            Pros & Cons
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "20px" }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: green, marginBottom: 12 }}>Pros</div>
              {pros.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "#1e293b", marginBottom: 8, lineHeight: 1.5 }}>
                  <Check size={16} color={green} style={{ flexShrink: 0, marginTop: 2 }} /> {p}
                </div>
              ))}
            </div>
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "20px" }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#dc2626", marginBottom: 12 }}>Cons</div>
              {cons.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "#1e293b", marginBottom: 8, lineHeight: 1.5 }}>
                  <XIcon size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} /> {c}
                </div>
              ))}
            </div>
          </div>

          {/* Account Types */}
          <h2 id="account-types" style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>
            Account Types
          </h2>
          <div style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 12, padding: 0, overflow: "hidden", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f8f9fb", borderBottom: "1px solid #e8ecf1" }}>
                  {["Account", "Spread From", "Commission", "Min Deposit", "Best For"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Standard", spread: "0.6 pips", comm: "$0", min: "$200", best: "Beginners" },
                  { name: "Raw Spread", spread: "0.0 pips", comm: "$7/lot", min: "$200", best: "Scalpers" },
                  { name: "cTrader Raw", spread: "0.0 pips", comm: "$6/lot", min: "$200", best: "Advanced" },
                ].map((a, i) => (
                  <tr key={i} style={{ borderBottom: i < 2 ? "1px solid #f0f4f8" : "none" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#1e293b" }}>{a.name}</td>
                    <td style={{ padding: "12px 14px", fontFamily: "'JetBrains Mono'", fontWeight: 700, color: green }}>{a.spread}</td>
                    <td style={{ padding: "12px 14px" }}>{a.comm}</td>
                    <td style={{ padding: "12px 14px" }}>{a.min}</td>
                    <td style={{ padding: "12px 14px", color: "#64748b", fontSize: 13 }}>{a.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expert Verdict */}
          <h2 id="verdict" style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>
            Expert Verdict
          </h2>
          <div style={{
            background: "#f0fdf4", border: "2px solid #86efac", borderRadius: 14, padding: "24px",
            marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Award size={20} color={green} />
              <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: "#065f46" }}>
                {B.score}/10 — Excellent
              </span>
            </div>
            <p style={{ fontSize: 15, color: "#065f46", lineHeight: 1.7, margin: 0 }}>
              {B.name} delivers the tightest raw spreads we've measured — averaging 0.02 pips on EUR/USD with 30ms execution.
              For active traders and scalpers, it's our top recommendation. The only weakness is the lack of FCA regulation
              and somewhat limited educational resources.
            </p>
          </div>

          {/* FAQ */}
          <h2 id="faq" style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 14, marginTop: 32 }}>
            FAQ
          </h2>
          {[
            { q: `Is ${B.name} safe?`, a: `Yes. ${B.name} is regulated by ASIC and CySEC, both Tier-1 regulators.` },
            { q: `What is the minimum deposit?`, a: `The minimum deposit is $${B.minDep}.` },
            { q: `Does ${B.name} allow scalping?`, a: `Yes, ${B.name} has no restrictions on scalping strategies.` },
          ].map((f, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 10, padding: "16px 20px", marginBottom: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>{f.q}</div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{f.a}</div>
            </div>
          ))}
        </main>

        {/* Right sidebar (desktop) */}
        {!mob && (
          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            {/* Quick facts */}
            <div style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 12, padding: "18px", marginBottom: 16 }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 12 }}>Quick Facts</div>
              {[
                { l: "Founded", v: "2007" },
                { l: "Headquarters", v: "Sydney" },
                { l: "Regulation", v: "ASIC, CySEC" },
                { l: "Min Deposit", v: `$${B.minDep}` },
                { l: "Platforms", v: "MT4, MT5, cTrader" },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? "1px solid #f1f5f9" : "none" }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{f.l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{f.v}</span>
                </div>
              ))}
            </div>

            {/* Alternatives */}
            <div style={{ background: "#fff", border: "1px solid #e8ecf1", borderRadius: 12, padding: "18px" }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 12 }}>Alternatives</div>
              {[
                { name: "Pepperstone", score: "9.5" },
                { name: "FP Markets", score: "9.4" },
                { name: "Tickmill", score: "8.7" },
              ].map((alt, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: i < 2 ? "1px solid #f1f5f9" : "none",
                }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{alt.name}</span>
                  <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 14, fontWeight: 700, color: green }}>{alt.score}</span>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
