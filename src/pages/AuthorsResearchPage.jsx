import { useEffect, useState, useMemo } from "react";
import {
  ExternalLink, Linkedin, Twitter, Globe, FileText, Search, Copy, Check, Star,
  LayoutGrid, List, ChevronDown, Mail, Flame,
} from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { useMedia } from "../hooks/useMedia";
import {
  AUTHORS, SITES, CATEGORIES, BEATS, SENIORITY_LEVELS, EEAT_TIERS,
  calcAuthorScore, calcAuthoritativeness, calcFinalScore, deriveEEATTier,
} from "../data/authorsSample";

// ============================
// STYLES
// ============================
const palette = {
  navy: "#0f172a",
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  text: "#334155",
  muted: "#64748b",
  link: "#047857",
  orange: "#f59e0b",
};

const BADGE_STYLES = {
  A: { bg: "#fef3c7", color: "#b45309", border: "#fcd34d", label: "A · Trading" },
  B: { bg: "#dbeafe", color: "#1e40af", border: "#93c5fd", label: "B · Finance" },
};

const TIER_STYLES = {
  T1: { bg: "#0f172a", color: "#fff", label: "T1" },
  T2: { bg: "#1e40af", color: "#fff", label: "T2" },
  T3: { bg: "#64748b", color: "#fff", label: "T3" },
  T4: { bg: "#cbd5e1", color: "#0f172a", label: "T4" },
};

function avatarColor(name) {
  const palette = ["#0f172a", "#047857", "#7c3aed", "#dc2626", "#2563eb", "#f59e0b", "#0891b2", "#db2777"];
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "");
}

function scoreColor(score) {
  if (score >= 75) return "#047857";
  if (score >= 60) return "#0891b2";
  if (score >= 45) return "#f59e0b";
  if (score >= 30) return "#64748b";
  return "#94a3b8";
}

// ============================
// PAGE
// ============================
export default function AuthorsResearchPage() {
  const { mob } = useMedia();
  const [search, setSearch] = useState("");
  const [filterSite, setFilterSite] = useState("all");
  const [filterBadge, setFilterBadge] = useState("all");
  const [filterSeniority, setFilterSeniority] = useState("all");
  const [filterTier, setFilterTier] = useState("all");
  const [filterBeat, setFilterBeat] = useState("all");
  const [filterLinkedIn, setFilterLinkedIn] = useState(false);
  const [filterEmail, setFilterEmail] = useState(false);
  const [filterMultiOutlet, setFilterMultiOutlet] = useState(false);
  const [filterEEAT, setFilterEEAT] = useState("all");
  const [filterManualReview, setFilterManualReview] = useState(false);
  const [filterHasCerts, setFilterHasCerts] = useState(false);
  const [filterCertType, setFilterCertType] = useState("all");
  const [filterHasTier1, setFilterHasTier1] = useState(false);
  const [filterHasBook, setFilterHasBook] = useState(false);
  const [filterHasTV, setFilterHasTV] = useState(false);
  const [filterHasMuckrack, setFilterHasMuckrack] = useState(false);
  const [filterHasEducation, setFilterHasEducation] = useState(false);
  const [filterHasOwnDomain, setFilterHasOwnDomain] = useState(false);
  const [minYears, setMinYears] = useState(0);
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("final");
  const [viewMode, setViewMode] = useState("cards");

  useSEO({
    title: "Authors Research (MVP) — Internal",
    description: "Internal research: authors harvested across 5 sites via WebSearch layer-7 methodology.",
    path: "/research/authors",
  });

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "noindex, nofollow");
    meta.setAttribute("data-seo-noindex", "1");
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  // Enrich authors with computed fields
  const authorsEnriched = useMemo(() => {
    return AUTHORS.map((a) => {
      const outlet = SITES[a.site];
      const baseScore = calcAuthorScore(a);
      const authScore = calcAuthoritativeness(a);
      const finalScore = calcFinalScore(a);
      const eeatTier = deriveEEATTier(authScore);
      return {
        ...a,
        score: baseScore,
        authoritativeness: authScore,
        finalScore,
        eeatTier,
        outletDR: outlet?.dr || 0,
        outletTier: outlet?.tier || "T4",
        outletName: outlet?.name || a.site,
        competitorBacklinks: outlet?.competitorBacklinks || null,
        isMultiOutlet: (a.writesFor?.length || 1) > 1,
      };
    });
  }, []);

  // Available beat options (only those actually present in data)
  const availableBeats = useMemo(() => {
    const s = new Set();
    authorsEnriched.forEach((a) => a.beat?.forEach((b) => s.add(b)));
    return [...s].sort();
  }, [authorsEnriched]);

  // Filter logic
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let res = authorsEnriched.filter((a) => {
      if (filterSite !== "all" && a.site !== filterSite) return false;
      if (filterBadge !== "all" && a.badge !== filterBadge) return false;
      if (filterSeniority !== "all" && a.seniority !== filterSeniority) return false;
      if (filterTier !== "all" && a.outletTier !== filterTier) return false;
      if (filterBeat !== "all" && !a.beat?.includes(filterBeat)) return false;
      if (filterLinkedIn && !a.linkedin) return false;
      if (filterEmail && !a.email) return false;
      if (filterMultiOutlet && !a.isMultiOutlet) return false;
      if (filterEEAT !== "all" && a.eeatTier !== filterEEAT) return false;
      if (!filterManualReview && a.needsManualReview) return false;
      if (filterHasCerts && !(a.certifications?.length > 0)) return false;
      if (filterCertType !== "all") {
        const names = (a.certifications || []).map((c) => c.name?.toUpperCase?.() || "");
        const match =
          filterCertType === "finra"
            ? names.some((n) => n.includes("SERIES") || n.includes("FINRA"))
            : names.some((n) => n.includes(filterCertType.toUpperCase()));
        if (!match) return false;
      }
      if (filterHasTier1 && !(a.mediaSignals?.quotedInTier1?.length > 0)) return false;
      if (filterHasBook && !(a.mediaSignals?.authoredBooks?.length > 0)) return false;
      if (filterHasTV && !(a.mediaSignals?.tvAppearances?.length > 0)) return false;
      if (filterHasMuckrack && !a.muckrack) return false;
      if (filterHasEducation && !(a.education?.length > 0)) return false;
      if (filterHasOwnDomain && !a.trustSignals?.ownedDomain) return false;
      if ((a.yearsInIndustry || 0) < minYears) return false;
      if (a.finalScore < minScore) return false;
      if (q) {
        const hay = (a.name + " " + a.role + " " + (a.bio || "") + " " + (a.beat || []).join(" ")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sort = {
      final: (a, b) => b.finalScore - a.finalScore,
      score: (a, b) => b.score - a.score,
      auth: (a, b) => b.authoritativeness - a.authoritativeness,
      dr: (a, b) => b.outletDR - a.outletDR,
      followers: (a, b) => (b.mediaSignals?.linkedinFollowers || 0) - (a.mediaSignals?.linkedinFollowers || 0),
      name: (a, b) => a.name.localeCompare(b.name),
      outlet: (a, b) => a.outletName.localeCompare(b.outletName) || b.finalScore - a.finalScore,
    };
    res.sort(sort[sortBy] || sort.final);
    return res;
  }, [
    authorsEnriched, search, filterSite, filterBadge, filterSeniority,
    filterTier, filterBeat, filterLinkedIn, filterEmail, filterMultiOutlet,
    filterEEAT, filterManualReview, filterHasCerts, filterCertType,
    filterHasTier1, filterHasBook, filterHasTV, filterHasMuckrack,
    filterHasEducation, filterHasOwnDomain, minYears, minScore, sortBy,
  ]);

  const grouped = useMemo(() => {
    const g = {};
    for (const a of filtered) {
      if (!g[a.site]) g[a.site] = [];
      g[a.site].push(a);
    }
    return g;
  }, [filtered]);

  const stats = useMemo(() => {
    const avgScore = filtered.length
      ? Math.round(filtered.reduce((s, a) => s + a.finalScore, 0) / filtered.length)
      : 0;
    return {
      total: filtered.length,
      a: filtered.filter((a) => a.badge === "A").length,
      b: filtered.filter((a) => a.badge === "B").length,
      withLinkedIn: filtered.filter((a) => a.linkedin).length,
      withTwitter: filtered.filter((a) => a.twitter).length,
      withMuckrack: filtered.filter((a) => a.muckrack).length,
      withEmail: filtered.filter((a) => a.email).length,
      readyTargets: filtered.filter((a) => a.finalScore >= 60).length,
      t1Outlets: filtered.filter((a) => a.outletTier === "T1").length,
      tierS: filtered.filter((a) => a.eeatTier === "S").length,
      tierA: filtered.filter((a) => a.eeatTier === "A").length,
      avgScore,
    };
  }, [filtered]);

  const clearAll = () => {
    setSearch(""); setFilterSite("all"); setFilterBadge("all");
    setFilterSeniority("all"); setFilterTier("all"); setFilterBeat("all");
    setFilterLinkedIn(false); setFilterEmail(false); setFilterMultiOutlet(false);
    setFilterEEAT("all"); setFilterManualReview(false);
    setFilterHasCerts(false); setFilterCertType("all");
    setFilterHasTier1(false); setFilterHasBook(false); setFilterHasTV(false);
    setFilterHasMuckrack(false); setFilterHasEducation(false); setFilterHasOwnDomain(false);
    setMinYears(0); setMinScore(0); setSortBy("final");
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${palette.navy} 0%, #047857 100%)`,
        color: "#fff",
        padding: mob ? "28px 16px 32px" : "44px 24px 52px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{
            display: "inline-block", padding: "4px 10px", borderRadius: 999,
            background: "rgba(251, 191, 36, 0.15)", color: "#fbbf24",
            fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase",
            marginBottom: 10,
          }}>
            Internal · noindex · Phase 1-6 complete · 96 outlets
          </div>
          <h1 style={{
            fontFamily: "Outfit, sans-serif", fontWeight: 700,
            fontSize: mob ? 26 : 36, lineHeight: 1.15, margin: 0, letterSpacing: -0.3,
          }}>
            Authors &amp; Journalists — Outreach Map
          </h1>
          <p style={{
            marginTop: 10, fontSize: mob ? 14 : 16,
            color: "rgba(255,255,255,0.78)", maxWidth: 900,
          }}>
            580 authors harvested across 96 outlets via 10-layer methodology
            (WebSearch + WebFetch + Muck Rack + LinkedIn + own-domain).
            Each record enriched with outlet DR, tier (T1–T4), beat taxonomy,
            seniority, certifications, and competitor-backlink overlap from Ahrefs.
            E-E-A-T tier S/A/B/C and Outreach Score auto-computed per author.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: mob ? "16px 12px 0" : "20px 24px 0",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: mob ? "repeat(2, 1fr)" : "repeat(10, 1fr)",
          gap: 8,
          background: palette.borderLight,
          borderRadius: 10,
          padding: mob ? 12 : 14,
        }}>
          <StatCell label="Authors" value={stats.total} bold />
          <StatCell label="Avg final" value={stats.avgScore} color={scoreColor(stats.avgScore)} />
          <StatCell label="Tier S" value={stats.tierS} color="#047857" />
          <StatCell label="Tier A" value={stats.tierA} color="#1e40af" />
          <StatCell label="Ready ≥60" value={stats.readyTargets} color="#047857" />
          <StatCell label="T1 outlets" value={stats.t1Outlets} color="#0f172a" />
          <StatCell label="A · Trading" value={stats.a} color="#b45309" />
          <StatCell label="LinkedIn" value={stats.withLinkedIn} />
          <StatCell label="Muck Rack" value={stats.withMuckrack} />
          <StatCell label="Email" value={stats.withEmail} />
        </div>
      </div>

      {/* Filters */}
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: mob ? "12px 12px 0" : "16px 24px 0",
      }}>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
          padding: mob ? 12 : 14,
          background: "#fff",
          border: `1px solid ${palette.border}`,
          borderRadius: 10,
        }}>
          <div style={{ position: "relative", flex: mob ? "1 1 100%" : "1 1 220px", minWidth: 180 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: palette.muted }} />
            <input
              type="text"
              placeholder="Search name, role, bio, beat…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "8px 10px 8px 30px",
                fontSize: 13, border: `1px solid ${palette.border}`,
                borderRadius: 8, outline: "none",
              }}
            />
          </div>
          <FilterSelect label="Site" value={filterSite} onChange={setFilterSite}
            options={[["all", "All sites"], ...Object.values(SITES).map((s) => [s.slug, s.name])]} />
          <FilterSelect label="Tier" value={filterTier} onChange={setFilterTier}
            options={[["all", "All tiers"], ["T1", "T1 (DR 90+)"], ["T2", "T2 (70-89)"], ["T3", "T3 (50-69)"], ["T4", "T4 (<50)"]]} />
          <FilterSelect label="Badge" value={filterBadge} onChange={setFilterBadge}
            options={[["all", "A + B"], ["A", "A (trading)"], ["B", "B (finance)"]]} />
          <FilterSelect label="Seniority" value={filterSeniority} onChange={setFilterSeniority}
            options={[["all", "All seniority"], ...Object.entries(SENIORITY_LEVELS).map(([k, v]) => [k, v.label])]} />
          <FilterSelect label="Beat" value={filterBeat} onChange={setFilterBeat}
            options={[["all", "All beats"], ...availableBeats.map((b) => [b, BEATS[b]?.label || b])]} />
          <FilterSelect label="E-E-A-T" value={filterEEAT} onChange={setFilterEEAT}
            options={[["all", "All E-E-A-T"], ["S", "S · Google-ideal"], ["A", "A · Verifiable"], ["B", "B · Exp. low verify"], ["C", "C · Generic"]]} />
          <FilterSelect label="Sort" value={sortBy} onChange={setSortBy}
            options={[["final", "Sort: final ↓"], ["score", "Sort: base score ↓"], ["auth", "Sort: E-E-A-T ↓"], ["dr", "Sort: DR ↓"], ["followers", "Sort: LI followers ↓"], ["name", "Name A→Z"], ["outlet", "Outlet"]]} />
          <MinScoreSlider value={minScore} onChange={setMinScore} />
          <Toggle label="Has LinkedIn" icon={<Linkedin size={12} />} on={filterLinkedIn} onChange={setFilterLinkedIn} />
          <Toggle label="Has email" icon={<Mail size={12} />} on={filterEmail} onChange={setFilterEmail} />
          <Toggle label="Multi-outlet" icon={<Flame size={12} />} on={filterMultiOutlet} onChange={setFilterMultiOutlet} />
          <Toggle label="Show review-needed" icon={<Search size={12} />} on={filterManualReview} onChange={setFilterManualReview} />
        </div>
        {/* E-E-A-T specific filter row */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
          padding: mob ? 10 : 12, marginTop: 8,
          background: "#fefbf4",
          border: `1px solid #fcd34d`,
          borderRadius: 10,
        }}>
          <span style={{
            fontSize: 11, fontWeight: 800, color: "#b45309",
            textTransform: "uppercase", letterSpacing: 0.5,
            padding: "3px 8px", background: "#fef3c7", borderRadius: 4,
          }}>
            🎖 E-E-A-T filters
          </span>
          <FilterSelect label="Credential" value={filterCertType} onChange={setFilterCertType}
            options={[
              ["all", "Any credential"],
              ["CFA", "CFA only"],
              ["CFP", "CFP only"],
              ["CPA", "CPA only"],
              ["CMT", "CMT only"],
              ["FRM", "FRM only"],
              ["CAIA", "CAIA only"],
              ["CTA", "CTA only"],
              ["finra", "FINRA Series"],
            ]} />
          <MinYearsSlider value={minYears} onChange={setMinYears} />
          <Toggle label="Has certs" icon={<span style={{ fontSize: 10 }}>🎖</span>} on={filterHasCerts} onChange={setFilterHasCerts} />
          <Toggle label="Has education" icon={<span style={{ fontSize: 10 }}>🎓</span>} on={filterHasEducation} onChange={setFilterHasEducation} />
          <Toggle label="Quoted in tier-1" icon={<span style={{ fontSize: 10 }}>📰</span>} on={filterHasTier1} onChange={setFilterHasTier1} />
          <Toggle label="Has book" icon={<span style={{ fontSize: 10 }}>📚</span>} on={filterHasBook} onChange={setFilterHasBook} />
          <Toggle label="TV appearances" icon={<span style={{ fontSize: 10 }}>📺</span>} on={filterHasTV} onChange={setFilterHasTV} />
          <Toggle label="Muck Rack" icon={<FileText size={12} />} on={filterHasMuckrack} onChange={setFilterHasMuckrack} />
          <Toggle label="Own domain" icon={<Globe size={12} />} on={filterHasOwnDomain} onChange={setFilterHasOwnDomain} />
          <button onClick={clearAll} style={{
            padding: "7px 10px", fontSize: 12, fontWeight: 600,
            color: palette.muted, background: "#fff",
            border: `1px solid ${palette.border}`, borderRadius: 8, cursor: "pointer",
          }}>Clear</button>
          <div style={{ marginLeft: "auto", display: "flex", gap: 0, border: `1px solid ${palette.border}`, borderRadius: 8, overflow: "hidden" }}>
            <ViewToggleBtn active={viewMode === "cards"} onClick={() => setViewMode("cards")} icon={<LayoutGrid size={13} />} label="Cards" />
            <ViewToggleBtn active={viewMode === "table"} onClick={() => setViewMode("table")} icon={<List size={13} />} label="Table" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: mob ? "16px 12px 48px" : "20px 24px 64px",
      }}>
        {filtered.length === 0 && (
          <div style={{
            padding: 40, textAlign: "center", color: palette.muted,
            background: palette.borderLight, borderRadius: 10,
          }}>
            No authors match the current filters.
          </div>
        )}

        {viewMode === "table" && filtered.length > 0 && (
          <AuthorsTable rows={filtered} mob={mob} />
        )}

        {viewMode === "cards" && Object.values(SITES).map((site, idx) => {
          const list = grouped[site.slug] || [];
          if (list.length === 0) return null;
          return (
            <SiteSection key={site.slug} idx={idx + 1} site={site} authors={list} mob={mob} />
          );
        })}

        <div style={{
          marginTop: 28, padding: "14px 16px",
          background: palette.borderLight, borderRadius: 10,
          fontSize: 12, color: palette.muted, lineHeight: 1.6,
        }}>
          <strong style={{ color: palette.navy }}>Score formula.</strong>{" "}
          <code style={{ fontSize: 11, background: "#fff", padding: "1px 5px", borderRadius: 4 }}>
            outletDR×0.35 + badge(A=20,B=10) + seniority(chief=18,editor=15,senior=12,staff=8,contrib=5,guest=3,junior=4,former=−15) + LinkedIn=10 + Muck Rack=5 + Twitter=3 + email=5 + credentials×4 + multi-outlet=8 + competitor-linked(≥3 refdomains)=5
          </code>. Clamped to 0–100.
          <br /><strong style={{ color: palette.navy }}>Outlet tier.</strong>{" "}
          T1 DR ≥ 90 · T2 DR 70–89 · T3 DR 50–69 · T4 DR &lt; 50. From Ahrefs pull (AHREFS-DATA-LOG.md Request #2).
          <br /><strong style={{ color: palette.navy }}>Competitor backlinks.</strong>{" "}
          Each outlet cross-referenced against 11 competitor refdomain CSVs. Outlets that receive links from ≥3 of our competitors are flagged — those sites are strong outreach targets because their own readers are our ICP.
          <br /><strong style={{ color: palette.navy }}>No fabrication.</strong>{" "}
          Missing LinkedIn/Twitter/email = not-yet-verified. Pass 2 of the full sprint will fill gaps.
        </div>
      </div>
    </div>
  );
}

// ============================
// COMPONENTS
// ============================
function StatCell({ label, value, color = palette.navy, bold }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "Outfit, sans-serif",
        fontSize: 20, fontWeight: bold ? 700 : 600, color,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: palette.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "7px 10px",
        fontSize: 12, fontWeight: 600,
        border: `1px solid ${palette.border}`,
        borderRadius: 8, background: "#fff",
        color: palette.text, cursor: "pointer",
      }}
      aria-label={label}
    >
      {options.map(([v, lbl]) => <option key={v} value={v}>{lbl}</option>)}
    </select>
  );
}

function MinYearsSlider({ value, onChange }) {
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 10px", fontSize: 11, fontWeight: 600,
      background: "#fff", border: `1px solid #fcd34d`,
      borderRadius: 8, color: palette.text,
    }}>
      <span style={{ color: "#b45309" }}>min years</span>
      <input type="range" min="0" max="25" step="1" value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: 80, accentColor: "#f59e0b" }}
      />
      <span style={{ color: "#b45309", minWidth: 18, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{value}+</span>
    </label>
  );
}

function MinScoreSlider({ value, onChange }) {
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 10px", fontSize: 11, fontWeight: 600,
      background: "#fff", border: `1px solid ${palette.border}`,
      borderRadius: 8, color: palette.text,
    }}>
      <span style={{ color: palette.muted }}>min score</span>
      <input type="range" min="0" max="100" step="5" value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: 80, accentColor: palette.link }}
      />
      <span style={{ color: scoreColor(value), minWidth: 20, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </label>
  );
}

function Toggle({ label, icon, on, onChange }) {
  return (
    <label style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "7px 10px", fontSize: 11, fontWeight: 600,
      color: on ? "#fff" : palette.text,
      background: on ? palette.navy : palette.borderLight,
      border: `1px solid ${on ? palette.navy : palette.border}`,
      borderRadius: 8, cursor: "pointer",
    }}>
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} style={{ margin: 0, display: "none" }} />
      {icon}{label}
    </label>
  );
}

function ViewToggleBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 10px", fontSize: 11, fontWeight: 600,
      color: active ? "#fff" : palette.text,
      background: active ? palette.navy : "#fff",
      border: "none", cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {icon}{label}
    </button>
  );
}

function SiteSection({ idx, site, authors, mob }) {
  const cat = CATEGORIES.find((c) => c.id === site.category) || { label: "Other", color: "#64748b" };
  const tier = TIER_STYLES[site.tier] || { label: site.tier || "—", color: "#64748b", bg: "#f1f5f9" };
  const compLinks = site.competitorBacklinks?.refdomains || 0;

  return (
    <section style={{ marginTop: idx === 1 ? 20 : 36 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 28, borderRadius: 8,
          background: palette.navy, color: "#fbbf24",
          fontSize: 13, fontWeight: 700, fontFamily: "Outfit, sans-serif",
        }}>{idx}</div>
        <h2 style={{
          fontFamily: "Outfit, sans-serif", fontWeight: 700,
          fontSize: mob ? 19 : 22, color: palette.navy,
          margin: 0, letterSpacing: -0.2,
        }}>{site.name}</h2>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4,
          color: tier.color, background: tier.bg, letterSpacing: 0.4,
        }}>
          {tier.label} · DR {site.dr}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: cat.color,
          background: cat.color + "18", padding: "2px 8px", borderRadius: 999,
          textTransform: "uppercase", letterSpacing: 0.4,
        }}>{cat.label}</span>
        <span style={{
          fontSize: 12, color: palette.muted, fontWeight: 500,
          background: palette.borderLight, padding: "2px 8px", borderRadius: 999,
        }}>{authors.length} author{authors.length === 1 ? "" : "s"}</span>
        {compLinks >= 3 && (
          <span title="Already receives links from ≥3 of our competitors — high-value target" style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            fontSize: 10, fontWeight: 700, color: "#b91c1c",
            background: "#fee2e2", padding: "2px 7px", borderRadius: 999,
          }}>
            <Flame size={11} />Linked by {compLinks} competitors
          </span>
        )}
        <a
          href={site.url} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: palette.link, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3, marginLeft: "auto" }}
        >
          {site.url.replace(/^https?:\/\//, "").replace(/^www\./, "")}
          <ExternalLink size={11} />
        </a>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr" : "repeat(auto-fill, minmax(360px, 1fr))",
        gap: 10,
      }}>
        {authors.map((a) => <AuthorCard key={a.id} author={a} mob={mob} />)}
      </div>
    </section>
  );
}

function AuthorCard({ author, mob }) {
  const [copied, setCopied] = useState(false);
  const siteDef = SITES[author.site];
  const badge = BADGE_STYLES[author.badge];
  const sen = SENIORITY_LEVELS[author.seniority];

  const copy = async () => {
    const parts = [
      author.name,
      author.role,
      siteDef.name + " (DR " + siteDef.dr + ")",
      author.linkedin || "",
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(parts.join(" — "));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 8,
      padding: 14, background: "#fff",
      border: `1px solid ${palette.border}`, borderRadius: 10,
      position: "relative",
    }}>
      {/* Score badge top-right: final = base × (1 + auth/100) */}
      <div title={`Final: ${author.finalScore} = base ${author.score} × (1 + auth ${author.authoritativeness}/100)`} style={{
        position: "absolute", top: 10, right: 10,
        display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2,
      }}>
        <div style={{
          minWidth: 34, padding: "2px 8px", borderRadius: 999,
          background: scoreColor(author.finalScore), color: "#fff",
          fontFamily: "Outfit, sans-serif", fontSize: 13, fontWeight: 700,
          textAlign: "center", lineHeight: 1.3,
        }}>
          {author.finalScore}
        </div>
        {author.eeatTier && EEAT_TIERS[author.eeatTier] && (
          <div style={{
            fontSize: 9, fontWeight: 800,
            color: EEAT_TIERS[author.eeatTier].color,
            background: EEAT_TIERS[author.eeatTier].bg,
            padding: "1px 6px", borderRadius: 4,
            letterSpacing: 0.3,
          }}>
            E-E-A-T: {author.eeatTier}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingRight: 50 }}>
        <div style={{
          flexShrink: 0, width: 44, height: 44, borderRadius: 10,
          background: avatarColor(author.name), color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 16,
          letterSpacing: 0.3,
        }}>
          {initials(author.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
            <div style={{
              fontFamily: "Outfit, sans-serif", fontWeight: 700, fontSize: 15,
              color: palette.navy, lineHeight: 1.2,
            }}>{author.name}</div>
            {author.status === "former" && (
              <span style={{
                fontSize: 9, fontWeight: 700, color: "#64748b",
                background: "#f1f5f9", padding: "1px 5px", borderRadius: 4,
                textTransform: "uppercase", letterSpacing: 0.3,
              }}>FORMER</span>
            )}
            {author.isMultiOutlet && (
              <span title="Writes for multiple outlets" style={{
                display: "inline-flex", alignItems: "center", gap: 2,
                fontSize: 9, fontWeight: 700, color: "#b91c1c",
                background: "#fee2e2", padding: "1px 5px", borderRadius: 4,
              }}>
                <Flame size={9} />CROSS
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: palette.text, lineHeight: 1.35, marginTop: 2 }}>
            {author.role}
            {author.credentials?.length > 0 && (
              <span style={{ color: palette.link, fontWeight: 600 }}>
                {" · "}{author.credentials.join(", ")}
              </span>
            )}
          </div>
        </div>
      </div>

      {author.bio && (
        <div style={{ fontSize: 12, color: palette.muted, lineHeight: 1.45 }}>
          {author.bio}
        </div>
      )}

      {/* E-E-A-T signals row */}
      {(author.certifications?.length > 0 || author.education?.length > 0 || author.yearsInIndustry) && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", fontSize: 10, color: palette.text }}>
          {author.yearsInIndustry && (
            <span style={{ padding: "2px 6px", background: "#ecfdf5", color: "#047857", borderRadius: 4, fontWeight: 700 }}>
              {author.yearsInIndustry} yrs
            </span>
          )}
          {author.certifications?.map((c, i) => (
            <span key={i} title={`${c.name} · ${c.issuer}${c.verified ? " · verified" : " · not verified"}`}
              style={{
                padding: "2px 6px", borderRadius: 4, fontWeight: 700,
                background: c.verified ? "#d1fae5" : "#fef3c7",
                color: c.verified ? "#047857" : "#b45309",
                border: `1px solid ${c.verified ? "#6ee7b7" : "#fcd34d"}`,
              }}>
              🎖 {c.name}
            </span>
          ))}
          {author.education?.slice(0, 1).map((e, i) => (
            <span key={i} title={`${e.degree} · ${e.school || "—"}`}
              style={{ padding: "2px 6px", background: "#f1f5f9", color: "#475569", borderRadius: 4 }}>
              🎓 {e.school || "?"}
            </span>
          ))}
          {author.mediaSignals?.quotedInTier1?.length > 0 && (
            <span title={`Cited in: ${author.mediaSignals.quotedInTier1.join(", ")}`}
              style={{ padding: "2px 6px", background: "#dbeafe", color: "#1e40af", borderRadius: 4, fontWeight: 700 }}>
              📰 {author.mediaSignals.quotedInTier1.length} tier-1
            </span>
          )}
          {author.mediaSignals?.authoredBooks?.length > 0 && (
            <span title={author.mediaSignals.authoredBooks.map((b) => b.title).join("; ")}
              style={{ padding: "2px 6px", background: "#fef3c7", color: "#b45309", borderRadius: 4, fontWeight: 700 }}>
              📚 {author.mediaSignals.authoredBooks.length}
            </span>
          )}
          {author.mediaSignals?.linkedinFollowers != null && (
            <span title={`${author.mediaSignals.linkedinFollowers.toLocaleString()} LinkedIn followers (fetched ${author.mediaSignals.linkedinFetchedAt?.split("T")[0] || "—"})`}
              style={{ padding: "2px 6px", background: "#e0f2fe", color: "#075985", borderRadius: 4, fontWeight: 700 }}>
              📣 {author.mediaSignals.linkedinFollowers >= 1000
                ? (author.mediaSignals.linkedinFollowers / 1000).toFixed(author.mediaSignals.linkedinFollowers >= 10000 ? 0 : 1) + "K"
                : author.mediaSignals.linkedinFollowers.toLocaleString()}
            </span>
          )}
          {author.mediaSignals?.linkedinFollowers == null && author.mediaSignals?.linkedinConnections && (
            <span title={`${author.mediaSignals.linkedinConnections} LinkedIn connections (followers not exposed)`}
              style={{ padding: "2px 6px", background: "#f1f5f9", color: "#475569", borderRadius: 4, fontWeight: 600 }}>
              👥 {author.mediaSignals.linkedinConnections}
            </span>
          )}
          {author.needsManualReview && (
            <span title="Needs manual review — socials not surfaced via Layer 5.5 or Rule A"
              style={{ padding: "2px 6px", background: "#fee2e2", color: "#b91c1c", borderRadius: 4, fontWeight: 700 }}>
              ⚠ review
            </span>
          )}
        </div>
      )}

      {/* Badges row */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
        {badge && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
            color: badge.color, background: badge.bg, border: `1px solid ${badge.border}`,
          }}>{badge.label}</span>
        )}
        {sen && (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
            color: "#475569", background: "#f1f5f9",
          }}>{sen.label}</span>
        )}
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
          color: TIER_STYLES[author.outletTier].color,
          background: TIER_STYLES[author.outletTier].bg,
        }}>
          {author.outletTier} · DR {author.outletDR}
        </span>
      </div>

      {/* Beat chips */}
      {author.beat?.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {author.beat.map((b) => {
            const bDef = BEATS[b] || { label: b, color: "#64748b" };
            return (
              <span key={b} style={{
                fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 4,
                color: bDef.color, background: bDef.color + "14",
                border: `1px solid ${bDef.color}30`,
              }}>{bDef.label}</span>
            );
          })}
        </div>
      )}

      {/* Socials + author page */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2, alignItems: "center" }}>
        <SocialLink icon={<Linkedin size={13} />} url={author.linkedin} label="LinkedIn" />
        <SocialLink icon={<Twitter size={13} />} url={author.twitter} label="Twitter" />
        <SocialLink icon={<FileText size={13} />} url={author.muckrack} label="Muck Rack" />
        <SocialLink icon={<Mail size={13} />} url={author.email ? `mailto:${author.email}` : null} label="Email" />
        <SocialLink icon={<Globe size={13} />} url={author.personalSite} label="Site" />
        <SocialLink icon={<ExternalLink size={13} />} url={author.authorUrl} label="Author page" strong />
        <button
          onClick={copy}
          title="Copy name — role — outlet — LinkedIn"
          style={{
            marginLeft: "auto",
            background: "transparent", border: `1px solid ${palette.border}`,
            borderRadius: 6, padding: "3px 7px", cursor: "pointer", color: palette.muted,
            display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600,
          }}
        >
          {copied ? <Check size={12} color={palette.link} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function SocialLink({ icon, url, label, strong }) {
  if (!url) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 11, fontWeight: 500,
        color: "#cbd5e1", padding: "3px 7px",
        background: "#f8fafc", borderRadius: 6,
      }} title={`No ${label} on record`}>
        {icon}<span>{label}</span>
      </span>
    );
  }
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer nofollow"
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 11, fontWeight: 600,
        color: strong ? "#fff" : palette.link,
        background: strong ? palette.link : "#ecfdf5",
        border: `1px solid ${strong ? palette.link : "#a7f3d0"}`,
        padding: "3px 7px", borderRadius: 6,
        textDecoration: "none",
      }}
    >
      {icon}<span>{label}</span>
    </a>
  );
}

// ============================
// TABLE VIEW
// ============================
function AuthorsTable({ rows, mob }) {
  return (
    <div style={{
      border: `1px solid ${palette.border}`,
      borderRadius: 10, overflow: "hidden", background: "#fff",
    }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%", borderCollapse: "collapse",
          fontSize: 12, minWidth: 1100,
        }}>
          <thead>
            <tr style={{ background: palette.borderLight }}>
              <Th style={{ width: 48, textAlign: "right" }}>Final</Th>
              <Th style={{ width: 50 }}>E-E-A-T</Th>
              <Th>Author</Th>
              <Th>Role</Th>
              <Th>Outlet</Th>
              <Th style={{ width: 56 }}>Tier</Th>
              <Th style={{ width: 50 }}>Badge</Th>
              <Th>Beat</Th>
              <Th style={{ width: 50 }}>Yrs</Th>
              <Th style={{ width: 80, textAlign: "right" }}>LI ⓕ</Th>
              <Th style={{ width: 140 }}>Contacts</Th>
              <Th style={{ width: 70 }}>Page</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} style={{ borderTop: `1px solid ${palette.borderLight}` }}>
                <Td style={{ textAlign: "right" }}>
                  <span title={`base ${a.score} × (1 + ${a.authoritativeness}/100)`}
                    style={{
                      display: "inline-block", minWidth: 32, padding: "2px 7px",
                      borderRadius: 999, background: scoreColor(a.finalScore), color: "#fff",
                      fontFamily: "Outfit, sans-serif", fontSize: 12, fontWeight: 700,
                    }}>{a.finalScore}</span>
                </Td>
                <Td>
                  {a.eeatTier && EEAT_TIERS[a.eeatTier] && (
                    <span title={EEAT_TIERS[a.eeatTier].label}
                      style={{
                        fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 4,
                        color: EEAT_TIERS[a.eeatTier].color, background: EEAT_TIERS[a.eeatTier].bg,
                      }}>{a.eeatTier}</span>
                  )}
                </Td>
                <Td style={{ fontWeight: 700, color: palette.navy }}>
                  {a.name}
                  {a.status === "former" && (
                    <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 700, color: "#64748b", background: "#f1f5f9", padding: "1px 4px", borderRadius: 3 }}>FORMER</span>
                  )}
                  {a.isMultiOutlet && (
                    <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 700, color: "#b91c1c", background: "#fee2e2", padding: "1px 4px", borderRadius: 3 }}>CROSS</span>
                  )}
                </Td>
                <Td style={{ color: palette.text }}>
                  {a.role}
                  {a.credentials?.length > 0 && (
                    <span style={{ color: palette.link, fontWeight: 600 }}>{" "}· {a.credentials.join(", ")}</span>
                  )}
                </Td>
                <Td>{a.outletName}</Td>
                <Td>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                    color: TIER_STYLES[a.outletTier].color, background: TIER_STYLES[a.outletTier].bg,
                  }}>{a.outletTier} · {a.outletDR}</span>
                </Td>
                <Td>
                  {a.badge && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                      color: BADGE_STYLES[a.badge].color, background: BADGE_STYLES[a.badge].bg,
                    }}>{a.badge}</span>
                  )}
                </Td>
                <Td style={{ maxWidth: 220 }}>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {a.beat?.slice(0, 3).map((b) => {
                      const bDef = BEATS[b] || { label: b, color: "#64748b" };
                      return (
                        <span key={b} style={{
                          fontSize: 10, fontWeight: 600, padding: "0px 5px", borderRadius: 3,
                          color: bDef.color, background: bDef.color + "14",
                        }}>{bDef.label}</span>
                      );
                    })}
                    {a.beat?.length > 3 && <span style={{ fontSize: 10, color: palette.muted }}>+{a.beat.length - 3}</span>}
                  </div>
                </Td>
                <Td style={{ color: palette.text, textAlign: "center" }}>{a.yearsInIndustry || "—"}</Td>
                <Td style={{ textAlign: "right", fontFamily: "Outfit, sans-serif", fontWeight: 700, color: palette.navy }}>
                  {a.mediaSignals?.linkedinFollowers != null
                    ? a.mediaSignals.linkedinFollowers >= 1000
                      ? (a.mediaSignals.linkedinFollowers / 1000).toFixed(a.mediaSignals.linkedinFollowers >= 10000 ? 0 : 1) + "K"
                      : a.mediaSignals.linkedinFollowers.toLocaleString()
                    : a.mediaSignals?.linkedinConnections
                      ? <span style={{ color: palette.muted, fontWeight: 500, fontSize: 11 }}>{a.mediaSignals.linkedinConnections} conn</span>
                      : <span style={{ color: palette.muted, fontWeight: 400 }}>—</span>}
                </Td>
                <Td>
                  <div style={{ display: "flex", gap: 3 }}>
                    <IconLink url={a.linkedin} title="LinkedIn"><Linkedin size={13} /></IconLink>
                    <IconLink url={a.twitter} title="Twitter"><Twitter size={13} /></IconLink>
                    <IconLink url={a.muckrack} title="Muck Rack"><FileText size={13} /></IconLink>
                    <IconLink url={a.email ? `mailto:${a.email}` : null} title="Email"><Mail size={13} /></IconLink>
                  </div>
                </Td>
                <Td>
                  <IconLink url={a.authorUrl} title="Author page"><ExternalLink size={13} /></IconLink>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function IconLink({ url, title, children }) {
  if (!url) {
    return (
      <span title={`No ${title}`} style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 22, height: 22, color: "#cbd5e1",
      }}>{children}</span>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer nofollow"
      title={title}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 22, height: 22, color: palette.link,
        background: "#ecfdf5", borderRadius: 4,
      }}
    >{children}</a>
  );
}

function Th({ children, style }) {
  return (
    <th style={{
      padding: "10px 10px", textAlign: "left",
      fontSize: 10, fontWeight: 700, color: "#64748b",
      textTransform: "uppercase", letterSpacing: 0.5,
      ...style,
    }}>{children}</th>
  );
}

function Td({ children, style }) {
  return <td style={{ padding: "8px 10px", verticalAlign: "middle", ...style }}>{children}</td>;
}
