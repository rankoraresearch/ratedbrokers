/**
 * Prototypes Gallery — browse all design variants.
 * /prototypes route, no header/footer (standalone).
 *
 * Organized in two sections:
 * 1. "Homepage Concepts" — 15 original homepage prototypes
 * 2. "Design Directions" — Direction A (Clean Authority) and B (Beginner Warm)
 *    with full page variants: Home, Review, Ranking, Header
 */
import { useState, lazy, Suspense } from "react";

/* ─── Homepage concepts (Proto1-15) ─── */
const homepageProtos = [
  { id: "p1", name: "Clean Authority", color: "#059669", desc: "White + emerald green, professional authority" },
  { id: "p2", name: "Clean White", color: "#0891b2", desc: "NerdWallet-inspired, teal accent, search-first" },
  { id: "p3", name: "Gradient Fintech", color: "#8b5cf6", desc: "Purple gradient, SaaS startup feel" },
  { id: "p4", name: "Editorial", color: "#dc2626", desc: "Financial Times style, serif headlines" },
  { id: "p5", name: "Dashboard Metrics", color: "#3b82f6", desc: "Analytics dashboard, metric cards" },
  { id: "p6", name: "Swiss Minimal", color: "#ef4444", desc: "Ultra-clean, bold typography, massive whitespace" },
  { id: "p7", name: "Trust & Safety", color: "#1d4ed8", desc: "Blue + amber, regulation-first" },
  { id: "p8", name: "Comparison First", color: "#f97316", desc: "Hero IS the compare tool" },
  { id: "p9", name: "Search Hub", color: "#2563eb", desc: "Google-like, giant search bar" },
  { id: "p10", name: "Social Proof", color: "#10b981", desc: "Green, testimonials, 50K+ traders" },
  { id: "p11", name: "Elegant Cream", color: "#9f1239", desc: "Warm luxury, burgundy/wine accent" },
  { id: "p12", name: "Beginner Warm", color: "#0d9488", desc: "Cream + teal, step-by-step guide" },
  { id: "p13", name: "Infographic Light", color: "#0891b2", desc: "Score bars, data visualization" },
  { id: "p14", name: "Marketplace Grid", color: "#7c3aed", desc: "E-commerce browse, filter chips" },
  { id: "p15", name: "Content Hub", color: "#4f46e5", desc: "Magazine editorial grid, trending topics" },
];

/* ─── Direction A: Clean Authority (green) ─── */
const dirA = [
  { id: "a-home", name: "Home", color: "#059669", desc: "Clean Authority — Homepage" },
  { id: "a-review", name: "Review", color: "#059669", desc: "Clean Authority — Broker Review" },
  { id: "a-ranking", name: "Ranking", color: "#059669", desc: "Clean Authority — Ranking Page" },
  { id: "a-header", name: "Header", color: "#059669", desc: "Clean Authority — Header only" },
];

/* ─── Direction B: Beginner Warm (teal) ─── */
const dirB = [
  { id: "b-home", name: "Home", color: "#0d9488", desc: "Beginner Warm — Homepage" },
  { id: "b-review", name: "Review", color: "#0d9488", desc: "Beginner Warm — Broker Review" },
  { id: "b-ranking", name: "Ranking", color: "#0d9488", desc: "Beginner Warm — Ranking Page" },
  { id: "b-header", name: "Header", color: "#0d9488", desc: "Beginner Warm — Header only" },
];

/* ─── Lazy components ─── */
const components = {
  // Homepage protos
  "p1": lazy(() => import("./Proto1")),
  "p2": lazy(() => import("./Proto2")),
  "p3": lazy(() => import("./Proto3")),
  "p4": lazy(() => import("./Proto4")),
  "p5": lazy(() => import("./Proto5")),
  "p6": lazy(() => import("./Proto6")),
  "p7": lazy(() => import("./Proto7")),
  "p8": lazy(() => import("./Proto8")),
  "p9": lazy(() => import("./Proto9")),
  "p10": lazy(() => import("./Proto10")),
  "p11": lazy(() => import("./Proto11")),
  "p12": lazy(() => import("./Proto12")),
  "p13": lazy(() => import("./Proto13")),
  "p14": lazy(() => import("./Proto14")),
  "p15": lazy(() => import("./Proto15")),

  // Direction A
  "a-home": lazy(() => import("./a/HomeA")),
  "a-review": lazy(() => import("./a/ReviewA")),
  "a-ranking": lazy(() => import("./a/RankingA")),
  "a-header": lazy(() => import("./a/HeaderA")),

  // Direction B
  "b-home": lazy(() => import("./b/HomeB")),
  "b-review": lazy(() => import("./b/ReviewB")),
  "b-ranking": lazy(() => import("./b/RankingB")),
  "b-header": lazy(() => import("./b/HeaderB")),
};

export default function PrototypesPage() {
  const [active, setActive] = useState("a-home");
  const Proto = components[active];

  const btn = (item, isActive) => ({
    padding: "6px 14px", borderRadius: 100, border: "none", cursor: "pointer",
    background: isActive ? item.color : "#f1f5f9",
    color: isActive ? "#fff" : "#64748b",
    fontWeight: 700, fontSize: 12, fontFamily: "inherit",
    whiteSpace: "nowrap", transition: "all 0.15s",
    flexShrink: 0,
  });

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      {/* Selector bar — fixed top */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{
          maxWidth: 1600, margin: "0 auto", padding: "8px 16px",
          display: "flex", alignItems: "center", gap: 12,
          overflowX: "auto",
        }}>
          <span style={{ fontWeight: 800, fontSize: 14, color: "#0f172a", whiteSpace: "nowrap" }}>
            Prototypes
          </span>

          {/* Separator */}
          <span style={{ width: 1, height: 24, background: "#e5e7eb", flexShrink: 0 }} />

          {/* Direction A */}
          <span style={{ fontWeight: 700, fontSize: 11, color: "#059669", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            A: Authority
          </span>
          {dirA.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} title={item.desc} style={btn(item, active === item.id)}>
              {item.name}
            </button>
          ))}

          {/* Separator */}
          <span style={{ width: 1, height: 24, background: "#e5e7eb", flexShrink: 0 }} />

          {/* Direction B */}
          <span style={{ fontWeight: 700, fontSize: 11, color: "#0d9488", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            B: Warm
          </span>
          {dirB.map(item => (
            <button key={item.id} onClick={() => setActive(item.id)} title={item.desc} style={btn(item, active === item.id)}>
              {item.name}
            </button>
          ))}

          {/* Separator */}
          <span style={{ width: 1, height: 24, background: "#e5e7eb", flexShrink: 0 }} />

          {/* Homepage protos */}
          <span style={{ fontWeight: 700, fontSize: 11, color: "#64748b", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Concepts
          </span>
          {homepageProtos.map(p => (
            <button key={p.id} onClick={() => setActive(p.id)} title={p.desc} style={btn(p, active === p.id)}>
              {p.id.replace("p", "")}.{p.name.substring(0, 8)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 52 }}>
        <Suspense fallback={
          <div style={{ padding: "120px 0", textAlign: "center", color: "#94a3b8" }}>
            Loading...
          </div>
        }>
          <Proto />
        </Suspense>
      </div>
    </div>
  );
}
