/**
 * Direction B: "Beginner Warm" — Ranking Page
 * Cream bg, teal + coral accents. Friendly, approachable, educational.
 * Step-by-step guidance, less intimidating presentation.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useLocalePath } from "../../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../../data/brokers";
import BrokerLogo from "../../../components/BrokerLogo";
import { RANKINGS, visitUrl } from "../shared";
import {
  CheckCircle, ArrowRight, Star, Shield, BookOpen,
  ChevronDown, ChevronRight, Award, Heart, Compass,
  ExternalLink,
} from "lucide-react";

const teal = "#0d9488";
const coral = "#f97066";
const cream = "#fef7ed";
const YEAR = "2026";

export default function RankingB() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const [openFaq, setOpenFaq] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const cn = { maxWidth: 960, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const displayBrokers = showAll ? brokers : brokers.slice(0, 5);

  const faqs = [
    { q: "How do you test forex brokers?", a: "We open real accounts, deposit real money, and execute 100+ trades per broker. We measure actual spreads, test withdrawals, and evaluate platforms — just like a regular trader would." },
    { q: "Can beginners trust these rankings?", a: "Absolutely. Our rankings are specifically designed to help new traders find safe, regulated brokers. We prioritize regulation, ease of use, and education in our scoring." },
    { q: "Do brokers pay to be listed?", a: "No. We may earn commissions if you open an account through our links, but this never affects our rankings. See our methodology for full transparency." },
    { q: "How often do rankings change?", a: "We review and update rankings every quarter. Major regulatory changes or fee updates trigger immediate re-evaluations." },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: cream, minHeight: "100vh" }}>

      {/* Breadcrumbs */}
      <div style={{ ...cn, padding: mob ? "16px 16px 0" : "20px 24px 0" }}>
        <nav style={{ display: "flex", gap: 6, fontSize: 13, color: "#a8a29e" }}>
          <Link to={lp("/")} style={{ color: "#a8a29e", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <span style={{ color: "#57534e", fontWeight: 600 }}>Best Forex Brokers {YEAR}</span>
        </nav>
      </div>

      {/* Hero */}
      <header style={{ ...cn, padding: mob ? "28px 16px 36px" : "40px 24px 52px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px",
          borderRadius: 100, background: "#fff", border: "1px solid #e5ddd4", marginBottom: 20,
        }}>
          <Compass size={14} color={teal} />
          <span style={{ fontSize: 13, fontWeight: 700, color: teal }}>Updated March {YEAR}</span>
        </div>

        <h1 style={{
          fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 28 : tab ? 38 : 48,
          lineHeight: 1.08, color: "#1c1917", marginBottom: 12,
        }}>
          Best Forex Brokers {YEAR}
        </h1>
        <p style={{
          fontSize: mob ? 15 : 17, color: "#78716c", lineHeight: 1.7,
          maxWidth: 540, margin: "0 auto 12px",
        }}>
          We tested {brokers.length} brokers with real money so you don't have to.
          Here are the ones we actually recommend.
        </p>

        {/* Author */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          marginTop: 16, fontSize: 13, color: "#a8a29e",
        }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e7e5e4" }} />
          <span>By <strong style={{ color: "#57534e" }}>James Chen, CFA</strong></span>
          <span>·</span>
          <span>Fact-checked by Alex Thompson</span>
        </div>
      </header>

      {/* What we looked for */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: mob ? "24px" : "32px",
          border: "1px solid #e7e5e4",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <BookOpen size={18} color={teal} />
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, margin: 0 }}>
              What We Looked For
            </h2>
          </div>
          <p style={{ fontSize: 15, color: "#78716c", lineHeight: 1.7, marginBottom: 16 }}>
            Every broker was scored across 6 categories. Here's what matters most:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
            {[
              { emoji: "🛡️", title: "Safety First", desc: "Top-tier regulation is non-negotiable. 30% of the score.", weight: "30%" },
              { emoji: "💰", title: "Low Costs", desc: "We measure real spreads during peak hours. 20% of the score.", weight: "20%" },
              { emoji: "🖥️", title: "Good Platforms", desc: "Easy to use, reliable, with the tools you need. 15% of the score.", weight: "15%" },
            ].map((c, i) => (
              <div key={i} style={{
                padding: "16px", borderRadius: 14, background: cream,
                border: "1px solid #e5ddd4",
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.emoji}</div>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "#1c1917", marginBottom: 4 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 13, color: "#78716c", lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Link to={lp("/methodology")} style={{
              fontSize: 14, fontWeight: 700, color: teal, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>Read Full Methodology <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>

      {/* Top Pick highlight */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          background: "#ecfdf5", borderRadius: 20, padding: mob ? "24px" : "32px",
          border: `2px solid ${teal}`,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px",
            borderRadius: 100, background: teal, color: "#fff",
            fontSize: 12, fontWeight: 700, marginBottom: 16,
          }}>
            <Award size={12} /> Our #1 Pick
          </div>
          <div style={{
            display: "flex", alignItems: mob ? "flex-start" : "center",
            gap: mob ? 12 : 20, flexDirection: mob ? "column" : "row",
          }}>
            <BrokerLogo slug={brokers[0].slug} name={brokers[0].B.name} size={mob ? 48 : 56} shape="wide" />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, color: "#065f46" }}>
                {brokers[0].B.name}
              </div>
              <div style={{ fontSize: 15, color: "#065f46", marginTop: 4, lineHeight: 1.6 }}>
                Best overall broker with tight spreads from {brokers[0].B.spread} pips,
                {brokers[0].B.regs?.length || 3} regulatory licenses, and excellent platform choices.
              </div>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{
                fontFamily: "'JetBrains Mono'", fontWeight: 900, fontSize: 32, color: teal,
              }}>{brokers[0].B.score}</div>
              <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#fbbf24" color="#fbbf24" />)}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <a href={visitUrl(brokers[0].slug)} target="_blank" rel="noopener nofollow sponsored" style={{
              padding: "14px 28px", borderRadius: 14, background: teal, color: "#fff",
              fontWeight: 800, fontSize: 15, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 6,
            }}>Open Account <ArrowRight size={14} /></a>
            <Link to={lp(`/review/${brokers[0].slug}`)} style={{
              padding: "14px 20px", borderRadius: 14, border: "1px solid #a7f3d0",
              background: "#fff", color: "#065f46", fontWeight: 600, fontSize: 14, textDecoration: "none",
            }}>Read Review</Link>
          </div>
        </div>
      </section>

      {/* All Brokers */}
      <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 20 : 26, marginBottom: 20 }}>
          All {brokers.length} Brokers Ranked
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {displayBrokers.map((b, i) => {
            const scoreColor = b.B.score >= 9.0 ? teal : b.B.score >= 8.5 ? "#2563eb" : "#d97706";
            return (
              <div key={b.slug} style={{
                background: "#fff", borderRadius: 18, padding: mob ? "16px" : "20px 24px",
                border: i === 0 ? `2px solid ${teal}` : "1px solid #e7e5e4",
                transition: "all 0.15s",
              }}>
                <div style={{
                  display: "flex", alignItems: mob ? "flex-start" : "center",
                  gap: mob ? 12 : 16, flexDirection: mob ? "column" : "row",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: mob ? 10 : 14, width: mob ? "100%" : "auto" }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: i === 0 ? teal : "#f5f5f4",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 13,
                      color: i === 0 ? "#fff" : "#78716c", flexShrink: 0,
                    }}>#{i + 1}</span>
                    <BrokerLogo slug={b.slug} name={b.B.name} size={mob ? 36 : 44} shape="wide" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 16 : 18, color: "#1c1917" }}>
                        {b.B.name}
                      </div>
                      <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="#fbbf24" color="#fbbf24" />)}
                      </div>
                    </div>
                    {mob && (
                      <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 22, color: scoreColor }}>{b.B.score}</div>
                    )}
                  </div>

                  {/* Desktop stats */}
                  {!mob && (
                    <div style={{ display: "flex", gap: 20, flex: 1, justifyContent: "center" }}>
                      {[
                        ["Spread", `${b.B.spread} pips`],
                        ["Min Deposit", b.B.minDep === 0 ? "$0" : `$${b.B.minDep}`],
                        ["Type", b.B.type],
                      ].map(([label, val]) => (
                        <div key={label} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: "#a8a29e", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#57534e", marginTop: 2 }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Score + actions */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: mob ? 10 : 14,
                    width: mob ? "100%" : "auto",
                  }}>
                    {!mob && (
                      <div style={{
                        fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 24, color: scoreColor,
                      }}>{b.B.score}</div>
                    )}
                    <div style={{ display: "flex", gap: 8, flex: mob ? 1 : undefined }}>
                      <a href={visitUrl(b.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                        padding: mob ? "10px 0" : "10px 20px", borderRadius: 10,
                        background: teal, color: "#fff", fontWeight: 700, fontSize: 14,
                        textDecoration: "none", textAlign: "center",
                        flex: mob ? 1 : undefined,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                      }}>Visit <ExternalLink size={12} /></a>
                      <Link to={lp(`/review/${b.slug}`)} style={{
                        padding: mob ? "10px 0" : "10px 16px", borderRadius: 10,
                        border: "1px solid #e7e5e4", background: "#fff",
                        color: "#78716c", fontWeight: 600, fontSize: 14,
                        textDecoration: "none", textAlign: "center",
                        flex: mob ? 1 : undefined,
                      }}>Review</Link>
                    </div>
                  </div>
                </div>

                {/* Mobile quick stats */}
                {mob && (
                  <div style={{
                    display: "flex", gap: 12, marginTop: 12, paddingTop: 12,
                    borderTop: "1px solid #f5f5f4",
                  }}>
                    {[
                      ["Spread", `${b.B.spread} pips`],
                      ["Min Dep.", b.B.minDep === 0 ? "$0" : `$${b.B.minDep}`],
                      ["Type", b.B.type],
                    ].map(([label, val]) => (
                      <div key={label} style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color: "#a8a29e", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#57534e", marginTop: 1 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show more */}
        {!showAll && brokers.length > 5 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={() => setShowAll(true)} style={{
              padding: "12px 28px", borderRadius: 12, border: "1px solid #d6d3d1",
              background: "#fff", color: "#57534e", fontWeight: 700, fontSize: 15,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Show All {brokers.length} Brokers <ChevronDown size={14} style={{ verticalAlign: "middle" }} />
            </button>
          </div>
        )}
      </section>

      {/* Related rankings */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16 }}>
          Find Brokers by Category
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
          {RANKINGS.slice(1, 6).map((r, i) => (
            <Link key={i} to={lp(r.path)} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 16px", borderRadius: 14, background: "#fff", border: "1px solid #e7e5e4",
              textDecoration: "none", color: "#44403c", fontWeight: 600, fontSize: 14,
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = teal}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e7e5e4"}
            >
              <span>{r.title}</span>
              <ChevronRight size={14} color="#a8a29e" />
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 18 : 22, marginBottom: 16 }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, border: "1px solid #e7e5e4", overflow: "hidden",
            }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: mob ? "16px" : "18px 24px", background: "transparent", border: "none",
                cursor: "pointer", fontFamily: "inherit",
              }}>
                <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: mob ? 15 : 16, color: "#1c1917", textAlign: "left" }}>
                  {f.q}
                </span>
                <ChevronDown size={16} color="#a8a29e" style={{
                  transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "none",
                  flexShrink: 0, marginLeft: 12,
                }} />
              </button>
              {openFaq === i && (
                <div style={{ padding: mob ? "0 16px 16px" : "0 24px 20px" }}>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: "#78716c", margin: 0 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ ...cn, paddingBottom: mob ? 32 : 48 }}>
        <div style={{
          background: teal, borderRadius: 24, padding: mob ? "40px 24px" : "56px 40px",
          textAlign: "center",
        }}>
          <Heart size={32} color="#fff" style={{ marginBottom: 12 }} />
          <h2 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 22 : 32, color: "#fff", marginBottom: 8, lineHeight: 1.15 }}>
            Not Sure Where to Start?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 28, maxWidth: 440, margin: "0 auto 28px" }}>
            Our beginner's guide walks you through everything step by step.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/best-forex-brokers-for-beginners")} style={{
              padding: "16px 36px", borderRadius: 14, background: "#fff", color: teal,
              fontWeight: 800, fontSize: 16, textDecoration: "none",
            }}>Beginner's Guide</Link>
            <Link to={lp("/methodology")} style={{
              padding: "16px 28px", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
              fontWeight: 600, fontSize: 16, textDecoration: "none",
            }}>Our Methodology</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
