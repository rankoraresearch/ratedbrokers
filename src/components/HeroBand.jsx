/**
 * HeroBand — Premium Dark hero wrapper.
 *
 * @param {React.ReactNode} children — content inside the band
 * @param {boolean} mob — mobile breakpoint
 * @param {boolean} tab — tablet breakpoint
 * @param {boolean} compact — reduced padding (Platform, Regulator, Ranking pages)
 * @param {"default"|"green"} variant — colour theme:
 *   - "default": navy → green gradient (sitewide standard)
 *   - "green":   green → deep-emerald gradient with amber border + amber-tinted texture (Ranking pages)
 */
export default function HeroBand({
  children,
  mob = false,
  tab = false,
  compact = false,
  variant = "default",
}) {
  const padding = compact
    ? (mob ? "28px 16px 32px" : tab ? "32px 24px 40px" : "40px 24px 48px")
    : (mob ? "32px 16px 40px" : tab ? "40px 24px 48px" : "48px 24px 56px");

  const isGreen = variant === "green";

  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      borderTop: isGreen ? "4px solid #fbbf24" : "3px solid #f59e0b",
      background: isGreen
        ? "linear-gradient(135deg, #047857 0%, #065f46 45%, #0f2e24 100%)"
        : "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
    }}>
      {/* Diagonal line texture — green variant uses amber-tinted threads */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: isGreen
          ? "repeating-linear-gradient(135deg, rgba(251,191,36,0.06) 0px, rgba(251,191,36,0.06) 1px, transparent 1px, transparent 28px)"
          : "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: 1200,
        margin: "0 auto",
        padding,
      }}>
        {children}
      </div>
    </div>
  );
}
