/**
 * PROTO 4: "Editorial" (Financial Times / Bloomberg Magazine)
 * Serif headlines, off-white background, red accents.
 * Content-first, authoritative, newspaper-like credibility.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, visitUrl } from "./shared";
import { AUTHORS } from "../../data/authors";
import AuthorAvatar from "../../components/AuthorAvatar";

export default function Proto4() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top5 = brokers.slice(0, 5);
  const cn = { maxWidth: 1080, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const red = "#dc2626";
  const serif = "Georgia, 'Times New Roman', serif";
  const author = Object.values(AUTHORS)[0];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#faf9f7", color: "#1a1a1a", minHeight: "100vh" }}>

      {/* Top bar */}
      <div style={{ borderBottom: "3px solid #1a1a1a", padding: "12px 0" }}>
        <div style={{ ...cn, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: serif, fontSize: 12, color: "#6b7280", fontStyle: "italic" }}>Independent Broker Analysis</span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>March 2026 Edition</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ ...cn, padding: mob ? "40px 16px" : "56px 24px 48px", borderBottom: "1px solid #d4d0c8" }}>
        <div style={{ maxWidth: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ padding: "4px 10px", background: red, color: "#fff", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
              Exclusive Rankings
            </span>
            <span style={{ fontSize: 13, color: "#6b7280" }}>Updated March 12, 2026</span>
          </div>
          <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: mob ? 32 : 52, lineHeight: 1.15, color: "#1a1a1a", marginBottom: 16 }}>
            The Best Forex Brokers of 2026, Ranked by Our Research Team
          </h1>
          <p style={{ fontFamily: serif, fontSize: mob ? 18 : 22, color: "#4b5563", lineHeight: 1.6, fontStyle: "italic", marginBottom: 24 }}>
            After depositing real money and executing over 500 trades at each of {brokers.length} brokers, our analysts present the definitive ranking for this quarter.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <AuthorAvatar author={author} size={44} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>By {author?.name || "Marcus Chen"}</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{author?.role || "Senior Forex Analyst"} · 8 min read</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content: two-column layout */}
      <section style={{ ...cn, padding: mob ? "32px 16px" : "48px 24px" }}>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 32 : 48 }}>

          {/* Main column */}
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: serif, fontSize: 18, lineHeight: 1.8, color: "#374151", marginBottom: 32 }}>
              The forex brokerage industry enters 2026 in a state of consolidation. Regulatory pressure from the FCA, ASIC, and CySEC continues to reshape the landscape, pushing out undercapitalized operators while rewarding brokers who invest in genuine infrastructure. Our quarterly ranking reflects these shifts — and one broker continues to stand apart.
            </p>

            {/* Ranked list */}
            {top5.map((br, i) => (
              <div key={br.slug} style={{
                padding: "24px 0", borderBottom: "1px solid #e5e1d8",
                display: "flex", gap: 20, alignItems: "flex-start",
              }}>
                <div style={{
                  fontFamily: serif, fontWeight: 700, fontSize: 36, color: i === 0 ? red : "#d1d5db",
                  lineHeight: 1, minWidth: 40, textAlign: "center",
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <BrokerLogo slug={br.slug} name={br.B.name} size={36} shape="wide" />
                    <Link to={lp(`/review/${br.slug}`)} style={{
                      fontFamily: serif, fontWeight: 700, fontSize: 22, color: "#1a1a1a",
                      textDecoration: "none", borderBottom: "1px solid transparent",
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderBottomColor = red}
                      onMouseLeave={e => e.currentTarget.style.borderBottomColor = "transparent"}
                    >{br.B.name}</Link>
                    <span style={{
                      fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 16,
                      color: br.B.score >= 9.5 ? red : "#1a1a1a",
                    }}>{br.B.score}/10</span>
                  </div>
                  <p style={{ fontFamily: serif, fontSize: 16, lineHeight: 1.7, color: "#4b5563", marginBottom: 12, marginTop: 0 }}>
                    {br.B.type} broker. Spreads from {br.B.spread} pips, ${br.B.minDep} minimum deposit.
                    {br.B.regs?.length > 0 && ` Regulated by ${br.B.regs.slice(0, 2).map(r => r.name).join(" and ")}.`}
                  </p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <Link to={lp(`/review/${br.slug}`)} style={{ fontSize: 14, fontWeight: 700, color: red, textDecoration: "none" }}>
                      Read Full Review →
                    </Link>
                    <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", textDecoration: "none" }}>
                      Visit Broker
                    </a>
                  </div>
                </div>
              </div>
            ))}

            <Link to={lp("/best-forex-brokers")} style={{
              display: "inline-block", marginTop: 24, padding: "14px 28px", border: `2px solid ${red}`,
              color: red, fontWeight: 700, fontSize: 15, textDecoration: "none", borderRadius: 4,
            }}>View Complete Rankings →</Link>
          </div>

          {/* Sidebar */}
          {!mob && (
            <div style={{ width: 280, flexShrink: 0 }}>
              <div style={{ borderTop: `3px solid ${red}`, paddingTop: 16, marginBottom: 32 }}>
                <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>
                  Rankings by Category
                </div>
                {RANKINGS.slice(0, 8).map((r, i) => (
                  <Link key={i} to={lp(r.path)} style={{
                    display: "block", padding: "10px 0", borderBottom: "1px solid #e5e1d8",
                    fontSize: 14, fontWeight: 600, color: "#374151", textDecoration: "none",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = red}
                    onMouseLeave={e => e.currentTarget.style.color = "#374151"}
                  >{r.title}</Link>
                ))}
              </div>

              <div style={{ borderTop: `3px solid #1a1a1a`, paddingTop: 16 }}>
                <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
                  Key Numbers
                </div>
                {[
                  [String(brokers.length), "Brokers independently tested"],
                  ["500+", "Live trades per broker"],
                  ["6", "Scoring criteria"],
                  ["$200", "Average minimum deposit"],
                ].map(([val, label], i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 24, color: "#1a1a1a" }}>{val}</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
