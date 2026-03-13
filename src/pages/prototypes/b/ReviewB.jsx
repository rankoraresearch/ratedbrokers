/**
 * Direction B: "Beginner Warm" — Broker Review Page
 * Cream bg, teal + coral accents. Friendly, approachable, educational.
 * Less intimidating data presentation, more guidance and context.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useLocalePath } from "../../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../../data/brokers";
import BrokerLogo from "../../../components/BrokerLogo";
import { visitUrl } from "../shared";
import {
  CheckCircle, XCircle, ArrowRight, Star, Shield, BookOpen,
  ChevronDown, Users, Clock, Award, Heart, ThumbsUp, AlertCircle,
} from "lucide-react";

const teal = "#0d9488";
const coral = "#f97066";
const cream = "#fef7ed";

export default function ReviewB() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const broker = brokers[0];
  if (!broker) return null;
  const B = broker.B;
  const [openSection, setOpenSection] = useState(null);

  const cn = { maxWidth: 900, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const scores = [
    { label: "Safety & Regulation", score: 9.6, emoji: "🛡️", desc: "Licensed by top-tier regulators" },
    { label: "Trading Costs", score: 9.4, emoji: "💰", desc: "Very competitive spreads and fees" },
    { label: "Platforms & Tools", score: 9.2, emoji: "🖥️", desc: "MT4, MT5, cTrader available" },
    { label: "Education", score: 8.8, emoji: "📚", desc: "Good learning resources" },
    { label: "Transparency", score: 9.0, emoji: "🔍", desc: "Clear fee disclosure" },
    { label: "Support", score: 8.5, emoji: "💬", desc: "24/7 live chat available" },
  ];

  const pros = [
    "Very low spreads from " + B.spread + " pips — you keep more of your profits",
    "Regulated by multiple top-tier authorities — your money is protected",
    "MT4, MT5, and cTrader all available — choose what suits you",
    "Fast withdrawals — typically processed within 24 hours",
    "No minimum deposit restrictions on most account types",
  ];

  const cons = [
    "Platform can feel overwhelming for complete beginners at first",
    "Educational content could be more comprehensive",
    "Customer support response times vary during off-peak hours",
  ];

  const accountTypes = [
    { name: "Standard", spread: "0.8 pips", commission: "None", minDep: "$200", best: "Beginners" },
    { name: "Raw Spread", spread: "0.0 pips", commission: "$3.50/lot", minDep: "$200", best: "Active traders" },
    { name: "cTrader Raw", spread: "0.0 pips", commission: "$3.00/lot", minDep: "$200", best: "Scalpers" },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: cream, minHeight: "100vh" }}>

      {/* Breadcrumbs */}
      <div style={{ ...cn, padding: mob ? "16px 16px 0" : "20px 24px 0" }}>
        <nav style={{ display: "flex", gap: 6, fontSize: 13, color: "#a8a29e" }}>
          <Link to={lp("/")} style={{ color: "#a8a29e", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link to={lp("/reviews")} style={{ color: "#a8a29e", textDecoration: "none" }}>Reviews</Link>
          <span>/</span>
          <span style={{ color: "#57534e", fontWeight: 600 }}>{B.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <header style={{ ...cn, padding: mob ? "28px 16px 32px" : "40px 24px 48px" }}>
        <div style={{
          background: "#fff", borderRadius: 24, padding: mob ? "24px" : "40px",
          border: "1px solid #e7e5e4",
        }}>
          <div style={{
            display: "flex", alignItems: mob ? "flex-start" : "center",
            gap: mob ? 16 : 24, flexDirection: mob ? "column" : "row",
          }}>
            <BrokerLogo slug={broker.slug} name={B.name} size={mob ? 52 : 68} shape="wide" />
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 24 : 36,
                color: "#1c1917", marginBottom: 6, lineHeight: 1.15,
              }}>
                {B.name} Review 2026
              </h1>
              <p style={{ fontSize: 15, color: "#78716c", margin: 0 }}>
                Is {B.name} right for you? Here's our honest verdict based on independent expert analysis.
              </p>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20, background: "#ecfdf5",
                border: `3px solid ${teal}`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 900, fontSize: 26, color: teal, lineHeight: 1 }}>{B.score}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#78716c", textTransform: "uppercase" }}>Score</div>
              </div>
              <div style={{ display: "flex", gap: 2, justifyContent: "center", marginTop: 6 }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#fbbf24" color="#fbbf24" />)}
              </div>
            </div>
          </div>

          {/* Quick info badges */}
          <div style={{
            display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap",
          }}>
            {[
              { icon: <Shield size={14} />, text: `${B.regs?.length || 3} Regulators`, color: teal },
              { icon: <Clock size={14} />, text: `From ${B.spread} pips`, color: "#d97706" },
              { icon: <Users size={14} />, text: `$${B.minDep} Min Deposit`, color: "#7c3aed" },
            ].map((badge, i) => (
              <span key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "6px 14px", borderRadius: 100,
                background: badge.color + "10", color: badge.color,
                fontSize: 13, fontWeight: 700,
              }}>
                {badge.icon} {badge.text}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <a href={visitUrl(broker.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: mob ? "14px 24px" : "14px 32px", borderRadius: 14,
              background: teal, color: "#fff", fontWeight: 800, fontSize: 16,
              textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
              boxShadow: `0 4px 20px ${teal}30`,
            }}>
              Open Account <ArrowRight size={16} />
            </a>
            <Link to={lp("/compare")} style={{
              padding: "14px 24px", borderRadius: 14, border: "1px solid #d6d3d1",
              background: "#fff", color: "#57534e", fontWeight: 600, fontSize: 15, textDecoration: "none",
            }}>Compare</Link>
          </div>
        </div>
      </header>

      {/* The Verdict — simple, friendly */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: mob ? "24px" : "32px",
          border: "1px solid #e7e5e4",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <ThumbsUp size={20} color={teal} />
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, margin: 0 }}>
              Our Verdict
            </h2>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#57534e", marginBottom: 16 }}>
            <strong>{B.name}</strong> is an excellent choice for traders who want tight spreads
            and reliable execution. After testing with a real ${B.minDep} deposit and executing
            over 100 trades, we can confidently recommend it — especially for intermediate to
            advanced traders looking for low-cost trading.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#57534e", margin: 0 }}>
            If you're a complete beginner, the platform choices might feel overwhelming at first, but
            the Standard account with its built-in spreads (no separate commission) is the easiest way to start.
          </p>
        </div>
      </section>

      {/* Score breakdown — friendly format */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: mob ? "24px" : "32px",
          border: "1px solid #e7e5e4",
        }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 20 }}>
            How {B.name} Scores
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {scores.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{s.emoji}</span>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: 15, color: "#1c1917" }}>{s.label}</span>
                      <span style={{ fontSize: 13, color: "#a8a29e", marginLeft: 8 }}>{s.desc}</span>
                    </div>
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 16,
                    color: s.score >= 9.0 ? teal : "#d97706",
                  }}>{s.score}</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "#f5f5f4", overflow: "hidden" }}>
                  <div style={{
                    width: `${s.score * 10}%`, height: "100%", borderRadius: 4,
                    background: s.score >= 9.0 ? `linear-gradient(90deg, ${teal}, #5eead4)` : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pros & Cons */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 14 }}>
          {/* Pros */}
          <div style={{
            background: "#ecfdf5", borderRadius: 20, padding: mob ? "24px" : "28px",
            border: "1px solid #a7f3d0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <CheckCircle size={20} color={teal} />
              <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: "#065f46", margin: 0 }}>
                What We Like
              </h3>
            </div>
            {pros.map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10,
              }}>
                <CheckCircle size={16} color={teal} style={{ flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontSize: 15, lineHeight: 1.6, color: "#065f46" }}>{p}</span>
              </div>
            ))}
          </div>

          {/* Cons */}
          <div style={{
            background: "#fff5f5", borderRadius: 20, padding: mob ? "24px" : "28px",
            border: "1px solid #fecaca",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <XCircle size={20} color={coral} />
              <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: "#991b1b", margin: 0 }}>
                What Could Be Better
              </h3>
            </div>
            {cons.map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10,
              }}>
                <AlertCircle size={16} color={coral} style={{ flexShrink: 0, marginTop: 3 }} />
                <span style={{ fontSize: 15, lineHeight: 1.6, color: "#991b1b" }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Account Types — beginner-friendly table */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: mob ? "24px" : "32px",
          border: "1px solid #e7e5e4",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <BookOpen size={20} color={teal} />
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, margin: 0 }}>
              Which Account is Right for You?
            </h2>
          </div>
          <p style={{ fontSize: 14, color: "#78716c", marginBottom: 20 }}>
            Not sure which to pick? Start with Standard — it's the simplest option for beginners.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
            {accountTypes.map((acc, i) => (
              <div key={i} style={{
                padding: "20px", borderRadius: 16,
                background: i === 0 ? cream : "#fafaf9",
                border: i === 0 ? `2px solid ${teal}` : "1px solid #e7e5e4",
                position: "relative",
              }}>
                {i === 0 && (
                  <div style={{
                    position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                    padding: "3px 14px", borderRadius: 100, background: teal, color: "#fff",
                    fontSize: 11, fontWeight: 700,
                  }}>Recommended</div>
                )}
                <div style={{
                  fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: "#1c1917",
                  marginBottom: 12, marginTop: i === 0 ? 4 : 0,
                }}>{acc.name}</div>
                {[
                  ["Spread", acc.spread],
                  ["Commission", acc.commission],
                  ["Min Deposit", acc.minDep],
                  ["Best For", acc.best],
                ].map(([label, val]) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", padding: "8px 0",
                    borderBottom: "1px solid #f5f5f4", fontSize: 14,
                  }}>
                    <span style={{ color: "#78716c" }}>{label}</span>
                    <span style={{ fontWeight: 600, color: "#1c1917" }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Is it safe? */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: mob ? "24px" : "32px",
          border: "1px solid #e7e5e4",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Shield size={20} color={teal} />
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, margin: 0 }}>
              Is {B.name} Safe?
            </h2>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "#57534e", marginBottom: 16 }}>
            <strong>Yes.</strong> {B.name} is regulated by {B.regs?.length || 3} top-tier financial authorities,
            which means your funds are held in segregated accounts and protected by regulatory safeguards.
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 10,
          }}>
            {[
              { label: "ASIC", country: "Australia", tier: "Tier 1" },
              { label: "CySEC", country: "Cyprus/EU", tier: "Tier 1" },
              { label: "FSA", country: "Seychelles", tier: "Tier 3" },
            ].map((reg, i) => (
              <div key={i} style={{
                padding: "14px", borderRadius: 12, background: "#ecfdf5",
                border: "1px solid #a7f3d0", textAlign: "center",
              }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: teal }}>{reg.label}</div>
                <div style={{ fontSize: 12, color: "#065f46", marginTop: 2 }}>{reg.country}</div>
                <div style={{
                  display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 100,
                  background: i < 2 ? teal : "#f59e0b", color: "#fff", fontSize: 11, fontWeight: 700,
                }}>{reg.tier}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA block */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          background: teal, borderRadius: 24, padding: mob ? "32px 24px" : "48px 40px",
          textAlign: "center",
        }}>
          <Heart size={28} color="#fff" style={{ marginBottom: 12 }} />
          <h2 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 22 : 30, color: "#fff", marginBottom: 8 }}>
            Ready to Start Trading?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
            Open your {B.name} account in under 5 minutes. No minimum deposit required.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={visitUrl(broker.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: "16px 36px", borderRadius: 14, background: "#fff", color: teal,
              fontWeight: 800, fontSize: 16, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              Open Account <ArrowRight size={16} />
            </a>
            <Link to={lp(`/compare`)} style={{
              padding: "16px 28px", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
              fontWeight: 600, fontSize: 15, textDecoration: "none",
            }}>Compare Brokers</Link>
          </div>
        </div>
      </section>

      {/* Alternatives */}
      <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 24, marginBottom: 16 }}>
          Similar Brokers You Might Like
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
          {brokers.slice(1, 4).map((alt) => (
            <Link key={alt.slug} to={lp(`/review/${alt.slug}`)} style={{
              background: "#fff", borderRadius: 16, padding: "20px",
              border: "1px solid #e7e5e4", textDecoration: "none", color: "#1c1917",
              transition: "all 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = teal; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e7e5e4"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <BrokerLogo slug={alt.slug} name={alt.B.name} size={36} shape="wide" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16 }}>{alt.B.name}</div>
                  <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 18, color: teal }}>{alt.B.score}</div>
              </div>
              <div style={{ fontSize: 14, color: "#78716c" }}>
                {alt.B.type} · From {alt.B.spread} pips
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
