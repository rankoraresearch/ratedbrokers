/**
 * Quiz Preview Prototypes — MobileMiniPreview + LiveSidebar variants
 *
 * 3 variants (toggle via fixed bar):
 *   A. CURRENT   — 1 prominent + 2 compact (orange CTA on #1)
 *   B. BARBARA   — 1 prominent + 4 compact, NO orange CTA (info only, CTA on results)
 *   C. ЕГОР/5EQ  — 5 equal rows, each with Visit button
 *
 * Two frames side-by-side:
 *   LEFT:  Mobile (375px) — MobileMiniPreview
 *   RIGHT: Desktop (320px) — LiveSidebar
 *
 * Uses real broker data + matching engine with UK + Forex + Intermediate answers.
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { matchBrokers } from "../utils/quizMatching";
import { getVisitUrl } from "../utils/visitUrl";
import BrokerLogo from "../components/BrokerLogo";
import RegBadge from "../components/RegBadge";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import {
  ChevronRight, Check, ArrowRight, Trophy, Star, Sparkles, Shield, ExternalLink,
  ArrowUpRight, MoveUpRight, SquareArrowOutUpRight, CircleArrowOutUpRight, Zap,
} from "lucide-react";

/* ── Simulate quiz answers (UK, Forex+Stocks, Intermediate, $1K-5K, Costs, Weekly) ── */
const MOCK_ANSWERS = {
  country: "GB",
  assets: ["forex", "stocks"],
  experience: "intermediate",
  budget: "1k-5k",
  priority: "costs",
  frequency: "weekly",
};

/* ── TpStars ── */
const TpStars = ({ rating = 0, size = 12 }) => {
  const full = Math.floor(rating);
  const partial = rating - full;
  const empty = 5 - full - (partial > 0 ? 1 : 0);
  const p = "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z";
  const uid = `tp-p-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
      {Array.from({ length: full }, (_, i) => (<svg key={`f${i}`} width={size} height={size} viewBox="0 0 24 24"><path d={p} fill="#00B67A" /></svg>))}
      {partial > 0 && (<svg key="p" width={size} height={size} viewBox="0 0 24 24"><defs><clipPath id={uid}><rect x="0" y="0" width={24 * partial} height="24" /></clipPath></defs><path d={p} fill="#dcdce6" /><path d={p} fill="#00B67A" clipPath={`url(#${uid})`} /></svg>)}
      {Array.from({ length: empty }, (_, i) => (<svg key={`e${i}`} width={size} height={size} viewBox="0 0 24 24"><path d={p} fill="#dcdce6" /></svg>))}
    </span>
  );
};

/* ═══════════════════════════════════════════
   VARIANT A: CURRENT — 1 prominent + 2 compact
   ═══════════════════════════════════════════ */

function MobilePreviewA({ results }) {
  const top3 = results.slice(0, 3);
  const top1 = top3[0];
  const B1 = top1.broker.B;
  const visitUrl1 = getVisitUrl(top1.slug, B1.url);

  return (
    <div style={{ marginTop: 12 }}>
      <a href={visitUrl1} target="_blank" rel="noopener nofollow sponsored"
        style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", borderRadius: 12,
          background: "linear-gradient(135deg, rgba(236,253,245,0.9), rgba(209,250,229,0.6))",
          boxShadow: "inset 0 0 0 1px rgba(5,150,105,0.15)",
          textDecoration: "none",
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
        <BrokerLogo slug={top1.slug} name={B1.name} size={28} shape="icon" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {B1.name} — <span style={{ color: "#059669" }}>{top1.matchPct}%</span>
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Your top match · {B1.score}/10</div>
        </div>
        <div style={{
          padding: "6px 12px", borderRadius: 8, flexShrink: 0,
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
          color: "#0f172a", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap",
        }}>Visit {B1.name} →</div>
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, padding: "0 4px" }}>
        {top3.slice(1).map((r, i) => (
          <a key={r.slug} href={getVisitUrl(r.slug, r.broker.B.url)} target="_blank" rel="noopener nofollow sponsored"
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 8px", borderRadius: 8, background: "#f8fafc", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)", textDecoration: "none", flex: 1 }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, color: "#64748b", width: 16, textAlign: "center", flexShrink: 0 }}>#{i + 2}</span>
            <BrokerLogo slug={r.slug} name={r.broker.B.name} size={20} shape="icon" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.broker.B.name}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#059669" }}>{r.matchPct}%</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT B: BARBARA — 1+4 info only, no CTA
   ═══════════════════════════════════════════ */

function MobilePreviewB({ results }) {
  const top5 = results.slice(0, 5);
  const top1 = top5[0];
  const B1 = top1.broker.B;

  return (
    <div style={{ marginTop: 12 }}>
      {/* Top-1 — info card, no CTA */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 12,
        background: "linear-gradient(135deg, rgba(236,253,245,0.9), rgba(209,250,229,0.6))",
        boxShadow: "inset 0 0 0 1px rgba(5,150,105,0.15)",
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
        <BrokerLogo slug={top1.slug} name={B1.name} size={28} shape="icon" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {B1.name} — <span style={{ color: "#059669" }}>{top1.matchPct}%</span>
          </div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Best match for your profile · {B1.score}/10</div>
        </div>
        <ChevronRight size={14} color="#059669" />
      </div>
      {/* #2-5 — compact rows, no CTA */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6 }}>
        {top5.slice(1).map((r, i) => (
          <div key={r.slug} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "5px 8px",
            borderRadius: 8, background: "#f8fafc", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", width: 14, textAlign: "center", flexShrink: 0 }}>#{i + 2}</span>
            <BrokerLogo slug={r.slug} name={r.broker.B.name} size={18} shape="icon" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.broker.B.name}</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 6, fontSize: 10, color: "#94a3b8" }}>
        Results update live · CTA appears on final results
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT C: 5 EQUAL — all with Visit button
   ═══════════════════════════════════════════ */

function MobilePreviewC({ results }) {
  const top5 = results.slice(0, 5);

  return (
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
      {top5.map((r, i) => {
        const B = r.broker.B;
        return (
          <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", borderRadius: 10,
              background: i === 0 ? "linear-gradient(135deg, rgba(236,253,245,0.6), rgba(209,250,229,0.3))" : "#f8fafc",
              boxShadow: i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.12)" : "inset 0 0 0 1px rgba(0,0,0,0.04)",
              textDecoration: "none",
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 800, color: "#64748b", width: 14, textAlign: "center", flexShrink: 0 }}>#{i + 1}</span>
            <BrokerLogo slug={r.slug} name={B.name} size={22} shape="icon" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
              <div style={{ fontSize: 10, color: "#64748b" }}>{B.score}/10 · {r.matchPct}%</div>
            </div>
            <div style={{
              padding: "4px 10px", borderRadius: 6, flexShrink: 0,
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              color: "#0f172a", fontWeight: 700, fontSize: 10, whiteSpace: "nowrap",
            }}>Visit →</div>
          </a>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT D1: SUBTLE GRAY ↗ — ExternalLink icon, hover lift
   ═══════════════════════════════════════════ */

function MobilePreviewD1({ results }) {
  const top3 = results.slice(0, 3);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>
      {top3.map((r, i) => {
        const B = r.broker.B;
        return (
          <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.05)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.transform = "translateX(2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b" }}>{i + 1}</div>
            <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
            <ExternalLink size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
          </a>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT D2: GREEN ARROW — ArrowUpRight, green on #1, row hover bg
   ═══════════════════════════════════════════ */

function MobilePreviewD2({ results }) {
  const top3 = results.slice(0, 3);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>
      {top3.map((r, i) => {
        const B = r.broker.B;
        const arrowColor = i === 0 ? "#059669" : "#94a3b8";
        return (
          <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.05)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; const arrow = e.currentTarget.querySelector('.d2-arrow'); if (arrow) arrow.style.color = "#059669"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; const arrow = e.currentTarget.querySelector('.d2-arrow'); if (arrow) arrow.style.color = arrowColor; }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b" }}>{i + 1}</div>
            <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
            <ArrowUpRight className="d2-arrow" size={15} color={arrowColor} style={{ flexShrink: 0, transition: "color 0.2s" }} />
          </a>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT D3: PILL BADGE — icon inside green/gray pill, hover scale
   ═══════════════════════════════════════════ */

function MobilePreviewD3({ results }) {
  const top3 = results.slice(0, 3);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>
      {top3.map((r, i) => {
        const B = r.broker.B;
        return (
          <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.05)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; const pill = e.currentTarget.querySelector('.d3-pill'); if (pill) { pill.style.background = "#059669"; pill.style.color = "#fff"; pill.style.transform = "scale(1.1)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; const pill = e.currentTarget.querySelector('.d3-pill'); if (pill) { pill.style.background = i === 0 ? "#ecfdf5" : "#f1f5f9"; pill.style.color = i === 0 ? "#059669" : "#94a3b8"; pill.style.transform = "scale(1)"; } }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b" }}>{i + 1}</div>
            <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
            <div className="d3-pill" style={{
              width: 26, height: 26, borderRadius: 8, flexShrink: 0,
              background: i === 0 ? "#ecfdf5" : "#f1f5f9",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>
              <ArrowUpRight size={13} color={i === 0 ? "#059669" : "#94a3b8"} style={{ transition: "color 0.2s" }} />
            </div>
          </a>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT D4: TEXT HINT — "Visit ↗" text instead of icon, green underline hover
   ═══════════════════════════════════════════ */

function MobilePreviewD4({ results }) {
  const top3 = results.slice(0, 3);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>
      {top3.map((r, i) => {
        const B = r.broker.B;
        return (
          <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.05)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; const hint = e.currentTarget.querySelector('.d4-hint'); if (hint) { hint.style.color = "#047857"; hint.style.borderBottomColor = "#047857"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; const hint = e.currentTarget.querySelector('.d4-hint'); if (hint) { hint.style.color = "#94a3b8"; hint.style.borderBottomColor = "transparent"; } }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b" }}>{i + 1}</div>
            <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
            <span className="d4-hint" style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", flexShrink: 0, borderBottom: "1px solid transparent", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 2 }}>
              Visit <ArrowUpRight size={11} />
            </span>
          </a>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT D5: CARD ROWS — each row is a card with subtle shadow, ChevronRight + glow hover
   ═══════════════════════════════════════════ */

function MobilePreviewD5({ results }) {
  const top3 = results.slice(0, 3);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {top3.map((r, i) => {
          const B = r.broker.B;
          return (
            <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, textDecoration: "none", transition: "all 0.25s",
                background: i === 0 ? "linear-gradient(135deg, rgba(236,253,245,0.8), rgba(209,250,229,0.4))" : "#fff",
                boxShadow: i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.12), 0 2px 8px rgba(5,150,105,0.08)" : "inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(5,150,105,0.2), 0 4px 16px rgba(5,150,105,0.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.12), 0 2px 8px rgba(5,150,105,0.08)" : "inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b" }}>{i + 1}</div>
              <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
              <ChevronRight size={15} color={i === 0 ? "#059669" : "#cbd5e1"} style={{ flexShrink: 0, transition: "color 0.2s" }} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT D6: RANK MEDAL — icon hidden until hover, medal badge
   ═══════════════════════════════════════════ */

function DRow6({ r, i, total }) {
  const B = r.broker.B;
  return (
    <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: i < total - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", textDecoration: "none", transition: "all 0.25s", borderRadius: 8 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; const medal = e.currentTarget.querySelector('.d6-medal'); if (medal) medal.style.background = "#059669"; if (medal) medal.style.color = "#fff"; const icon = e.currentTarget.querySelector('.d6-icon'); if (icon) icon.style.opacity = "1"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; const medal = e.currentTarget.querySelector('.d6-medal'); if (medal) { medal.style.background = i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9"; medal.style.color = i === 0 ? "#fff" : "#64748b"; } const icon = e.currentTarget.querySelector('.d6-icon'); if (icon) icon.style.opacity = "0"; }}
    >
      <div className="d6-medal" style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", transition: "all 0.25s" }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ExternalLink className="d6-icon" size={14} color="#059669" style={{ flexShrink: 0, opacity: 0, transition: "opacity 0.25s" }} />
    </a>
  );
}

function MobilePreviewD6({ results }) {
  const top3 = results.slice(0, 3);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>
      {top3.map((r, i) => <DRow6 key={r.slug} r={r} i={i} total={3} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT D7: SCORE BAR — thin progress bar under name, ArrowRight
   ═══════════════════════════════════════════ */

function DRow7({ r, i, total }) {
  const B = r.broker.B;
  const barWidth = Math.round((B.score / 10) * 100);
  return (
    <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: i < total - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; const bar = e.currentTarget.querySelector('.d7-bar-fill'); if (bar) bar.style.background = "#34d399"; const arrow = e.currentTarget.querySelector('.d7-arrow'); if (arrow) arrow.style.transform = "translateX(4px)"; if (arrow) arrow.style.color = "#059669"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; const bar = e.currentTarget.querySelector('.d7-bar-fill'); if (bar) bar.style.background = "#e2e8f0"; const arrow = e.currentTarget.querySelector('.d7-arrow'); if (arrow) arrow.style.transform = "none"; if (arrow) arrow.style.color = "#cbd5e1"; }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b" }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
        <div style={{ width: 48, height: 3, borderRadius: 2, background: "#f1f5f9", marginTop: 4, overflow: "hidden" }}>
          <div className="d7-bar-fill" style={{ width: `${barWidth}%`, height: "100%", borderRadius: 2, background: "#e2e8f0", transition: "background 0.3s" }} />
        </div>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowRight className="d7-arrow" size={15} color="#cbd5e1" style={{ flexShrink: 0, transition: "all 0.25s" }} />
    </a>
  );
}

function MobilePreviewD7({ results }) {
  const top3 = results.slice(0, 3);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>
      {top3.map((r, i) => <DRow7 key={r.slug} r={r} i={i} total={3} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT D8: GLOW BORDER — transparent border, Zap icon, hover → green glow
   ═══════════════════════════════════════════ */

function DRow8({ r, i, total }) {
  const B = r.broker.B;
  return (
    <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", marginBottom: i < total - 1 ? 6 : 0, borderRadius: 10, textDecoration: "none", transition: "all 0.25s",
        border: "1.5px solid transparent",
        background: i === 0 ? "rgba(236,253,245,0.5)" : "transparent",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(5,150,105,0.12)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b" }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <Zap size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
    </a>
  );
}

function MobilePreviewD8({ results }) {
  const top3 = results.slice(0, 3);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>
      {top3.map((r, i) => <DRow8 key={r.slug} r={r} i={i} total={3} />)}
    </div>
  );
}

/* ═══════════════════════════════════════════
   UNIVERSAL SIDEBAR — reuses DRow components for consistency
   ═══════════════════════════════════════════ */

function SidebarDx({ results, RowComponent }) {
  const top5 = results.slice(0, 5);
  return (
    <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <SidebarHeader count={6} />
      <div style={{ padding: "4px 6px" }}>
        {top5.map((r, i) => <RowComponent key={r.slug} r={r} i={i} total={5} />)}
      </div>
      <SidebarFooter count={results.length} />
    </div>
  );
}

/* ── Shared row components for D1-D5 sidebars ── */
function DRow1({ r, i, total }) {
  const B = r.broker.B;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderBottom: i < total - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; e.currentTarget.style.transform = "translateX(2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ExternalLink size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
    </a>
  );
}
function DRow2({ r, i, total }) {
  const B = r.broker.B;
  const arrowColor = i === 0 ? "#059669" : "#94a3b8";
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderBottom: i < total - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; const a = e.currentTarget.querySelector('.dr2'); if (a) a.style.color = "#059669"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; const a = e.currentTarget.querySelector('.dr2'); if (a) a.style.color = arrowColor; }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight className="dr2" size={15} color={arrowColor} style={{ flexShrink: 0, transition: "color 0.2s" }} />
    </a>
  );
}
/* ── D2a: Green Border — full green border on hover ── */
function DRow2a({ r, i, total }) {
  const B = r.broker.B;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: i < total - 1 ? 4 : 0, textDecoration: "none", transition: "all 0.2s", borderRadius: 10, border: "1.5px solid transparent", background: i === 0 ? "rgba(236,253,245,0.4)" : "transparent" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.background = "#f0fdf4"; const a = e.currentTarget.querySelector('.d2a-arrow'); if (a) a.style.color = "#059669"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = i === 0 ? "rgba(236,253,245,0.4)" : "transparent"; const a = e.currentTarget.querySelector('.d2a-arrow'); if (a) a.style.color = i === 0 ? "#059669" : "#94a3b8"; }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight className="d2a-arrow" size={15} color={i === 0 ? "#059669" : "#94a3b8"} style={{ flexShrink: 0, transition: "color 0.2s" }} />
    </a>
  );
}
function MobilePreviewD2a({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2a key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2f: Green Border + Left Bar — border + left accent stripe ── */
function DRow2f({ r, i, total }) {
  const B = r.broker.B;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: i < total - 1 ? 4 : 0, textDecoration: "none", transition: "all 0.2s", borderRadius: 10, border: "1.5px solid transparent", position: "relative", overflow: "hidden", background: i === 0 ? "rgba(236,253,245,0.4)" : "transparent" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.background = "#f0fdf4"; const bar = e.currentTarget.querySelector('.d2f-bar'); if (bar) bar.style.transform = "scaleY(1)"; const a = e.currentTarget.querySelector('.d2f-arrow'); if (a) a.style.color = "#059669"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = i === 0 ? "rgba(236,253,245,0.4)" : "transparent"; const bar = e.currentTarget.querySelector('.d2f-bar'); if (bar) bar.style.transform = "scaleY(0)"; const a = e.currentTarget.querySelector('.d2f-arrow'); if (a) a.style.color = i === 0 ? "#059669" : "#94a3b8"; }}
    >
      <div className="d2f-bar" style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: 3, borderRadius: 2, background: "#059669", transform: "scaleY(0)", transition: "transform 0.2s ease", transformOrigin: "top" }} />
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight className="d2f-arrow" size={15} color={i === 0 ? "#059669" : "#94a3b8"} style={{ flexShrink: 0, transition: "color 0.2s" }} />
    </a>
  );
}
function MobilePreviewD2f({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2f key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2g: Soft Shadow Border — inset shadow grows on hover ── */
function DRow2g({ r, i, total }) {
  const B = r.broker.B;
  const restShadow = "inset 0 0 0 1px rgba(0,0,0,0.04)";
  const hoverShadow = "inset 0 0 0 1.5px #059669, 0 2px 8px rgba(5,150,105,0.1)";
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", marginBottom: i < total - 1 ? 4 : 0, textDecoration: "none", transition: "all 0.2s", borderRadius: 10, boxShadow: i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.15)" : restShadow, background: i === 0 ? "rgba(236,253,245,0.4)" : "#fff" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = hoverShadow; e.currentTarget.style.background = "#f0fdf4"; const a = e.currentTarget.querySelector('.d2g-arrow'); if (a) a.style.color = "#059669"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.15)" : restShadow; e.currentTarget.style.background = i === 0 ? "rgba(236,253,245,0.4)" : "#fff"; const a = e.currentTarget.querySelector('.d2g-arrow'); if (a) a.style.color = i === 0 ? "#059669" : "#94a3b8"; }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight className="d2g-arrow" size={15} color={i === 0 ? "#059669" : "#94a3b8"} style={{ flexShrink: 0, transition: "color 0.2s" }} />
    </a>
  );
}
function MobilePreviewD2g({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2g key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2h: Gradient Border — transparent → green gradient border ── */
function DRow2h({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  return (
    <div style={{ marginBottom: i < total - 1 ? 4 : 0, borderRadius: 10, padding: hov ? 1.5 : 1.5, background: hov ? "linear-gradient(135deg, #059669, #34d399)" : "transparent", transition: "background 0.25s" }}>
      <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", textDecoration: "none", borderRadius: 8.5, background: hov ? "#f0fdf4" : (i === 0 ? "rgba(236,253,245,0.6)" : "#fff"), transition: "background 0.2s" }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      >
        <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
        <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
        <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "color 0.2s" }} />
      </a>
    </div>
  );
}
function MobilePreviewD2h({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2h key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2i: Bottom Accent — thin green bottom border draws in on hover ── */
function DRow2i({ r, i, total }) {
  const B = r.broker.B;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", marginBottom: i < total - 1 ? 4 : 0, textDecoration: "none", transition: "all 0.2s", borderRadius: 10, background: i === 0 ? "rgba(236,253,245,0.4)" : "transparent", position: "relative", overflow: "hidden" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; const line = e.currentTarget.querySelector('.d2i-line'); if (line) line.style.transform = "scaleX(1)"; const a = e.currentTarget.querySelector('.d2i-arrow'); if (a) a.style.color = "#059669"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = i === 0 ? "rgba(236,253,245,0.4)" : "transparent"; const line = e.currentTarget.querySelector('.d2i-line'); if (line) line.style.transform = "scaleX(0)"; const a = e.currentTarget.querySelector('.d2i-arrow'); if (a) a.style.color = i === 0 ? "#059669" : "#94a3b8"; }}
    >
      <div className="d2i-line" style={{ position: "absolute", bottom: 0, left: "10%", right: "10%", height: 2, borderRadius: 1, background: "linear-gradient(90deg, #059669, #34d399)", transform: "scaleX(0)", transition: "transform 0.25s ease", transformOrigin: "left" }} />
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight className="d2i-arrow" size={15} color={i === 0 ? "#059669" : "#94a3b8"} style={{ flexShrink: 0, transition: "color 0.2s" }} />
    </a>
  );
}
function MobilePreviewD2i({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2i key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ═══════════════════════════════════════════
   D2j-D2m: Border + Lift + Risk Warning on hover
   ═══════════════════════════════════════════ */

/* ── D2j: Green Border + arrow shift — block stays still, risk always visible ── */
function DRow2j({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "block", textDecoration: "none", marginBottom: i < total - 1 ? 5 : 0,
        borderRadius: 10, border: hov ? "1.5px solid #059669" : "1.5px solid transparent",
        background: hov ? "#f0fdf4" : (i === 0 ? "rgba(236,253,245,0.4)" : "transparent"),
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px 2px" }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
        <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
        <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
      </div>
      {rw && <div style={{ padding: "0 12px 8px 44px" }}>
        <div style={{ fontSize: 9, lineHeight: 1.2, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
      </div>}
    </a>
  );
}
function MobilePreviewD2j({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2j key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2k: Shadow border + risk overlay inside (fixed height, no jump) ── */
function DRow2k({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 12px",
        textDecoration: "none", marginBottom: i < total - 1 ? 5 : 0,
        borderRadius: 10, position: "relative", overflow: "hidden",
        border: hov ? "1.5px solid #059669" : "1.5px solid transparent",
        background: hov ? "#f0fdf4" : (i === 0 ? "rgba(236,253,245,0.4)" : "transparent"),
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={30} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
      {rw && <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "3px 12px 4px 44px",
        background: hov ? "linear-gradient(to top, rgba(240,253,244,0.95) 60%, rgba(240,253,244,0))" : "transparent",
        opacity: hov ? 1 : 0,
        transition: "all 0.2s ease", pointerEvents: "none",
      }}>
        <div style={{ fontSize: 9, lineHeight: 1.2, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
      </div>}
    </a>
  );
}
/* ── D2k_nobg: Border only, no background change ── */
function DRow2k_nobg({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 12px",
        textDecoration: "none", marginBottom: i < total - 1 ? 5 : 0,
        borderRadius: 10, position: "relative", overflow: "hidden",
        border: hov ? "1.5px solid #059669" : "1.5px solid transparent",
        background: i === 0 ? "rgba(236,253,245,0.4)" : "transparent",
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={30} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
      {rw && <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "3px 12px 4px 44px",
        background: hov ? "linear-gradient(to top, rgba(255,255,255,0.95) 60%, transparent)" : "transparent",
        opacity: hov ? 1 : 0, transition: "all 0.2s ease", pointerEvents: "none",
      }}>
        <div style={{ fontSize: 9, lineHeight: 1.2, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
      </div>}
    </a>
  );
}
function MobilePreviewD2k_nobg({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2k_nobg key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── Orange Border Only — no bg change ── */
function DRowOrgBorder({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 12px",
        textDecoration: "none", marginBottom: i < total - 1 ? 5 : 0,
        borderRadius: 10, position: "relative", overflow: "hidden",
        border: hov ? "1.5px solid #f59e0b" : "1.5px solid transparent",
        background: i === 0 ? "rgba(254,243,199,0.3)" : "transparent",
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #f59e0b, #d97706)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#0f172a" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={30} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight size={15} color={hov ? "#d97706" : (i === 0 ? "#d97706" : "#94a3b8")} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
      {rw && <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "3px 12px 4px 44px",
        background: hov ? "linear-gradient(to top, rgba(255,255,255,0.95) 60%, transparent)" : "transparent",
        opacity: hov ? 1 : 0, transition: "all 0.2s ease", pointerEvents: "none",
      }}>
        <div style={{ fontSize: 9, lineHeight: 1.2, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
      </div>}
    </a>
  );
}
function MobilePreviewOrgBorder({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRowOrgBorder key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── Orange Minimal — thin 1px border, muted arrow, very clean ── */
function DRowOrgMinimal({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 12px",
        textDecoration: "none", marginBottom: i < total - 1 ? 5 : 0,
        borderRadius: 8, position: "relative", overflow: "hidden",
        border: hov ? "1px solid rgba(245,158,11,0.5)" : "1px solid transparent",
        background: "transparent",
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 20, height: 20, borderRadius: 5, background: i === 0 ? "#f59e0b" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: i === 0 ? "#0f172a" : "#94a3b8", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={28} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>{r.matchPct}%</span>
      <ArrowUpRight size={14} color={hov ? "#d97706" : "#cbd5e1"} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
      {rw && <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "2px 12px 3px 40px",
        background: hov ? "linear-gradient(to top, rgba(255,255,255,0.92) 60%, transparent)" : "transparent",
        opacity: hov ? 1 : 0, transition: "all 0.2s ease", pointerEvents: "none",
      }}>
        <div style={{ fontSize: 8, lineHeight: 1.2, color: "#b0b8c4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
      </div>}
    </a>
  );
}
function MobilePreviewOrgMinimal({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRowOrgMinimal key={r.slug} r={r} i={i} total={3} />)}</div>);
}

function MobilePreviewD2k({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2k key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ═══════════════════════════════════════════
   COLOR VARIANTS — D2k base with different border/accent colors
   ═══════════════════════════════════════════ */

const COLOR_THEMES = {
  green:   { border: "#059669", bg: "#f0fdf4", bgFirst: "rgba(236,253,245,0.4)", arrow: "#059669", badge: "linear-gradient(135deg, #059669, #047857)", riskBg: "rgba(240,253,244,0.95)" },
  orange:  { border: "#f59e0b", bg: "#fffbeb", bgFirst: "rgba(254,243,199,0.4)", arrow: "#d97706", badge: "linear-gradient(135deg, #f59e0b, #d97706)", riskBg: "rgba(255,251,235,0.95)" },
  blue:    { border: "#2563eb", bg: "#eff6ff", bgFirst: "rgba(219,234,254,0.4)", arrow: "#2563eb", badge: "linear-gradient(135deg, #2563eb, #1d4ed8)", riskBg: "rgba(239,246,255,0.95)" },
  purple:  { border: "#7c3aed", bg: "#f5f3ff", bgFirst: "rgba(237,233,254,0.4)", arrow: "#7c3aed", badge: "linear-gradient(135deg, #7c3aed, #6d28d9)", riskBg: "rgba(245,243,255,0.95)" },
  navy:    { border: "#334155", bg: "#f8fafc", bgFirst: "rgba(241,245,249,0.5)", arrow: "#334155", badge: "linear-gradient(135deg, #1e293b, #0f172a)", riskBg: "rgba(248,250,252,0.95)" },
};

function DRowColor({ r, i, total, theme }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const t = COLOR_THEMES[theme] || COLOR_THEMES.green;
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 12px",
        textDecoration: "none", marginBottom: i < total - 1 ? 5 : 0,
        borderRadius: 10, position: "relative", overflow: "hidden",
        border: hov ? `1.5px solid ${t.border}` : "1.5px solid transparent",
        background: hov ? t.bg : (i === 0 ? t.bgFirst : "transparent"),
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? t.badge : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={30} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: hov ? t.border : (r.matchPct >= 80 ? "#059669" : "#64748b"), transition: "color 0.2s" }}>{r.matchPct}%</span>
      <ArrowUpRight size={15} color={hov ? t.arrow : (i === 0 ? t.arrow : "#94a3b8")} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
      {rw && <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0,
        padding: "3px 12px 4px 44px",
        background: hov ? `linear-gradient(to top, ${t.riskBg} 60%, transparent)` : "transparent",
        opacity: hov ? 1 : 0, transition: "all 0.2s ease", pointerEvents: "none",
      }}>
        <div style={{ fontSize: 9, lineHeight: 1.2, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
      </div>}
    </a>
  );
}

function MobilePreviewColor({ results, theme }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRowColor key={r.slug} r={r} i={i} total={3} theme={theme} />)}</div>);
}

/* Wrappers for each color */
function MobilePreviewGreen({ results }) { return <MobilePreviewColor results={results} theme="green" />; }
function MobilePreviewOrange({ results }) { return <MobilePreviewColor results={results} theme="orange" />; }
function MobilePreviewBlue({ results }) { return <MobilePreviewColor results={results} theme="blue" />; }
function MobilePreviewPurple({ results }) { return <MobilePreviewColor results={results} theme="purple" />; }
function MobilePreviewNavy({ results }) { return <MobilePreviewColor results={results} theme="navy" />; }

/* ═══════════════════════════════════════════
   FINAL VARIANTS — based on D2k
   Static block, border, arrow shift, risk overlay
   ═══════════════════════════════════════════ */

/* ── F1: Green shadow + left accent bar appears on hover ── */
function FRow1({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 12px",
        textDecoration: "none", marginBottom: i < total - 1 ? 5 : 0,
        borderRadius: 10, position: "relative", overflow: "hidden",
        background: hov ? "#f0fdf4" : (i === 0 ? "rgba(236,253,245,0.4)" : "#fff"),
        boxShadow: hov ? "inset 0 0 0 1.5px #059669" : (i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.12)" : "inset 0 0 0 1px rgba(0,0,0,0.04)"),
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      {/* Left accent bar */}
      <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 3, borderRadius: 2, background: "#059669", transform: hov ? "scaleY(1)" : "scaleY(0)", transition: "transform 0.2s ease", transformOrigin: "center" }} />
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={30} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
      {rw && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "3px 12px 4px 44px", background: "linear-gradient(to top, rgba(248,250,252,0.95) 60%, rgba(248,250,252,0))", opacity: hov ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none" }}>
        <div style={{ fontSize: 9, lineHeight: 1.2, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
      </div>}
    </a>
  );
}
function MobilePreviewF1({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <FRow1 key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── F2: Badge turns green on hover + match% pulses green ── */
function FRow2({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 12px",
        textDecoration: "none", marginBottom: i < total - 1 ? 5 : 0,
        borderRadius: 10, position: "relative", overflow: "hidden",
        background: hov ? "#f0fdf4" : (i === 0 ? "rgba(236,253,245,0.4)" : "#fff"),
        boxShadow: hov ? "inset 0 0 0 1.5px #059669" : (i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.12)" : "inset 0 0 0 1px rgba(0,0,0,0.04)"),
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: hov ? "linear-gradient(135deg, #059669, #047857)" : (i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: hov || i === 0 ? "#fff" : "#64748b", flexShrink: 0, transition: "all 0.2s" }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={30} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: hov ? "#059669" : (r.matchPct >= 80 ? "#059669" : "#64748b"), transition: "color 0.2s" }}>{r.matchPct}%</span>
      <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
      {rw && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "3px 12px 4px 44px", background: "linear-gradient(to top, rgba(248,250,252,0.95) 60%, rgba(248,250,252,0))", opacity: hov ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none" }}>
        <div style={{ fontSize: 9, lineHeight: 1.2, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
      </div>}
    </a>
  );
}
function MobilePreviewF2({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <FRow2 key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── F3: Gradient border wrapper (like D2m but static) ── */
function FRow3({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <div style={{ marginBottom: i < total - 1 ? 5 : 0, borderRadius: 10, padding: 1.5, background: hov ? "linear-gradient(135deg, #059669, #34d399)" : (i === 0 ? "rgba(5,150,105,0.1)" : "transparent"), transition: "background 0.25s" }}>
      <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
        style={{
          display: "flex", alignItems: "center", gap: 8, padding: "11px 11px",
          textDecoration: "none", borderRadius: 8.5, position: "relative", overflow: "hidden",
          background: hov ? "#f0fdf4" : (i === 0 ? "rgba(236,253,245,0.6)" : "#fff"), transition: "background 0.2s",
        }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      >
        <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
        <BrokerLogo slug={r.slug} name={B.name} size={30} shape="icon" />
        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
        <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
        {rw && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "3px 11px 4px 43px", background: "linear-gradient(to top, rgba(248,250,252,0.95) 60%, rgba(248,250,252,0))", opacity: hov ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none" }}>
          <div style={{ fontSize: 9, lineHeight: 1.2, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
        </div>}
      </a>
    </div>
  );
}
function MobilePreviewF3({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <FRow3 key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── F4: Subtle — only background darkens + arrow shifts, minimal feel ── */
function FRow4({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "12px 12px",
        textDecoration: "none", marginBottom: i < total - 1 ? 5 : 0,
        borderRadius: 10, position: "relative", overflow: "hidden",
        background: hov ? "rgba(5,150,105,0.06)" : (i === 0 ? "rgba(236,253,245,0.4)" : "transparent"),
        boxShadow: hov ? "inset 0 0 0 1px rgba(5,150,105,0.2)" : (i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.08)" : "none"),
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={30} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#cbd5e1")} style={{ flexShrink: 0, transition: "all 0.25s", transform: hov ? "translate(2px, -1px)" : "none" }} />
      {rw && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "3px 12px 4px 44px", background: "linear-gradient(to top, rgba(248,250,252,0.95) 60%, rgba(248,250,252,0))", opacity: hov ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none" }}>
        <div style={{ fontSize: 9, lineHeight: 1.2, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
      </div>}
    </a>
  );
}
function MobilePreviewF4({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <FRow4 key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2l: Border + score/regs line + risk — block stays still ── */
function DRow2l({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "block", textDecoration: "none", marginBottom: i < total - 1 ? 5 : 0,
        borderRadius: 10, border: hov ? "1.5px solid #059669" : "1.5px solid transparent",
        background: hov ? "#f0fdf4" : (i === 0 ? "rgba(236,253,245,0.4)" : "transparent"),
        transition: "all 0.2s",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px 2px" }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
        <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
          <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 1 }}>{B.score}/10 · {B.regs.slice(0,2).map(reg => reg.name).join(", ")}</div>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
        <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
      </div>
      {rw && <div style={{ padding: "2px 12px 8px 44px" }}>
        <div style={{ fontSize: 9, lineHeight: 1.2, color: "#b0b8c4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
      </div>}
    </a>
  );
}
function MobilePreviewD2l({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2l key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2m: Gradient border + arrow shift — block stays still, risk always visible ── */
function DRow2m({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  const rw = B.riskWarning && (B.verticals || []).some(v => ["forex","cfd","crypto","spread-betting"].includes(v)) ? B.riskWarning : null;
  return (
    <div style={{ marginBottom: i < total - 1 ? 5 : 0, borderRadius: 10, padding: 1.5, background: hov ? "linear-gradient(135deg, #059669, #34d399)" : (i === 0 ? "rgba(5,150,105,0.08)" : "transparent"), transition: "all 0.25s" }}>
      <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
        style={{ display: "block", textDecoration: "none", borderRadius: 8.5, background: hov ? "#f0fdf4" : (i === 0 ? "rgba(236,253,245,0.6)" : "#fff"), transition: "background 0.2s" }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 11px 2px" }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
          <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
          <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "all 0.2s", transform: hov ? "translateX(2px)" : "none" }} />
        </div>
        {rw && <div style={{ padding: "0 11px 8px 43px" }}>
          <div style={{ fontSize: 9, lineHeight: 1.2, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>
        </div>}
      </a>
    </div>
  );
}
function MobilePreviewD2m({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2m key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2b: Arrow Launch — arrow bounces on hover ── */
function DRow2b({ r, i, total }) {
  const B = r.broker.B;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderBottom: i < total - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; const a = e.currentTarget.querySelector('.d2b-arrow'); if (a) { a.style.animation = "arrowLaunch 0.4s cubic-bezier(0.36,0.07,0.19,0.97)"; a.style.color = "#059669"; } const m = e.currentTarget.querySelector('.d2b-match'); if (m) m.style.color = "#059669"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; const a = e.currentTarget.querySelector('.d2b-arrow'); if (a) { a.style.animation = "none"; a.style.color = i === 0 ? "#059669" : "#94a3b8"; } const m = e.currentTarget.querySelector('.d2b-match'); if (m) m.style.color = r.matchPct >= 80 ? "#059669" : "#64748b"; }}
    >
      <style>{`@keyframes arrowLaunch { 0% { transform: translate(0,0); } 40% { transform: translate(6px,-6px); } 100% { transform: translate(0,0); } }`}</style>
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span className="d2b-match" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b", transition: "color 0.2s" }}>{r.matchPct}%</span>
      <ArrowUpRight className="d2b-arrow" size={15} color={i === 0 ? "#059669" : "#94a3b8"} style={{ flexShrink: 0, transition: "color 0.2s" }} />
    </a>
  );
}
function MobilePreviewD2b({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2b key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2c: Match Ring — SVG progress ring around match% ── */
function MatchRing({ pct, size = 32, stroke = 3, hover }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ flexShrink: 0, transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={hover ? "#059669" : (pct >= 80 ? "#059669" : "#94a3b8")} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={hover ? offset : circ} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.3s" }} />
    </svg>
  );
}
function DRow2c({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderBottom: i < total - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8, background: hov ? "#f8fafc" : "transparent" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
        <MatchRing pct={r.matchPct} hover={hov} />
        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 800, color: hov || r.matchPct >= 80 ? "#059669" : "#64748b", transform: "rotate(0deg)" }}>{r.matchPct}</span>
      </div>
      <ArrowUpRight size={14} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "color 0.2s" }} />
    </a>
  );
}
function MobilePreviewD2c({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2c key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2d: Gold Crown — #1 has permanent glow, "Best Match" tag on hover ── */
function DRow2d({ r, i, total }) {
  const B = r.broker.B;
  const [hov, setHov] = useState(false);
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", textDecoration: "none", transition: "all 0.25s", borderRadius: 10, marginBottom: i < total - 1 ? 4 : 0,
        background: hov ? "#f0fdf4" : (i === 0 ? "rgba(236,253,245,0.5)" : "transparent"),
        boxShadow: i === 0 ? "0 0 0 1px rgba(5,150,105,0.15), 0 2px 8px rgba(5,150,105,0.08)" : "none",
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</span>
          {i === 0 && hov && <span style={{ fontSize: 9, fontWeight: 800, color: "#047857", background: "#d1fae5", padding: "1px 6px", borderRadius: 4, whiteSpace: "nowrap", animation: "fadeIn 0.2s ease" }}>Best Match</span>}
        </div>
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight size={15} color={hov ? "#059669" : (i === 0 ? "#059669" : "#94a3b8")} style={{ flexShrink: 0, transition: "color 0.2s" }} />
    </a>
  );
}
function MobilePreviewD2d({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(-4px); } to { opacity: 1; transform: none; } }`}</style><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2d key={r.slug} r={r} i={i} total={3} />)}</div>);
}

/* ── D2e: Press-In Mobile — :active scale(0.98), badge color flip ── */
function DRow2e({ r, i, total }) {
  const B = r.broker.B;
  const [pressed, setPressed] = useState(false);
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderBottom: i < total - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", textDecoration: "none", borderRadius: 8,
        transition: "all 0.1s ease",
        transform: pressed ? "scale(0.97)" : "none",
        background: pressed ? "#f1f5f9" : "transparent",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; const a = e.currentTarget.querySelector('.d2e-arrow'); if (a) a.style.color = "#059669"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; const a = e.currentTarget.querySelector('.d2e-arrow'); if (a) a.style.color = i === 0 ? "#059669" : "#94a3b8"; }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
    >
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: pressed ? "#059669" : (i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9"),
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 800, color: pressed || i === 0 ? "#fff" : "#64748b",
        transition: "all 0.1s",
      }}>{pressed ? <Check size={12} /> : i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ArrowUpRight className="d2e-arrow" size={15} color={i === 0 ? "#059669" : "#94a3b8"} style={{ flexShrink: 0, transition: "color 0.2s" }} />
    </a>
  );
}
function MobilePreviewD2e({ results }) {
  const top3 = results.slice(0, 3);
  return (<div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>{top3.map((r, i) => <DRow2e key={r.slug} r={r} i={i} total={3} />)}</div>);
}

function DRow3({ r, i, total }) {
  const B = r.broker.B;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderBottom: i < total - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; const p = e.currentTarget.querySelector('.dr3'); if (p) { p.style.background = "#059669"; p.style.transform = "scale(1.1)"; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; const p = e.currentTarget.querySelector('.dr3'); if (p) { p.style.background = i === 0 ? "#ecfdf5" : "#f1f5f9"; p.style.transform = "scale(1)"; } }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <div className="dr3" style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, background: i === 0 ? "#ecfdf5" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}><ArrowUpRight size={13} color={i === 0 ? "#059669" : "#94a3b8"} /></div>
    </a>
  );
}
function DRow4({ r, i, total }) {
  const B = r.broker.B;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderBottom: i < total - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", textDecoration: "none", transition: "all 0.2s", borderRadius: 8 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; const h = e.currentTarget.querySelector('.dr4'); if (h) { h.style.color = "#047857"; h.style.borderBottomColor = "#047857"; } }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; const h = e.currentTarget.querySelector('.dr4'); if (h) { h.style.color = "#94a3b8"; h.style.borderBottomColor = "transparent"; } }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <span className="dr4" style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", flexShrink: 0, borderBottom: "1px solid transparent", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 2 }}>Visit <ArrowUpRight size={11} /></span>
    </a>
  );
}
function DRow5({ r, i, total }) {
  const B = r.broker.B;
  return (
    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
      style={{
        display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, textDecoration: "none", transition: "all 0.25s", marginBottom: i < total - 1 ? 4 : 0,
        background: i === 0 ? "linear-gradient(135deg, rgba(236,253,245,0.8), rgba(209,250,229,0.4))" : "#fff",
        boxShadow: i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.12), 0 2px 8px rgba(5,150,105,0.08)" : "inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(5,150,105,0.2), 0 4px 16px rgba(5,150,105,0.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.12), 0 2px 8px rgba(5,150,105,0.08)" : "inset 0 0 0 1px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
      <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
      <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div></div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
      <ChevronRight size={15} color={i === 0 ? "#059669" : "#cbd5e1"} style={{ flexShrink: 0 }} />
    </a>
  );
}

/* ── D alias ── */
const MobilePreviewD = MobilePreviewD1;

/* ═══════════════════════════════════════════
   VARIANT E: WINNER CARD + 2 COMPACT
   #1 with text-link CTA (not button), #2-3 with ↗
   ═══════════════════════════════════════════ */

function MobilePreviewE({ results }) {
  const top3 = results.slice(0, 3);
  const top1 = top3[0];
  const B1 = top1.broker.B;
  const visitUrl1 = getVisitUrl(top1.slug, B1.url);

  // Dynamic USP
  const usp = B1.spread ? `From ${B1.spread} pip spreads` : B1.score >= 9 ? "Top-rated broker" : `${B1.regs.slice(0, 2).map(r => r.name).join(" + ")} regulated`;

  return (
    <div style={{ marginTop: 12 }}>
      {/* #1 — featured card with text-link CTA */}
      <div style={{
        padding: "12px 14px", borderRadius: 12,
        background: "linear-gradient(135deg, rgba(236,253,245,0.9), rgba(209,250,229,0.6))",
        boxShadow: "inset 0 0 0 1px rgba(5,150,105,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
          <BrokerLogo slug={top1.slug} name={B1.name} size={28} shape="icon" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
              {B1.name} — <span style={{ color: "#059669" }}>{top1.matchPct}%</span>
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{usp}</div>
          </div>
        </div>
        <a href={visitUrl1} target="_blank" rel="noopener nofollow sponsored"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            marginTop: 8, marginLeft: 38,
            fontSize: 12, fontWeight: 700, color: "#059669",
            textDecoration: "none", borderBottom: "1px dashed #059669",
          }}
        >
          Open account <ExternalLink size={11} />
        </a>
      </div>
      {/* #2-3 — compact rows with ↗ */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginTop: 6 }}>
        {top3.slice(1).map((r, i) => {
          const B = r.broker.B;
          return (
            <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 10px",
                borderBottom: i === 0 ? "1px solid rgba(0,0,0,0.04)" : "none",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", width: 16, textAlign: "center", flexShrink: 0 }}>#{i + 2}</span>
              <BrokerLogo slug={r.slug} name={B.name} size={22} shape="icon" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#374151", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{B.name}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
              <ExternalLink size={12} color="#cbd5e1" style={{ flexShrink: 0 }} />
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   VARIANT F: PILL STRIP — horizontal scroll
   4-5 pills with label "Tap to visit broker"
   ═══════════════════════════════════════════ */

function MobilePreviewF({ results }) {
  const top5 = results.slice(0, 5);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", marginBottom: 6, padding: "0 2px", display: "flex", alignItems: "center", gap: 4 }}>
        <ExternalLink size={10} /> Tap to visit broker site
      </div>
      <div style={{
        display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4,
        scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
      }}>
        {top5.map((r, i) => {
          const B = r.broker.B;
          return (
            <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
              style={{
                flexShrink: 0, width: 80, textDecoration: "none",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "10px 6px", borderRadius: 12,
                background: i === 0 ? "linear-gradient(135deg, rgba(236,253,245,0.9), rgba(209,250,229,0.6))" : "#f8fafc",
                boxShadow: i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.15)" : "inset 0 0 0 1px rgba(0,0,0,0.04)",
                transition: "transform 0.15s",
              }}
            >
              <BrokerLogo slug={r.slug} name={B.name} size={32} shape="icon" />
              <div style={{ fontSize: 10, fontWeight: 700, color: "#0f172a", textAlign: "center", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }}>{B.name}</div>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800,
                color: r.matchPct >= 80 ? "#059669" : "#64748b",
              }}>{r.matchPct}%</div>
              <ExternalLink size={10} color="#94a3b8" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DESKTOP SIDEBARS D, E, F
   ═══════════════════════════════════════════ */

function SidebarD({ results }) {
  const top5 = results.slice(0, 5);
  return (
    <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <SidebarHeader count={6} />
      <div style={{ padding: "4px 0", display: "flex", flexDirection: "column" }}>
        {top5.map((r, i) => {
          const B = r.broker.B;
          return (
            <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 14px",
                borderBottom: i < 4 ? "1px solid rgba(0,0,0,0.04)" : "none",
                textDecoration: "none", transition: "background 0.15s",
              }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : i < 3 ? "#e2e8f0" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
              <BrokerLogo slug={r.slug} name={B.name} size={28} shape="icon" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 1 }}>{B.score}/10</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
              <ExternalLink size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
            </a>
          );
        })}
      </div>
      <SidebarFooter count={results.length} />
    </div>
  );
}

function SidebarE({ results }) {
  const top1 = results[0];
  const rest = results.slice(1, 5);
  const B1 = top1.broker.B;
  const visitUrl1 = getVisitUrl(top1.slug, B1.url);
  const hasTp1 = B1.tp && B1.tp > 0;
  const usp = B1.spread ? `From ${B1.spread} pip spreads` : `${B1.regs.slice(0, 2).map(r => r.name).join(" + ")} regulated`;

  return (
    <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <SidebarHeader count={6} />
      {/* Top-1 with text-link */}
      <div style={{ padding: 16, background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)", borderBottom: "1px solid rgba(5,150,105,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <BrokerLogo slug={top1.slug} name={B1.name} size={38} shape="icon" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{B1.name}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{usp}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 800, color: "#059669", lineHeight: 1 }}>{top1.matchPct}%</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>match</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: "#059669", background: "#fff", padding: "2px 6px", borderRadius: 4, border: "1px solid rgba(0,0,0,0.06)" }}>{B1.score}/10</span>
          {B1.regs.slice(0, 2).map((r) => <RegBadge key={r.name} reg={r.name} />)}
        </div>
        {hasTp1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
            <TpStars rating={B1.tp} size={11} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>{B1.tp}</span>
          </div>
        )}
        {/* Text-link CTA — not a button */}
        <a href={visitUrl1} target="_blank" rel="noopener nofollow sponsored"
          style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: "#059669", textDecoration: "none", borderBottom: "1px dashed #059669" }}
        >
          Open account <ExternalLink size={12} />
        </a>
      </div>
      {/* #2-5 with ↗ */}
      <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        {rest.map((r, i) => {
          const B = r.broker.B;
          return (
            <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)", textDecoration: "none", transition: "all 0.2s" }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 6, background: (i + 2) <= 3 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: (i + 2) <= 3 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 2}</div>
              <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
              <ExternalLink size={12} color="#cbd5e1" style={{ flexShrink: 0 }} />
            </a>
          );
        })}
      </div>
      <SidebarFooter count={results.length} />
    </div>
  );
}

function SidebarF({ results }) {
  const top5 = results.slice(0, 5);
  return (
    <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <SidebarHeader count={6} />
      <div style={{ padding: "12px 12px 6px", fontSize: 10, fontWeight: 600, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}>
        <ExternalLink size={10} /> Click to visit broker site
      </div>
      <div style={{ padding: "4px 12px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {top5.map((r, i) => {
          const B = r.broker.B;
          return (
            <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
              style={{
                display: "flex", flexDirection: i === 0 ? "row" : "column", alignItems: "center", gap: i === 0 ? 10 : 4,
                padding: "10px 6px", borderRadius: 12, textDecoration: "none",
                background: i === 0 ? "linear-gradient(135deg, rgba(236,253,245,0.9), rgba(209,250,229,0.6))" : "#f8fafc",
                boxShadow: i === 0 ? "inset 0 0 0 1px rgba(5,150,105,0.15)" : "inset 0 0 0 1px rgba(0,0,0,0.04)",
                gridColumn: i === 0 ? "1 / -1" : undefined,
              }}
            >
              <BrokerLogo slug={r.slug} name={B.name} size={i === 0 ? 36 : 30} shape="icon" />
              <div style={{ textAlign: i === 0 ? "left" : "center", flex: i === 0 ? 1 : undefined }}>
                <div style={{ fontSize: i === 0 ? 13 : 11, fontWeight: 700, color: "#0f172a" }}>{B.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</div>
              </div>
              <ExternalLink size={11} color="#94a3b8" />
            </a>
          );
        })}
      </div>
      <SidebarFooter count={results.length} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   DESKTOP SIDEBAR — A/B/C variants
   ═══════════════════════════════════════════ */

function SidebarA({ results }) {
  const top1 = results[0];
  const rest = results.slice(1, 5);
  const B1 = top1.broker.B;
  const visitUrl1 = getVisitUrl(top1.slug, B1.url);
  const hasTp1 = B1.tp && B1.tp > 0;

  return (
    <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <SidebarHeader count={6} />
      {/* Top-1 full card */}
      <div style={{ padding: 16, background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)", borderBottom: "1px solid rgba(5,150,105,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <BrokerLogo slug={top1.slug} name={B1.name} size={38} shape="icon" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{B1.name}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{B1.type}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 800, color: "#059669", lineHeight: 1 }}>{top1.matchPct}%</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>match</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: B1.score >= 9 ? "#059669" : "#2563eb", background: B1.score >= 9 ? "#fff" : "#eff6ff", padding: "2px 6px", borderRadius: 4, border: "1px solid rgba(0,0,0,0.06)" }}>{B1.score}/10</span>
          {B1.regs.slice(0, 2).map((r) => <RegBadge key={r.name} reg={r.name} />)}
        </div>
        {hasTp1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
            <TpStars rating={B1.tp} size={11} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>{B1.tp}</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10, fontSize: 12, fontWeight: 600, color: "#047857" }}>
          <Check size={12} strokeWidth={3} />{B1.spread} pip spreads
        </div>
        {/* Orange CTA */}
        <a href={visitUrl1} target="_blank" rel="noopener nofollow sponsored" style={{
          display: "block", padding: "10px 16px", borderRadius: 10, textAlign: "center",
          background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 2px 8px rgba(245,158,11,0.25)",
        }}>Visit {B1.name} <ArrowRight size={13} style={{ verticalAlign: "middle", marginLeft: 2 }} /></a>
      </div>
      {/* #2-5 */}
      <SidebarRest results={rest} startRank={2} />
      <SidebarFooter count={results.length} />
    </div>
  );
}

function SidebarB({ results }) {
  const top1 = results[0];
  const rest = results.slice(1, 5);
  const B1 = top1.broker.B;
  const hasTp1 = B1.tp && B1.tp > 0;

  return (
    <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <SidebarHeader count={6} />
      {/* Top-1 — info only, no CTA */}
      <div style={{ padding: 16, background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)", borderBottom: "1px solid rgba(5,150,105,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <BrokerLogo slug={top1.slug} name={B1.name} size={38} shape="icon" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{B1.name}</div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{B1.type}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 800, color: "#059669", lineHeight: 1 }}>{top1.matchPct}%</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>match</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: B1.score >= 9 ? "#059669" : "#2563eb", background: B1.score >= 9 ? "#fff" : "#eff6ff", padding: "2px 6px", borderRadius: 4, border: "1px solid rgba(0,0,0,0.06)" }}>{B1.score}/10</span>
          {B1.regs.slice(0, 2).map((r) => <RegBadge key={r.name} reg={r.name} />)}
        </div>
        {hasTp1 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
            <TpStars rating={B1.tp} size={11} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>{B1.tp}</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#047857" }}>
          <Check size={12} strokeWidth={3} />Best match for your profile
        </div>
        {/* No CTA — just info tag */}
        <div style={{ marginTop: 10, padding: "6px 12px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #a7f3d0", fontSize: 11, color: "#047857", fontWeight: 500, textAlign: "center" }}>
          Visit options appear with your final results
        </div>
      </div>
      {/* #2-5 */}
      <SidebarRest results={rest} startRank={2} />
      <SidebarFooter count={results.length} />
    </div>
  );
}

function SidebarC({ results }) {
  const top5 = results.slice(0, 5);

  return (
    <div style={{ borderRadius: 14, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <SidebarHeader count={6} />
      <div style={{ padding: "8px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        {top5.map((r, i) => {
          const B = r.broker.B;
          const visitUrl = getVisitUrl(r.slug, B.url);
          return (
            <div key={r.slug} style={{
              padding: "10px 10px", borderRadius: 10,
              background: i === 0 ? "linear-gradient(135deg, #f0fdf4, #ecfdf5)" : "#fff",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: i < 3 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: i < 3 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
                <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                    <Star size={10} color="#059669" fill="#059669" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>{B.score}</span>
                  </div>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
              </div>
              <a href={visitUrl} target="_blank" rel="noopener nofollow sponsored" style={{
                display: "block", marginTop: 6, padding: "6px 12px", borderRadius: 8, textAlign: "center",
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)", color: "#0f172a", fontWeight: 700, fontSize: 12, textDecoration: "none",
              }}>Visit {B.name} →</a>
            </div>
          );
        })}
      </div>
      <SidebarFooter count={results.length} />
    </div>
  );
}

/* ── Shared sidebar parts ── */
function SidebarHeader({ count }) {
  return (
    <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>Your Match</span>
      </div>
      <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>Based on {count} answers</span>
    </div>
  );
}

function SidebarRest({ results, startRank }) {
  return (
    <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
      {results.map((r, i) => {
        const B = r.broker.B;
        const rank = startRank + i;
        return (
          <div key={r.slug} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: rank <= 3 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: rank <= 3 ? "#fff" : "#64748b", flexShrink: 0 }}>{rank}</div>
            <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                <Star size={10} color="#059669" fill="#059669" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>{B.score}</span>
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
            <ChevronRight size={14} color="#cbd5e1" />
          </div>
        );
      })}
    </div>
  );
}

function SidebarFooter({ count }) {
  return (
    <div style={{ padding: "8px 16px 10px", borderTop: "1px solid rgba(0,0,0,0.04)", textAlign: "center" }}>
      <span style={{ fontSize: 10, color: "#94a3b8" }}>Independent analysis of {count} expert-tested brokers</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FAKE QUIZ STEP — Simulates step 4
   ═══════════════════════════════════════════ */

function FakeQuizStep() {
  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "24px 20px 20px",
      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Question 4 of 6</div>
      <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>How much do you plan to deposit?</h2>
      <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 16px" }}>We'll filter brokers by minimum deposit requirements.</p>
      {["$50 – $200", "$200 – $500", "$500 – $1,000", "$1,000 – $5,000"].map((label, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, marginBottom: 8,
          background: i === 3 ? "#ecfdf5" : "#fff",
          boxShadow: i === 3 ? "inset 0 0 0 2px #059669, 0 2px 8px rgba(5,150,105,0.1)" : "inset 0 0 0 1px rgba(0,0,0,0.08)",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: i === 3 ? 700 : 600, color: i === 3 ? "#047857" : "#111827" }}>{label}</div>
          </div>
          {i === 3 && <div style={{ width: 24, height: 24, borderRadius: 8, background: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}><Check size={14} color="#fff" strokeWidth={3} /></div>}
        </div>
      ))}
      {/* Sticky nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 16px", borderRadius: 10, background: "#fff", border: "1px solid #e2e8f0", fontSize: 14, fontWeight: 600, color: "#111827", fontFamily: "inherit", cursor: "pointer" }}>← Back</button>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg, #059669, #047857)", border: "none", color: "#fff", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>Next →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════ */

function ProgressBar() {
  return (
    <div style={{ padding: "10px 0 6px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.5 }}>Step 4 of 6</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>How much do you plan to deposit?</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ flex: 1, height: 8, borderRadius: 4, background: i < 4 ? "#059669" : i === 4 ? "#34d399" : "#e2e8f0", transition: "background 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PROTO PAGE
   ═══════════════════════════════════════════ */

const FINAL_VARIANTS = [
  { key: "D2k", label: "D2k: Border+Bg", desc: "Зелёная рамка + зелёный фон при hover", color: "#059669" },
  { key: "D2k_nobg", label: "D2k: Border Only", desc: "Только рамка, без подсветки фона внутри", color: "#047857" },
  { key: "ORG_border", label: "Orange: Border Only", desc: "Оранжевая рамка, без подсветки фона", color: "#f59e0b" },
  { key: "ORG_minimal", label: "Orange: Minimal", desc: "Тонкая оранжевая рамка 1px, серая стрелка, без смены фона", color: "#d97706" },
  { key: "CLR_green", label: "Green", desc: "Зелёная рамка + зелёный фон — brand color", color: "#059669" },
  { key: "CLR_orange", label: "Orange", desc: "Оранжевая рамка — CTA-акцент, энергия, внимание", color: "#f59e0b" },
  { key: "CLR_blue", label: "Blue", desc: "Синяя рамка — профессионализм, стабильность", color: "#2563eb" },
  { key: "CLR_purple", label: "Purple", desc: "Фиолетовая рамка — премиум, уникальность", color: "#7c3aed" },
  { key: "CLR_navy", label: "Navy", desc: "Тёмная рамка — минимализм, нейтральность, brand navy", color: "#334155" },
  { key: "F1", label: "F1: +Left Bar", desc: "Зелёная рамка + полоска слева вырастает", color: "#10b981" },
  { key: "F2", label: "F2: +Badge", desc: "Badge зеленеет при hover, match% зеленеет", color: "#34d399" },
  { key: "F3", label: "F3: Gradient", desc: "Градиентная обводка green→emerald", color: "#6ee7b7" },
  { key: "F4", label: "F4: Minimal", desc: "Самый тихий: только фон темнеет + тонкая обводка", color: "#a7f3d0" },
];

const ARCHIVE_VARIANTS = [
  { key: "A", label: "A: Current", group: "orig" }, { key: "B", label: "B: No CTA", group: "orig" }, { key: "C", label: "C: 5 Equal", group: "orig" }, { key: "E", label: "E: Winner+↗", group: "orig" }, { key: "F", label: "F: Pill Strip", group: "orig" },
  { key: "D1", label: "D1", group: "D" }, { key: "D2", label: "D2", group: "D" }, { key: "D3", label: "D3", group: "D" }, { key: "D4", label: "D4", group: "D" }, { key: "D5", label: "D5", group: "D" }, { key: "D6", label: "D6", group: "D" }, { key: "D7", label: "D7", group: "D" }, { key: "D8", label: "D8", group: "D" },
  { key: "D2a", label: "D2a", group: "D2" }, { key: "D2b", label: "D2b", group: "D2" }, { key: "D2c", label: "D2c", group: "D2" }, { key: "D2d", label: "D2d", group: "D2" }, { key: "D2e", label: "D2e", group: "D2" }, { key: "D2f", label: "D2f", group: "D2" }, { key: "D2g", label: "D2g", group: "D2" }, { key: "D2h", label: "D2h", group: "D2" }, { key: "D2i", label: "D2i", group: "D2" }, { key: "D2j", label: "D2j", group: "D2" }, { key: "D2l", label: "D2l", group: "D2" }, { key: "D2m", label: "D2m", group: "D2" },
];

export default function QuizPreviewProto() {
  const [variant, setVariant] = useState("D2k");
  const [showArchive, setShowArchive] = useState(false);
  const results = matchBrokers(MOCK_ANSWERS);

  const MOBILE_MAP = {
    A: MobilePreviewA, B: MobilePreviewB, C: MobilePreviewC, E: MobilePreviewE, F: MobilePreviewF,
    D: MobilePreviewD, D1: MobilePreviewD1, D2: MobilePreviewD2, D3: MobilePreviewD3, D4: MobilePreviewD4, D5: MobilePreviewD5,
    D6: MobilePreviewD6, D7: MobilePreviewD7, D8: MobilePreviewD8,
    D2a: MobilePreviewD2a, D2b: MobilePreviewD2b, D2c: MobilePreviewD2c, D2d: MobilePreviewD2d, D2e: MobilePreviewD2e,
    D2f: MobilePreviewD2f, D2g: MobilePreviewD2g, D2h: MobilePreviewD2h, D2i: MobilePreviewD2i,
    D2j: MobilePreviewD2j, D2k: MobilePreviewD2k, D2l: MobilePreviewD2l, D2m: MobilePreviewD2m,
    F1: MobilePreviewF1, F2: MobilePreviewF2, F3: MobilePreviewF3, F4: MobilePreviewF4,
    D2k_nobg: MobilePreviewD2k_nobg, ORG_border: MobilePreviewOrgBorder, ORG_minimal: MobilePreviewOrgMinimal,
    CLR_green: MobilePreviewGreen, CLR_orange: MobilePreviewOrange, CLR_blue: MobilePreviewBlue, CLR_purple: MobilePreviewPurple, CLR_navy: MobilePreviewNavy,
  };
  const SIDEBAR_MAP = {
    A: SidebarA, B: SidebarB, C: SidebarC, E: SidebarE, F: SidebarF,
    D1: (p) => <SidebarDx {...p} RowComponent={DRow1} />, D2: (p) => <SidebarDx {...p} RowComponent={DRow2} />,
    D3: (p) => <SidebarDx {...p} RowComponent={DRow3} />, D4: (p) => <SidebarDx {...p} RowComponent={DRow4} />,
    D5: (p) => <SidebarDx {...p} RowComponent={DRow5} />, D6: (p) => <SidebarDx {...p} RowComponent={DRow6} />,
    D7: (p) => <SidebarDx {...p} RowComponent={DRow7} />, D8: (p) => <SidebarDx {...p} RowComponent={DRow8} />,
    D2a: (p) => <SidebarDx {...p} RowComponent={DRow2a} />, D2b: (p) => <SidebarDx {...p} RowComponent={DRow2b} />,
    D2c: (p) => <SidebarDx {...p} RowComponent={DRow2c} />, D2d: (p) => <SidebarDx {...p} RowComponent={DRow2d} />,
    D2e: (p) => <SidebarDx {...p} RowComponent={DRow2e} />, D2f: (p) => <SidebarDx {...p} RowComponent={DRow2f} />,
    D2g: (p) => <SidebarDx {...p} RowComponent={DRow2g} />, D2h: (p) => <SidebarDx {...p} RowComponent={DRow2h} />,
    D2i: (p) => <SidebarDx {...p} RowComponent={DRow2i} />, D2j: (p) => <SidebarDx {...p} RowComponent={DRow2j} />,
    D2k: (p) => <SidebarDx {...p} RowComponent={DRow2k} />, D2l: (p) => <SidebarDx {...p} RowComponent={DRow2l} />,
    D2m: (p) => <SidebarDx {...p} RowComponent={DRow2m} />,
    F1: (p) => <SidebarDx {...p} RowComponent={FRow1} />, F2: (p) => <SidebarDx {...p} RowComponent={FRow2} />,
    F3: (p) => <SidebarDx {...p} RowComponent={FRow3} />, F4: (p) => <SidebarDx {...p} RowComponent={FRow4} />,
    D2k_nobg: (p) => <SidebarDx {...p} RowComponent={DRow2k_nobg} />,
    ORG_border: (p) => <SidebarDx {...p} RowComponent={DRowOrgBorder} />,
    ORG_minimal: (p) => <SidebarDx {...p} RowComponent={DRowOrgMinimal} />,
    CLR_green: (p) => <SidebarDx {...p} RowComponent={(rp) => <DRowColor {...rp} theme="green" />} />,
    CLR_orange: (p) => <SidebarDx {...p} RowComponent={(rp) => <DRowColor {...rp} theme="orange" />} />,
    CLR_blue: (p) => <SidebarDx {...p} RowComponent={(rp) => <DRowColor {...rp} theme="blue" />} />,
    CLR_purple: (p) => <SidebarDx {...p} RowComponent={(rp) => <DRowColor {...rp} theme="purple" />} />,
    CLR_navy: (p) => <SidebarDx {...p} RowComponent={(rp) => <DRowColor {...rp} theme="navy" />} />,
  };
  const MobilePreview = MOBILE_MAP[variant];
  const DesktopSidebar = SIDEBAR_MAP[variant];

  const v = FINAL_VARIANTS.find((fv) => fv.key === variant) || { desc: variant };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      {/* ── Variant Switcher ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 20px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "'Outfit',sans-serif", marginBottom: 8 }}>
            Quiz Preview Prototypes — MobileMiniPreview + LiveSidebar
          </div>
          {/* ── FINAL VARIANTS ── */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {FINAL_VARIANTS.map((fv) => (
              <button key={fv.key} onClick={() => setVariant(fv.key)}
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  background: variant === fv.key ? fv.color : "rgba(255,255,255,0.06)",
                  border: variant === fv.key ? "2px solid #fff" : "1px solid rgba(255,255,255,0.1)",
                  color: variant === fv.key ? "#0f172a" : "#94a3b8",
                  fontWeight: 800, fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}
              >{fv.label}</button>
            ))}
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>{v.desc}</div>

          {/* ── Archive toggle ── */}
          <button onClick={() => setShowArchive(!showArchive)}
            style={{ marginTop: 8, padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >{showArchive ? "▾ Скрыть архив" : "▸ Архив прототипов (25 вариантов)"}</button>
          {showArchive && (
            <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
              {ARCHIVE_VARIANTS.map((av) => (
                <button key={av.key} onClick={() => setVariant(av.key)}
                  style={{
                    padding: "3px 8px", borderRadius: 4,
                    background: variant === av.key ? "#475569" : "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: variant === av.key ? "#fff" : "#475569",
                    fontWeight: 600, fontSize: 9, cursor: "pointer", fontFamily: "inherit",
                  }}
                >{av.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Two frames ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 60px", display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
        {/* Mobile Frame */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textAlign: "center" }}>
            Mobile — 375px
          </div>
          <div style={{
            width: 375, background: "#fff", borderRadius: 24,
            boxShadow: "0 0 0 4px #334155, 0 20px 60px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}>
            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg, #0f172a, #1e3a5f)", padding: "28px 16px 24px" }}>
              <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 6px" }}>Find Your Perfect Broker</h1>
              <p style={{ fontSize: 15, color: "#94a3b8", margin: 0 }}>Answer 6 quick questions. We'll match you with the best broker.</p>
            </div>
            {/* Quiz content */}
            <div style={{ padding: "16px 16px 24px" }}>
              <ProgressBar />
              <FakeQuizStep />
              {/* Context tip */}
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 10, background: "#f8fafc", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)", fontSize: 13, color: "#64748b", fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
                Higher deposits often unlock better spreads and VIP perks.
              </div>
              {/* ── THE PREVIEW ── */}
              <MobilePreview results={results} />
            </div>
          </div>
        </div>

        {/* Desktop Sidebar Frame */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 8, textAlign: "center" }}>
            Desktop Sidebar — 320px
          </div>
          <div style={{
            width: 320, background: "#f1f5f9", borderRadius: 16,
            boxShadow: "0 0 0 4px #334155, 0 20px 60px rgba(0,0,0,0.4)",
            padding: 12,
          }}>
            <DesktopSidebar results={results} />
          </div>
        </div>
      </div>

      {/* ── Variant descriptions ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {FINAL_VARIANTS.map((fv) => (
            <div key={fv.key} style={{
              padding: "14px 16px", borderRadius: 12,
              background: variant === fv.key ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
              border: variant === fv.key ? `2px solid ${fv.color}` : "1px solid rgba(255,255,255,0.06)",
              cursor: "pointer",
            }} onClick={() => setVariant(fv.key)}>
              <div style={{ fontSize: 13, fontWeight: 800, color: fv.color, marginBottom: 4 }}>{fv.label}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{fv.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
