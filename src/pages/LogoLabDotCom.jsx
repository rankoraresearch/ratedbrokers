import { useMedia } from "../hooks/useMedia";

/* ── Logo Variants Lab ── */

const S = {
  page: { fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f1f5f9", minHeight: "100vh", padding: "32px 16px" },
  grid: { maxWidth: 900, margin: "0 auto", display: "grid", gap: 24 },
  card: {
    background: "#fff", borderRadius: 16, padding: "32px 28px",
    border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  darkCard: {
    background: "#0f172a", borderRadius: 16, padding: "32px 28px",
    border: "1px solid #1e293b",
  },
  label: {
    fontFamily: "JetBrains Mono, monospace", fontSize: 11, fontWeight: 700,
    color: "#94a3b8", textTransform: "uppercase", letterSpacing: 2,
    marginBottom: 16,
  },
  desc: { fontSize: 14, color: "#64748b", lineHeight: 1.6, marginTop: 14, maxWidth: 500 },
  darkDesc: { fontSize: 14, color: "#94a3b8", lineHeight: 1.6, marginTop: 14, maxWidth: 500 },
  tag: {
    display: "inline-block", padding: "3px 10px", borderRadius: 6,
    fontSize: 11, fontWeight: 700, marginRight: 6, marginTop: 10,
  },
};

/* ── Shield SVG (current) ── */
const ShieldIcon = ({ size = 17, fill = "#f59e0b", checkColor = "#fff" }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 20 22" style={{ verticalAlign: "baseline" }}>
    <path d="M10 0.5L1.5 4.5v6.5c0 5.5 3.6 10.6 8.5 11.5 4.9-0.9 8.5-6 8.5-11.5V4.5L10 0.5z" fill={fill} />
    <path d="M7 11.5l2.5 2.5 4.5-5" stroke={checkColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/* ── Triangle SVG ── */
const TriangleDot = ({ size = 10, color = "#f59e0b" }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" style={{ verticalAlign: "baseline", marginBottom: 2 }}>
    <polygon points="6,0.5 11.5,11 0.5,11" fill={color} />
  </svg>
);

/* ── "RB" Monogram in shield ── */
const RBMonogram = ({ size = 36, bg = "#059669", textColor = "#fff" }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 36 40" style={{ verticalAlign: "middle" }}>
    <path d="M18 1L3 7v12c0 10 6.2 19.2 15 21 8.8-1.8 15-11 15-21V7L18 1z" fill={bg} />
    <text x="18" y="26" textAnchor="middle" fontFamily="Outfit" fontWeight="800" fontSize="16" fill={textColor}>RB</text>
  </svg>
);

/* ── Hexagon badge ── */
const HexBadge = ({ size = 32, bg = "#f59e0b" }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" style={{ verticalAlign: "middle" }}>
    <polygon points="16,1 29,8.5 29,23.5 16,31 3,23.5 3,8.5" fill={bg} rx="2" />
    <path d="M11 16.5l3.5 3.5 6.5-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export default function LogoLab() {
  const { mob } = useMedia();
  const fs = mob ? 24 : 32;
  const fsSm = mob ? 14 : 17;
  const fsXs = mob ? 11 : 13;

  return (
    <div style={S.page}>
      <div style={S.grid}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28, color: "#0f172a", marginBottom: 4 }}>
            Logo Lab — RatedBrokers
          </h1>
          <p style={{ fontSize: 15, color: "#64748b" }}>6 вариантов логотипа для финального выбора</p>
        </div>

        {/* ══════════════ VARIANT A: Investing.com style ══════════════ */}
        <div style={S.card}>
          <div style={S.label}>Variant A — Investing.com Style</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
            <span style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: fsSm, color: "#94a3b8", letterSpacing: "0px", marginLeft: 1 }}>.com</span>
          </div>
          <p style={S.desc}>
            Чистый wordmark без иконки. ".com" в мелком сером — как у Investing.com. Максимальная простота, авторитетность через типографику.
          </p>
          <div>
            <span style={{ ...S.tag, background: "#ecfdf5", color: "#059669" }}>Minimalist</span>
            <span style={{ ...S.tag, background: "#eff6ff", color: "#2563eb" }}>Investing.com</span>
          </div>
        </div>

        {/* ══════════════ VARIANT B: Shield + .com ══════════════ */}
        <div style={S.card}>
          <div style={S.label}>Variant B — Shield + .com</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
            <span style={{ marginLeft: 3 }}><ShieldIcon size={mob ? 14 : 17} /></span>
            <span style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: fsXs, color: "#94a3b8", marginLeft: 2 }}>.com</span>
          </div>
          <p style={S.desc}>
            Эволюция текущего лого. Щит остаётся (доверие), добавлен ".com" мелким серым. Знакомо, но обновлённо.
          </p>
          <div>
            <span style={{ ...S.tag, background: "#fef3c7", color: "#92400e" }}>Trust</span>
            <span style={{ ...S.tag, background: "#ecfdf5", color: "#059669" }}>Evolution</span>
          </div>
        </div>

        {/* ══════════════ VARIANT C: Orange Dot = Period ══════════════ */}
        <div style={S.card}>
          <div style={S.label}>Variant C — Orange Dot Accent</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
            <span style={{
              display: "inline-block", width: mob ? 7 : 9, height: mob ? 7 : 9,
              borderRadius: "50%", background: "#f59e0b",
              marginLeft: 2, marginBottom: mob ? 2 : 3, verticalAlign: "baseline",
            }} />
            <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: fsSm, color: "#0f172a", letterSpacing: "-0.3px" }}>com</span>
          </div>
          <p style={S.desc}>
            Оранжевая точка выполняет двойную роль: и "точка" перед "com", и брендовый акцент. Чистый, запоминающийся, уникальный.
          </p>
          <div>
            <span style={{ ...S.tag, background: "#fef3c7", color: "#92400e" }}>Orange Accent</span>
            <span style={{ ...S.tag, background: "#f5f3ff", color: "#7c3aed" }}>Unique</span>
          </div>
        </div>

        {/* ══════════════ VARIANT D: Triangle Dot = Period ══════════════ */}
        <div style={S.card}>
          <div style={S.label}>Variant D — Triangle Dot</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
            <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
            <span style={{ marginLeft: 2, marginRight: 1 }}><TriangleDot size={mob ? 8 : 10} /></span>
            <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: fsSm, color: "#0f172a", letterSpacing: "-0.3px" }}>com</span>
          </div>
          <p style={S.desc}>
            Треугольник вместо точки — продолжение текущего брендинга (favicon). ".com" интегрирован. Уникальная геометрическая форма, аналогов нет у конкурентов.
          </p>
          <div>
            <span style={{ ...S.tag, background: "#fef3c7", color: "#92400e" }}>Brand Continuity</span>
            <span style={{ ...S.tag, background: "#ecfdf5", color: "#059669" }}>Geometric</span>
          </div>
        </div>

        {/* ══════════════ VARIANT E: Monogram + Wordmark ══════════════ */}
        <div style={S.card}>
          <div style={S.label}>Variant E — Monogram System</div>
          <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 12 }}>
            <RBMonogram size={mob ? 30 : 38} />
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
              <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
              <span style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: fsXs, color: "#94a3b8", marginLeft: 2 }}>.com</span>
            </div>
          </div>
          <p style={S.desc}>
            Двухчастная система как у NerdWallet: монограмма "RB" в зелёном щите + wordmark. Монограмму можно использовать как favicon и app icon отдельно.
          </p>
          <div>
            <span style={{ ...S.tag, background: "#ecfdf5", color: "#059669" }}>Scalable</span>
            <span style={{ ...S.tag, background: "#eff6ff", color: "#2563eb" }}>NerdWallet</span>
          </div>
        </div>

        {/* ══════════════ VARIANT F: Hexagon Badge Premium ══════════════ */}
        <div style={S.card}>
          <div style={S.label}>Variant F — Hex Badge Premium</div>
          <div style={{ display: "flex", alignItems: "center", gap: mob ? 8 : 10 }}>
            <HexBadge size={mob ? 28 : 34} />
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#0f172a", letterSpacing: "-0.5px" }}>Rated</span>
              <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs, color: "#059669", letterSpacing: "-0.5px" }}>Brokers</span>
              <span style={{
                display: "inline-block", width: mob ? 6 : 8, height: mob ? 6 : 8,
                borderRadius: "50%", background: "#f59e0b",
                marginLeft: 2, marginBottom: mob ? 2 : 3, verticalAlign: "baseline",
              }} />
              <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: fsSm, color: "#0f172a", letterSpacing: "-0.3px" }}>com</span>
            </div>
          </div>
          <p style={S.desc}>
            Гексагональный бейдж с галочкой (сертификация/верификация) + orange dot ".com". Премиальный, уникальный, финансовый.
          </p>
          <div>
            <span style={{ ...S.tag, background: "#fef3c7", color: "#92400e" }}>Premium</span>
            <span style={{ ...S.tag, background: "#f5f3ff", color: "#7c3aed" }}>Certification</span>
          </div>
        </div>

        {/* ══════════════ DARK MODE PREVIEW ══════════════ */}
        <div style={{ ...S.darkCard, marginTop: 8 }}>
          <div style={{ ...S.label, color: "#475569" }}>Dark Variants (Footer / Hero)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* A dark */}
            <div>
              <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 8 }}>A</div>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs - 4, color: "#fff", letterSpacing: "-0.5px" }}>Rated</span>
                <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs - 4, color: "#34d399", letterSpacing: "-0.5px" }}>Brokers</span>
                <span style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: fsSm - 2, color: "#64748b", marginLeft: 1 }}>.com</span>
              </div>
            </div>
            {/* C dark */}
            <div>
              <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 8 }}>C</div>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs - 4, color: "#fff", letterSpacing: "-0.5px" }}>Rated</span>
                <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs - 4, color: "#34d399", letterSpacing: "-0.5px" }}>Brokers</span>
                <span style={{
                  display: "inline-block", width: 7, height: 7,
                  borderRadius: "50%", background: "#f59e0b",
                  marginLeft: 2, marginBottom: 2, verticalAlign: "baseline",
                }} />
                <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: fsSm - 2, color: "#e2e8f0", letterSpacing: "-0.3px" }}>com</span>
              </div>
            </div>
            {/* D dark */}
            <div>
              <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 8 }}>D</div>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs - 4, color: "#fff", letterSpacing: "-0.5px" }}>Rated</span>
                <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs - 4, color: "#34d399", letterSpacing: "-0.5px" }}>Brokers</span>
                <span style={{ marginLeft: 2, marginRight: 1 }}><TriangleDot size={8} color="#fbbf24" /></span>
                <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: fsSm - 2, color: "#e2e8f0", letterSpacing: "-0.3px" }}>com</span>
              </div>
            </div>
            {/* F dark */}
            <div>
              <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 8 }}>F</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <HexBadge size={28} bg="#fbbf24" />
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs - 4, color: "#fff", letterSpacing: "-0.5px" }}>Rated</span>
                  <span style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: fs - 4, color: "#34d399", letterSpacing: "-0.5px" }}>Brokers</span>
                  <span style={{
                    display: "inline-block", width: 6, height: 6,
                    borderRadius: "50%", background: "#fbbf24",
                    marginLeft: 2, marginBottom: 2, verticalAlign: "baseline",
                  }} />
                  <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: fsSm - 2, color: "#e2e8f0", letterSpacing: "-0.3px" }}>com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════ COMPARISON TABLE ══════════════ */}
        <div style={S.card}>
          <div style={S.label}>Сравнительная матрица</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                  {["", "Простота", "Premium", "Уникальность", ".com", "Иконка", "Финансовая ДНК"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["A", "★★★", "★★★", "★☆☆", "✓", "—", "★★☆"],
                  ["B", "★★☆", "★★☆", "★★☆", "✓", "Shield", "★★★"],
                  ["C", "★★★", "★★★", "★★★", "✓", "Dot", "★★☆"],
                  ["D", "★★★", "★★★", "★★★", "✓", "△", "★★☆"],
                  ["E", "★★☆", "★★★", "★★☆", "✓", "RB shield", "★★★"],
                  ["F", "★★☆", "★★★", "★★★", "✓", "Hex badge", "★★★"],
                ].map(row => (
                  <tr key={row[0]} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {row.map((cell, i) => (
                      <td key={i} style={{ padding: "8px 10px", fontWeight: i === 0 ? 700 : 400, color: i === 0 ? "#059669" : "#1f2937" }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
