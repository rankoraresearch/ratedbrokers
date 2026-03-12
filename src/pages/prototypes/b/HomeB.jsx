/**
 * Direction B: "Beginner Warm" — Homepage (refined)
 * Cream bg, teal + coral accents. Warm, inviting, step-by-step.
 * Enhanced version of Proto12 with more depth and polish.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useLocalePath } from "../../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../../data/brokers";
import BrokerLogo from "../../../components/BrokerLogo";
import CountryFlag from "../../../components/CountryFlag";
import { RANKINGS, COUNTRIES, visitUrl } from "../shared";
import {
  BookOpen, ArrowRight, CheckCircle, Compass, Star, ChevronRight,
  Heart, Shield, Users, Award, TrendingUp,
} from "lucide-react";

const teal = "#0d9488";
const coral = "#f97066";
const cream = "#fef7ed";
const YEAR = "2026";

export default function HomeB() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top3 = brokers.slice(0, 3);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  const steps = [
    { num: "01", title: "Choose Your Style", desc: "Scalper, swing, or long-term? We have rankings for each trading approach.", icon: <Compass size={24} color={teal} /> },
    { num: "02", title: "Compare Brokers", desc: "See detailed side-by-side comparisons on fees, platforms, and safety.", icon: <BookOpen size={24} color={teal} /> },
    { num: "03", title: "Start Trading", desc: "Open your account with confidence. We tested them all with real money.", icon: <CheckCircle size={24} color={teal} /> },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: cream, minHeight: "100vh" }}>

      {/* Warm welcome strip */}
      <div style={{
        background: "#fff", padding: "10px 0", borderBottom: "1px solid #e5ddd4",
      }}>
        <div style={{ ...cn, display: "flex", justifyContent: "center", gap: mob ? 12 : 28, fontSize: 13, color: "#78716c", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Heart size={12} color={coral} fill={coral} /> Trusted by Beginners
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Shield size={12} color={teal} /> Real Money Testing
          </span>
          {!mob && <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Award size={12} color={teal} /> 100% Independent
          </span>}
        </div>
      </div>

      {/* Hero */}
      <section style={{ ...cn, padding: mob ? "48px 16px 40px" : "80px 24px 64px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px",
          borderRadius: 100, background: "#fff", border: "1px solid #e5ddd4",
          marginBottom: 24,
        }}>
          <BookOpen size={14} color={teal} />
          <span style={{ fontSize: 13, fontWeight: 700, color: teal }}>New to Forex? Start here</span>
        </div>

        <h1 style={{
          fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 32 : 56,
          lineHeight: 1.08, color: "#1c1917", marginBottom: 16,
        }}>
          Find the Right Broker<br />
          <span style={{ color: teal }}>for You</span>
        </h1>
        <p style={{
          fontSize: mob ? 16 : 18, color: "#78716c", maxWidth: 520,
          margin: "0 auto 32px", lineHeight: 1.7,
        }}>
          We tested {brokers.length} forex brokers with real money so you don't have to.
          Simple, honest, beginner-friendly reviews.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to={lp("/best-forex-brokers-for-beginners")} style={{
            padding: "16px 32px", borderRadius: 14, background: teal, color: "#fff",
            fontWeight: 800, fontSize: 16, textDecoration: "none",
            boxShadow: `0 4px 20px ${teal}30`,
          }}>Best for Beginners</Link>
          <Link to={lp("/best-forex-brokers")} style={{
            padding: "16px 32px", borderRadius: 14, border: "1px solid #d6d3d1",
            background: "#fff", color: "#44403c", fontWeight: 700, fontSize: 16, textDecoration: "none",
          }}>All Rankings</Link>
        </div>
      </section>

      {/* Steps */}
      <section style={{ ...cn, padding: mob ? "0 16px 48px" : "0 24px 72px" }}>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {steps.map((s, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 20, padding: "28px 24px",
              border: "1px solid #e7e5e4", position: "relative",
              transition: "all 0.15s",
            }}>
              <div style={{
                position: "absolute", top: 16, right: 16, fontFamily: "'JetBrains Mono'",
                fontWeight: 800, fontSize: 36, color: "#f5f5f4",
              }}>{s.num}</div>
              <div style={{ marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#1c1917" }}>
                {s.title}
              </div>
              <p style={{ fontSize: 14, color: "#78716c", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top picks */}
      <section style={{ background: "#fff", padding: mob ? "48px 0" : "72px 0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, textAlign: "center", marginBottom: 8 }}>
            Our Top Picks
          </h2>
          <p style={{ textAlign: "center", color: "#78716c", fontSize: 16, marginBottom: 36 }}>
            Safe, easy to use, and great for all experience levels
          </p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {top3.map((br, i) => (
              <div key={br.slug} style={{
                background: cream, borderRadius: 20, padding: "24px",
                border: i === 0 ? `2px solid ${teal}` : "1px solid #e7e5e4",
                position: "relative", transition: "all 0.15s",
              }}>
                {i === 0 && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    padding: "4px 16px", borderRadius: 100, background: coral, color: "#fff",
                    fontSize: 12, fontWeight: 700,
                  }}>Our #1 Pick</div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, marginTop: i === 0 ? 8 : 0 }}>
                  <BrokerLogo slug={br.slug} name={br.B.name} size={48} shape="wide" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, color: "#1c1917" }}>{br.B.name}</div>
                    <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                      {[1, 2, 3, 4, 5].map(si => <Star key={si} size={14} fill="#fbbf24" color="#fbbf24" />)}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 24, color: teal }}>{br.B.score}</div>
                </div>

                <div style={{ fontSize: 14, color: "#78716c", lineHeight: 1.6, marginBottom: 16 }}>
                  {br.B.type} · From {br.B.spread} pips · {br.B.minDep === 0 ? "No min deposit" : `$${br.B.minDep} minimum`}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {[
                    i === 0 ? "Best overall — top scores across all categories" : i === 1 ? "Great platforms and research tools" : "Competitive pricing and fast execution",
                    "Regulated & safe — your money is protected",
                    "Easy account opening — start in minutes",
                  ].map((f, fi) => (
                    <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                      <CheckCircle size={16} color={teal} />
                      <span style={{ color: "#44403c" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                    flex: 1, padding: "14px", borderRadius: 12, background: teal,
                    color: "#fff", fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                  }}>Open Account <ArrowRight size={14} /></a>
                  <Link to={lp(`/review/${br.slug}`)} style={{
                    padding: "14px 18px", borderRadius: 12, border: "1px solid #d6d3d1",
                    color: "#78716c", fontWeight: 600, fontSize: 14, textDecoration: "none",
                    background: "#fff",
                  }}>Review</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why trust us */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: mob ? 24 : 48, alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px",
              borderRadius: 100, background: "#fff", border: "1px solid #e5ddd4", marginBottom: 16,
            }}>
              <Shield size={13} color={teal} />
              <span style={{ fontSize: 13, fontWeight: 700, color: teal }}>Why Trust Us</span>
            </div>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, marginBottom: 12, lineHeight: 1.15 }}>
              Real Testing,<br />Honest Results
            </h2>
            <p style={{ fontSize: 16, color: "#78716c", lineHeight: 1.7, marginBottom: 20 }}>
              We don't just read about brokers — we test them. Real accounts, real money,
              real trades. No broker can pay for a better ranking.
            </p>
            <Link to={lp("/methodology")} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 15, fontWeight: 700, color: teal, textDecoration: "none",
            }}>How We Test <ArrowRight size={14} /></Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { val: String(brokers.length), label: "Brokers Tested", icon: <Users size={18} color={teal} /> },
              { val: "100+", label: "Trades per Broker", icon: <TrendingUp size={18} color={teal} /> },
              { val: "6", label: "Score Categories", icon: <Star size={18} color={teal} /> },
              { val: "$0", label: "From Brokers", icon: <Shield size={18} color={teal} /> },
            ].map((m, i) => (
              <div key={i} style={{
                padding: "20px", borderRadius: 16, background: "#fff", border: "1px solid #e7e5e4",
                textAlign: "center",
              }}>
                <div style={{ marginBottom: 8 }}>{m.icon}</div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 24, color: "#1c1917" }}>{m.val}</div>
                <div style={{ fontSize: 13, color: "#a8a29e", marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ background: "#fff", padding: mob ? "48px 0" : "72px 0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 8 }}>
            Find Brokers by Category
          </h2>
          <p style={{ textAlign: "center", color: "#78716c", fontSize: 15, marginBottom: 28 }}>
            Specialized rankings for every trading style
          </p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
            {RANKINGS.map((r, i) => (
              <Link key={i} to={lp(r.path)} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", borderRadius: 14, background: cream, border: "1px solid #e5ddd4",
                textDecoration: "none", color: "#44403c", fontWeight: 600, fontSize: 14,
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = teal; e.currentTarget.style.color = teal; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5ddd4"; e.currentTarget.style.color = "#44403c"; }}
              >
                <span>{r.title}</span>
                <ChevronRight size={14} color="#a8a29e" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 8 }}>By Country</h2>
        <p style={{ textAlign: "center", color: "#78716c", fontSize: 15, marginBottom: 28 }}>
          Find brokers regulated in your country
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 10 }}>
          {COUNTRIES.map((c, i) => (
            <Link key={i} to={lp(c.path)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
              borderRadius: 12, background: "#fff", border: "1px solid #e7e5e4",
              textDecoration: "none", color: "#1c1917", transition: "all 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = teal}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e7e5e4"}
            >
              <CountryFlag code={c.code} size={24} />
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{c.name}</span>
              <span style={{ fontSize: 12, color: teal, fontWeight: 700 }}>{c.reg}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest reviews */}
      <section style={{ background: "#fff", padding: mob ? "48px 0" : "72px 0" }}>
        <div style={cn}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
            <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, margin: 0 }}>Latest Reviews</h2>
            <Link to={lp("/reviews")} style={{ fontSize: 14, fontWeight: 600, color: teal, textDecoration: "none" }}>
              All Reviews <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
            {brokers.slice(0, 3).map((br) => (
              <Link key={br.slug} to={lp(`/review/${br.slug}`)} style={{
                padding: "20px", borderRadius: 16, background: cream, border: "1px solid #e5ddd4",
                textDecoration: "none", color: "#1c1917", transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = teal; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5ddd4"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <BrokerLogo slug={br.slug} name={br.B.name} size={36} shape="wide" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16 }}>{br.B.name}</div>
                    <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill="#fbbf24" color="#fbbf24" />)}
                    </div>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 18, color: teal }}>{br.B.score}</div>
                </div>
                <div style={{ fontSize: 14, color: "#78716c", lineHeight: 1.6 }}>
                  {br.B.type} · From {br.B.spread} pips · {br.B.minDep === 0 ? "No min" : `$${br.B.minDep} min`}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{
        background: teal, padding: mob ? "56px 16px" : "80px 24px", textAlign: "center",
      }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <Heart size={32} color="#fff" style={{ marginBottom: 16 }} />
          <h2 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 26 : 36, color: "#fff", marginBottom: 12, lineHeight: 1.1 }}>
            Not Sure Where to Start?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 28, lineHeight: 1.7 }}>
            Our beginner's guide walks you through everything step by step.
            No jargon, no pressure.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to={lp("/best-forex-brokers-for-beginners")} style={{
              display: "inline-block", padding: "16px 36px", background: "#fff", color: teal,
              fontWeight: 800, fontSize: 16, borderRadius: 14, textDecoration: "none",
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
