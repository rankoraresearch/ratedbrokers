import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { QUIZ_QUESTIONS, POPULAR_COUNTRIES, CONTEXTUAL_TIPS, matchBrokers, getWeakPoint, getUserProfile } from "../utils/quizMatching";
import { getVisitUrl } from "../utils/visitUrl";
import { getTrustpilotUrl } from "../data/trustpilot-links";
import ScoreBadge from "../components/ScoreBadge";
import RegBadge from "../components/RegBadge";
import BrokerLogo from "../components/BrokerLogo";
import CountryFlag from "../components/CountryFlag";
import {
  ChevronLeft, ChevronRight, ChevronDown, Check, Info,
  Search, ArrowRight, Trophy, Target, Shield, Sparkles,
  BarChart3, X as XIcon, ExternalLink, Star, Calendar,
  Monitor, Share2, RotateCcw, ArrowUpRight,
} from "lucide-react";

/* ── Trustpilot stars (reused from BrokerRankCard) ── */
const TpStars = ({ rating = 0, size = 14 }) => {
  const full = Math.floor(rating);
  const partial = rating - full;
  const empty = 5 - full - (partial > 0 ? 1 : 0);
  const starPath = "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z";
  const uid = `tp-q-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
      {Array.from({ length: full }, (_, i) => (
        <svg key={`f${i}`} width={size} height={size} viewBox="0 0 24 24"><path d={starPath} fill="#00B67A" /></svg>
      ))}
      {partial > 0 && (
        <svg key="p" width={size} height={size} viewBox="0 0 24 24">
          <defs><clipPath id={uid}><rect x="0" y="0" width={24 * partial} height="24" /></clipPath></defs>
          <path d={starPath} fill="#dcdce6" /><path d={starPath} fill="#00B67A" clipPath={`url(#${uid})`} />
        </svg>
      )}
      {Array.from({ length: empty }, (_, i) => (
        <svg key={`e${i}`} width={size} height={size} viewBox="0 0 24 24"><path d={starPath} fill="#dcdce6" /></svg>
      ))}
    </span>
  );
};

const formatTpCount = (n) => {
  if (!n) return "";
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : n.toString();
};

/* ── Wide logo (simplified from BrokerRankCard) ── */
function WideLogo({ slug, name, w = 140, h = 44 }) {
  const [err, setErr] = useState(false);
  if (err) return <BrokerLogo slug={slug} name={name} size={h} shape="icon" />;
  return (
    <div style={{
      borderRadius: 10, overflow: "hidden", display: "inline-flex",
      alignItems: "center", justifyContent: "center",
      height: h, width: w, flexShrink: 0,
      background: "linear-gradient(135deg, #0a2018, #0f172a)",
      border: "1px solid #1a3d30",
    }}>
      <img
        src={`${import.meta.env.BASE_URL}logos-wide-dark/${slug}.svg`}
        alt={`${name} logo`} loading="lazy" onError={() => setErr(true)}
        style={{ width: "70%", height: "70%", objectFit: "contain" }}
      />
    </div>
  );
}

/* ── Match label for top-3 ── */
const MATCH_LABELS = { 1: "Best Match", 2: "Runner-Up", 3: "Runner-Up" };

/* ═══════════════════════════════════════════════════════════
   MAIN QUIZ PAGE COMPONENT — v2 Premium
   ═══════════════════════════════════════════════════════════ */

export default function FindYourBrokerPage() {
  const { mob, tab } = useMedia();
  const lp = useLocalePath();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [transitioning, setTransitioning] = useState(false);
  const [infoOpen, setInfoOpen] = useState(null);
  const [searchCountry, setSearchCountry] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [riskExpanded, setRiskExpanded] = useState({});
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // Cleanup timers on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const totalSteps = QUIZ_QUESTIONS.length;
  const isResults = step >= totalSteps;
  const currentQ = QUIZ_QUESTIONS[step] || null;


  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  // SEO
  // SEO: title, description, canonical (Sprint 4)
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") || "";
    document.title = "Find Your Broker — Personalized Broker Matching | RatedBrokers";
    if (meta) meta.setAttribute("content", "Answer 6 quick questions about your trading style, experience, budget, and frequency — and get matched with the best broker from 50+ expert-tested options.");
    // Canonical — track if we created or reused, restore prev href on unmount
    let canonical = document.querySelector('link[rel="canonical"]');
    const canonicalIsNew = !canonical;
    const prevCanonicalHref = canonical?.href || "";
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = "https://ratedbrokers.com/find-your-broker";
    // OG meta tags for social sharing
    const ogTags = [
      { property: "og:title", content: "Find Your Perfect Broker — Free Quiz | RatedBrokers" },
      { property: "og:description", content: "Answer 6 questions and get matched with the best broker for your trading style. Expert-tested, data-driven results." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://ratedbrokers.com/find-your-broker" },
    ];
    const createdOg = ogTags.map(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      const isNew = !tag;
      const prevContent = tag?.getAttribute("content") || "";
      if (!tag) { tag = document.createElement("meta"); tag.setAttribute("property", property); document.head.appendChild(tag); }
      tag.setAttribute("content", content);
      return { tag, isNew, prevContent };
    });
    return () => {
      document.title = prevTitle;
      if (meta) meta.setAttribute("content", prevDesc);
      if (canonicalIsNew) { if (canonical.parentNode) canonical.parentNode.removeChild(canonical); }
      else { canonical.href = prevCanonicalHref; }
      createdOg.forEach(({ tag, isNew, prevContent }) => {
        if (isNew) { if (tag.parentNode) tag.parentNode.removeChild(tag); }
        else { tag.setAttribute("content", prevContent); }
      });
    };
  }, []);

  // Shared FAQ data — used for both JSON-LD and visual FAQ section
  const QUIZ_FAQ = [
    { q: "How does the Find Your Broker quiz work?", a: "Our quiz asks 6 targeted questions about your trading preferences, experience, budget, and trading frequency. Our algorithm then scores all 50+ brokers against your answers and ranks them by match percentage." },
    { q: "Is the broker matching tool free?", a: "Yes, completely free with no registration required. We earn revenue through affiliate partnerships with brokers we recommend, but your results are 100% based on our independent scoring methodology. We never accept payment to boost a broker's position." },
    { q: "How many brokers does the quiz compare?", a: "The quiz evaluates all 50+ brokers in our database, each independently tested and scored across 6 categories: Regulation, Costs, Trustpilot, Expert Evaluation, Trading Frequency Fit, and Execution." },
    { q: "Can I retake the quiz with different answers?", a: "Absolutely. Click 'Start Over' at any point to restart the quiz. You can also go back to any previous question using the Back button. Your live results in the sidebar update in real-time as you modify your answers." },
    { q: "What data do you use to score brokers?", a: "We collect data across 6 dimensions: regulatory licenses and tier classification, trading costs (spreads and commissions), Trustpilot user ratings, our proprietary expert evaluation, trading frequency fit, and execution quality. All data is verified firsthand." },
    { q: "Do brokers pay to be listed?", a: "No. Our rankings are based entirely on our independent methodology. We may earn affiliate commissions when you open an account through our links, but this never influences broker placement or match percentages." },
    { q: "How often are results updated?", a: "Our broker data is reviewed and updated monthly. Regulatory changes, fee updates, and platform additions are reflected as soon as they are verified by our team." },
  ];

  // JSON-LD: FAQ + BreadcrumbList + HowTo schemas
  useEffect(() => {
    const schemas = [
      { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: QUIZ_FAQ.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) },
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ratedbrokers.com/" },
        { "@type": "ListItem", position: 2, name: "Find Your Broker", item: "https://ratedbrokers.com/find-your-broker" },
      ]},
      { "@context": "https://schema.org", "@type": "HowTo", name: "How to Find Your Perfect Broker", description: "Answer 6 quick questions to get matched with the best broker for your trading needs.", step: [
        { "@type": "HowToStep", position: 1, name: "Select your country", text: "Tell us where you are based so we can prioritize locally regulated brokers." },
        { "@type": "HowToStep", position: 2, name: "Choose your assets", text: "Select the markets you want to trade: forex, stocks, crypto, and more." },
        { "@type": "HowToStep", position: 3, name: "Set your experience level", text: "Are you a beginner, intermediate, or professional trader?" },
        { "@type": "HowToStep", position: 4, name: "Enter your budget", text: "How much do you plan to deposit? This filters brokers by minimum requirements." },
        { "@type": "HowToStep", position: 5, name: "Pick your priority", text: "What matters most: lowest costs, maximum safety, best platform, or fast execution?" },
        { "@type": "HowToStep", position: 6, name: "Set your trading frequency", text: "How often do you trade? This helps match the right cost structure." },
      ]},
    ];
    let el = document.getElementById("quiz-faq-jsonld");
    if (!el) { el = document.createElement("script"); el.id = "quiz-faq-jsonld"; el.type = "application/ld+json"; document.head.appendChild(el); }
    el.textContent = JSON.stringify(schemas);
    return () => { if (el.parentNode) el.parentNode.removeChild(el); };
  }, []);

  const results = useMemo(() => matchBrokers(answers), [answers]);
  const topResults = results.slice(0, 10);

  // ── Navigation ──
  function goNext() {
    if (step >= totalSteps) return;
    if (step === totalSteps - 1) {
      // Show shimmer loading before results (Sprint 12.3)
      setShowLoading(true);
      timerRef.current = setTimeout(() => {
        setShowLoading(false);
        setStep((s) => s + 1);
        setInfoOpen(null);
      }, 900);
      return;
    }
    setTransitioning(true);
    timerRef.current = setTimeout(() => { setStep((s) => s + 1); setTransitioning(false); setInfoOpen(null); }, 200);
  }
  function goBack() {
    if (step <= 0) return;
    setTransitioning(true);
    timerRef.current = setTimeout(() => { setStep((s) => s - 1); setTransitioning(false); setInfoOpen(null); }, 200);
  }
  function restart() {
    setStep(0); setInfoOpen(null); setRiskExpanded({});
    setAnswers({});
  }
  function setAnswer(qId, value) {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  }
  function toggleMulti(qId, value) {
    setAnswers((prev) => {
      const arr = prev[qId] || [];
      if (value === "unknown") return { ...prev, [qId]: ["unknown"] };
      const filtered = arr.filter((v) => v !== "unknown");
      return { ...prev, [qId]: filtered.includes(value) ? filtered.filter((v) => v !== value) : [...filtered, value] };
    });
  }
  function canProceed() {
    if (!currentQ) return false;
    const val = answers[currentQ.id];
    if (currentQ.type === "multi") return val && val.length > 0;
    return !!val;
  }

  // Share URL (Sprint 12.4)
  function getShareUrl() {
    const params = new URLSearchParams();
    Object.entries(answers).forEach(([k, v]) => {
      params.set(k, Array.isArray(v) ? v.join(",") : v);
    });
    return `${window.location.origin}${import.meta.env.BASE_URL}find-your-broker?${params.toString()}`;
  }
  function copyShare() {
    navigator.clipboard.writeText(getShareUrl()).catch(() => {});
  }

  // Load from URL params on mount
  const BUDGET_MIGRATION = { micro: "under50", small: "200-500", medium: "1k-5k", large: "5k-50k" };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.size === 0) return;
    const loaded = {};
    for (const [k, v] of params.entries()) {
      if (k === "platform") continue; // Skip deprecated param from old share URLs
      const q = QUIZ_QUESTIONS.find((q) => q.id === k);
      if (!q) continue;
      const val = k === "budget" && BUDGET_MIGRATION[v] ? BUDGET_MIGRATION[v] : v;
      loaded[k] = q.type === "multi" ? val.split(",") : val;
    }
    // Only jump to results if we have country + at least 1 other valid answer
    if (loaded.country && Object.keys(loaded).length >= 2) {
      setAnswers(loaded);
      setStep(totalSteps); // Jump to results
    }
  }, []);

  const cardStyle = {
    background: "#fff", borderRadius: 14,
    border: "none",
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.05)",
    overflow: "hidden",
  };

  // Dynamic USP based on answers (Sprint v3)
  function getDynamicUSP(broker) {
    const B = broker.B;
    const prio = answers.priority;
    if (prio === "costs") return `${B.spread} pip spreads`;
    if (prio === "safety") {
      const t1 = B.regs.filter((r) => r.tier === 1).map((r) => r.name);
      return t1.length > 0 ? t1.slice(0, 2).join(", ") + " regulated" : "Tier-1 regulated";
    }
    if (prio === "platform") return B.platforms.slice(0, 2).join(" + ");
    if (prio === "speed") return /ecn|stp/i.test(B.type) ? "ECN/STP execution" : B.type;
    if (prio === "ease") return B.tp >= 4.0 ? `${B.tp}/5 Trustpilot` : "User-friendly";
    return B.minDep === 0 ? "$0 min deposit" : `From $${B.minDep}`;
  }

  /* ═══ Progress Bar (Sprint 8.4) ═══ */
  const ProgressBar = () => (
    <div style={{ padding: mob ? "10px 0 6px" : "14px 0 8px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 6,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", letterSpacing: 0.5 }}>
          {isResults ? "Results" : `Step ${step + 1} of ${totalSteps}`}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>
          {isResults ? "Complete" : currentQ?.title}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: mob ? 3 : 6 }}>
        {QUIZ_QUESTIONS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 8, borderRadius: 4,
            background: i < step ? "#059669" : i === step ? "#34d399" : "#e2e8f0",
            transition: "background 0.3s",
          }} />
        ))}
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: isResults ? "#059669" : "#e2e8f0", transition: "background 0.3s" }} />
      </div>
    </div>
  );

  /* ═══ Mobile Mini Preview — D2k Border Only: 3 clean rows, green border on hover, risk overlay ═══ */
  const MobileMiniPreview = () => {
    if (step === 0 && Object.keys(answers).length === 0) return null;
    const top3 = topResults.slice(0, 3);
    if (top3.length === 0) return null;
    return (
      <div className="d2k-list" style={{ marginTop: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, padding: "0 2px" }}>Your top matches</div>
        {top3.map((r, i) => {
          const B = r.broker.B;
          const rw = B.riskWarning && (B.verticals || []).some(v => ["forex", "cfd", "crypto", "spread-betting"].includes(v)) ? B.riskWarning : null;
          return (
            <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
              className="d2k-row"
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "14px 12px",
                textDecoration: "none", marginBottom: i < 2 ? 6 : 0,
                borderRadius: 12,
                background: i === 0 ? "rgba(236,253,245,0.4)" : "transparent",
              }}
            >
              <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
              <BrokerLogo slug={r.slug} name={B.name} size={52} shape="icon" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
                {rw && <div className="d2k-risk" style={{ fontSize: 10, lineHeight: 1.3, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
              <ArrowUpRight size={18} className="d2k-arrow" color={i === 0 ? "#059669" : "#94a3b8"} style={{ flexShrink: 0 }} />
            </a>
          );
        })}
      </div>
    );
  };

  /* ═══ Question Step ═══ */
  const QuestionStep = () => {
    if (!currentQ) return null;

    // Country grouping (Sprint 8.5)
    let countryOptions = currentQ.options;
    if (currentQ.id === "country" && searchCountry) {
      countryOptions = currentQ.options.filter((o) => o.label.toLowerCase().includes(searchCountry.toLowerCase()));
    }
    const popularCountries = currentQ.id === "country" && !searchCountry
      ? countryOptions.filter((o) => POPULAR_COUNTRIES.includes(o.value))
      : [];
    const otherCountries = currentQ.id === "country" && !searchCountry
      ? countryOptions.filter((o) => !POPULAR_COUNTRIES.includes(o.value))
      : countryOptions;

    return (
      <div style={{
        ...cardStyle,
        overflow: "visible",
        padding: mob ? "24px 20px 20px" : "36px 40px 32px",
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "translateX(20px)" : "translateX(0)",
        transition: "opacity 0.2s, transform 0.2s",
      }}>
        {/* Step counter */}
        <div style={{
          fontSize: 12, fontWeight: 700, color: "#059669",
          textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8,
        }}>
          Question {step + 1} of {totalSteps}
        </div>

        <h2 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: mob ? 22 : 28, fontWeight: 800,
          color: "#0f172a", margin: "0 0 6px", lineHeight: 1.2,
        }}>
          {currentQ.title}
        </h2>

        <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 20px" }}>
          {currentQ.subtitle}
        </p>

        {/* Why it matters — subtle toggle */}
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={() => setInfoOpen(infoOpen === currentQ.id ? null : currentQ.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: 0, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 500, color: "#94a3b8",
              fontFamily: "inherit", transition: "color 0.15s", background: "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#2563eb"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; }}
          >
            <Info size={13} /> Why this matters
          </button>
          {infoOpen === currentQ.id && (
            <div style={{
              marginTop: 8, padding: "10px 14px", borderRadius: 10,
              background: "#f8fafc",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
              fontSize: 13, lineHeight: 1.6, color: "#64748b",
            }}>
              {currentQ.whyMatters}
            </div>
          )}
        </div>

        {/* ── Country dropdown (Sprint 8.5: grouped) ── */}
        {currentQ.type === "dropdown" && (
          <div>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
              <input
                id="quiz-country-search"
                type="text" placeholder="Search country..." value={searchCountry}
                aria-label="Search country"
                autoFocus={searchCountry.length > 0}
                onChange={(e) => setSearchCountry(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10,
                  border: "1px solid #e2e8f0", fontSize: 16, fontFamily: "inherit",
                  outline: "none", background: "#f8fafc",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#059669"; e.target.style.background = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
              />
            </div>



            {/* Popular countries */}
            {popularCountries.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  Popular
                </div>
                <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 6, marginBottom: 14 }}>
                  {popularCountries.map((opt) => <CountryButton key={opt.value} opt={opt} qId={currentQ.id} selected={answers[currentQ.id] === opt.value} onSelect={setAnswer} />)}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
                  All Countries
                </div>
              </>
            )}

            <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 6, maxHeight: 300, overflowY: "auto" }}>
              {(searchCountry ? countryOptions : otherCountries).map((opt) => (
                <CountryButton key={opt.value} opt={opt} qId={currentQ.id} selected={answers[currentQ.id] === opt.value} onSelect={setAnswer} />
              ))}
            </div>
          </div>
        )}

        {/* ── Single select (clean card style, checkmark right) ── */}
        {currentQ.type === "single" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {currentQ.options.map((opt) => {
              const selected = answers[currentQ.id] === opt.value;
              return (
                <button key={opt.value} role="radio" aria-checked={selected} onClick={() => setAnswer(currentQ.id, opt.value)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: mob ? "14px 16px" : "16px 20px", borderRadius: 12,
                    border: "none",
                    background: selected ? "#ecfdf5" : "#fff",
                    boxShadow: selected
                      ? "inset 0 0 0 2px #059669, 0 2px 8px rgba(5,150,105,0.1)"
                      : "inset 0 0 0 1px rgba(0,0,0,0.08)",
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", textAlign: "left",
                  }}
                  onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)"; } }}
                  onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.08)"; } }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: selected ? 700 : 600, color: selected ? "#047857" : "#111827" }}>{opt.label}</div>
                    {opt.desc && <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{opt.desc}</div>}
                  </div>
                  {selected && (
                    <div style={{
                      width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                      background: "#059669",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={14} color="#fff" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ── Multi select (clean card + checkmark) ── */}
        {currentQ.type === "multi" && (
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: 8 }}>
            {currentQ.options.map((opt) => {
              const arr = answers[currentQ.id] || [];
              const selected = arr.includes(opt.value);
              return (
                <button key={opt.value} role="checkbox" aria-checked={selected} onClick={() => toggleMulti(currentQ.id, opt.value)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: mob ? "14px 14px" : "14px 18px", borderRadius: 12,
                    border: "none",
                    background: selected ? "#ecfdf5" : "#fff",
                    boxShadow: selected
                      ? "inset 0 0 0 2px #059669, 0 2px 8px rgba(5,150,105,0.1)"
                      : "inset 0 0 0 1px rgba(0,0,0,0.08)",
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s", textAlign: "left",
                  }}
                  onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.04)"; } }}
                  onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.08)"; } }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: selected ? 700 : 600, color: selected ? "#047857" : "#111827" }}>{opt.label}</div>
                    {opt.desc && <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{opt.desc}</div>}
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: selected ? "#059669" : "transparent",
                    border: selected ? "none" : "2px solid #d1d5db",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {selected && <Check size={14} color="#fff" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Contextual tip — all steps */}
        {CONTEXTUAL_TIPS[currentQ.id] && (
          <div style={{
            marginTop: 16, padding: "10px 14px", borderRadius: 10,
            background: "#f8fafc",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04)",
            fontSize: 13, color: "#64748b", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Sparkles size={14} color="#f59e0b" style={{ flexShrink: 0 }} />
            {CONTEXTUAL_TIPS[currentQ.id] || "Your answers help us find your perfect broker match."}
          </div>
        )}

        {/* Mobile mini preview */}
        {(mob || tab) && <MobileMiniPreview />}

        {/* Spacer for fixed nav on mobile */}
        {mob && <div style={{ height: 64 }} />}

        {/* Desktop navigation — sticky inside card */}
        {!mob && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            position: "sticky", bottom: 0,
            marginTop: 20, paddingTop: 14, paddingBottom: 4,
            background: "#fff", borderTop: "1px solid #f1f5f9", zIndex: 10,
          }}>
            <button onClick={goBack} disabled={step === 0} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: step === 0 ? "#f8fafc" : "#fff", border: "1px solid #e2e8f0", cursor: step === 0 ? "default" : "pointer", fontSize: 14, fontWeight: 600, color: step === 0 ? "#94a3b8" : "#111827", fontFamily: "inherit", opacity: step === 0 ? 0.5 : 1 }}>
              <ChevronLeft size={16} /> Back
            </button>
            <button onClick={goNext} disabled={!canProceed()} className={canProceed() && step === totalSteps - 1 ? "cta-primary" : ""} style={{ display: "flex", alignItems: "center", gap: 6, padding: step === totalSteps - 1 ? "12px 28px" : "10px 24px", borderRadius: 10, background: canProceed() ? (step === totalSteps - 1 ? "linear-gradient(135deg, #f59e0b, #fbbf24)" : "linear-gradient(135deg, #059669, #047857)") : "#e2e8f0", border: "none", cursor: canProceed() ? "pointer" : "default", fontSize: step === totalSteps - 1 ? 16 : 15, fontWeight: 700, color: canProceed() ? (step === totalSteps - 1 ? "#0f172a" : "#fff") : "#94a3b8", fontFamily: "inherit", boxShadow: canProceed() ? (step === totalSteps - 1 ? "0 4px 16px rgba(245,158,11,0.35)" : "0 4px 12px rgba(5,150,105,0.3)") : "none" }}>
              {step === totalSteps - 1 ? "See My Results" : "Next"} {step === totalSteps - 1 ? <ArrowRight size={16} /> : <ChevronRight size={16} />}
            </button>
          </div>
        )}
      </div>
    );
  };

  /* ═══ Country Button (extracted) ═══ */
  const CountryButton = ({ opt, qId, selected, onSelect }) => (
    <button onClick={() => onSelect(qId, opt.value)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 10,
        border: selected ? "2px solid #059669" : "1px solid #e2e8f0",
        background: selected ? "#ecfdf5" : "#fff",
        cursor: "pointer", fontFamily: "inherit",
        fontSize: 15, fontWeight: selected ? 700 : 500,
        color: selected ? "#047857" : "#1f2937",
        transition: "all 0.15s", textAlign: "left",
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "#f0fdf4"; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "#fff"; }}
    >
      {opt.flag && <CountryFlag code={opt.flag} size={20} />}
      {!opt.flag && <span style={{ width: 20, height: 14 }} />}
      {opt.label}
      {selected && <Check size={16} style={{ marginLeft: "auto", color: "#059669" }} />}
    </button>
  );

  /* ═══ Live Sidebar v3 — Premium with full top-1 card ═══ */
  const LiveSidebar = () => {
    const answeredCount = Object.keys(answers).length;

    if (step === 0 && answeredCount === 0) {
      return (
        <div style={{
          borderRadius: 14, padding: "28px 20px", textAlign: "center",
          background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
        }}>
          <Trophy size={32} color="#f59e0b" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", fontFamily: "'Outfit',sans-serif", marginBottom: 4 }}>Your Match</div>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Answer the first question to see your personalized ranking.</p>
        </div>
      );
    }

    const top5 = topResults.slice(0, 5);
    if (top5.length === 0) return null;

    return (
      <div style={{
        borderRadius: 14,
        background: "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "quizPulse 2s infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", letterSpacing: 0.3 }}>Your Match</span>
          </div>
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
            Based on {answeredCount} answer{answeredCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── D2k Border Only rows ── */}
        <div className="d2k-list" style={{ padding: "6px 8px" }}>
          {top5.map((r, i) => {
            const B = r.broker.B;
            const rw = B.riskWarning && (B.verticals || []).some(v => ["forex", "cfd", "crypto", "spread-betting"].includes(v)) ? B.riskWarning : null;
            return (
              <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
                className="d2k-row"
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 10px",
                  textDecoration: "none", marginBottom: i < 4 ? 5 : 0,
                  borderRadius: 12,
                  background: i === 0 ? "rgba(236,253,245,0.4)" : "transparent",
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : (i < 3 ? "#e2e8f0" : "#f1f5f9"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b", flexShrink: 0 }}>{i + 1}</div>
                <BrokerLogo slug={r.slug} name={B.name} size={48} shape="icon" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{B.name}</div>
                  {rw && <div className="d2k-risk" style={{ fontSize: 10, lineHeight: 1.3, color: "#6b7280", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b" }}>{r.matchPct}%</span>
                <ArrowUpRight size={18} className="d2k-arrow" color={i === 0 ? "#059669" : "#94a3b8"} style={{ flexShrink: 0 }} />
              </a>
            );
          })}
        </div>

        {/* Trust footer */}
        <div style={{
          padding: "8px 16px 10px", borderTop: "1px solid rgba(0,0,0,0.04)",
          textAlign: "center",
        }}>
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>
            Independent analysis of {results.length} expert-tested brokers
          </span>
        </div>
      </div>
    );
  };

  /* ═══ Shimmer Loading — branded ═══ */
  const ShimmerLoading = () => {
    const [counter, setCounter] = useState(0);
    useEffect(() => {
      const iv = setInterval(() => setCounter((c) => Math.min(c + 1, results.length)), 15);
      return () => clearInterval(iv);
    }, []);
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center", padding: "60px 20px" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18, margin: "0 auto 20px",
          background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(15,23,42,0.2)",
        }}>
          <BarChart3 size={32} color="#34d399" className="quiz-match-pulse" />
        </div>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
          Analyzing your preferences
        </div>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
          Matching against <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: "#059669" }}>{counter}</span> expert-tested brokers
        </p>
        <div style={{
          width: "100%", height: 4, borderRadius: 2, background: "#e2e8f0", overflow: "hidden",
        }}>
          <div style={{
            width: `${results.length > 0 ? Math.min(counter / results.length * 100, 100) : 0}%`, height: "100%",
            background: "linear-gradient(90deg, #059669, #34d399)",
            borderRadius: 2, transition: "width 0.1s",
          }} />
        </div>
      </div>
    );
  };

  /* ═══ Quick Compare — REMOVED (replaced by D2k unified rows) ═══ */
  /* const QuickCompareTable_REMOVED = () => {
    const top3 = topResults.slice(0, 3);
    if (top3.length < 3) return null;

    // Mobile: card layout
    if (mob) return (
      <div style={{ ...cardStyle, marginBottom: 20, padding: "16px" }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>
          Quick Compare — Your Top 3
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {top3.map((r, i) => {
            const B = r.broker.B;
            return (
              <div key={r.slug} style={{
                padding: 14, borderRadius: 12,
                background: i === 0 ? "linear-gradient(135deg, rgba(236,253,245,0.5), rgba(209,250,229,0.3))" : "#f8fafc",
                border: i === 0 ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <BrokerLogo slug={r.slug} name={B.name} size={48} shape="icon" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{B.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: "#059669" }}>{r.matchPct}% match</div>
                  </div>
                  <div style={{
                    fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 18,
                    color: B.score >= 9.0 ? "#059669" : "#2563eb",
                  }}>{B.score}</div>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#64748b", marginBottom: 10 }}>
                  <span>Spread: <strong style={{ color: "#111827" }}>{B.spread} pips</strong></span>
                  <span>Min: <strong style={{ color: "#111827" }}>{B.minDep === 0 ? "$0" : `$${B.minDep}`}</strong></span>
                  <span>TP: <strong style={{ color: "#111827" }}>{B.tp > 0 ? `${B.tp}/5` : "—"}</strong></span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored" className="cta-primary"
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 8, textAlign: "center",
                      background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                      color: "#0f172a", fontWeight: 700, fontSize: 13, textDecoration: "none",
                    }}
                  >Visit {B.name}</a>
                  <Link to={lp(`/reviews/${r.slug}`)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, textAlign: "center",
                    border: "2px solid #059669", color: "#059669", fontWeight: 700, fontSize: 13,
                    textDecoration: "none",
                  }}>Read Review</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

    // Desktop: table layout
    return (
      <div style={{ ...cardStyle, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "20px 28px 12px", borderBottom: "1px solid #f1f5f9" }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Quick Compare — Your Top 3
          </h2>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["", "Score", "Spread", "Min Dep", "Trustpilot", "", "Review"].map((h, i) => (
                <th key={i} style={{
                  padding: "10px 14px", fontSize: 11, fontWeight: 700, color: "#64748b",
                  textTransform: "uppercase", letterSpacing: 0.5, textAlign: i === 0 ? "left" : "center",
                  borderBottom: "1px solid #e2e8f0",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top3.map((r, i) => {
              const B = r.broker.B;
              return (
                <tr key={r.slug} style={{ borderBottom: i < 2 ? "1px solid #f1f5f9" : "none" }}>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <BrokerLogo slug={r.slug} name={B.name} size={32} shape="icon" />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{B.name}</div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800, color: "#059669" }}>{r.matchPct}% match</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 8px" }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16, color: B.score >= 9.0 ? "#059669" : "#2563eb" }}>{B.score}</span>
                  </td>
                  <td style={{ textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14 }}>{B.spread} pips</td>
                  <td style={{ textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 14 }}>{B.minDep === 0 ? "$0" : `$${B.minDep}`}</td>
                  <td style={{ textAlign: "center", padding: "12px 8px" }}>
                    {B.tp > 0 ? (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                        <TpStars rating={B.tp} size={12} />
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700 }}>{B.tp}</span>
                      </div>
                    ) : <span style={{ color: "#94a3b8" }}>—</span>}
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 14px" }}>
                    <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored" className="cta-primary"
                      style={{
                        display: "inline-block", padding: "7px 14px", borderRadius: 8,
                        background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                        color: "#0f172a", fontWeight: 700, fontSize: 12, textDecoration: "none", whiteSpace: "nowrap",
                      }}
                    >Visit {B.name} →</a>
                  </td>
                  <td style={{ textAlign: "center", padding: "12px 8px" }}>
                    <Link to={lp(`/reviews/${r.slug}`)} style={{ fontSize: 12, fontWeight: 600, color: "#059669", textDecoration: "none" }}>Review</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }; */

  /* ═══ Results Page — D2k Border Only style ═══ */
  const ResultsPage = () => (
    <div style={{
      opacity: transitioning ? 0 : 1,
      transform: transitioning ? "translateY(20px)" : "translateY(0)",
      transition: "opacity 0.3s, transform 0.3s",
      overflow: "hidden",
    }}>
      {/* Hero band */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
        borderRadius: 14, padding: mob ? "24px 20px" : "28px 32px",
        marginBottom: 20,
        display: "flex", alignItems: mob ? "flex-start" : "center",
        justifyContent: "space-between",
        flexDirection: mob ? "column" : "row", gap: 16,
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: mob ? 22 : 28, fontWeight: 800,
            color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em",
          }}>
            Your Top Broker Matches
          </h1>
          <p style={{ fontSize: mob ? 13 : 15, color: "#94a3b8", margin: 0 }}>
            Personalized results based on your {Object.keys(answers).length} answers
          </p>
          {(() => { const profile = getUserProfile(answers); return profile ? (
            <span style={{
              display: "inline-block", marginTop: 8, padding: "4px 12px", borderRadius: 16,
              fontSize: 12, fontWeight: 600,
              background: "rgba(5,150,105,0.12)", color: "#34d399",
              border: "1px solid rgba(52,211,153,0.25)",
            }}>{profile}</span>
          ) : null; })()}
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={restart} style={{
            padding: "8px 12px", borderRadius: 8,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
          }}><RotateCcw size={12} /> Retake</button>
          <button onClick={copyShare} style={{
            padding: "8px 12px", borderRadius: 8,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5,
          }}><Share2 size={12} /> Share</button>
        </div>
      </div>

      {/* ── Quick Compare — Top 3 ── */}
      <div style={{ ...cardStyle, marginBottom: 20, padding: mob ? "16px" : "20px 24px" }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: mob ? 18 : 20, fontWeight: 800, color: "#0f172a", margin: "0 0 14px" }}>
          Quick Compare — Your Top 3
        </h2>
        <div style={{ display: "flex", flexDirection: mob ? "column" : "row", gap: mob ? 10 : 12 }}>
          {topResults.slice(0, 3).map((r, i) => {
            const B = r.broker.B;
            return (
              <div key={r.slug} style={{
                flex: 1, minWidth: 0, padding: 14, borderRadius: 12,
                border: i === 0 ? "1.5px solid rgba(5,150,105,0.15)" : "1.5px solid #e2e8f0",
                background: i === 0 ? "rgba(236,253,245,0.4)" : "#fff",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <BrokerLogo slug={r.slug} name={B.name} size={48} shape="icon" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{B.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800, color: "#059669" }}>{r.matchPct}% match</div>
                  </div>
                  <ScoreBadge score={B.score} size="md" />
                </div>
                <div style={{ display: "flex", gap: mob ? 6 : 8, fontSize: 12, color: "#64748b", marginBottom: 12, flexWrap: "wrap" }}>
                  <span>Spread: <strong style={{ color: "#111827" }}>{B.spread}</strong></span>
                  <span>Min: <strong style={{ color: "#111827" }}>{B.minDep === 0 ? "$0" : `$${B.minDep}`}</strong></span>
                  {B.tp > 0 && <span>TP: <strong style={{ color: "#111827" }}>{B.tp}/5</strong></span>}
                </div>
                <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored" className="cta-primary"
                  style={{
                    display: "block", padding: "10px 0", borderRadius: 8, textAlign: "center",
                    background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                    color: "#0f172a", fontWeight: 700, fontSize: 13,
                    textDecoration: "none",
                    boxShadow: "0 2px 6px rgba(245,158,11,0.2)",
                  }}
                >Visit {B.name}</a>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── D2k Top 10 list ── */}
      <div style={{ ...cardStyle, overflow: "hidden" }}>
        <div style={{
          padding: mob ? "14px 16px 10px" : "16px 24px 12px",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Your Top 10 Matches</span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>Ranked by match score</span>
        </div>

        <div className="d2k-list" style={{
          padding: "6px 8px",
          display: mob ? "block" : "grid",
          gridTemplateColumns: mob ? undefined : "1fr 1fr",
          gridTemplateRows: mob ? undefined : "repeat(5, auto)",
          gridAutoFlow: mob ? undefined : "column",
          gap: mob ? 0 : "0 8px",
        }}>
          {topResults.map((r, i) => {
            const B = r.broker.B;
            const rw = B.riskWarning && (B.verticals || []).some(v => ["forex", "cfd", "crypto", "spread-betting"].includes(v)) ? B.riskWarning : null;
            return (
              <a key={r.slug} href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
                className="d2k-row"
                style={{
                  display: "flex", alignItems: "center", gap: mob ? 10 : 8, minWidth: 0,
                  padding: mob ? "14px 12px" : "10px 12px",
                  textDecoration: "none", marginBottom: i < 9 ? (mob ? 5 : 3) : 0,
                  borderRadius: mob ? 12 : 10,
                  background: i === 0 ? "rgba(236,253,245,0.4)" : "transparent",
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: i === 0 ? "linear-gradient(135deg, #059669, #047857)" : (i < 3 ? "#e2e8f0" : "#f1f5f9"),
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: mob ? 13 : 12, fontWeight: 800, color: i === 0 ? "#fff" : "#64748b",
                }}>{i + 1}</div>
                <BrokerLogo slug={r.slug} name={B.name} size={mob ? 52 : 48} shape="icon" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: mob ? 17 : 15, fontWeight: 600, color: "#0f172a",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {B.name}
                    {i === 0 && <span style={{
                      marginLeft: 6, fontSize: 9, fontWeight: 800, color: "#047857",
                      background: "#d1fae5", padding: "1px 6px",
                      borderRadius: 4, verticalAlign: "middle", textTransform: "uppercase",
                    }}>Best Match</span>}
                  </div>
                  {rw && <div className="d2k-risk" style={{ fontSize: mob ? 10 : 9, lineHeight: 1.3, color: "#6b7280", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rw}</div>}
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: mob ? 13 : 12, fontWeight: 800, flexShrink: 0,
                  color: r.matchPct >= 80 ? "#059669" : r.matchPct >= 60 ? "#2563eb" : "#d97706",
                }}>{r.matchPct}%</span>
                <ArrowUpRight size={mob ? 18 : 16} className="d2k-arrow" color={i === 0 ? "#059669" : "#94a3b8"} style={{ flexShrink: 0 }} />
              </a>
            );
          })}
        </div>
      </div>

      {/* Actions — ghost buttons */}
      <div style={{
        marginTop: 16, display: "flex", gap: 10,
        justifyContent: "center", flexWrap: "wrap",
      }}>
        <Link to={lp("/rankings")} style={{
          padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)", color: "#111827",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
        }}>Browse All Rankings <ArrowRight size={14} /></Link>
        {topResults.length >= 2 && (
          <Link to={lp(`/compare/${topResults[0].slug}-vs-${topResults[1].slug}`)} style={{
            padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)", color: "#059669",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
          }}>Compare Top 2 <ArrowRight size={14} /></Link>
        )}
      </div>

      {/* Didn't Find? */}
      <div style={{
        marginTop: 20, padding: mob ? "20px 16px" : "24px 28px", ...cardStyle,
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        textAlign: "center",
      }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: mob ? 16 : 18, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
          Didn't find what you're looking for?
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 14px" }}>
          Explore more options or get personalized help from our team.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to={lp("/rankings")} style={{
            padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)", color: "#111827",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
          }}><Search size={14} /> Browse Rankings</Link>
          <Link to={lp("/compare")} style={{
            padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)", color: "#111827",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
          }}><Target size={14} /> Compare Brokers</Link>
          <Link to={lp("/contact")} style={{
            padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)", color: "#059669",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
          }}><ExternalLink size={14} /> Contact Us</Link>
        </div>
      </div>

      {/* Methodology + Trust */}
      <div style={{ marginTop: 20, padding: mob ? "20px 16px" : "24px 28px", ...cardStyle, background: "#f8fafc" }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: mob ? 16 : 18, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" }}>
          How We Match You With Brokers
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 12 }}>
          {[
            { n: `${results.length}`, l: "Brokers analyzed" },
            { n: "6", l: "Scoring categories" },
            { n: "100", l: "Point matching scale" },
            { n: "Monthly", l: "Data updates" },
          ].map((s, si) => (
            <div key={si} style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 800, color: "#059669" }}>{s.n}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
          Data verified: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}. We may receive compensation from featured brokers. This does not influence our scoring methodology or your quiz results.
        </div>
      </div>

      <FAQSection />

      {/* SEO content block */}
      <div style={{ marginTop: 32, padding: mob ? "24px 16px" : "32px 28px", ...cardStyle }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: mob ? 18 : 22, fontWeight: 800, color: "#0f172a", margin: "0 0 14px" }}>
          How to Choose the Right Broker
        </h2>
        <div style={{ fontSize: 15, lineHeight: 1.8, color: "#374151" }}>
          <p style={{ margin: "0 0 12px" }}>Choosing the right online broker is one of the most important decisions for any trader or investor. The wrong choice can cost you money through higher fees, poor execution, or inadequate regulatory protection. Our Find Your Broker quiz simplifies this process by matching your specific needs against our database of {results.length} expert-tested brokers.</p>
          <p style={{ margin: "0 0 12px" }}>We evaluate each broker across six key dimensions: regulatory compliance (including Tier-1 licenses from FCA, ASIC, and CySEC), trading costs (spreads and commissions), user satisfaction (Trustpilot ratings), platform quality, execution speed, and suitability for different experience levels. This multi-dimensional approach ensures you get a truly personalized recommendation.</p>
          <p style={{ margin: "0 0 12px" }}>Unlike generic "best broker" lists, our quiz adapts to your individual profile. A beginner in the UK with a $200 budget will see completely different results than a professional day trader in Australia managing $50,000. Your country, trading frequency, risk tolerance, and priorities all factor into the match percentage you see next to each broker.</p>
          <p style={{ margin: 0, fontWeight: 600 }}>Our data is updated monthly, and every broker in our database has been independently tested by our team. We earn commissions through affiliate partnerships, but this never influences our scoring methodology or your quiz results.</p>
        </div>
      </div>
    </div>
  );

  /* ═══ FAQ Section — uses shared QUIZ_FAQ array ═══ */
  const FAQSection = () => {
    const [openFaq, setOpenFaq] = useState(null);
    return (
      <div style={{ marginTop: 32, padding: mob ? "24px 16px" : "32px 28px", ...cardStyle }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: mob ? 20 : 24, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>
          Frequently Asked Questions
        </h2>
        {QUIZ_FAQ.map((faq, i) => (
          <div key={i} style={{ borderBottom: i < QUIZ_FAQ.length - 1 ? "1px solid #f1f5f9" : "none" }}>
            <button aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "14px 0", background: "none", border: "none",
                cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 600,
                color: "#111827", textAlign: "left",
              }}
            >
              {faq.q}
              <ChevronDown size={16} style={{ flexShrink: 0, color: "#64748b", transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "none" }} />
            </button>
            {openFaq === i && <div style={{ padding: "0 0 14px", fontSize: 14, lineHeight: 1.7, color: "#374151" }}>{faq.a}</div>}
          </div>
        ))}
      </div>
    );
  };

  /* ═══ MAIN RENDER ═══ */
  return (
    <>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "12px 16px 0" : "16px 24px 0" }}>
        <div style={{ fontSize: 13, color: "#64748b", display: "flex", alignItems: "center", gap: 6 }}>
          <Link to={lp("/")} style={{ color: "#64748b", textDecoration: "none" }}>Home</Link>
          <span style={{ color: "#cbd5e1" }}>/</span>
          <span style={{ color: "#111827", fontWeight: 600 }}>Find Your Broker</span>
        </div>
      </div>

      {!isResults && !showLoading && (
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          padding: mob ? "28px 16px 24px" : "36px 24px 32px", marginTop: 8,
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: mob ? 26 : 38, fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Find Your Perfect Broker
            </h1>
            <p style={{ fontSize: mob ? 15 : 17, color: "#94a3b8", margin: 0, maxWidth: 560 }}>
              Answer {totalSteps} quick questions. We'll match you with the best broker from our expert-tested database of 50+ brokers.
            </p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "16px 16px 80px" : "24px 24px 60px" }}>
        {!showLoading && <ProgressBar />}

        {showLoading ? (
          <ShimmerLoading />
        ) : mob ? (
          <div>{isResults ? <ResultsPage /> : <QuestionStep />}</div>
        ) : tab ? (
          /* Tablet: show sidebar (Sprint 11.2) */
          <div style={{ display: "grid", gridTemplateColumns: isResults ? "1fr" : "1fr 300px", gap: 20, alignItems: "start" }}>
            <div>{isResults ? <ResultsPage /> : <QuestionStep />}</div>
            {!isResults && <div style={{ position: "sticky", top: 80 }}><LiveSidebar /></div>}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isResults ? "1fr" : "1fr 360px", gap: 24, alignItems: "start" }}>
            <div ref={containerRef}>{isResults ? <ResultsPage /> : <QuestionStep />}</div>
            {!isResults && <div style={{ position: "sticky", top: 80 }}><LiveSidebar /></div>}
          </div>
        )}
      </div>

      {/* ── Mobile fixed nav — outside all transform containers ── */}
      {mob && !isResults && !showLoading && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "10px 16px", paddingBottom: "max(10px, env(safe-area-inset-bottom))",
          background: "#fff", zIndex: 50,
          boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
          borderTop: "1px solid #e2e8f0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <button onClick={goBack} disabled={step === 0} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 10, background: step === 0 ? "#f8fafc" : "#fff", border: "1px solid #e2e8f0", cursor: step === 0 ? "default" : "pointer", fontSize: 14, fontWeight: 600, color: step === 0 ? "#94a3b8" : "#111827", fontFamily: "inherit", opacity: step === 0 ? 0.5 : 1 }}>
            <ChevronLeft size={16} /> Back
          </button>
          <button onClick={goNext} disabled={!canProceed()} className={canProceed() && step === totalSteps - 1 ? "cta-primary" : ""} style={{ display: "flex", alignItems: "center", gap: 6, padding: step === totalSteps - 1 ? "12px 28px" : "10px 24px", borderRadius: 10, background: canProceed() ? (step === totalSteps - 1 ? "linear-gradient(135deg, #f59e0b, #fbbf24)" : "linear-gradient(135deg, #059669, #047857)") : "#e2e8f0", border: "none", cursor: canProceed() ? "pointer" : "default", fontSize: step === totalSteps - 1 ? 16 : 15, fontWeight: 700, color: canProceed() ? (step === totalSteps - 1 ? "#0f172a" : "#fff") : "#94a3b8", fontFamily: "inherit", boxShadow: canProceed() ? (step === totalSteps - 1 ? "0 4px 16px rgba(245,158,11,0.35)" : "0 4px 12px rgba(5,150,105,0.3)") : "none" }}>
            {step === totalSteps - 1 ? "See My Results" : "Next"} {step === totalSteps - 1 ? <ArrowRight size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      )}
    </>
  );
}
