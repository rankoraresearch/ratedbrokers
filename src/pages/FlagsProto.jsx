/**
 * FlagsProto — сравнение пакетов флагов на живых участках сайта
 *
 * 6 пакетов × 6 реальных секций + отдельно 3 варианта language switcher.
 * Никаких npm install — все SVG с jsDelivr CDN. Никакой магии —
 * блоки воспроизводят реальные Home/Header/Footer/CountryPage 1:1.
 *
 * Консультации: Barbara (UX, круглые ≤40 + rect hero), Bill (rect везде,
 * editorial tone), Research (circle-flags trend 2025-26, monogram Bloomberg).
 */
import { useState } from "react";
import { useMedia } from "../hooks/useMedia";
import {
  ArrowRight,
  ChevronDown,
  Globe,
  Search as SearchIcon,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════
// PACKAGES
// ══════════════════════════════════════════════════════════════
const PACKS = [
  {
    id: "A",
    name: "Current — PNG 3:2",
    desc: "flagcdn.com PNG, baseline (что сейчас на сайте).",
    note: "Растровый PNG, прямоугольник 3:2, r≈15%",
  },
  {
    id: "B",
    name: "Rect SVG — Bill's pick",
    desc: "lipis/flag-icons 4:3. Editorial/Bloomberg tone, как у BrokerChooser.",
    note: "SVG 4:3, r=2, inset 1px ring. ~500B-1KB/flag",
  },
  {
    id: "C",
    name: "Circle SVG — fintech trend",
    desc: "HatScripts/circle-flags. Apple/Revolut/Wise style (тренд 2025-26).",
    note: "SVG 1:1, perfect circle, inset ring. ~300B-1.5KB/flag",
  },
  {
    id: "D",
    name: "Squircle iOS",
    desc: "lipis 1×1 с r=22%. Apple Weather / Linear style.",
    note: "SVG 1:1, squircle r=22%, soft shadow + ring",
  },
  {
    id: "E",
    name: "Hybrid — Barbara's pick",
    desc: "Circle ≤40px, passport rect ≥48px hero. Лучшее обоих миров.",
    note: "Mixed: circle-flags small + lipis 4:3 large",
  },
  {
    id: "F",
    name: "Monogram — no flags",
    desc: "ISO-код в navy pill. Bloomberg Terminal / WSJ tone.",
    note: "Pure CSS, 0 байт сети, text-only",
  },
];

const LANG_VARIANTS = [
  { id: "L1", name: "GB flag + EN (current)" },
  { id: "L2", name: "Globe + EN (Bill/research)" },
  { id: "L3", name: "Monogram EN ▾ (Barbara)" },
];

// ══════════════════════════════════════════════════════════════
// DATA — copies of real site data
// ══════════════════════════════════════════════════════════════
const COUNTRIES_FEATURED = [
  {
    code: "GB",
    name: "United Kingdom",
    reg: "FCA",
    brokers: 14,
    verticals: ["Forex Brokers UK", "CFD Brokers UK", "Stocks UK"],
  },
  {
    code: "US",
    name: "United States",
    reg: "SEC / NFA",
    brokers: 11,
    verticals: ["Stocks USA", "Options USA", "Futures USA"],
  },
  {
    code: "AU",
    name: "Australia",
    reg: "ASIC",
    brokers: 12,
    verticals: ["Forex AU", "CFD AU", "Crypto AU"],
  },
  {
    code: "DE",
    name: "Germany",
    reg: "BaFin",
    brokers: 10,
    verticals: ["Forex DE", "Crypto DE"],
  },
];

const COUNTRIES_EUROPE = [
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "ES", name: "Spain" },
];
const COUNTRIES_ASIAPAC = [
  { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "HK", name: "Hong Kong" },
  { code: "IN", name: "India" },
];
const COUNTRIES_AMERICAS = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AE", name: "UAE" },
  { code: "ZA", name: "South Africa" },
  { code: "BR", name: "Brazil" },
];

const FOOTER_COUNTRIES = [
  { code: "GB", label: "UK" },
  { code: "AU", label: "Australia" },
  { code: "US", label: "USA" },
  { code: "AE", label: "UAE" },
  { code: "DE", label: "Germany" },
  { code: "SG", label: "Singapore" },
  { code: "CA", label: "Canada" },
  { code: "ZA", label: "South Africa" },
  { code: "IN", label: "India" },
  { code: "JP", label: "Japan" },
];

const QUIZ_COUNTRIES = [
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
];

// ══════════════════════════════════════════════════════════════
// FLAG RENDERER — switches between packs
// ══════════════════════════════════════════════════════════════
function ProtoFlag({ code, pack, size = 20 }) {
  const lc = (code || "").toLowerCase();
  if (!code) return null;

  // F — Monogram (no image)
  if (pack === "F") {
    return (
      <span
        style={{
          width: size,
          height: size,
          borderRadius: Math.max(4, size * 0.25),
          background: "#0f172a",
          color: "#fff",
          fontFamily: "'Outfit',sans-serif",
          fontWeight: 700,
          fontSize: Math.max(9, Math.round(size * 0.42)),
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: 0.3,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {code}
      </span>
    );
  }

  let src, width, height, br, boxShadow;

  if (pack === "A") {
    // Current — flagcdn PNG 3:2
    src = `https://flagcdn.com/w80/${lc}.png`;
    width = Math.round(size * 1.5);
    height = size;
    br = Math.max(2, size * 0.15);
  } else if (pack === "B") {
    // Rect SVG 4:3
    src = `https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.5.0/flags/4x3/${lc}.svg`;
    width = Math.round(size * 1.33);
    height = size;
    br = 2;
    boxShadow = "inset 0 0 0 1px rgba(0,0,0,0.08)";
  } else if (pack === "C") {
    // Circle SVG
    src = `https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@gh-pages/flags/${lc}.svg`;
    width = size;
    height = size;
    br = "50%";
    boxShadow = "inset 0 0 0 1px rgba(15,23,42,0.12)";
  } else if (pack === "D") {
    // Squircle — lipis 1x1 + r=22%
    src = `https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.5.0/flags/1x1/${lc}.svg`;
    width = size;
    height = size;
    br = Math.max(4, size * 0.22);
    boxShadow = "0 1px 2px rgba(15,23,42,0.08), inset 0 0 0 0.5px rgba(15,23,42,0.1)";
  } else if (pack === "E") {
    // Hybrid — circle ≤40, rect ≥48
    if (size >= 48) {
      src = `https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.5.0/flags/4x3/${lc}.svg`;
      width = Math.round(size * 1.33);
      height = size;
      br = 4;
      boxShadow = "0 4px 12px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.08)";
    } else {
      src = `https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@gh-pages/flags/${lc}.svg`;
      width = size;
      height = size;
      br = "50%";
      boxShadow = "inset 0 0 0 1px rgba(15,23,42,0.12)";
    }
  }

  return (
    <img
      src={src}
      alt={code}
      width={width}
      height={height}
      loading="lazy"
      style={{
        width,
        height,
        borderRadius: br,
        objectFit: "cover",
        boxShadow,
        flexShrink: 0,
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}

// ══════════════════════════════════════════════════════════════
// LANG SWITCHER — 3 variants
// ══════════════════════════════════════════════════════════════
function LangSwitch({ variant, pack }) {
  const base = {
    background: "#f1f5f9",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 700,
    color: "#1f2937",
    fontFamily: "inherit",
  };
  if (variant === "L1") {
    return (
      <button style={base}>
        <ProtoFlag code="GB" pack={pack} size={16} />
        EN
        <ChevronDown size={11} style={{ color: "#64748b" }} />
      </button>
    );
  }
  if (variant === "L2") {
    return (
      <button style={base}>
        <Globe size={14} color="#64748b" />
        EN
        <ChevronDown size={11} style={{ color: "#64748b" }} />
      </button>
    );
  }
  // L3 — monogram, letterSpacing for premium feel
  return (
    <button style={{ ...base, letterSpacing: 0.5 }}>
      EN
      <ChevronDown size={11} style={{ color: "#64748b" }} />
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════
export default function FlagsProto() {
  const { mob, tab } = useMedia();
  const [pack, setPack] = useState("C");
  const [langVariant, setLangVariant] = useState("L3");

  const packData = PACKS.find((p) => p.id === pack);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* ──────── STICKY CONTROL BAR ──────── */}
      <div
        style={{
          position: "sticky",
          top: 64,
          zIndex: 50,
          background: "#0f172a",
          color: "#fff",
          padding: mob ? "14px 16px" : "18px 24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 11,
              fontWeight: 700,
              color: "#fbbf24",
              letterSpacing: 1.5,
              marginBottom: 6,
            }}
          >
            PROTO · /proto/flags
          </div>
          <h1
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 800,
              fontSize: mob ? 18 : 22,
              margin: 0,
              marginBottom: 14,
              letterSpacing: "-0.02em",
            }}
          >
            Flag Packages — {packData.name}
          </h1>

          {/* Pack picker */}
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.55)",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontWeight: 700,
              }}
            >
              Flag pack
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PACKS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPack(p.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    background:
                      pack === p.id ? "#fbbf24" : "rgba(255,255,255,0.06)",
                    color: pack === p.id ? "#0f172a" : "#fff",
                    border:
                      pack === p.id
                        ? "none"
                        : "1px solid rgba(255,255,255,0.12)",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {p.id}. {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Lang picker */}
          <div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.55)",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontWeight: 700,
              }}
            >
              Language switcher variant
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {LANG_VARIANTS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setLangVariant(v.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    background:
                      langVariant === v.id
                        ? "#34d399"
                        : "rgba(255,255,255,0.06)",
                    color: langVariant === v.id ? "#0f172a" : "#fff",
                    border:
                      langVariant === v.id
                        ? "none"
                        : "1px solid rgba(255,255,255,0.12)",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {v.id}. {v.name}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.55)",
              marginTop: 10,
              lineHeight: 1.5,
            }}
          >
            {packData.desc} · <em>{packData.note}</em>
          </div>
        </div>
      </div>

      {/* ──────── CONTENT ──────── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: mob ? "24px 16px 60px" : "32px 24px 80px",
        }}
      >
        {/* Sec 1 — Language switcher in header context */}
        <Sec
          n={1}
          title="Language switcher — в контексте хедера"
          desc="Переключалка рядом с Search и CTA (как на живом сайте). Перебери L1/L2/L3 сверху."
        />
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: mob ? "14px 16px" : "14px 24px",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.03)",
            border: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontWeight: 800,
              fontSize: 20,
              color: "#0f172a",
              letterSpacing: "-0.02em",
            }}
          >
            RatedBrokers<span style={{ color: "#f59e0b" }}>.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              aria-label="Search"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                color: "#1f2937",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <SearchIcon size={18} />
            </button>
            <LangSwitch variant={langVariant} pack={pack} />
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                color: "#0f172a",
                padding: "8px 16px",
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(245,158,11,0.2)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Find Your Broker <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Sec 2 — Countries mega menu */}
        <Sec
          n={2}
          title="Header mega menu — Countries dropdown"
          desc="3 колонки (Europe / Asia-Pacific / Americas). Флаги 14px — самый критичный размер."
          mt={40}
        />
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            maxWidth: 560,
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr",
              gap: 24,
            }}
          >
            <DropdownCol title="EUROPE" items={COUNTRIES_EUROPE} pack={pack} />
            <DropdownCol
              title="ASIA-PACIFIC"
              items={COUNTRIES_ASIAPAC}
              pack={pack}
            />
            <DropdownCol
              title="AMERICAS & MENA"
              items={COUNTRIES_AMERICAS}
              pack={pack}
            />
          </div>
        </div>

        {/* Sec 3 — Homepage featured country cards */}
        <Sec
          n={3}
          title='Homepage — "Regulated Brokers by Country"'
          desc="Featured country cards (flag 36px desktop / 32px mobile), живая вёрстка с главной."
          mt={40}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mob
              ? "1fr"
              : tab
              ? "1fr 1fr"
              : "repeat(4, 1fr)",
            gap: 14,
          }}
        >
          {COUNTRIES_FEATURED.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: 140,
                borderRadius: 14,
                overflow: "hidden",
                background: "#fff",
                border: "1px solid #e8ecf1",
                boxShadow:
                  "inset 0 0 0 1px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "18px 18px 0",
                }}
              >
                <ProtoFlag code={c.code} pack={pack} size={mob ? 32 : 36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#0f172a",
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 3,
                    }}
                  >
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "#0f172a",
                        color: "#fff",
                        fontFamily: "'JetBrains Mono',monospace",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {c.reg}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#94a3b8",
                        fontWeight: 600,
                      }}
                    >
                      {c.brokers} brokers
                    </span>
                  </div>
                </div>
                <ArrowRight size={16} color="#cbd5e1" />
              </div>
              <div
                style={{
                  height: 1,
                  background: "#f0f4f8",
                  margin: "12px 18px 0",
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: "10px 18px 14px",
                  marginTop: "auto",
                }}
              >
                {c.verticals.map((v, vi) => (
                  <a
                    key={vi}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      fontSize: 12,
                      color: "#059669",
                      fontWeight: 500,
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "#059669",
                        display: "inline-block",
                      }}
                    />
                    {v}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sec 4 — Footer strip */}
        <Sec
          n={4}
          title="Footer — Countries strip"
          desc="10 стран inline на тёмном фоне footer (flag 15px). Важный стресс-тест для Pack A — на navy PNG может «терять» белые поля."
          mt={40}
        />
        <div
          style={{
            background: "#0f172a",
            borderRadius: 12,
            padding: 24,
            color: "#fff",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              fontWeight: 700,
              color: "#fbbf24",
              letterSpacing: 1.5,
              marginBottom: 14,
              textTransform: "uppercase",
            }}
          >
            Forex Brokers by Country
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)",
              gap: 10,
            }}
          >
            {FOOTER_COUNTRIES.map((c, i) => (
              <a
                key={i}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "rgba(255,255,255,0.75)",
                  fontSize: 14,
                  textDecoration: "none",
                  padding: "5px 0",
                }}
              >
                <ProtoFlag code={c.code} pack={pack} size={15} />
                {c.label}
              </a>
            ))}
          </div>
        </div>

        {/* Sec 5 — CountryPage hero */}
        <Sec
          n={5}
          title="Country page — hero"
          desc="Большой флаг (52px desktop / 38px mobile) рядом с H1. Pack E здесь переключается на passport rectangle."
          mt={40}
        />
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: mob ? 20 : 32,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: mob ? 12 : 16,
              marginBottom: 12,
            }}
          >
            <ProtoFlag code="GB" pack={pack} size={mob ? 38 : 52} />
            <div>
              <h1
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 800,
                  fontSize: mob ? 22 : 32,
                  lineHeight: 1.1,
                  color: "#111827",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Best Forex Brokers in the UK 2026
              </h1>
              <span
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 600,
                  fontSize: mob ? 13 : 16,
                  color: "#059669",
                }}
              >
                FCA-Regulated · Updated April 2026
              </span>
            </div>
          </div>
          <p
            style={{
              fontSize: 15,
              color: "#475569",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 700,
            }}
          >
            We tested 14 FCA-regulated forex brokers accepting UK traders —
            comparing GBP accounts, spreads, FSCS protection and leverage.
          </p>
        </div>

        {/* Sec 6 — Quiz country option */}
        <Sec
          n={6}
          title="Find Your Broker quiz — country options"
          desc="Карточки-опции выбора страны в квизе (flag 20px)."
          mt={40}
        />
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: 20,
            border: "1px solid #e2e8f0",
            maxWidth: 540,
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#64748b",
              marginBottom: 10,
            }}
          >
            Your country of residence:
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {QUIZ_COUNTRIES.map((c) => (
              <button
                key={c.code}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  background: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0f172a",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <ProtoFlag code={c.code} pack={pack} size={20} />
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sec 7 — Size ladder (all sizes in one row for direct comparison) */}
        <Sec
          n={7}
          title="Size ladder — GB флаг во всех размерах"
          desc="Один флаг × все размеры (14/16/20/24/32/40/52). Для оценки как пакет ведёт себя в крайних точках."
          mt={40}
        />
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            padding: mob ? 20 : 32,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            display: "flex",
            alignItems: "flex-end",
            gap: mob ? 14 : 24,
            flexWrap: "wrap",
          }}
        >
          {[14, 16, 20, 24, 32, 40, 52].map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <ProtoFlag code="GB" pack={pack} size={s} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 10,
                  color: "#64748b",
                  fontWeight: 600,
                }}
              >
                {s}px
              </span>
            </div>
          ))}
        </div>

        {/* Sec 8 — Tech notes table */}
        <Sec n={8} title="Tech notes — реализация" desc="" mt={40} />
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <table
            style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={th}>Pack</th>
                <th style={th}>Format</th>
                <th style={th}>~Size</th>
                <th style={th}>Shape</th>
                <th style={th}>Source</th>
              </tr>
            </thead>
            <tbody>
              {TECH_ROWS.map((r, i) => (
                <tr
                  key={i}
                  style={{
                    background: pack === r.id ? "#fffbeb" : "#fff",
                  }}
                >
                  <td style={td}>
                    <strong>{r.id}</strong> {r.label}
                  </td>
                  <td style={td}>{r.format}</td>
                  <td style={td}>{r.size}</td>
                  <td style={td}>{r.shape}</td>
                  <td style={{ ...td, fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>
                    {r.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expert opinions */}
        <Sec n={9} title="Что сказали эксперты" desc="" mt={40} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: mob ? "1fr" : "1fr 1fr 1fr",
            gap: 14,
          }}
        >
          <Opinion
            who="Барбара (UX)"
            pick="E — Hybrid"
            text="Круг ≤40px (Revolut/Wise), passport rect ≥48px в hero. Language switcher — L3 monogram «EN ▾» (семантика: EN ≠ GB)."
            color="#059669"
          />
          <Opinion
            who="Билл (SEO/Affiliate)"
            pick="B — Rect SVG 4:3"
            text="Конкуренты в нише (BrokerChooser, BestBrokers, ForexBrokers) — все rect. Круглые = «mobile wallet», теряем editorial authority. Language — L2 Globe + EN."
            color="#2563eb"
          />
          <Opinion
            who="Research 2026"
            pick="C — Circle SVG"
            text="Тренд 2025-26 в fintech: Revolut, Wise, N26, Robinhood — все круглые. Circle-flags включает lang_en.svg — решает GB≠EN. Single sprite ~30KB gzipped."
            color="#f59e0b"
          />
        </div>

        <div
          style={{
            marginTop: 30,
            padding: 20,
            background: "#fff",
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            fontSize: 13,
            lineHeight: 1.6,
            color: "#475569",
          }}
        >
          <strong style={{ color: "#0f172a" }}>Что я вижу как итог:</strong> по
          языковому свитчеру все трое сходятся — <strong>убрать GB-флаг</strong>,
          либо Globe+EN (Bill), либо monogram EN (Barbara). По самим флагам
          стран — разногласие между <strong>editorial</strong> (Bill, rect) и{" "}
          <strong>fintech-modern</strong> (Barbara + research, circle).
          Перебери пакеты сверху и выбери — я порчу в прод.
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Helpers
// ══════════════════════════════════════════════════════════════
const TECH_ROWS = [
  {
    id: "A",
    label: "Current",
    format: "PNG 3:2",
    size: "100-450B (w40)",
    shape: "Rect, slight r",
    source: "flagcdn.com (external)",
  },
  {
    id: "B",
    label: "Rect SVG",
    format: "SVG 4:3",
    size: "~500B-1KB",
    shape: "Rect r=2, inset ring",
    source: "jsdelivr/lipis/flag-icons",
  },
  {
    id: "C",
    label: "Circle SVG",
    format: "SVG 1:1",
    size: "~300B-1.5KB",
    shape: "Perfect circle",
    source: "jsdelivr/HatScripts/circle-flags",
  },
  {
    id: "D",
    label: "Squircle",
    format: "SVG 1:1",
    size: "~500B-1KB",
    shape: "r=22%, soft shadow",
    source: "jsdelivr/lipis (1x1)",
  },
  {
    id: "E",
    label: "Hybrid",
    format: "SVG mixed",
    size: "~500B-1.5KB",
    shape: "Circle ≤40 + rect ≥48",
    source: "circle-flags + lipis",
  },
  {
    id: "F",
    label: "Monogram",
    format: "CSS text",
    size: "0 bytes",
    shape: "Navy pill, ISO code",
    source: "pure CSS",
  },
];

function DropdownCol({ title, items, pack }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 10,
          fontFamily: "'JetBrains Mono',monospace",
        }}
      >
        {title}
      </div>
      {items.map((c) => (
        <a
          key={c.code}
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "7px 0",
            color: "#1f2937",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <ProtoFlag code={c.code} pack={pack} size={14} />
          {c.name}
        </a>
      ))}
    </div>
  );
}

function Sec({ n, title, desc, mt = 0 }) {
  return (
    <div style={{ marginTop: mt, marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: desc ? 4 : 0,
        }}
      >
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#0f172a",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 12,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {n}
        </span>
        <h2
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: "#0f172a",
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
      </div>
      {desc && (
        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            margin: 0,
            marginLeft: 36,
            lineHeight: 1.5,
          }}
        >
          {desc}
        </p>
      )}
    </div>
  );
}

function Opinion({ who, pick, text, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 18,
        border: "1px solid #e2e8f0",
        borderLeft: `3px solid ${color}`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: 1.2,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        {who}
      </div>
      <div
        style={{
          fontFamily: "'Outfit',sans-serif",
          fontWeight: 800,
          fontSize: 18,
          color,
          marginBottom: 6,
          letterSpacing: "-0.02em",
        }}
      >
        {pick}
      </div>
      <p
        style={{
          fontSize: 13,
          lineHeight: 1.55,
          color: "#475569",
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}

const th = {
  padding: "10px 14px",
  textAlign: "left",
  color: "#64748b",
  fontWeight: 700,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.8,
  fontFamily: "'JetBrains Mono',monospace",
  borderBottom: "1px solid #e2e8f0",
};
const td = {
  padding: "12px 14px",
  borderBottom: "1px solid #f1f5f9",
  color: "#1f2937",
  fontSize: 13,
};
