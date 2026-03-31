import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ShieldAlert, Shield, AlertTriangle, ExternalLink,
  ArrowRight, ChevronRight, ChevronDown, Star,
} from "lucide-react";
import { useMedia } from "../hooks/useMedia";
import { getWarningData } from "../data/warnings";
import { getBrokerData } from "../data/brokers";
import { getVisitUrl } from "../utils/visitUrl";
import { AUTHORS } from "../data/authors";
import TRUSTPILOT_LINKS from "../data/trustpilot-links";
import AuthorCredits from "../components/AuthorCredits";
import TrustpilotLogo from "../components/TrustpilotLogo";
import FaqSection from "../components/subpage/FaqSection";
import { H2 } from "../components/subpage/Typography";

/* ── Palette v3 — muted, sophisticated ───────────────── */
const C = {
  navy: "#0f172a",
  danger: "#be123c",
  dangerBg: "#fff5f7",
  dangerBorder: "#fecdd3",
  safe: "#047857",
  safeLight: "#ecfdf5",
  orange: "#f59e0b",
  ctaGrad: "linear-gradient(135deg, #f59e0b, #fbbf24)",
  gray: "#374151",
  grayMuted: "#6b7280",
  grayLight: "#9ca3af",
  border: "#e5e7eb",
  white: "#fff",
  bg: "#fafafa",
};

const BASE = import.meta.env.BASE_URL;

const TOC = [
  { id: "verdict", label: "Our Verdict" },
  { id: "methodology", label: "How We Investigated" },
  { id: "red-flags", label: "Red Flags" },
  { id: "alternatives", label: "Safe Alternatives" },
  { id: "key-facts", label: "Key Facts" },
  { id: "regulatory-warnings", label: "Regulatory Warnings" },
  { id: "user-complaints", label: "User Complaints" },
  { id: "what-to-do", label: "What To Do" },
  { id: "faq", label: "FAQ" },
];

/* ── Hero Band — clean navy, rose top accent ─────────── */
function WarningHeroBand({ children, mob }) {
  return (
    <div style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    }}>
      {/* Gradient accent strip — rose to amber, premium danger signal */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, #be123c 0%, #e11d48 30%, #f59e0b 70%, #be123c 100%)",
        zIndex: 10,
      }} />
      {/* Diagonal texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, transparent 1px, transparent 60px)",
        pointerEvents: "none",
      }} />
      {/* Subtle warm glow — top-left rose, bottom-right amber */}
      <div style={{
        position: "absolute", top: -80, left: -80,
        width: 280, height: 280,
        background: "radial-gradient(circle, rgba(190,18,60,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, right: "20%",
        width: 200, height: 200,
        background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 1200, margin: "0 auto",
        padding: mob ? "32px 16px 36px" : "48px 24px 52px",
      }}>{children}</div>
    </div>
  );
}

/* ── Verdict Badge — frosted glass ───────────────────── */
function VerdictBadge({ verdict, mob }) {
  const isNotRec = verdict === "not-recommended";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "8px 20px", borderRadius: 8,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.15)",
      backdropFilter: "blur(8px)",
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: isNotRec ? "#fb7185" : "#fbbf24",
      }} />
      <span style={{
        fontSize: mob ? 11 : 13, fontWeight: 700,
        color: "rgba(255,255,255,0.85)",
        letterSpacing: "0.08em", textTransform: "uppercase",
      }}>{isNotRec ? "NOT RECOMMENDED" : "HIGH RISK"}</span>
    </div>
  );
}

/* ── Hero Stats — glass pills with Trustpilot link ───── */
function HeroStats({ data, mob }) {
  const pillStyle = {
    padding: mob ? "8px 14px" : "10px 18px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, minWidth: mob ? "calc(33% - 6px)" : undefined,
    textAlign: mob ? "center" : "left",
  };
  const labelStyle = {
    fontSize: 11, color: "rgba(255,255,255,0.45)",
    fontWeight: 600, letterSpacing: "0.04em", marginBottom: 3,
  };
  const valStyle = (bad) => ({
    fontSize: mob ? 13 : 14, fontWeight: 700,
    color: bad ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.9)",
    display: "flex", alignItems: "center",
    justifyContent: mob ? "center" : "flex-start", gap: 5,
  });
  const dot = <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fb7185", flexShrink: 0 }} />;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: mob ? 8 : 12, marginTop: 20 }}>
      <div style={pillStyle}>
        <div style={labelStyle}>Regulation</div>
        <div style={valStyle(true)}>{dot}{data.regulation || "None"}</div>
      </div>
      {/* Trustpilot — clickable link to Quotex TP page */}
      <a
        href={`https://www.trustpilot.com/review/${data.domain}`}
        target="_blank" rel="noopener noreferrer"
        style={{ ...pillStyle, textDecoration: "none", transition: "border-color 0.15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
      >
        <div style={labelStyle}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <TrustpilotLogo size="xs" onDark /> Rating
          </span>
        </div>
        <div style={valStyle(data.trustpilot < 2)}>
          {data.trustpilot < 2 && dot}
          {data.trustpilot ? `${data.trustpilot}/5` : "N/A"}
          {data.trustpilotCount && (
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
              ({data.trustpilotCount.toLocaleString()})
            </span>
          )}
        </div>
      </a>
      <div style={pillStyle}>
        <div style={labelStyle}>Protection</div>
        <div style={valStyle(true)}>{dot}{data.keyFacts?.investorProtection || "None"}</div>
      </div>
      {!mob && (
        <div style={pillStyle}>
          <div style={labelStyle}>Issues Found</div>
          <div style={valStyle(true)}>{dot}{data.redFlags.length}</div>
        </div>
      )}
    </div>
  );
}

/* ── Danger Score Card (hero) — frosted glass ────────── */
function DangerScoreCard({ data, tab }) {
  return (
    <div style={{
      width: tab ? 220 : 260, flexShrink: 0,
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 16, padding: tab ? 18 : 24, textAlign: "center",
    }}>
      <div style={{
        fontSize: 12, color: "rgba(255,255,255,0.5)",
        fontWeight: 600, letterSpacing: "0.06em",
        textTransform: "uppercase", marginBottom: 12,
      }}>Safety Score</div>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        border: "3px solid rgba(255,255,255,0.1)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        margin: "0 auto 12px", position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "3px solid transparent",
          borderTopColor: "#fb7185", transform: "rotate(-90deg)",
        }} />
        <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 }}>0</span>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>/10</span>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
        Not Recommended
      </div>
      {data.trustpilot && (
        <div style={{
          fontSize: 12, color: "rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 6, padding: "6px 10px", marginBottom: 16,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
        }}>
          <Star size={11} fill="#f59e0b" color="#f59e0b" />
          {data.trustpilot}/5
          {data.trustpilotCount && (
            <span style={{ color: "rgba(255,255,255,0.35)" }}>({data.trustpilotCount.toLocaleString()})</span>
          )}
        </div>
      )}
      <a href="#alternatives" className="cta-primary" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        background: C.ctaGrad, color: C.navy,
        fontSize: 14, fontWeight: 700, textDecoration: "none",
        padding: "13px 20px", borderRadius: 10, width: "100%",
        boxShadow: "0 4px 12px rgba(245,158,11,0.25)",
      }}>
        <Shield size={14} /> Safe Alternatives
      </a>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 10 }}>
        {data.redFlags.length} issues identified
      </div>
    </div>
  );
}

/* ── How We Investigated (E-E-A-T) ──────────────────── */
function HowWeInvestigated({ data, mob }) {
  const steps = [
    { title: "Regulatory Database Check", desc: `We searched 30+ financial regulators worldwide for any license or registration under "${data.name}".` },
    { title: "User Complaint Analysis", desc: `We analyzed ${data.complaints?.length || "multiple"} user reports from Trustpilot, forums, and regulatory databases.` },
    { title: "Platform Verification", desc: "Our team verified withdrawal processes, customer support, and trading conditions." },
    { title: "Expert Review", desc: `${data.author.name}, ${data.author.role}, reviewed all findings for this assessment.` },
  ];
  return (
    <div id="methodology" style={{
      background: C.bg, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: mob ? "20px 16px" : "24px 28px", marginBottom: 24,
    }}>
      <h2 style={{
        fontFamily: "Outfit", fontSize: mob ? 17 : 19, fontWeight: 700,
        color: C.navy, margin: "0 0 16px",
      }}>How We Investigated {data.name}</h2>
      <div style={{
        display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 12 : 16,
      }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <span style={{
              width: 28, height: 28, borderRadius: 8,
              background: C.navy, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>{i + 1}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: C.grayMuted, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Red Flags — numbered list, left accent ──────────── */
function RedFlagsList({ flags, mob }) {
  return (
    <div id="red-flags" style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${C.danger}`,
      borderRadius: "0 12px 12px 0",
      padding: mob ? "20px 16px" : "28px 32px", marginBottom: 24,
    }}>
      <h2 style={{
        fontFamily: "Outfit", fontSize: mob ? 19 : 22, fontWeight: 800,
        color: C.navy, margin: "0 0 6px",
      }}>{flags.length} Red Flags Identified</h2>
      <p style={{ fontSize: 14, color: C.grayMuted, margin: "0 0 20px", lineHeight: 1.5 }}>
        Based on our investigation of regulatory records, user reports, and industry databases.
      </p>
      {flags.map((f, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "flex-start", gap: 14,
          padding: "14px 0",
          borderBottom: i < flags.length - 1 ? `1px solid ${C.border}` : "none",
        }}>
          <span style={{
            fontSize: 14, fontWeight: 700, color: C.grayLight,
            minWidth: 20, textAlign: "right", paddingTop: 1,
            fontVariantNumeric: "tabular-nums",
          }}>{i + 1}.</span>
          <span style={{
            fontSize: mob ? 14 : 15,
            color: f.severity === "critical" ? C.navy : C.gray,
            fontWeight: f.severity === "critical" ? 600 : 400,
            lineHeight: 1.6,
          }}>{f.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Regulatory Warnings ─────────────────────────────── */
function RegulatoryWarnings({ warnings, mob }) {
  const sc = {
    banned: { bg: C.dangerBg, border: C.dangerBorder, badge: C.danger },
    warning: { bg: "#fffbeb", border: "#fde68a", badge: "#d97706" },
    "not-regulated": { bg: C.bg, border: C.border, badge: C.grayLight },
  };
  return (
    <div id="regulatory-warnings" style={{ marginBottom: 24 }}>
      <H2>Regulatory Warnings</H2>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 12 }}>
        {warnings.map((w, i) => {
          const s = sc[w.status] || sc["not-regulated"];
          return (
            <div key={i} style={{
              borderRadius: 10, padding: mob ? "14px 16px" : "16px 20px",
              border: `1px solid ${s.border}`, background: s.bg,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{w.regulator}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em",
                  background: s.badge, color: C.white,
                  padding: "2px 10px", borderRadius: 4,
                }}>{w.status === "banned" ? "BANNED" : w.status === "warning" ? "WARNING" : "N/A"}</span>
              </div>
              <p style={{ fontSize: 13, color: C.grayMuted, lineHeight: 1.6, margin: "0 0 6px" }}>
                {w.action} ({w.date})
              </p>
              {w.url && (
                <a href={w.url} target="_blank" rel="noopener noreferrer" style={{
                  fontSize: 13, color: "#2563eb", textDecoration: "underline",
                  display: "inline-flex", alignItems: "center", gap: 4,
                }}>View source <ExternalLink size={12} /></a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Safe Alternatives — premium cards ────────────────── */
function SafeAlternatives({ slugs, mob }) {
  const brokers = slugs.map((s) => getBrokerData(s)).filter(Boolean);
  if (brokers.length === 0) return null;
  return (
    <div id="alternatives" style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: mob ? "24px 16px" : "32px 32px", marginBottom: 24,
    }}>
      <h2 style={{ fontFamily: "Outfit", fontSize: mob ? 20 : 24, fontWeight: 800, color: C.navy, margin: "0 0 6px" }}>
        Regulated Alternatives
      </h2>
      <p style={{ fontSize: 15, color: C.grayMuted, marginBottom: 20, marginTop: 6, lineHeight: 1.6 }}>
        These brokers hold top-tier licenses and offer segregated client funds with investor protection.
      </p>
      {brokers.map((bData, i) => {
        const B = bData.B;
        const slug = B.slug || slugs[i];
        const visitUrl = getVisitUrl(slug, B.url);
        const tierRegs = (B.regs || []).filter((r) => r.tier === 1).slice(0, 3);
        const tpLink = TRUSTPILOT_LINKS[slug];

        return (
          <div key={i} style={{
            background: C.bg, borderRadius: 12,
            border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${i === 0 ? C.safe : C.border}`,
            padding: mob ? "18px 16px" : "20px 24px",
            marginBottom: 12,
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
            onMouseEnter={(e) => { if (!mob) { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={(e) => { if (!mob) { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; } }}
          >
            {/* Top row: Logo + Name + Score + Badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              marginBottom: 12,
            }}>
              <img src={`${BASE}logos/${slugs[i]}.png`} alt={B.name}
                style={{ height: 42, width: 42, borderRadius: 10, objectFit: "contain" }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>{B.name}</span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    minWidth: 36, height: 28, borderRadius: 6, padding: "0 8px",
                    background: C.navy, color: "#34d399", fontSize: 14, fontWeight: 800,
                  }}>{B.score}</span>
                  {i === 0 && (
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: C.safe,
                      background: C.safeLight, padding: "3px 10px", borderRadius: 4,
                      textTransform: "uppercase", letterSpacing: "0.03em",
                    }}>Top Pick</span>
                  )}
                </div>
              </div>
            </div>

            {/* Middle row: Regs + Trustpilot (compact) */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
              marginBottom: 14, paddingBottom: 14,
              borderBottom: `1px solid ${C.border}`,
            }}>
              {tierRegs.map((r, ri) => (
                <span key={ri} style={{
                  fontSize: 11, fontWeight: 500, color: C.grayMuted,
                  background: "#f3f4f6", padding: "2px 8px", borderRadius: 4,
                }}>{r.name}</span>
              ))}
              {B.tp && (
                tpLink ? (
                  <a href={tpLink} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 11, color: C.grayLight, display: "inline-flex", alignItems: "center", gap: 3, textDecoration: "none" }}
                  >
                    <Star size={10} fill="#00B67A" color="#00B67A" /> {B.tp}
                  </a>
                ) : (
                  <span style={{ fontSize: 11, color: C.grayLight, display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <Star size={10} fill="#00B67A" color="#00B67A" /> {B.tp}
                  </span>
                )
              )}
            </div>

            {/* Bottom row: CTA buttons — EQUAL WIDTH */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-primary"
                style={{
                  background: C.ctaGrad, color: C.navy,
                  padding: "12px 0", borderRadius: 8,
                  fontSize: 14, fontWeight: 700,
                  textDecoration: "none", textAlign: "center",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                  minWidth: 180, width: 180,
                }}>Visit {B.name} <ArrowRight size={14} /></a>
              <Link to={`/review/${slugs[i]}`} style={{
                fontSize: 13, fontWeight: 600, color: C.grayMuted,
                textDecoration: "none", padding: "12px 0",
                border: `1px solid ${C.border}`, borderRadius: 8,
                textAlign: "center", minWidth: 130, width: 130,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.grayMuted; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
              >Read Review</Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Bottom Alternatives — compact grid ──────────────── */
function BottomAlternatives({ slugs, mob }) {
  const brokers = slugs.map((s) => getBrokerData(s)).filter(Boolean);
  if (brokers.length === 0) return null;
  return (
    <div style={{
      background: C.bg, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: mob ? "20px 16px" : "24px 28px", marginBottom: 24,
    }}>
      <h2 style={{
        fontFamily: "Outfit", fontSize: mob ? 18 : 20, fontWeight: 800,
        color: C.navy, margin: "0 0 16px",
      }}>Still Looking? Compare Safe Brokers</h2>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
        {brokers.map((bData, i) => {
          const B = bData.B;
          const visitUrl = getVisitUrl(B.slug || slugs[i], B.url);
          return (
            <a key={i} href={visitUrl} target="_blank" rel="noopener nofollow sponsored"
              style={{
                background: C.white, borderRadius: 10, padding: 16,
                textDecoration: "none", textAlign: "center",
                border: `1px solid ${C.border}`, transition: "all 0.2s", display: "block",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <img src={`${BASE}logos/${slugs[i]}.png`} alt={B.name}
                style={{ height: 40, width: 40, borderRadius: 8, objectFit: "contain", marginBottom: 8 }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{B.name}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.safe, margin: "4px 0 10px" }}>{B.score}/10</div>
              <span style={{
                background: C.ctaGrad, color: C.navy, padding: "8px 20px", borderRadius: 8,
                fontSize: 13, fontWeight: 700, display: "inline-block",
              }}>Visit {B.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ── User Complaints — blockquote style ──────────────── */
function UserComplaints({ complaints, mob }) {
  if (!complaints || complaints.length === 0) return null;
  return (
    <div id="user-complaints" style={{ marginBottom: 24 }}>
      <H2>User Complaints</H2>
      {complaints.map((c, i) => (
        <div key={i} style={{
          background: C.bg, borderLeft: "3px solid #d1d5db",
          borderRadius: "0 8px 8px 0", padding: mob ? "14px 16px" : "16px 22px", marginBottom: 10,
        }}>
          <p style={{ fontSize: 14, fontStyle: "italic", color: C.gray, lineHeight: 1.7, margin: "0 0 6px" }}>
            &ldquo;{c.text}&rdquo;
          </p>
          <span style={{ fontSize: 12, color: C.grayLight }}>— {c.source}, {c.date}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Key Facts — clean, dot indicators ───────────────── */
function KeyFacts({ facts, mob }) {
  const rows = Object.entries(facts);
  const labels = {
    founded: "Founded", headquarters: "Headquarters", regulation: "Regulation",
    investorProtection: "Investor Protection", segregatedFunds: "Segregated Funds",
    minDeposit: "Min Deposit", productType: "Product Type",
  };
  const isDanger = (key, val) => {
    if (key === "regulation" || key === "investorProtection") return val === "None" || val === "Unknown";
    if (key === "segregatedFunds") return val === "Unknown" || val === "No";
    if (key === "headquarters") return /offshore|seychelles|marshall|vincent/i.test(val);
    if (key === "productType") return /binary/i.test(val);
    return false;
  };
  return (
    <div id="key-facts" style={{
      background: C.white, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: mob ? "20px 16px" : "24px 28px", marginBottom: 24,
    }}>
      <h3 style={{ fontFamily: "Outfit", fontSize: mob ? 18 : 20, fontWeight: 800, color: C.navy, margin: "0 0 16px" }}>
        Key Facts
      </h3>
      {rows.map(([key, val], i) => {
        const bad = isDanger(key, val);
        return (
          <div key={key} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 0",
            borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none",
          }}>
            <span style={{ fontSize: 14, color: C.grayMuted }}>{labels[key] || key}</span>
            <span style={{
              fontSize: 14, fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: 6,
              color: bad ? C.danger : C.navy,
            }}>
              {bad && <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.danger, flexShrink: 0 }} />}
              {val}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── What To Do ──────────────────────────────────────── */
function WhatToDo({ brokerName, mob }) {
  const steps = [
    "Withdraw your funds immediately — do not wait.",
    "Document all transactions, screenshots, and communications.",
    "Report the platform to your local financial regulator (FCA, SEC, ASIC, etc.).",
    "Contact your bank or card issuer about a chargeback.",
    "Avoid 'recovery' services that ask for upfront fees — these are often secondary scams.",
  ];
  return (
    <div id="what-to-do" style={{ marginBottom: 24 }}>
      <H2>Already Invested in {brokerName}?</H2>
      <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.8, marginBottom: 16 }}>
        If you already have funds with {brokerName}, here is what you should do:
      </p>
      {steps.map((text, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: C.navy, color: C.white,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, flexShrink: 0,
          }}>{i + 1}</div>
          <span style={{ fontSize: 15, color: C.gray, lineHeight: 1.6, paddingTop: 3 }}>{text}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Sidebar — clean white ───────────────────────────── */
function PageSidebar({ data }) {
  const topAlt = data.alternatives[0] ? getBrokerData(data.alternatives[0]) : null;
  const topB = topAlt?.B;
  const topVisitUrl = topB ? getVisitUrl(topB.slug || data.alternatives[0], topB.url) : "#alternatives";

  return (
    <aside style={{ position: "sticky", top: 70, alignSelf: "start" }}>
      <div style={{
        background: C.white, border: `1px solid ${C.border}`,
        borderRadius: 14, padding: 22, textAlign: "center",
      }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: C.grayMuted,
          textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10,
        }}>Safety Score</div>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          border: `3px solid ${C.border}`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          margin: "0 auto 8px", position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "3px solid transparent",
            borderTopColor: C.danger, transform: "rotate(-90deg)",
          }} />
          <span style={{ fontSize: 24, fontWeight: 800, color: C.navy }}>0</span>
          <span style={{ fontSize: 10, color: C.grayLight }}>/10</span>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 12, fontWeight: 600, color: C.danger, marginBottom: 14,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.danger }} />
          Not Recommended
        </div>
        <div style={{ fontSize: 12, color: C.grayMuted, lineHeight: 1.5, marginBottom: 16 }}>
          {data.redFlags.length} issues found. No tier-1 regulation.
        </div>
        <a href="#alternatives" className="cta-primary" style={{
          display: "block", background: C.ctaGrad, color: C.navy,
          padding: "12px 16px", borderRadius: 8,
          fontSize: 14, fontWeight: 700, textDecoration: "none",
        }}>See Alternatives</a>
      </div>
      {topB && (
        <div style={{
          marginTop: 14, background: C.bg,
          border: `1px solid ${C.border}`, borderRadius: 12,
          padding: 16, textAlign: "center",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: C.grayMuted,
            textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8,
          }}>Top Alternative</div>
          <img src={`${BASE}logos/${data.alternatives[0]}.png`} alt={topB.name}
            style={{ height: 36, width: 36, borderRadius: 6, objectFit: "contain", marginBottom: 6 }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{topB.name}</div>
          <div style={{ fontSize: 14, color: C.safe, fontWeight: 700, marginBottom: 10 }}>{topB.score}/10</div>
          <a href={topVisitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-primary"
            style={{
              display: "block", background: C.ctaGrad, color: C.navy,
              padding: "10px", borderRadius: 8,
              fontSize: 13, fontWeight: 700, textDecoration: "none",
            }}>Visit {topB.name}</a>
        </div>
      )}
    </aside>
  );
}

/* ── Mobile TOC ──────────────────────────────────────── */
function MobileToc() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 16px 0" }}>
      <div style={{
        background: C.bg, border: `1px solid ${C.border}`,
        borderRadius: 12, overflow: "hidden",
      }}>
        <button onClick={() => setOpen(!open)} style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "12px 16px",
          background: "none", border: "none", cursor: "pointer",
        }}>
          <span style={{ fontFamily: "Outfit", fontSize: 13, fontWeight: 600, color: C.navy }}>Contents</span>
          <ChevronDown size={16} color={C.grayMuted} style={{
            transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s",
          }} />
        </button>
        {open && (
          <div style={{ padding: "0 16px 14px" }}>
            {TOC.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)}
                style={{
                  display: "block", fontSize: 13, color: C.gray,
                  textDecoration: "none", padding: "6px 12px",
                  borderLeft: `2px solid ${C.border}`, lineHeight: 1.4,
                }}>{item.label}</a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sticky Mobile CTA ───────────────────────────────── */
function StickyBar({ brokerName, topBrokerName, topSlug }) {
  const [show, setShow] = useState(false);
  const visitUrl = getVisitUrl(topSlug);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: C.white, borderTop: `1px solid ${C.border}`,
      padding: "10px 16px", boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
      display: "flex", alignItems: "center", gap: 10,
      transform: show ? "translateY(0)" : "translateY(100%)",
      transition: "transform 0.3s ease",
    }}>
      <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.navy }}>
        {brokerName} is not safe
      </span>
      <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" className="cta-primary"
        style={{
          background: C.ctaGrad, color: C.navy, padding: "10px 20px", borderRadius: 8,
          fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
        }}>Visit {topBrokerName}</a>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   WarningPage v3 — Premium Template
   ══════════════════════════════════════════════════════ */
export default function WarningPage() {
  const { slug } = useParams();
  const { mob, tab } = useMedia();
  const data = getWarningData(slug);

  useEffect(() => {
    if (!data) return;
    const schema = [
      {
        "@context": "https://schema.org", "@type": "Article",
        headline: `Is ${data.name} a Scam? Our Expert Warning`,
        description: data.verdictText,
        datePublished: data.updated, dateModified: data.updated,
        author: { "@type": "Person", name: data.author.name },
        publisher: { "@type": "Organization", name: "RatedBrokers", url: "https://ratedbrokers.com" },
      },
      {
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: data.faq.map((f) => ({
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ratedbrokers.com/" },
          { "@type": "ListItem", position: 2, name: "Broker Warnings", item: "https://ratedbrokers.com/warnings" },
          { "@type": "ListItem", position: 3, name: `Is ${data.name} a Scam?` },
        ],
      },
    ];
    const tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.textContent = JSON.stringify(schema);
    document.head.appendChild(tag);
    return () => { document.head.removeChild(tag); };
  }, [data]);

  useEffect(() => {
    if (!data) return;
    document.title = `Is ${data.name} a Scam? Warning & Safe Alternatives (2026) | RatedBrokers`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.content = `${data.name} is not regulated by any top-tier authority. Read our expert warning, key red flags, and discover trusted alternatives with FCA/ASIC/CySEC regulation.`;
  }, [data]);

  if (!data) return <Navigate to="/" replace />;

  const topAlt = data.alternatives[0] ? getBrokerData(data.alternatives[0]) : null;
  const topBName = topAlt?.B?.name || "Safe Broker";

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ padding: mob ? "12px 16px 0" : "16px 24px 0" }}>
        <nav style={{
          maxWidth: 1200, margin: "0 auto", fontSize: 13, color: C.grayMuted,
          display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap",
        }}>
          <Link to="/" style={{ color: C.grayMuted, textDecoration: "none" }}>Home</Link>
          <ChevronRight size={14} />
          <span>Broker Warnings</span>
          <ChevronRight size={14} />
          <span style={{ color: C.navy, fontWeight: 600 }}>Is {data.name} a Scam?</span>
        </nav>
      </div>

      {/* Hero */}
      <WarningHeroBand mob={mob}>
        <div style={{
          display: "flex", flexDirection: mob ? "column" : "row",
          justifyContent: "space-between", gap: mob ? 20 : 32,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <ShieldAlert size={mob ? 28 : 36} color="rgba(255,255,255,0.6)" />
              <h1 style={{
                fontFamily: "Outfit", fontWeight: 800,
                fontSize: mob ? 26 : 36, color: C.white, lineHeight: 1.15, margin: 0,
              }}>Is {data.name} a Scam?</h1>
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: "0 0 12px", fontWeight: 500 }}>
              Our Expert Warning for 2026
            </p>
            <VerdictBadge verdict={data.verdict} mob={mob} />
            <HeroStats data={data} mob={mob} />
            {/* AuthorCredits — full component with avatars & LinkedIn */}
            <div style={{ marginTop: 16 }}>
              <AuthorCredits
                author={AUTHORS["marcus-chen"]}
                editor={AUTHORS["sarah-williams"]}
                factChecker={AUTHORS["david-kowalski"]}
                updatedDate={data.updated}
                onDark
                compact={mob}
              />
            </div>
          </div>
          {!mob && <DangerScoreCard data={data} tab={tab} />}
        </div>
      </WarningHeroBand>

      {mob && <MobileToc />}

      {/* 3-column layout */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: mob ? "block" : "grid",
        gridTemplateColumns: mob ? undefined : tab ? "1fr 220px" : "180px 1fr 260px",
        gap: mob ? undefined : 24,
        padding: mob ? "24px 16px 40px" : "32px 24px 56px",
      }}>
        {/* Desktop TOC */}
        {!mob && !tab && (
          <aside style={{ position: "sticky", top: 70, alignSelf: "start" }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: C.grayMuted,
              textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10,
            }}>Contents</div>
            {TOC.map((item) => (
              <a key={item.id} href={`#${item.id}`} style={{
                display: "block", fontSize: 13, color: C.gray,
                textDecoration: "none", padding: "5px 10px",
                borderLeft: `2px solid ${C.border}`, marginBottom: 1, lineHeight: 1.4,
                transition: "color 0.15s, border-color 0.15s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.safe; e.currentTarget.style.borderLeftColor = C.safe; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.gray; e.currentTarget.style.borderLeftColor = C.border; }}
              >{item.label}</a>
            ))}
          </aside>
        )}

        {/* Main */}
        <main>
          {/* Verdict */}
          <div id="verdict" style={{
            background: C.dangerBg, border: `1px solid ${C.dangerBorder}`,
            borderRadius: 12, padding: mob ? "16px" : "18px 22px",
            marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 14,
          }}>
            <AlertTriangle size={20} color={C.danger} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.danger, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                Our Verdict
              </div>
              <p style={{ fontSize: 15, color: C.navy, lineHeight: 1.7, fontWeight: 500, margin: 0 }}>
                {data.verdictText}
              </p>
            </div>
          </div>

          <HowWeInvestigated data={data} mob={mob} />

          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <a href="#alternatives" className="cta-primary" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: C.ctaGrad, color: C.navy,
              padding: "14px 32px", borderRadius: 10,
              fontSize: 16, fontWeight: 700, textDecoration: "none",
            }}>
              <Shield size={18} /> Switch to a Trusted Broker
            </a>
          </div>

          <RedFlagsList flags={data.redFlags} mob={mob} />
          <SafeAlternatives slugs={data.alternatives} mob={mob} />
          <KeyFacts facts={data.keyFacts} mob={mob} />
          <RegulatoryWarnings warnings={data.regulatoryWarnings} mob={mob} />
          <UserComplaints complaints={data.complaints} mob={mob} />
          <WhatToDo brokerName={data.name} mob={mob} />

          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Link to="/best-forex-brokers" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: `2px solid ${C.safe}`, color: C.safe,
              padding: "12px 28px", borderRadius: 10,
              fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.safe; e.currentTarget.style.color = C.white; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.safe; }}
            >Compare All Regulated Brokers <ArrowRight size={16} /></Link>
          </div>

          <div id="faq"><FaqSection faqs={data.faq} mob={mob} /></div>
          <BottomAlternatives slugs={data.alternatives} mob={mob} />

          <div style={{
            fontSize: 12, color: C.grayLight, lineHeight: 1.7,
            borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 24,
          }}>
            <strong>Disclaimer:</strong> This page is for informational purposes only. We encourage readers to verify information with official regulatory bodies.
            CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage.
            Between 70-80% of retail investor accounts lose money when trading CFDs.
            All broker recommendations include affiliate links — see our{" "}
            <Link to="/how-we-make-money" style={{ color: C.grayMuted }}>How We Make Money</Link> page.
          </div>
        </main>

        {!mob && <PageSidebar data={data} />}
      </div>

      {mob && <StickyBar brokerName={data.name} topBrokerName={topBName} topSlug={data.alternatives[0] || ""} />}
    </>
  );
}
