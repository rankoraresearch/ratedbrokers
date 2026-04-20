import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Star, Flame, Globe, ChevronRight } from "lucide-react";
import CountryFlag from "../components/CountryFlag";
import { COUNTRY_VERTICALS, VERTICAL_META } from "../data/countryVerticals";

// Derived totals — единый источник для всех трёх вариантов.
// Если countryVerticals меняется, прото самосогласуется.
const TOTAL_COUNTRIES = COUNTRY_VERTICALS.length;
const TOTAL_VERTICALS = Object.keys(VERTICAL_META).length;
const TOTAL_COVERAGE_LABEL = `All ${TOTAL_COUNTRIES} countries across ${TOTAL_VERTICALS} verticals`;

/* ─────────────────────────────────────────────────────────────
   MenuCountriesProto — /proto/menu-countries
   3 варианта реализации Countries dropdown для главного меню.

   Проблема текущего варианта (B-1) в MenuProtoV2:
   - anchor-тексты чипов были короткие ("Forex") — SEO link equity
     растекается между разными destination
   - визуальная каша: короткие чипы × много стран

   Ниже три переосмысленных варианта. Все anchor'ы — full keyword
   ("Forex Brokers UK"), все линки реальные (валидированы 200 OK).
   ───────────────────────────────────────────────────────────── */

const VARIANTS = [
  { id: "A", label: "A — Top Combinations",  sub: "Flat 10 money-page links" },
  { id: "B", label: "B — Split by Vertical", sub: "3 columns, full keywords" },
  { id: "C", label: "C — Featured + Popular", sub: "Cards hero + hot combos" },
];

const by = (slug) => COUNTRY_VERTICALS.find((c) => c.slug === slug);

// ═══ Variant A — Top 10 combinations ═══
// Отобрано по приоритету (money pages) + разнообразию вертикалей/стран.
const TOP_COMBOS = [
  { country: by("uk"),          vertKey: "forex",         emoji: Star  },
  { country: by("usa"),         vertKey: "forex",         emoji: null  },
  { country: by("usa"),         vertKey: "crypto",        emoji: Flame },
  { country: by("usa"),         vertKey: "stocks",        emoji: null  },
  { country: by("usa"),         vertKey: "options",       emoji: null  },
  { country: by("australia"),   vertKey: "forex",         emoji: null  },
  { country: by("uk"),          vertKey: "cfd",           emoji: null  },
  { country: by("uae"),         vertKey: "crypto",        emoji: Flame },
  { country: by("uk"),          vertKey: "spreadBetting", emoji: null  },
  { country: by("singapore"),   vertKey: "forex",         emoji: null  },
].filter((c) => c.country);

// ═══ Variant B — Split by vertical ═══
const BY_VERTICAL = {
  forex: [
    by("uk"), by("usa"), by("australia"), by("germany"), by("singapore"), by("uae"),
  ].filter(Boolean),
  crypto: [
    by("usa"), by("uk"), by("australia"), by("uae"), by("singapore"), by("india"),
  ].filter(Boolean),
  other: [
    // manual — не все страны имеют stocks/options/etc, выбираем по availability
    { country: by("usa"), vertKey: "stocks"    },
    { country: by("usa"), vertKey: "options"   },
    { country: by("usa"), vertKey: "futures"   },
    { country: by("uk"),  vertKey: "spreadBetting" },
    { country: by("uk"),  vertKey: "cfd"       },
    { country: by("australia"), vertKey: "cfd" },
  ].filter((c) => c.country),
};

// ═══ Variant C — Featured countries (4 hero cards) + popular list ═══
const FEATURED_SLUGS = ["uk", "usa", "australia", "germany"];
const FEATURED = FEATURED_SLUGS.map(by).filter(Boolean);

const POPULAR_COMBOS = [
  { country: by("usa"), vertKey: "crypto"        },
  { country: by("uk"),  vertKey: "forex"         },
  { country: by("uae"), vertKey: "crypto"        },
  { country: by("usa"), vertKey: "options"       },
  { country: by("australia"), vertKey: "forex"   },
  { country: by("uk"),  vertKey: "spreadBetting" },
  { country: by("singapore"), vertKey: "crypto"  },
  { country: by("usa"), vertKey: "stocks"        },
].filter((c) => c.country);

// ─── Shared helpers ───
function anchorText(country, vertKey) {
  const meta = VERTICAL_META[vertKey];
  if (!meta) return country.name;
  return `${meta.label} ${meta.word} ${country.geo}`;
}

function comboHref(country, vertKey) {
  const v = country.verticals.find((x) => x.key === vertKey);
  return v ? v.path : "#";
}

// ═══════════════════════════════════════════════════════════════
// VARIANT RENDERERS (each returns the dropdown body)
// ═══════════════════════════════════════════════════════════════

function DropdownFrame({ width = 560, children, hint }) {
  return (
    <div style={{
      width, maxWidth: "100%",
      background: "#fff", borderRadius: 16,
      border: "1px solid #e2e8f0",
      boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.05)",
      padding: "22px 24px",
    }}>
      {hint && (
        <div style={{
          fontSize: 10.5, fontWeight: 700, color: "#f59e0b",
          fontFamily: "'JetBrains Mono',monospace",
          letterSpacing: 1.5, textTransform: "uppercase",
          marginBottom: 10,
        }}>{hint}</div>
      )}
      {children}
    </div>
  );
}

const SECTION_HEAD = {
  fontSize: 11, fontWeight: 700, color: "#0f172a",
  textTransform: "uppercase", letterSpacing: 1.2,
  marginBottom: 10, paddingBottom: 8,
  borderBottom: "1px solid #f1f5f9",
};

const BOTTOM_CTA = {
  display: "flex", alignItems: "center", justifyContent: "space-between",
  gap: 8, marginTop: 16, padding: "10px 14px",
  background: "#f8fafc", color: "#047857", fontSize: 13.5, fontWeight: 700,
  textDecoration: "none",
  borderTop: "1px solid #e2e8f0", borderLeft: "3px solid #059669",
  transition: "background 160ms",
};

// ── Variant A ──
function VariantA() {
  return (
    <DropdownFrame width={520} hint="Variant A — Top Combinations">
      <div style={SECTION_HEAD}>Most popular broker rankings</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {TOP_COMBOS.map((row, i) => {
          const meta = VERTICAL_META[row.vertKey];
          const Emoji = row.emoji;
          return (
            <Link
              key={`${row.country.slug}-${row.vertKey}`}
              to={comboHref(row.country, row.vertKey)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 6,
                textDecoration: "none", color: "#0f172a",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <CountryFlag code={row.country.code} size={18} />
              <span style={{
                width: 3, height: 18, borderRadius: 1.5,
                background: meta.color, flexShrink: 0,
              }} />
              <span style={{
                fontSize: 14, fontWeight: 600, color: "#0f172a",
                flex: 1, minWidth: 0, whiteSpace: "nowrap",
                overflow: "hidden", textOverflow: "ellipsis",
              }}>
                Best {anchorText(row.country, row.vertKey)}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 10.5, fontWeight: 700,
                color: "#64748b",
              }}>{row.country.regulator.split(" / ")[0]}</span>
              {Emoji && (
                <Emoji size={12}
                  color={Emoji === Star ? "#f59e0b" : "#dc2626"}
                  fill={Emoji === Star ? "#f59e0b" : "#dc2626"} />
              )}
              <ArrowUpRight size={14} color="#cbd5e1" />
            </Link>
          );
        })}
      </div>
      <Link to="/brokers-by-country" style={BOTTOM_CTA}>
        <span>{TOTAL_COVERAGE_LABEL}</span>
        <ArrowRight size={14} />
      </Link>
    </DropdownFrame>
  );
}

// ── Variant B ──
function VariantB() {
  return (
    <DropdownFrame width={780} hint="Variant B — Split by Vertical">
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22,
      }}>
        {/* Forex column */}
        <div>
          <div style={{ ...SECTION_HEAD, color: VERTICAL_META.forex.color, borderBottomColor: "#ecfdf5" }}>
            Forex Brokers
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {BY_VERTICAL.forex.map((c) => (
              <Link key={c.slug} to={comboHref(c, "forex")} style={colLink}>
                <CountryFlag code={c.code} size={16} />
                <span style={colLinkText}>Forex Brokers {c.geo}</span>
                <ArrowUpRight size={12} color="#cbd5e1" className="arrow" />
              </Link>
            ))}
          </div>
        </div>

        {/* Crypto column */}
        <div>
          <div style={{ ...SECTION_HEAD, color: VERTICAL_META.crypto.color, borderBottomColor: "#fef3c7" }}>
            Crypto Brokers
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {BY_VERTICAL.crypto.map((c) => (
              <Link key={c.slug} to={comboHref(c, "crypto")} style={colLink}>
                <CountryFlag code={c.code} size={16} />
                <span style={colLinkText}>Crypto Brokers {c.geo}</span>
                <ArrowUpRight size={12} color="#cbd5e1" className="arrow" />
              </Link>
            ))}
          </div>
        </div>

        {/* Other assets column */}
        <div>
          <div style={{ ...SECTION_HEAD, color: "#0f172a", borderBottomColor: "#e2e8f0" }}>
            Other Assets
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {BY_VERTICAL.other.map((row) => {
              const meta = VERTICAL_META[row.vertKey];
              return (
                <Link
                  key={`${row.country.slug}-${row.vertKey}`}
                  to={comboHref(row.country, row.vertKey)}
                  style={colLink}
                >
                  <CountryFlag code={row.country.code} size={16} />
                  <span style={{ ...colLinkText }}>
                    {meta.label} {meta.word} {row.country.geo}
                  </span>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: meta.color, flexShrink: 0,
                  }} />
                  <ArrowUpRight size={12} color="#cbd5e1" className="arrow" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Link to="/brokers-by-country" style={BOTTOM_CTA}>
        <span>{TOTAL_COVERAGE_LABEL}</span>
        <ArrowRight size={14} />
      </Link>
    </DropdownFrame>
  );
}

const colLink = {
  display: "flex", alignItems: "center", gap: 8,
  padding: "7px 8px", borderRadius: 6,
  textDecoration: "none", color: "#0f172a",
  transition: "background 0.15s",
};
const colLinkText = {
  fontSize: 13, fontWeight: 600, color: "#0f172a",
  flex: 1, minWidth: 0, whiteSpace: "nowrap",
  overflow: "hidden", textOverflow: "ellipsis",
};

// ── Variant C ──
function VariantC() {
  return (
    <DropdownFrame width={720} hint="Variant C — Featured + Popular">
      <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 20 }}>
        {/* Left: featured country cards */}
        <div>
          <div style={SECTION_HEAD}>Top Regulated Markets</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {FEATURED.map((c) => {
              const primary = c.verticals[0];
              if (!primary) return null;
              const meta = VERTICAL_META[primary.key];
              const primaryAnchor = meta
                ? `${meta.label} ${meta.word} ${c.geo}`
                : c.geo;
              return (
                <div
                  key={c.slug}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 10, padding: 12,
                    display: "flex", flexDirection: "column", gap: 8,
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#cbd5e1";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CountryFlag code={c.code} size={22} />
                    <span style={{
                      fontFamily: "'Outfit',sans-serif", fontWeight: 700,
                      fontSize: 14, color: "#0f172a",
                    }}>{c.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      padding: "1px 6px", borderRadius: 4,
                      background: "#0f172a", color: "#fff",
                      fontFamily: "'JetBrains Mono',monospace",
                      fontSize: 10, fontWeight: 700,
                    }}>{c.regulator.split(" / ")[0]}</span>
                    <span style={{ fontSize: 10.5, color: "#64748b", fontWeight: 600 }}>
                      {c.verticals.length} rankings
                    </span>
                  </div>
                  {/* SEO anchor — primary money page */}
                  <Link to={primary.path} style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    color: "#047857", fontSize: 12, fontWeight: 700,
                    textDecoration: "none", marginTop: 2,
                  }}>
                    Best {primaryAnchor}
                    <ChevronRight size={12} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: popular combos */}
        <div>
          <div style={{ ...SECTION_HEAD, display: "flex", alignItems: "center", gap: 6 }}>
            <Flame size={11} color="#dc2626" /> Popular right now
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {POPULAR_COMBOS.map((row) => {
              const meta = VERTICAL_META[row.vertKey];
              return (
                <Link
                  key={`${row.country.slug}-${row.vertKey}`}
                  to={comboHref(row.country, row.vertKey)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 10px", borderRadius: 6,
                    textDecoration: "none", color: "#0f172a",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <CountryFlag code={row.country.code} size={14} />
                  <span style={{
                    width: 3, height: 16, borderRadius: 1.5,
                    background: meta.color, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#0f172a", flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    Best {meta.label} {meta.word} {row.country.geo}
                  </span>
                  <ArrowUpRight size={12} color="#cbd5e1" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Link to="/brokers-by-country" style={BOTTOM_CTA}>
        <span>{TOTAL_COVERAGE_LABEL}</span>
        <ArrowRight size={14} />
      </Link>
    </DropdownFrame>
  );
}

// ═══════════════════════════════════════════════════════════════
// Main proto page
// ═══════════════════════════════════════════════════════════════
export default function MenuCountriesProto() {
  const [active, setActive] = useState("A");
  const tabRefs = useRef({});
  const rendered =
    active === "A" ? <VariantA /> :
    active === "B" ? <VariantB /> :
                      <VariantC />;

  // WAI-ARIA tablist keyboard navigation: ←/→ move focus and activate.
  const onTabKeyDown = (e) => {
    const ids = VARIANTS.map((v) => v.id);
    const idx = ids.indexOf(active);
    let nextId = null;
    if (e.key === "ArrowRight") nextId = ids[(idx + 1) % ids.length];
    else if (e.key === "ArrowLeft") nextId = ids[(idx - 1 + ids.length) % ids.length];
    else if (e.key === "Home") nextId = ids[0];
    else if (e.key === "End") nextId = ids[ids.length - 1];
    if (nextId) {
      e.preventDefault();
      setActive(nextId);
      requestAnimationFrame(() => {
        tabRefs.current[nextId]?.focus();
      });
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", paddingBottom: 80 }}>
      {/* Hero band */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #065f46 55%, #047857 100%)",
        color: "#fff", padding: "36px 24px 28px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 10px", borderRadius: 999,
            background: "rgba(251,191,36,0.15)", color: "#fbbf24",
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700,
            letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12,
          }}>
            <Globe size={12} /> Proto · /proto/menu-countries
          </span>
          <h1 style={{
            fontFamily: "'Outfit',sans-serif", fontWeight: 800,
            fontSize: 32, color: "#fff", margin: 0, letterSpacing: "-0.02em",
            maxWidth: 820, lineHeight: 1.1,
          }}>
            Countries dropdown — 3 варианта редизайна
          </h1>
          <p style={{
            fontSize: 15, lineHeight: 1.55,
            color: "rgba(255,255,255,0.8)", maxWidth: 720,
            margin: "12px 0 0",
          }}>
            Все три варианта используют full-keyword anchor text
            ("Forex Brokers UK", "Crypto Brokers USA") и ссылаются только на
            существующие money pages. Нажми на вкладку чтобы сравнить.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 0" }}>
        <div
          role="tablist"
          aria-label="Countries dropdown variants"
          onKeyDown={onTabKeyDown}
          style={{
            display: "flex", gap: 8, flexWrap: "wrap",
            padding: 6, background: "#fff",
            borderRadius: 14, border: "1px solid #e2e8f0",
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
          }}
        >
          {VARIANTS.map((v) => {
            const isActive = active === v.id;
            return (
              <button
                key={v.id}
                type="button"
                role="tab"
                id={`variant-tab-${v.id}`}
                aria-selected={isActive}
                aria-controls={`variant-panel-${v.id}`}
                tabIndex={isActive ? 0 : -1}
                ref={(el) => { tabRefs.current[v.id] = el; }}
                onClick={() => setActive(v.id)}
                style={{
                  flex: 1, minWidth: 180,
                  padding: "12px 14px", borderRadius: 10,
                  background: isActive ? "linear-gradient(135deg, #059669, #047857)" : "transparent",
                  color: isActive ? "#fff" : "#0f172a",
                  border: "none",
                  cursor: "pointer", textAlign: "left",
                  fontFamily: "inherit",
                  transition: "background 0.18s, color 0.18s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ fontWeight: 800, fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>{v.label}</div>
                <div style={{
                  fontSize: 11.5, marginTop: 2,
                  opacity: isActive ? 0.88 : 0.6,
                }}>{v.sub}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Live dropdown preview */}
      <section
        role="tabpanel"
        id={`variant-panel-${active}`}
        aria-labelledby={`variant-tab-${active}`}
        style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}
      >
        <div style={{
          background: "#f1f5f9",
          borderRadius: 14,
          padding: "40px 28px",
          display: "flex", justifyContent: "center",
          minHeight: 420,
        }}>
          {rendered}
        </div>
      </section>

      {/* Pros / Cons */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
          background: "#fff", borderRadius: 14,
          padding: 28, border: "1px solid #e2e8f0",
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        }}>
          {active === "A" && (
            <>
              <ProsCons kind="pros" items={[
                "Максимум SEO-концентрации: 10 full-keyword money-page ссылок",
                "Мгновенно находишь нужную комбинацию без выбора «страна → актив»",
                "Компактно (520px), самый узкий dropdown",
                "★ и 🔥 бейджи направляют внимание на money pages",
              ]} />
              <ProsCons kind="cons" items={[
                "Нельзя найти «Forex Brokers Germany» если его нет в топ-10",
                "Бейджи приоритезации требуют поддержки (что считать Star vs Flame)",
                "Нет визуального разделения по активу — только bar цвет",
              ]} />
            </>
          )}
          {active === "B" && (
            <>
              <ProsCons kind="pros" items={[
                "Match ментальной модели: «я торгую crypto в UAE»",
                "~18 full-keyword anchor'ов — больше всего SEO-ссылок в dropdown",
                "3 колонки = 3 чёткие вертикали. Глаз видит сразу «Forex / Crypto / Other»",
                "Расширяется: новые вертикали = новая колонка",
              ]} />
              <ProsCons kind="cons" items={[
                "Шире dropdown (780px) — ближе к правой границе viewport",
                "Other Assets — heterogeneous (Stocks USA, SB UK, CFD UK) — требует объяснения",
                "Иерархия одинаковая: нет выделения приоритетов (fire/star)",
              ]} />
            </>
          )}
          {active === "C" && (
            <>
              <ProsCons kind="pros" items={[
                "Визуально самый богатый: 4 country-карточки + 8 популярных ссылок",
                "Featured карточки работают как landing preview: регулятор + число рейтингов",
                "«Popular right now» даёт эффект живой продакт-ленты",
                "На card'ах — primary-keyword CTA (\"Best Forex Brokers UK →\")",
              ]} />
              <ProsCons kind="cons" items={[
                "Самый высокий dropdown — занимает больше viewport",
                "Featured cards дублируют функцию: landing для одной вертикали",
                "~12 ссылок всего (меньше SEO-веса, чем вариант B)",
                "«Popular» требует эвристики (кто решает что популярно)",
              ]} />
            </>
          )}
        </div>
      </section>

      {/* Recommendation footer */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 0" }}>
        <div style={{
          borderRadius: 14, padding: 20,
          background: "linear-gradient(135deg, rgba(5,150,105,0.06), rgba(245,158,11,0.08))",
          border: "1px dashed #cbd5e1",
          display: "flex", alignItems: "flex-start", gap: 14,
        }}>
          <Flame size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{
              fontFamily: "'Outfit',sans-serif", fontWeight: 800,
              fontSize: 15, color: "#0f172a", marginBottom: 4,
            }}>
              Моя рекомендация: Variant B
            </div>
            <div style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.5 }}>
              Больше всего SEO-веса (~18 full-keyword anchor'ов), матчит ментальную модель
              трейдера, структура легко расширяется. A отлично подходит как fallback на
              мобильном, C — для «главной витрины» (но не в nav).
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProsCons({ kind, items }) {
  const pros = kind === "pros";
  return (
    <div>
      <div style={{
        fontSize: 12, fontWeight: 800, letterSpacing: 1,
        textTransform: "uppercase", marginBottom: 10,
        color: pros ? "#047857" : "#b91c1c",
      }}>{pros ? "Pros" : "Cons"}</div>
      <ul style={{ margin: 0, paddingLeft: 18, color: "#334155", fontSize: 13.5, lineHeight: 1.65 }}>
        {items.map((x, i) => <li key={i} style={{ marginBottom: 4 }}>{x}</li>)}
      </ul>
    </div>
  );
}
