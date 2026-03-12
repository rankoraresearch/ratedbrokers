/**
 * PROTO 12: "Beginner Warm"
 * Warm, inviting, step-by-step approach.
 * Cream/peach tones, teal + coral accents. Feels like a helpful guide.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, visitUrl } from "./shared";
import { BookOpen, ArrowRight, CheckCircle, Compass, Star, ChevronRight } from "lucide-react";

export default function Proto12() {
  const { mob } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top3 = brokers.slice(0, 3);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const teal = "#0d9488";
  const coral = "#f97066";
  const cream = "#fef7ed";

  const steps = [
    { num: "01", title: "Choose Your Style", desc: "Scalper, swing, or long-term? We have rankings for each.", icon: <Compass size={24} color={teal} /> },
    { num: "02", title: "Compare Brokers", desc: "See detailed side-by-side comparisons on fees, platforms, and safety.", icon: <BookOpen size={24} color={teal} /> },
    { num: "03", title: "Start Trading", desc: "Open your account with confidence. We tested them all.", icon: <CheckCircle size={24} color={teal} /> },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: cream, minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{
        ...cn, padding: mob ? "48px 16px 40px" : "80px 24px 64px", textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px",
          borderRadius: 100, background: "#fff", border: "1px solid #e5ddd4",
          marginBottom: 24,
        }}>
          <BookOpen size={14} color={teal} />
          <span style={{ fontSize: 13, fontWeight: 700, color: teal }}>New to Forex? Start here</span>
        </div>

        <h1 style={{
          fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 30 : 52,
          lineHeight: 1.1, color: "#1c1917", marginBottom: 16,
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
            boxShadow: "0 4px 20px rgba(13,148,136,0.25)",
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

      {/* Top picks — warm cards */}
      <section style={{ background: "#fff", padding: mob ? "48px 0" : "72px 0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, textAlign: "center", marginBottom: 8 }}>
            Our Top Picks for Beginners
          </h2>
          <p style={{ textAlign: "center", color: "#78716c", fontSize: 16, marginBottom: 36 }}>
            Safe, easy to use, and great for learning
          </p>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {top3.map((br, i) => (
              <div key={br.slug} style={{
                background: cream, borderRadius: 20, padding: "24px",
                border: i === 0 ? `2px solid ${teal}` : "1px solid #e7e5e4",
                position: "relative",
              }}>
                {i === 0 && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    padding: "4px 16px", borderRadius: 100, background: coral, color: "#fff",
                    fontSize: 12, fontWeight: 700,
                  }}>Beginner's Choice</div>
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
                  {br.B.type} · From {br.B.spread} pips · ${br.B.minDep} minimum deposit
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Regulated & safe", "Easy-to-use platform", "Good educational resources"].map((f, fi) => (
                    <div key={fi} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                      <CheckCircle size={16} color={teal} />
                      <span style={{ color: "#44403c" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                  <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                    flex: 1, padding: "14px", borderRadius: 12, background: teal,
                    color: "#fff", fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none",
                  }}>Open Account</a>
                  <Link to={lp(`/review/${br.slug}`)} style={{
                    padding: "14px 18px", borderRadius: 12, border: "1px solid #d6d3d1",
                    color: "#78716c", fontWeight: 600, fontSize: 14, textDecoration: "none",
                  }}>Read Review</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — warm grid */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 28 }}>
          Find Brokers by Category
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
          {RANKINGS.map((r, i) => (
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

      {/* Bottom CTA */}
      <section style={{
        background: teal, padding: mob ? "48px 16px" : "64px 24px", textAlign: "center",
        borderRadius: mob ? 0 : "24px 24px 0 0", maxWidth: mob ? "100%" : 1100, margin: "0 auto",
      }}>
        <div style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 24 : 36, color: "#fff", marginBottom: 12 }}>
          Not sure where to start?
        </div>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginBottom: 28 }}>
          Our beginner's guide walks you through everything step by step.
        </p>
        <Link to={lp("/best-forex-brokers-for-beginners")} style={{
          display: "inline-block", padding: "16px 36px", background: "#fff", color: teal,
          fontWeight: 800, fontSize: 16, borderRadius: 12, textDecoration: "none",
        }}>Beginner's Guide →</Link>
      </section>
    </div>
  );
}
