/**
 * RankingProtoB — прототип в стиле BestBrokers.com
 * Простой, понятный, information-dense дизайн
 * URL: /proto/ranking-b
 */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { getBrokersForRanking } from "../data/rankingFilters";
import SEO_CONTENT from "../data/rankingSeoContent";
import { getThematicData, getBrokerBlurb, getQuickVerdict } from "../data/rankingThematic";
import Accordion from "../components/Accordion";
import { getAuthorForRanking, getFactChecker, getReviewerForAuthor, getEditor } from "../data/authors";
import AuthorCredits from "../components/AuthorCredits";
import AuthorBioCard from "../components/AuthorBioCard";
import AffiliateDisclosureBanner from "../components/AffiliateDisclosureBanner";
import Breadcrumb from "../components/Breadcrumb";
import { ArrowRight } from "../components/Icon";
import { Trophy, Star, ExternalLink, Linkedin } from "lucide-react";
import BrokerLogo from "../components/BrokerLogo";
import ScoreBadge from "../components/ScoreBadge";
import RegBadge from "../components/RegBadge";

import { getVisitUrl as makeVisitUrl } from "../utils/visitUrl";
const YEAR = "2026";

// BestBrokers-inspired color palette
const C = {
  blue: "#4da8c4",
  blueDark: "#3d8faa",
  blueLight: "#e8f4f8",
  green: "#4caf50",
  greenDark: "#43a047",
  orange: "#f5a623",
  orangeLight: "#fef3dc",
  navy: "#1a1a2e",
  cardBg: "#ffffff",
  pageBg: "#f5f7fa",
  text: "#333333",
  textLight: "#666666",
  border: "#e0e5ea",
  trustpilot: "#00b67a",
};

// ─── Quick Preview Grid ───
function QuickPreviewGrid({ brokers, mob }) {
  const top8 = brokers.slice(0, 8);
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
      gap: mob ? 6 : 8,
    }}>
      {top8.map((broker, i) => {
        const B = broker.B;
        return (
          <a key={broker.slug} href={`#broker-${broker.slug}`} style={{
            display: "flex", alignItems: "center", gap: mob ? 10 : 12,
            padding: mob ? "10px 12px" : "12px 16px",
            background: C.blue, borderRadius: 8,
            textDecoration: "none", position: "relative",
            transition: "background 0.15s",
          }}>
            {/* Rank number */}
            <div style={{
              width: 24, height: 24, borderRadius: 4,
              background: i === 0 ? C.orange : "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 12, color: "#fff", flexShrink: 0,
            }}>{i + 1}</div>

            {/* Logo on dark bg */}
            <div style={{
              width: mob ? 80 : 100, height: 32, borderRadius: 4,
              background: C.navy, display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0, overflow: "hidden",
            }}>
              <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={24} shape="brand" />
            </div>

            {/* Name */}
            <span style={{
              fontWeight: 700, fontSize: mob ? 14 : 15,
              color: "#fff", flex: 1,
            }}>{B.name}</span>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
              <Star size={13} color="#fbbf24" fill="#fbbf24" />
              <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{B.score}</span>
            </div>

            {/* Top Rated badge for #1 */}
            {i === 0 && (
              <div style={{
                position: "absolute", top: -8, right: 12,
                background: C.orange, padding: "2px 10px", borderRadius: 4,
                fontSize: 10, fontWeight: 800, color: "#fff", textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}>Top Rated</div>
            )}
          </a>
        );
      })}
    </div>
  );
}

// ─── Full Broker Card (BestBrokers-style two-column) ───
function FullBrokerCard({ broker, rank, mob, tab, thematicBlurb }) {
  const B = broker.B;
  const visitUrl = makeVisitUrl(broker.slug, B.url);
  const reviewPath = `/review/${broker.slug}`;

  const dataPoints = [
    { label: "MIN DEPOSIT", value: B.minDep ? `$${B.minDep}` : "$0" },
    { label: "MIN SPREAD", value: `${B.spread || "0.0"} pips` },
    { label: "INSTRUMENTS", value: B.instruments || "N/A" },
    { label: "REGULATIONS", value: B.regs.map(r => r.name).join(", ") },
    { label: "PLATFORMS", value: B.platforms?.slice(0, 3).join(", ") || "MT4, MT5" },
    { label: "LEVERAGE", value: B.leverage || "1:500" },
  ];

  if (mob) {
    // Mobile: stacked layout
    return (
      <div id={`broker-${broker.slug}`} style={{ marginBottom: 16 }}>
        <div style={{
          background: C.cardBg, borderRadius: 10,
          border: `1px solid ${C.border}`,
          overflow: "hidden",
        }}>
          {/* Name band */}
          <div style={{
            background: C.blue, padding: "10px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 4,
                background: rank === 1 ? C.orange : "rgba(255,255,255,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 800, fontSize: 11, color: "#fff",
              }}>{rank}</div>
              <span style={{
                fontWeight: 700, fontSize: 16, color: "#fff",
                fontStyle: "italic",
              }}>{B.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Star size={13} color="#fbbf24" fill="#fbbf24" />
              <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{B.score}</span>
            </div>
          </div>

          {/* Logo + CTAs */}
          <div style={{ padding: "14px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 80, height: 50, borderRadius: 6,
              background: C.navy, display: "flex",
              alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={36} shape="brand" />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                padding: "10px", borderRadius: 6, textDecoration: "none",
                background: C.green, color: "#fff",
                fontWeight: 700, fontSize: 13, textAlign: "center",
                textTransform: "uppercase", letterSpacing: "0.3px",
              }}>Trade Now</a>
              <Link to={reviewPath} style={{
                padding: "10px", borderRadius: 6, textDecoration: "none",
                background: C.orange, color: "#fff",
                fontWeight: 700, fontSize: 13, textAlign: "center",
                textTransform: "uppercase", letterSpacing: "0.3px",
              }}>Read Review</Link>
            </div>
          </div>

          {/* Trustpilot */}
          {B.tp && (
            <div style={{
              padding: "8px 14px", borderTop: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <Star size={14} color={C.trustpilot} fill={C.trustpilot} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.trustpilot }}>{B.tp}/5</span>
              <span style={{ fontSize: 12, color: C.textLight }}>Trustpilot ({B.tpCount?.toLocaleString()})</span>
            </div>
          )}

          {/* Data grid */}
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {dataPoints.map((dp, i) => (
              <div key={dp.label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 14px",
                borderBottom: i < dataPoints.length - 1 ? `1px solid ${C.border}` : "none",
                background: i % 2 === 0 ? "#fafbfc" : "#fff",
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.textLight, textTransform: "uppercase" }}>{dp.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.text, textAlign: "right", maxWidth: "60%" }}>{dp.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Warning */}
        {B.riskWarning && (
          <div style={{
            background: C.orangeLight, padding: "10px 14px",
            borderRadius: "0 0 8px 8px", marginTop: -2,
            fontSize: 11, fontStyle: "italic", color: "#7c6a3c",
            lineHeight: 1.5,
          }}>{B.riskWarning}</div>
        )}

        {/* Description */}
        {thematicBlurb?.text && (
          <p style={{
            fontSize: 13, lineHeight: 1.7, color: C.text,
            margin: "10px 0 0", padding: "0 4px",
          }}>{thematicBlurb.text.slice(0, 200)}...</p>
        )}
      </div>
    );
  }

  // Desktop/Tablet: two-column layout
  return (
    <div id={`broker-${broker.slug}`} style={{ marginBottom: 20 }}>
      <div style={{
        background: C.cardBg, borderRadius: 10,
        border: `1px solid ${C.border}`,
        overflow: "hidden",
        display: "flex",
      }}>
        {/* LEFT COLUMN: Logo + CTAs + Trustpilot */}
        <div style={{
          width: tab ? 220 : 260, flexShrink: 0,
          padding: "20px", borderRight: `1px solid ${C.border}`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
          position: "relative",
        }}>
          {/* Rank badge */}
          <div style={{
            position: "absolute", top: 10, left: 10,
            width: 28, height: 28, borderRadius: 6,
            background: rank === 1 ? C.orange : C.blue,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14, color: "#fff",
          }}>{rank}</div>

          {/* Logo on dark bg */}
          <div style={{
            width: "100%", height: 70, borderRadius: 8,
            background: C.navy, display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>
            <BrokerLogo slug={broker.slug} name={B.name} fallback={B.logo} size={48} shape="brand" />
          </div>

          {/* TRADE NOW */}
          <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
            width: "100%", padding: "12px", borderRadius: 6,
            textDecoration: "none", background: C.green, color: "#fff",
            fontWeight: 700, fontSize: 14, textAlign: "center",
            textTransform: "uppercase", letterSpacing: "0.5px",
            display: "block",
          }}>Trade Now</a>

          {/* READ REVIEW */}
          <Link to={reviewPath} style={{
            width: "100%", padding: "12px", borderRadius: 6,
            textDecoration: "none", background: C.orange, color: "#fff",
            fontWeight: 700, fontSize: 14, textAlign: "center",
            textTransform: "uppercase", letterSpacing: "0.5px",
            display: "block",
          }}>Read Review</Link>

          {/* Trustpilot */}
          {B.tp && (
            <div style={{
              width: "100%", padding: "8px 0",
              borderTop: `1px solid ${C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: "auto",
            }}>
              <Star size={15} color={C.trustpilot} fill={C.trustpilot} />
              <span style={{ fontSize: 14, fontWeight: 700, color: C.trustpilot }}>{B.tp}/5</span>
              <span style={{ fontSize: 11, color: C.textLight }}>({B.tpCount?.toLocaleString()})</span>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Name band + Data */}
        <div style={{ flex: 1 }}>
          {/* Name band */}
          <div style={{
            background: C.blue, padding: "14px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{
              fontWeight: 700, fontSize: tab ? 22 : 26,
              color: "#fff", fontStyle: "italic",
            }}>{B.name}</span>
            {B.badge && (
              <span style={{
                padding: "4px 12px", borderRadius: 4,
                background: "rgba(255,255,255,0.2)", color: "#fff",
                fontSize: 12, fontWeight: 700,
              }}>{B.badge}</span>
            )}
          </div>

          {/* Data grid 3x2 */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          }}>
            {dataPoints.map((dp, i) => (
              <div key={dp.label} style={{
                padding: tab ? "12px 14px" : "14px 20px",
                borderBottom: i < 3 ? `1px solid ${C.border}` : "none",
                borderRight: (i % 3 !== 2) ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{
                  fontSize: 10, fontWeight: 700, color: C.textLight,
                  textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4,
                }}>{dp.label}</div>
                <div style={{
                  fontSize: tab ? 13 : 14, fontWeight: 600, color: C.text,
                }}>{dp.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Warning */}
      {B.riskWarning && (
        <div style={{
          background: C.orangeLight, padding: "10px 20px",
          borderRadius: "0 0 8px 8px",
          fontSize: 12, fontStyle: "italic", color: "#7c6a3c",
          lineHeight: 1.5,
        }}>{B.riskWarning}</div>
      )}

      {/* Description text */}
      {thematicBlurb?.text && (
        <p style={{
          fontSize: 14, lineHeight: 1.8, color: C.text,
          margin: "12px 0 0", padding: "0 4px",
        }}>{thematicBlurb.text}</p>
      )}
    </div>
  );
}

// ─── Main Page ───
export default function RankingProtoB() {
  const { mob, tab } = useMedia();
  const [openFaq, setOpenFaq] = useState(null);

  const rankingId = "forex-overall";
  const brokers = getBrokersForRanking(rankingId);
  const seo = SEO_CONTENT[rankingId] || {};
  const topBroker = brokers[0]?.B?.name || "IC Markets";
  const author = getAuthorForRanking("forex");
  const editor = getEditor();
  const reviewer = getReviewerForAuthor(author.id);
  const factChecker = getFactChecker(author.id);

  const fillVars = (text) =>
    text?.replace(/\{year\}/g, YEAR).replace(/\{topBroker\}/g, topBroker).replace(/\{count\}/g, String(brokers.length)) || "";

  const cn = { maxWidth: 1140, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };

  return (
    <main style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: C.pageBg, minHeight: "100vh" }}>

      {/* BREADCRUMB */}
      <div style={{ ...cn, padding: mob ? "10px 16px" : "14px 24px" }}>
        <Breadcrumb items={[
          { label: "Home", path: "/" },
          { label: `Best Forex Brokers in March ${YEAR}` },
        ]} />
      </div>

      {/* HERO BAND — BestBrokers blue gradient */}
      <div style={{
        background: `linear-gradient(135deg, #7ec8e3, ${C.blue})`,
        padding: mob ? "36px 16px" : "52px 24px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative shapes */}
        {!mob && (
          <>
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 200, height: 200, borderRadius: "50%",
              background: "rgba(245,166,35,0.25)",
            }} />
            <div style={{
              position: "absolute", bottom: -30, left: 60,
              width: 120, height: 120, borderRadius: "50%",
              background: "rgba(139,195,74,0.2)",
            }} />
          </>
        )}

        <div style={{ ...cn, position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{
            fontWeight: 900, fontStyle: "italic",
            fontSize: mob ? 26 : tab ? 34 : 42,
            lineHeight: 1.1, color: "#fff", marginBottom: 8,
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}>Best Forex Brokers in March {YEAR}</h1>
          <p style={{
            fontSize: mob ? 14 : 16, color: "rgba(255,255,255,0.85)",
            maxWidth: 500, margin: "0 auto",
          }}>
            {brokers.length} brokers independently tested and ranked
          </p>
        </div>
      </div>

      {/* AUTHOR BYLINE */}
      <section style={{
        ...cn, paddingTop: mob ? 12 : 16,
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 13, color: C.textLight }}>By</span>
        <Link to={`/author/${author.id}`} style={{
          fontSize: 13, fontWeight: 700, color: C.blue, textDecoration: "none",
        }}>{author.name}</Link>
        <a href={`https://linkedin.com/in/${author.id}`} target="_blank" rel="noopener" style={{ display: "flex" }}>
          <Linkedin size={14} color={C.blue} />
        </a>
        <span style={{ fontSize: 13, color: C.textLight }}>Updated March {YEAR}</span>
      </section>

      {/* AFFILIATE DISCLOSURE */}
      <section style={{ ...cn, paddingTop: 10 }}>
        <AffiliateDisclosureBanner />
      </section>

      {/* QUICK PREVIEW GRID */}
      <section style={{ ...cn, paddingTop: mob ? 16 : 24 }}>
        <h2 style={{
          fontWeight: 800, fontSize: mob ? 18 : 22,
          color: C.text, marginBottom: mob ? 10 : 14,
        }}>Quick Overview: Top {Math.min(8, brokers.length)} Brokers</h2>
        <QuickPreviewGrid brokers={brokers} mob={mob} />
      </section>

      {/* INTRO TEXT */}
      <section style={{ ...cn, paddingTop: mob ? 16 : 24 }}>
        {(seo.intro || []).map((p, i) => (
          <p key={i} style={{
            fontSize: 15, lineHeight: 1.8, color: C.text,
            marginBottom: 12,
          }}>{fillVars(p)}</p>
        ))}
      </section>

      {/* FULL BROKER CARDS */}
      <section style={{ ...cn, paddingTop: mob ? 16 : 24, paddingBottom: mob ? 16 : 24 }}>
        <h2 style={{
          fontWeight: 800, fontSize: mob ? 20 : 26,
          color: C.text, marginBottom: mob ? 16 : 20,
        }}>Best Forex Brokers {YEAR}</h2>

        {brokers.map((broker, i) => (
          <FullBrokerCard
            key={broker.slug}
            broker={broker}
            rank={i + 1}
            mob={mob}
            tab={tab}
            thematicBlurb={getBrokerBlurb(rankingId, broker.slug, broker)}
          />
        ))}
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: mob ? 18 : 22, color: C.text, marginBottom: mob ? 12 : 16 }}>
          Broker Comparison Table
        </h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%", borderCollapse: "collapse",
            background: C.cardBg, borderRadius: 8, overflow: "hidden",
            border: `1px solid ${C.border}`,
            minWidth: mob ? 600 : undefined,
          }}>
            <thead>
              <tr style={{ background: C.blue }}>
                {["#", "Broker", "Score", "Min Deposit", "Spread", "Leverage", "Regulation"].map(h => (
                  <th key={h} style={{
                    padding: "10px 12px", textAlign: "left",
                    fontSize: 12, fontWeight: 700, color: "#fff",
                    textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brokers.slice(0, 10).map((broker, i) => (
                <tr key={broker.slug} style={{
                  background: i % 2 === 0 ? "#fff" : "#fafbfc",
                  borderBottom: `1px solid ${C.border}`,
                }}>
                  <td style={{ padding: "10px 12px", fontWeight: 800, fontSize: 14, color: C.textLight }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <BrokerLogo slug={broker.slug} name={broker.B.name} fallback={broker.B.logo} size={24} shape="brand" />
                      <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{broker.B.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Star size={12} color="#fbbf24" fill="#fbbf24" />
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{broker.B.score}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 13 }}>${broker.B.minDep || 0}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13 }}>{broker.B.spread} pips</td>
                  <td style={{ padding: "10px 12px", fontSize: 13 }}>{broker.B.leverage}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13 }}>{broker.B.regs.slice(0, 3).map(r => r.name).join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* WHAT TO LOOK FOR */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: mob ? 18 : 22, color: C.text, marginBottom: mob ? 12 : 16 }}>
          How to Choose a Forex Broker
        </h2>
        <div style={{
          background: C.cardBg, borderRadius: 10,
          border: `1px solid ${C.border}`, padding: mob ? "16px" : "24px",
        }}>
          {[
            { h: "1. Check Regulation", t: "Only trade with brokers regulated by Tier-1 authorities: FCA (UK), ASIC (Australia), CySEC (EU), or SEC (US). These regulators require segregated client funds and participation in compensation schemes." },
            { h: "2. Compare Total Costs", t: "Look beyond advertised spreads. Calculate total cost per lot including spreads, commissions, and swap rates. A 0.0 pip spread with $7/lot commission may be cheaper than 1.0 pip with no commission." },
            { h: "3. Test the Platform", t: "Open a demo account and test order execution, charting tools, and mobile app responsiveness. The best platform is the one you're comfortable using under pressure." },
            { h: "4. Verify Withdrawal Speed", t: "Before depositing large amounts, test with a small withdrawal. Reliable brokers process withdrawals within 1-2 business days." },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: i < 3 ? 16 : 0 }}>
              <h3 style={{ fontWeight: 700, fontSize: 15, color: C.text, marginBottom: 4 }}>{item.h}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: C.textLight, margin: 0 }}>{item.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <h2 style={{ fontWeight: 800, fontSize: mob ? 18 : 22, color: C.text, marginBottom: mob ? 12 : 16 }}>
          Frequently Asked Questions
        </h2>
        <Accordion
          items={(seo.faq || []).slice(0, 6).map(item => ({ q: fillVars(item.q), a: fillVars(item.a) }))}
          expanded={openFaq}
          setExpanded={setOpenFaq}
        />
      </section>

      {/* METHODOLOGY */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <div style={{
          background: C.blue, borderRadius: 10,
          padding: mob ? "24px 16px" : "32px 28px", textAlign: "center",
        }}>
          <h3 style={{ fontWeight: 800, fontSize: mob ? 18 : 22, color: "#fff", marginBottom: 8 }}>
            Our Testing Methodology
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", maxWidth: 460, margin: "0 auto 16px", lineHeight: 1.6 }}>
            {brokers.length} brokers tested across 130+ data points. Licenses verified directly with regulators. Spreads measured live.
          </p>
          <Link to="/methodology" style={{
            display: "inline-block", padding: "12px 28px", borderRadius: 6,
            background: "#fff", color: C.blue,
            fontWeight: 700, fontSize: 14, textDecoration: "none",
            textTransform: "uppercase", letterSpacing: "0.3px",
          }}>Read Methodology</Link>
        </div>
      </section>

      {/* AUTHOR BIO */}
      <section style={{ ...cn, paddingBottom: mob ? 16 : 24 }}>
        <AuthorBioCard author={author} />
      </section>

      {/* FOOTER DISCLOSURE */}
      <section style={{ ...cn, paddingBottom: mob ? 24 : 32 }}>
        <div style={{
          fontSize: 12, fontStyle: "italic", color: C.textLight,
          lineHeight: 1.6, padding: mob ? "16px" : "20px",
          background: C.cardBg, borderRadius: 8,
          border: `1px solid ${C.border}`,
        }}>
          <strong>Risk Disclaimer:</strong> Trading forex and CFDs involves significant risk of loss and is not suitable for all investors. Past performance is not indicative of future results. You should carefully consider your investment objectives, level of experience, and risk appetite before trading. Only trade with money you can afford to lose.
        </div>
      </section>
    </main>
  );
}
