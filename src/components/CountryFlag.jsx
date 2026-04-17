/**
 * CountryFlag — Hybrid pack (E) utвержен 2026-04-18 через /proto/flags.
 *
 *   size ≤ 40  → круг (hatscripts/circle-flags), Wise/Revolut tone
 *   size ≥ 48  → паспортный прямоугольник 4:3 (lipis/flag-icons), editorial
 *
 * SVG через jsDelivr. Ranges выбраны так, чтобы dropdown/footer/cards
 * читались как "аватары страны", а hero CountryPage/RegulatorPage —
 * как точный флаг (Union Jack, US stripes узнаваемы полностью).
 *
 * @param {string} code  ISO 3166-1 alpha-2 ("GB", "US", "DE", …)
 * @param {number} size  Display height in px
 * @param {string} [name]  Optional full country name for better alt-text
 */
export default function CountryFlag({ code, size = 20, name }) {
  if (!code) return null;
  const lc = code.toLowerCase();
  const alt = name || code;

  // ─── Hero / large (≥48px): passport rectangle 4:3 ───
  if (size >= 48) {
    const width = Math.round(size * 1.33);
    return (
      <img
        src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.5.0/flags/4x3/${lc}.svg`}
        alt={alt}
        width={width}
        height={size}
        loading="lazy"
        style={{
          width,
          height: size,
          borderRadius: 4,
          objectFit: "cover",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.08)",
          flexShrink: 0,
          display: "inline-block",
          verticalAlign: "middle",
        }}
      />
    );
  }

  // ─── Dropdown / footer / cards / quiz (≤40px): circle ───
  return (
    <img
      src={`https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@gh-pages/flags/${lc}.svg`}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.12)",
        flexShrink: 0,
        display: "inline-block",
        verticalAlign: "middle",
      }}
    />
  );
}
