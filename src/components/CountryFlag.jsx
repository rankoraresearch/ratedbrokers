/**
 * CountryFlag — renders a high-quality flag image from flagcdn.com
 * @param {string} code  ISO 3166-1 alpha-2 country code (e.g. "GB", "US")
 * @param {number} size  Display height in px (default 20)
 */
export default function CountryFlag({ code, size = 20 }) {
  if (!code) return null;
  const lc = code.toLowerCase();
  // Use 2x resolution for retina; flagcdn provides w20,w40,w80,w160
  const w = size <= 16 ? 40 : size <= 24 ? 40 : 80;
  const src = `https://flagcdn.com/w${w}/${lc}.png`;
  const width = Math.round(size * 1.5); // flags are ~3:2 ratio
  return (
    <img
      src={src}
      alt={code}
      width={width}
      height={size}
      style={{
        borderRadius: Math.max(2, size * 0.15),
        objectFit: "cover",
        flexShrink: 0,
        display: "inline-block",
        verticalAlign: "middle",
      }}
      loading="lazy"
    />
  );
}
