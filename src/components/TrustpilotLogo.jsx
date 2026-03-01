/**
 * Trustpilot brand mark — green star + wordmark.
 * Sizes: "xs" (hero inline), "sm" (cards), "md" (trustpilot section).
 */
export default function TrustpilotLogo({ size = "sm" }) {
  const cfg = {
    xs: { star: 14, font: 11, gap: 3 },
    sm: { star: 16, font: 12, gap: 4 },
    md: { star: 20, font: 14, gap: 5 },
  }[size] || { star: 16, font: 12, gap: 4 };

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: cfg.gap }}>
      {/* Trustpilot star mark */}
      <svg width={cfg.star} height={cfg.star} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#00B67A" />
        <path d="M12 4.5L14.1 9.9L19.8 10.3L15.4 14.1L16.8 19.5L12 16.5L7.2 19.5L8.6 14.1L4.2 10.3L9.9 9.9L12 4.5Z" fill="#fff" />
      </svg>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: cfg.font, fontWeight: 700, color: "#191C1F", letterSpacing: "-0.01em" }}>
        Trustpilot
      </span>
    </span>
  );
}
