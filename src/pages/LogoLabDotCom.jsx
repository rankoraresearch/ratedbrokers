import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   LOGO LAB v3 — Orange Dot Variations + Favicon Options
   Focused exploration of the chosen "Orange Dot" concept (W1)
   ═══════════════════════════════════════════════════════════════ */

const O = "'Outfit', sans-serif";

/* ── Orange Dot function (reusable) ── */
const Dot = ({ size = 7, color = "#f59e0b", ml = 2, mb = 2 }) => (
  <span style={{
    display: "inline-block", width: size, height: size,
    borderRadius: "50%", background: color, marginLeft: ml, marginBottom: mb,
    verticalAlign: "baseline", flexShrink: 0,
  }} />
);

/* ═══ LOGO VARIANTS ═══ */
const logos = [
  {
    id: "A",
    name: "Original (Current)",
    desc: "Текущий вариант: Rated (navy) + Brokers (green) + оранжевая точка + com",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
        <Dot size={fs * 0.25} mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs * 0.52, color: "#0f172a", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#34d399", letterSpacing: "-0.5px" }}>Brokers</span>
        <Dot size={fs * 0.25} color="#fbbf24" mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs * 0.52, color: "#f1f5f9", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
  },
  {
    id: "B",
    name: "Monochrome Navy",
    desc: "Весь текст одного цвета (navy), только точка — оранжевая. Как Bloomberg — строгость и авторитет.",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>RatedBrokers</span>
        <Dot size={fs * 0.25} mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs * 0.52, color: "#0f172a", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>RatedBrokers</span>
        <Dot size={fs * 0.25} color="#fbbf24" mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs * 0.52, color: "#f1f5f9", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
  },
  {
    id: "C",
    name: "Lowercase Modern",
    desc: "Всё строчными, как investing.com или bloomberg. Современно, дружелюбно, tech-vibe.",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>rated</span>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>brokers</span>
        <Dot size={fs * 0.25} mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs * 0.52, color: "#0f172a", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>rated</span>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#34d399", letterSpacing: "-0.5px" }}>brokers</span>
        <Dot size={fs * 0.25} color="#fbbf24" mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs * 0.52, color: "#f1f5f9", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
  },
  {
    id: "D",
    name: "Light Weight",
    desc: "Те же цвета, но font-weight 500 (Medium). Более элегантно, менее агрессивно. Как Wise или Morningstar.",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 500, fontSize: fs, color: "#0f172a", letterSpacing: "0px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 500, fontSize: fs, color: "#059669", letterSpacing: "0px" }}>Brokers</span>
        <Dot size={fs * 0.22} mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 500, fontSize: fs * 0.52, color: "#0f172a" }}>com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 500, fontSize: fs, color: "#f1f5f9", letterSpacing: "0px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 500, fontSize: fs, color: "#34d399", letterSpacing: "0px" }}>Brokers</span>
        <Dot size={fs * 0.22} color="#fbbf24" mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 500, fontSize: fs * 0.52, color: "#f1f5f9" }}>com</span>
      </div>
    ),
  },
  {
    id: "E",
    name: "Bold + Light Mix",
    desc: "\"Rated\" жирный (800), \"Brokers\" лёгкий (400). Контраст веса создаёт иерархию, как S&P Global.",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 400, fontSize: fs, color: "#059669", letterSpacing: "0px" }}>Brokers</span>
        <Dot size={fs * 0.25} mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 400, fontSize: fs * 0.52, color: "#64748b", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 400, fontSize: fs, color: "#34d399", letterSpacing: "0px" }}>Brokers</span>
        <Dot size={fs * 0.25} color="#fbbf24" mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 400, fontSize: fs * 0.52, color: "#94a3b8", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
  },
  {
    id: "F",
    name: "Large Dot",
    desc: "Та же структура, но точка крупнее (35% шрифта). Точка становится полноценным графическим элементом.",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
        <Dot size={fs * 0.35} ml={3} mb={fs * 0.04} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs * 0.52, color: "#0f172a", letterSpacing: "-0.3px", marginLeft: 1 }}>com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#34d399", letterSpacing: "-0.5px" }}>Brokers</span>
        <Dot size={fs * 0.35} color="#fbbf24" ml={3} mb={fs * 0.04} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs * 0.52, color: "#f1f5f9", letterSpacing: "-0.3px", marginLeft: 1 }}>com</span>
      </div>
    ),
  },
  {
    id: "G",
    name: "ALL CAPS Institutional",
    desc: "Капслок + межбуквенное расстояние. Институциональный стиль, как S&P GLOBAL или MOODY'S.",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs * 0.85, color: "#0f172a", letterSpacing: "2px", textTransform: "uppercase" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs * 0.85, color: "#059669", letterSpacing: "2px", textTransform: "uppercase" }}>Brokers</span>
        <Dot size={fs * 0.22} ml={3} mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs * 0.44, color: "#64748b", letterSpacing: "1px", textTransform: "uppercase" }}>com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs * 0.85, color: "#f1f5f9", letterSpacing: "2px", textTransform: "uppercase" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs * 0.85, color: "#34d399", letterSpacing: "2px", textTransform: "uppercase" }}>Brokers</span>
        <Dot size={fs * 0.22} color="#fbbf24" ml={3} mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs * 0.44, color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase" }}>com</span>
      </div>
    ),
  },
  {
    id: "H",
    name: "Dot Separator",
    desc: "Точка между словами: \"Rated ● Brokers\". Точка становится разделителем, а не частью .com.",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
        <Dot size={fs * 0.22} ml={4} mb={fs * 0.08} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px", marginLeft: 4 }}>Brokers</span>
        <span style={{ fontFamily: O, fontWeight: 600, fontSize: fs * 0.48, color: "#94a3b8", marginLeft: 3, letterSpacing: "-0.3px" }}>.com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Rated</span>
        <Dot size={fs * 0.22} color="#fbbf24" ml={4} mb={fs * 0.08} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#34d399", letterSpacing: "-0.5px", marginLeft: 4 }}>Brokers</span>
        <span style={{ fontFamily: O, fontWeight: 600, fontSize: fs * 0.48, color: "#64748b", marginLeft: 3, letterSpacing: "-0.3px" }}>.com</span>
      </div>
    ),
  },
  {
    id: "I",
    name: "Single Color + Dot",
    desc: "Одноцветный navy-текст без разделения, только точка оранжевая. Ультра-чистый.",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Brokers</span>
        <Dot size={fs * 0.25} mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs * 0.52, color: "#64748b", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Brokers</span>
        <Dot size={fs * 0.25} color="#fbbf24" mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs * 0.52, color: "#94a3b8", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
  },
  {
    id: "J",
    name: "Lowercase Mono + Dot",
    desc: "Всё lowercase, один navy-цвет. Точка — единственный акцент. Максимальный минимализм.",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>ratedbrokers</span>
        <Dot size={fs * 0.25} mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs * 0.52, color: "#64748b", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>ratedbrokers</span>
        <Dot size={fs * 0.25} color="#fbbf24" mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 700, fontSize: fs * 0.52, color: "#94a3b8", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
  },
  {
    id: "K",
    name: "Без .com",
    desc: "Просто \"RatedBrokers\" с оранжевой точкой. Без .com — чище, как Bloomberg или Morningstar.",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
        <Dot size={fs * 0.25} mb={fs * 0.06} />
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#34d399", letterSpacing: "-0.5px" }}>Brokers</span>
        <Dot size={fs * 0.25} color="#fbbf24" mb={fs * 0.06} />
      </div>
    ),
  },
  {
    id: "L",
    name: "Dot + Green .com",
    desc: "Как Original, но \"com\" зелёным — единая цветовая связь с \"Brokers\".",
    light: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
        <Dot size={fs * 0.25} mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs * 0.52, color: "#059669", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
    dark: (fs) => (
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#f1f5f9", letterSpacing: "-0.5px" }}>Rated</span>
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs, color: "#34d399", letterSpacing: "-0.5px" }}>Brokers</span>
        <Dot size={fs * 0.25} color="#fbbf24" mb={fs * 0.06} />
        <span style={{ fontFamily: O, fontWeight: 800, fontSize: fs * 0.52, color: "#34d399", letterSpacing: "-0.3px" }}>com</span>
      </div>
    ),
  },
];

/* ═══ FAVICON VARIANTS ═══ */
const favicons = [
  {
    id: "F1",
    name: "Current — rb + Dot",
    desc: "Текущий: \"rb\" белым на navy фоне, оранжевая точка в углу.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0f172a"/><text x="16" y="22" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="900" font-size="16" letter-spacing="-1" fill="#fff">rb</text><circle cx="26" cy="7" r="3" fill="#fbbf24"/></svg>`,
  },
  {
    id: "F2",
    name: "R + Orange Dot",
    desc: "Большая \"R\" + оранжевая точка как период. Простой lettermark.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0f172a"/><text x="10" y="24" font-family="Outfit,sans-serif" font-weight="800" font-size="22" fill="#fff">R</text><circle cx="25" cy="21" r="3.5" fill="#f59e0b"/></svg>`,
  },
  {
    id: "F3",
    name: "Big Dot Center",
    desc: "Крупная оранжевая точка по центру navy-квадрата. Ультра-минимализм.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0f172a"/><circle cx="16" cy="16" r="8" fill="#f59e0b"/></svg>`,
  },
  {
    id: "F4",
    name: "RB Uppercase + Dot",
    desc: "\"RB\" заглавными, точка правее и ниже. Более формальный вариант.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0f172a"/><text x="15" y="22" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="800" font-size="15" letter-spacing="-0.5" fill="#fff">RB</text><circle cx="26.5" cy="23" r="2.5" fill="#f59e0b"/></svg>`,
  },
  {
    id: "F5",
    name: "Orange Circle + White R",
    desc: "Инвертированная схема: оранжевый круг, белая \"R\" внутри.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#f59e0b"/><text x="16" y="23" text-anchor="middle" font-family="Outfit,sans-serif" font-weight="800" font-size="22" fill="#fff">R</text></svg>`,
  },
  {
    id: "F6",
    name: "Navy R + Green B + Dot",
    desc: "R белым, B зелёным — как основной логотип. Точка оранжевая.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0f172a"/><text x="6" y="23" font-family="Outfit,sans-serif" font-weight="800" font-size="17" fill="#fff">R</text><text x="17" y="23" font-family="Outfit,sans-serif" font-weight="800" font-size="17" fill="#34d399">B</text><circle cx="27" cy="7" r="3" fill="#f59e0b"/></svg>`,
  },
  {
    id: "F7",
    name: "Dot + rb стиль Bloomberg",
    desc: "Lowercase \"rb\" мелким шрифтом, большая точка. Как Bloomberg terminal.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0f172a"/><text x="16" y="26" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="700" font-size="12" letter-spacing="-0.5" fill="#94a3b8">rb</text><circle cx="16" cy="10" r="5" fill="#f59e0b"/></svg>`,
  },
  {
    id: "F8",
    name: "Green bg + White rb + Dot",
    desc: "Зелёный фон вместо navy. Другая энергетика, более свежий.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#059669"/><text x="16" y="22" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="900" font-size="16" letter-spacing="-1" fill="#fff">rb</text><circle cx="26" cy="7" r="3" fill="#f59e0b"/></svg>`,
  },
];

/* ── Render one favicon as inline data:url ── */
function FavSvg({ svg, size = 64 }) {
  const encoded = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return <img src={encoded} width={size} height={size} alt="" style={{ borderRadius: size * 0.19 }} />;
}

/* ═══ PAGE COMPONENT ═══ */
export default function LogoLabDotCom() {
  const [selected, setSelected] = useState("A");
  const [favSelected, setFavSelected] = useState("F1");

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* ── Header ── */}
      <div style={{ background: "#0f172a", padding: "48px 20px 40px", textAlign: "center" }}>
        <h1 style={{ fontFamily: O, fontWeight: 800, fontSize: 32, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
          Orange Dot Lab
        </h1>
        <p style={{ color: "#94a3b8", fontSize: 15, marginTop: 8, maxWidth: 500, margin: "8px auto 0" }}>
          12 вариаций логотипа вокруг концепта Orange Dot + 8 вариантов favicon
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 80px" }}>
        {/* ═══ LOGO SECTION ═══ */}
        <h2 style={{ fontFamily: O, fontWeight: 800, fontSize: 22, color: "#0f172a", marginBottom: 8, letterSpacing: "-0.3px" }}>
          Варианты логотипа
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32 }}>
          Кликни на карточку, чтобы выбрать. Все варианты показаны на светлом и тёмном фоне.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480, 1fr))", gap: 16 }}>
          {logos.map((v) => {
            const active = selected === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setSelected(v.id)}
                style={{
                  background: "#fff", borderRadius: 16, overflow: "hidden", cursor: "pointer",
                  border: active ? "2px solid #f59e0b" : "1px solid #e2e8f0",
                  boxShadow: active ? "0 0 0 3px rgba(245,158,11,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "all 0.15s",
                }}
              >
                {/* Light preview */}
                <div style={{
                  padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#fff", minHeight: 56,
                }}>
                  {v.light(30)}
                </div>
                {/* Dark preview */}
                <div style={{
                  padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#0f172a", minHeight: 56,
                }}>
                  {v.dark(30)}
                </div>
                {/* Info */}
                <div style={{ padding: "16px 20px", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
                      color: active ? "#f59e0b" : "#94a3b8", letterSpacing: 1,
                    }}>{v.id}</span>
                    <span style={{ fontFamily: O, fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{v.name}</span>
                    {active && <span style={{
                      background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 4, marginLeft: "auto",
                    }}>SELECTED</span>}
                  </div>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5, marginTop: 6, marginBottom: 0 }}>{v.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ═══ FAVICON SECTION ═══ */}
        <h2 style={{
          fontFamily: O, fontWeight: 800, fontSize: 22, color: "#0f172a",
          marginTop: 64, marginBottom: 8, letterSpacing: "-0.3px",
        }}>
          Варианты Favicon
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 32 }}>
          Иконка для вкладки браузера, закладок и мобильного экрана. Показаны в 3 размерах.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {favicons.map((f) => {
            const active = favSelected === f.id;
            return (
              <div
                key={f.id}
                onClick={() => setFavSelected(f.id)}
                style={{
                  background: "#fff", borderRadius: 16, padding: 24, cursor: "pointer",
                  border: active ? "2px solid #f59e0b" : "1px solid #e2e8f0",
                  boxShadow: active ? "0 0 0 3px rgba(245,158,11,0.15)" : "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "all 0.15s", textAlign: "center",
                }}
              >
                {/* Sizes */}
                <div style={{ display: "flex", alignItems: "end", justifyContent: "center", gap: 16, marginBottom: 16 }}>
                  <div>
                    <FavSvg svg={f.svg} size={16} />
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>16px</div>
                  </div>
                  <div>
                    <FavSvg svg={f.svg} size={32} />
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>32px</div>
                  </div>
                  <div>
                    <FavSvg svg={f.svg} size={64} />
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>64px</div>
                  </div>
                </div>
                {/* Also show on dark bg */}
                <div style={{
                  background: "#0f172a", borderRadius: 10, padding: "12px 0", marginBottom: 16,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                }}>
                  <FavSvg svg={f.svg} size={32} />
                  <FavSvg svg={f.svg} size={48} />
                </div>
                {/* Info */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
                    color: active ? "#f59e0b" : "#94a3b8", letterSpacing: 1,
                  }}>{f.id}</span>
                  <span style={{ fontFamily: O, fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{f.name}</span>
                  {active && <span style={{
                    background: "#fef3c7", color: "#92400e", fontSize: 10, fontWeight: 700,
                    padding: "2px 8px", borderRadius: 4,
                  }}>SELECTED</span>}
                </div>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4, margin: 0 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* ═══ BROWSER TAB PREVIEW ═══ */}
        <h2 style={{
          fontFamily: O, fontWeight: 800, fontSize: 22, color: "#0f172a",
          marginTop: 64, marginBottom: 8, letterSpacing: "-0.3px",
        }}>
          Превью в браузере
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
          Как выбранная связка (логотип + favicon) будет выглядеть в контексте.
        </p>

        {/* Browser mockup */}
        <div style={{
          background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", overflow: "hidden",
        }}>
          {/* Chrome tab bar */}
          <div style={{
            background: "#e8eaed", padding: "8px 12px 0", display: "flex", alignItems: "end", gap: 4,
          }}>
            <div style={{
              background: "#fff", borderRadius: "8px 8px 0 0", padding: "8px 16px",
              display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#5f6368",
              maxWidth: 200,
            }}>
              <FavSvg svg={(favicons.find(f => f.id === favSelected) || favicons[0]).svg} size={16} />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                RatedBrokers — Forex Bro...
              </span>
            </div>
            <div style={{
              background: "#dee1e6", borderRadius: "8px 8px 0 0", padding: "8px 16px",
              fontSize: 12, color: "#80868b", display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#94a3b8", display: "inline-block" }} />
              New Tab
            </div>
          </div>
          {/* Address bar */}
          <div style={{
            background: "#fff", padding: "8px 12px", borderBottom: "1px solid #e2e8f0",
          }}>
            <div style={{
              background: "#f1f3f4", borderRadius: 20, padding: "6px 16px",
              fontSize: 13, color: "#5f6368", display: "flex", alignItems: "center", gap: 6,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6368" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span>ratedbrokers.com</span>
            </div>
          </div>
          {/* Page header mock */}
          <div style={{
            background: "#fff", padding: "16px 24px", borderBottom: "1px solid #e2e8f0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {(logos.find(l => l.id === selected) || logos[0]).light(24)}
            <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#64748b" }}>
              <span>Rankings</span>
              <span>Reviews</span>
              <span>Guides</span>
            </div>
          </div>
          {/* Dark version mockup */}
          <div style={{
            background: "#0f172a", padding: "16px 24px", borderTop: "1px solid #1e293b",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {(logos.find(l => l.id === selected) || logos[0]).dark(24)}
            <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#94a3b8" }}>
              <span>Rankings</span>
              <span>Reviews</span>
              <span>Guides</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
