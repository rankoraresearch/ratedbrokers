/**
 * HeroBand — Gradient Duo hero wrapper (navy → green).
 * Single dark band for all template pages.
 *
 * @param {React.ReactNode} children — content inside the band
 * @param {boolean} mob — mobile breakpoint
 * @param {boolean} tab — tablet breakpoint
 * @param {boolean} compact — reduced padding (Platform, Regulator pages)
 */
export default function HeroBand({
  children,
  mob = false,
  tab = false,
  compact = false,
}) {
  const padding = compact
    ? (mob ? "28px 16px 32px" : tab ? "32px 24px 40px" : "40px 24px 48px")
    : (mob ? "32px 16px 40px" : tab ? "40px 24px 48px" : "48px 24px 56px");

  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      borderTop: "3px solid #f59e0b",
      background: "linear-gradient(135deg, #0f172a 0%, #0f2e24 40%, #047857 100%)",
    }}>
      {/* Diagonal line texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)",
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
