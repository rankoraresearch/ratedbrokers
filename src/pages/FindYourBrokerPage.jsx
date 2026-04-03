import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useMedia } from "../hooks/useMedia";
import { useLocalePath } from "../i18n/useLocalePath";
import { QUIZ_QUESTIONS, POPULAR_COUNTRIES, CONTEXTUAL_TIPS, matchBrokers, detectCountry } from "../utils/quizMatching";
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
  Monitor, Share2, RotateCcw,
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
  const [geoDetected, setGeoDetected] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [riskExpanded, setRiskExpanded] = useState({});
  const containerRef = useRef(null);

  const totalSteps = QUIZ_QUESTIONS.length;
  const isResults = step >= totalSteps;
  const currentQ = QUIZ_QUESTIONS[step] || null;

  // GeoIP auto-detect
  useEffect(() => {
    detectCountry().then((code) => {
      if (code && !answers.country) {
        setAnswers((prev) => ({ ...prev, country: code }));
        setGeoDetected(true);
      }
    });
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [step]);

  // SEO
  useEffect(() => {
    document.title = "Find Your Broker — Personalized Broker Matching | RatedBrokers";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Answer 6 quick questions and get matched with the best broker for your trading style, experience, and budget. Expert-tested, data-driven results.");
  }, []);

  // JSON-LD
  useEffect(() => {
    const faqItems = [
      { q: "How does the Find Your Broker quiz work?", a: "Our quiz asks 6 targeted questions about your trading preferences, experience, and budget. Our algorithm then scores all 50+ brokers against your answers and ranks them by match percentage." },
      { q: "Is the broker matching tool free?", a: "Yes, completely free. We earn revenue through affiliate partnerships with brokers, but your results are unbiased and based on our independent scoring methodology." },
      { q: "How many brokers does the quiz compare?", a: "The quiz evaluates all 50+ brokers in our database, each independently tested and scored across 6 categories: Regulation, Costs, Trustpilot, Expert Evaluation, Platform, and Execution." },
      { q: "Can I retake the quiz with different answers?", a: "Absolutely. Click 'Start Over' at any time to retake the quiz. Your results update in real-time as you answer each question." },
    ];
    const schema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
    let el = document.getElementById("quiz-faq-jsonld");
    if (!el) { el = document.createElement("script"); el.id = "quiz-faq-jsonld"; el.type = "application/ld+json"; document.head.appendChild(el); }
    el.textContent = JSON.stringify(schema);
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
      setTimeout(() => {
        setShowLoading(false);
        setStep((s) => s + 1);
        setInfoOpen(null);
      }, 900);
      return;
    }
    setTransitioning(true);
    setTimeout(() => { setStep((s) => s + 1); setTransitioning(false); setInfoOpen(null); }, 200);
  }
  function goBack() {
    if (step <= 0) return;
    setTransitioning(true);
    setTimeout(() => { setStep((s) => s - 1); setTransitioning(false); setInfoOpen(null); }, 200);
  }
  function restart() { setStep(0); setAnswers({}); setInfoOpen(null); setGeoDetected(false); setRiskExpanded({}); }
  function setAnswer(qId, value) { setAnswers((prev) => ({ ...prev, [qId]: value })); }
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
    return `${window.location.origin}/find-your-broker?${params.toString()}`;
  }
  function copyShare() {
    navigator.clipboard.writeText(getShareUrl()).catch(() => {});
  }

  // Load from URL params on mount (Sprint 12.4)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.size === 0) return;
    const loaded = {};
    for (const [k, v] of params.entries()) {
      const q = QUIZ_QUESTIONS.find((q) => q.id === k);
      if (!q) continue;
      loaded[k] = q.type === "multi" ? v.split(",") : v;
    }
    if (Object.keys(loaded).length > 0) {
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

  /* ═══ Mobile Mini Preview ═══ */
  const MobileMiniPreview = () => {
    if (step === 0 && Object.keys(answers).length === 0) return null;
    const top3 = topResults.slice(0, 3);
    if (top3.length === 0) return null;
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 12, marginTop: 12,
        background: "rgba(240,253,244,0.8)", backdropFilter: "blur(8px)",
        boxShadow: "inset 0 0 0 1px rgba(5,150,105,0.12)",
      }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          {top3.map((r, i) => (
            <div key={r.slug} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <BrokerLogo slug={r.slug} name={r.broker.B.name} size={22} shape="icon" />
              <span style={{ fontWeight: 800, fontSize: 11, color: "#059669" }}>{r.matchPct}%</span>
              {i < 2 && <span style={{ color: "#d1d5db", fontSize: 10 }}>·</span>}
            </div>
          ))}
        </div>
        <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>Live</span>
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
                type="text" placeholder="Search country..." value={searchCountry}
                onChange={(e) => setSearchCountry(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10,
                  border: "1px solid #e2e8f0", fontSize: 15, fontFamily: "inherit",
                  outline: "none", background: "#f8fafc",
                }}
                onFocus={(e) => { e.target.style.borderColor = "#059669"; e.target.style.background = "#fff"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
              />
            </div>

            {geoDetected && answers.country && (
              <div style={{
                padding: "8px 12px", borderRadius: 8, marginBottom: 12,
                background: "#ecfdf5", border: "1px solid #a7f3d0",
                fontSize: 13, color: "#047857", fontWeight: 500,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Check size={14} /> Auto-detected your location. Change below if needed.
              </div>
            )}

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
                <button key={opt.value} onClick={() => setAnswer(currentQ.id, opt.value)}
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
                <button key={opt.value} onClick={() => toggleMulti(currentQ.id, opt.value)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: mob ? "12px 14px" : "14px 18px", borderRadius: 12,
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

        {/* ── Navigation (Sprint 8.2: orange "See My Results") ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 24, paddingTop: 16, borderTop: "1px solid #f1f5f9",
        }}>
          <button onClick={goBack} disabled={step === 0}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 16px", borderRadius: 10,
              background: step === 0 ? "#f8fafc" : "#fff",
              border: "1px solid #e2e8f0", cursor: step === 0 ? "default" : "pointer",
              fontSize: 14, fontWeight: 600, color: step === 0 ? "#94a3b8" : "#111827",
              fontFamily: "inherit", transition: "all 0.15s", opacity: step === 0 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <button onClick={goNext} disabled={!canProceed()}
            className={canProceed() && step === totalSteps - 1 ? "cta-primary" : ""}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: step === totalSteps - 1 ? "12px 28px" : "10px 24px",
              borderRadius: 10,
              background: canProceed()
                ? step === totalSteps - 1
                  ? "linear-gradient(135deg, #f59e0b, #fbbf24)"
                  : "linear-gradient(135deg, #059669, #047857)"
                : "#e2e8f0",
              border: "none", cursor: canProceed() ? "pointer" : "default",
              fontSize: step === totalSteps - 1 ? 16 : 15, fontWeight: 700,
              color: canProceed() ? (step === totalSteps - 1 ? "#0f172a" : "#fff") : "#94a3b8",
              fontFamily: "inherit", transition: "all 0.25s",
              boxShadow: canProceed()
                ? step === totalSteps - 1
                  ? "0 4px 16px rgba(245,158,11,0.35)"
                  : "0 4px 12px rgba(5,150,105,0.3)"
                : "none",
            }}
          >
            {step === totalSteps - 1 ? "See My Results" : "Next"}
            {step === totalSteps - 1 ? <ArrowRight size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* Contextual tip — only first 3 steps */}
        {step < 3 && (
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

        {/* Mobile mini preview (Sprint 11.1) */}
        {(mob || tab) && <MobileMiniPreview />}
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

    const top1 = topResults[0];
    const rest = topResults.slice(1, 5);
    if (!top1) return null;
    const B1 = top1.broker.B;
    const visitUrl1 = getVisitUrl(top1.slug, B1.url);
    const hasTp1 = B1.tp && B1.tp > 0;

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

        {/* ── Top-1 Full Card ── */}
        <div style={{
          padding: "16px",
          background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
          borderBottom: "1px solid rgba(5,150,105,0.1)",
        }}>
          {/* Logo + Match */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <WideLogo slug={top1.slug} name={B1.name} w={120} h={38} />
            <div style={{ flex: 1 }}>
              <Link to={lp(`/review/${top1.slug}`)} style={{
                fontSize: 14, fontWeight: 800, color: "#0f172a", textDecoration: "none",
                display: "block", lineHeight: 1.2,
              }}>{B1.name}</Link>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{B1.type}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 20, fontWeight: 800,
                color: "#059669", lineHeight: 1,
              }}>{top1.matchPct}%</div>
              <div style={{ fontSize: 9, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 }}>match</div>
            </div>
          </div>

          {/* Score + Reg badges */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{
              fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 800,
              color: B1.score >= 9.0 ? "#059669" : "#2563eb",
              background: B1.score >= 9.0 ? "#fff" : "#eff6ff",
              padding: "2px 6px", borderRadius: 4, border: "1px solid rgba(0,0,0,0.06)",
            }}>{B1.score}/10</span>
            {B1.regs.slice(0, 2).map((r) => <RegBadge key={r.name} reg={r.name} />)}
          </div>

          {/* Trustpilot */}
          {hasTp1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
              <TpStars rating={B1.tp} size={11} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>{B1.tp}</span>
              <span style={{ fontSize: 10, color: "#64748b" }}>({formatTpCount(B1.tpCount)})</span>
            </div>
          )}

          {/* Dynamic USP */}
          <div style={{
            display: "flex", alignItems: "center", gap: 4, marginBottom: 10,
            fontSize: 12, fontWeight: 600, color: "#047857",
          }}>
            <Check size={12} strokeWidth={3} />
            {getDynamicUSP(top1.broker)}
          </div>

          {/* Promo */}
          {B1.promo && (
            <div style={{
              padding: "5px 8px", borderRadius: 6, marginBottom: 10,
              background: "#fffbeb", border: "1px solid #fde68a",
              fontSize: 11, fontWeight: 600, color: "#92400e",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <Sparkles size={10} color="#f59e0b" /> {B1.promo}
            </div>
          )}

          {/* Primary CTA */}
          <a href={visitUrl1} target="_blank" rel="noopener nofollow sponsored" className="cta-primary"
            style={{
              display: "block", padding: "10px 16px", borderRadius: 10, textAlign: "center",
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              color: "#0f172a", fontWeight: 700, fontSize: 14,
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(245,158,11,0.25)",
            }}
          >
            Visit {B1.name} <ArrowRight size={13} style={{ verticalAlign: "middle", marginLeft: 2 }} />
          </a>
        </div>

        {/* ── Brokers #2-5 — each row is a clickable link to broker site ── */}
        <div style={{ padding: "6px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          {rest.map((r, i) => {
            const B = r.broker.B;
            const rank = i + 2;
            const visitUrl = getVisitUrl(r.slug, B.url);
            return (
              <a key={r.slug} href={visitUrl} target="_blank" rel="noopener nofollow sponsored"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 10px", borderRadius: 10,
                  background: "#fff",
                  boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
                  textDecoration: "none", cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "inset 0 0 0 1px #059669, 0 2px 8px rgba(5,150,105,0.08)"; e.currentTarget.style.background = "#f0fdf4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.05)"; e.currentTarget.style.background = "#fff"; }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: rank <= 3 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, color: rank <= 3 ? "#fff" : "#64748b",
                }}>{rank}</div>
                <BrokerLogo slug={r.slug} name={B.name} size={26} shape="icon" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700, color: "#0f172a",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{B.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                    <Star size={10} color="#059669" fill="#059669" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>{B.score}</span>
                    <span style={{ fontSize: 10, color: "#94a3b8" }}>/10</span>
                  </div>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 800, color: r.matchPct >= 80 ? "#059669" : "#64748b",
                }}>{r.matchPct}%</span>
                <ChevronRight size={14} color="#cbd5e1" style={{ flexShrink: 0, transition: "color 0.2s" }} />
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
            Independent analysis of 51 expert-tested brokers
          </span>
        </div>
      </div>
    );
  };

  /* ═══ Shimmer Loading — branded ═══ */
  const ShimmerLoading = () => {
    const [counter, setCounter] = useState(0);
    useEffect(() => {
      const iv = setInterval(() => setCounter((c) => Math.min(c + 1, 51)), 15);
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
            width: `${Math.min(counter / 51 * 100, 100)}%`, height: "100%",
            background: "linear-gradient(90deg, #059669, #34d399)",
            borderRadius: 2, transition: "width 0.1s",
          }} />
        </div>
      </div>
    );
  };

  /* ═══ Quick Compare Table (Sprint 10) ═══ */
  const QuickCompareTable = () => {
    const top3 = topResults.slice(0, 3);
    if (top3.length < 3) return null;
    return (
      <div style={{ ...cardStyle, marginBottom: 20, overflow: mob ? "auto" : "hidden" }}>
        <div style={{
          padding: mob ? "16px 16px 10px" : "20px 28px 12px",
          borderBottom: "1px solid #f1f5f9",
        }}>
          <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: mob ? 18 : 22, fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Quick Compare — Your Top 3
          </h2>
        </div>
        <div style={{ overflowX: mob ? "auto" : "visible", WebkitOverflowScrolling: "touch" }}>
          <table style={{
            width: "100%", minWidth: mob ? 600 : "auto",
            borderCollapse: "collapse", fontSize: 14,
          }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["", "Score", "Spread", "Min Dep", "Trustpilot", ""].map((h, i) => (
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
                          <div style={{
                            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 800,
                            color: "#059669",
                          }}>{r.matchPct}% match</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", padding: "12px 8px" }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono',monospace", fontWeight: 800, fontSize: 16,
                        color: B.score >= 9.0 ? "#059669" : "#2563eb",
                      }}>{B.score}</span>
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
                      <a href={getVisitUrl(r.slug, B.url)} target="_blank" rel="noopener nofollow sponsored"
                        className="cta-primary"
                        style={{
                          display: "inline-block", padding: "7px 14px", borderRadius: 8,
                          background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                          color: "#0f172a", fontWeight: 700, fontSize: 12,
                          textDecoration: "none", whiteSpace: "nowrap",
                        }}
                      >Visit</a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ═══ Results Page ═══ */
  const ResultsPage = () => (
    <div style={{
      opacity: transitioning ? 0 : 1,
      transform: transitioning ? "translateY(20px)" : "translateY(0)",
      transition: "opacity 0.3s, transform 0.3s",
    }}>
      {/* Hero band — site-consistent gradient */}
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
            Personalized results based on your {Object.keys(answers).length} answers. Click any broker to visit their site.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
          <button onClick={restart} style={{
            padding: "8px 14px", borderRadius: 8,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
          }}>
            <RotateCcw size={12} /> Retake
          </button>
          <button onClick={copyShare} style={{
            padding: "8px 14px", borderRadius: 8,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#cbd5e1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
          }}>
            <Share2 size={12} /> Share
          </button>
          <Link to={lp("/compare")} style={{
            padding: "8px 14px", borderRadius: 8,
            background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)",
            color: "#34d399", fontSize: 12, fontWeight: 600, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
          }}>
            Compare <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── Compact broker list — each row clicks to broker site ── */}
      <div style={{
        ...cardStyle, overflow: "hidden",
      }}>
        <div style={{
          padding: mob ? "14px 16px 10px" : "16px 24px 12px",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Your Top 10 Matches</span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>Click any broker to visit</span>
        </div>

        <div style={{
          display: mob ? "flex" : "grid",
          flexDirection: mob ? "column" : undefined,
          gridTemplateColumns: mob ? undefined : "1fr 1fr",
          gridAutoFlow: mob ? undefined : "column",
          gridTemplateRows: mob ? undefined : "repeat(5, auto)",
          gap: mob ? 0 : 0,
        }}>
          {topResults.map((r, i) => {
            const B = r.broker.B;
            const visitUrl = getVisitUrl(r.slug, B.url);
            const isTop3 = i < 3;
            return (
              <a key={r.slug} href={visitUrl} target="_blank" rel="noopener nofollow sponsored"
                className="quiz-fade-in"
                style={{
                  display: "flex", alignItems: "center", gap: mob ? 10 : 12,
                  padding: mob ? "10px 16px" : "12px 24px",
                  textDecoration: "none", cursor: "pointer",
                  borderBottom: "1px solid rgba(0,0,0,0.04)",
                  background: i === 0 ? "linear-gradient(135deg, rgba(236,253,245,0.5), rgba(209,250,229,0.3))" : "#fff",
                  transition: "all 0.2s",
                  opacity: 0,
                  animationDelay: `${i * 0.06}s`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0fdf4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = i === 0 ? "linear-gradient(135deg, rgba(236,253,245,0.5), rgba(209,250,229,0.3))" : "#fff"; }}
              >
                {/* Rank */}
                <div style={{
                  width: mob ? 26 : 30, height: mob ? 26 : 30, borderRadius: 8, flexShrink: 0,
                  background: isTop3 ? "linear-gradient(135deg, #059669, #047857)" : "#f1f5f9",
                  boxShadow: isTop3 ? "0 2px 6px rgba(5,150,105,0.25)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: mob ? 11 : 12, fontWeight: 800, color: isTop3 ? "#fff" : "#64748b",
                }}>{i + 1}</div>

                {/* Logo */}
                <BrokerLogo slug={r.slug} name={B.name} size={mob ? 32 : 36} shape="icon" />

                {/* Name + score */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: mob ? 14 : 15, fontWeight: 700, color: "#0f172a",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {B.name}
                    {i === 0 && <span style={{
                      marginLeft: 6, fontSize: 10, fontWeight: 800, color: "#92400e",
                      background: "linear-gradient(135deg, #fde68a, #fbbf24)", padding: "1px 6px",
                      borderRadius: 4, verticalAlign: "middle", textTransform: "uppercase",
                    }}>Best Match</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                      <Star size={mob ? 10 : 11} color="#059669" fill="#059669" />
                      <span style={{ fontSize: mob ? 12 : 13, fontWeight: 700, color: "#059669" }}>{B.score}</span>
                    </div>
                    {!mob && B.regs.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <span style={{ color: "#d1d5db" }}>·</span>
                        <span style={{ fontSize: 11, color: "#64748b" }}>{B.regs.slice(0, 2).map((reg) => reg.name).join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Match % */}
                <div style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: mob ? 13 : 14, fontWeight: 800,
                  color: r.matchPct >= 80 ? "#059669" : r.matchPct >= 60 ? "#2563eb" : "#d97706",
                  minWidth: 42, textAlign: "right",
                }}>{r.matchPct}%</div>

                {/* Chevron */}
                <ChevronRight size={mob ? 14 : 16} color="#cbd5e1" style={{
                  flexShrink: 0, transition: "transform 0.2s, color 0.2s",
                }} />
              </a>
            );
          })}
        </div>
      </div>

      {/* Actions below list */}
      <div style={{
        marginTop: 16, display: "flex", gap: 10,
        justifyContent: "center", flexWrap: "wrap",
      }}>
        <Link to={lp("/rankings")} style={{
          padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)", color: "#111827",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
        }}>Browse All Rankings <ArrowRight size={14} /></Link>
        <Link to={lp("/compare")} style={{
          padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
          background: "#fff", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)", color: "#111827",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
        }}>Compare Brokers <ArrowRight size={14} /></Link>
      </div>

      <FAQSection />
    </div>
  );

  /* ═══ FAQ Section ═══ */
  const FAQSection = () => {
    const [openFaq, setOpenFaq] = useState(null);
    const faqs = [
      { q: "How does the Find Your Broker quiz work?", a: "Our quiz asks 6 targeted questions about your trading preferences, experience level, budget, and platform preferences. Our matching algorithm then evaluates all 50+ brokers in our database — each independently tested and scored across 6 categories — and ranks them by how well they match your specific needs." },
      { q: "Is the broker matching tool free?", a: "Yes, completely free with no registration required. We earn revenue through affiliate partnerships with the brokers we recommend, but your results are 100% based on our independent scoring methodology. We never accept payment to boost a broker's position." },
      { q: "How accurate are the match percentages?", a: "Match percentages reflect how well each broker aligns with your stated preferences across 6 dimensions: regulation, trading instruments, experience fit, budget, priority criteria, and platform support. A 90%+ match means the broker excels in almost every area you care about." },
      { q: "Can I retake the quiz with different answers?", a: "Absolutely. Click 'Start Over' at any point to restart the quiz. You can also go back to any previous question using the Back button. Your live results in the sidebar update in real-time as you modify your answers." },
    ];
    return (
      <div style={{ marginTop: 32, padding: mob ? "24px 16px" : "32px 28px", ...cardStyle }}>
        <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: mob ? 20 : 24, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>
          Frequently Asked Questions
        </h2>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: i < faqs.length - 1 ? "1px solid #f1f5f9" : "none" }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
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

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: mob ? "16px 16px 40px" : "24px 24px 60px" }}>
        {!showLoading && <ProgressBar />}

        {showLoading ? (
          <ShimmerLoading />
        ) : mob ? (
          <div>{isResults ? <ResultsPage /> : <QuestionStep />}</div>
        ) : tab ? (
          /* Tablet: show sidebar (Sprint 11.2) */
          <div style={{ display: "grid", gridTemplateColumns: isResults ? "1fr" : "1fr 280px", gap: 20, alignItems: "start" }}>
            <div>{isResults ? <ResultsPage /> : <QuestionStep />}</div>
            {!isResults && <div style={{ position: "sticky", top: 80 }}><LiveSidebar /></div>}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isResults ? "1fr" : "1fr 320px", gap: 24, alignItems: "start" }}>
            <div ref={containerRef}>{isResults ? <ResultsPage /> : <QuestionStep />}</div>
            {!isResults && <div style={{ position: "sticky", top: 80 }}><LiveSidebar /></div>}
          </div>
        )}
      </div>
    </>
  );
}
