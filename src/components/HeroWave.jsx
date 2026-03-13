/**
 * HeroWave — SVG wave divider at the bottom of hero sections.
 * Creates a smooth curved transition from hero background to content.
 *
 * @param {string} color — fill color of the wave (default "#fff")
 * @param {number} height — wave height in px (default 48)
 * @param {boolean} flip — flip vertically for top placement
 */
export default function HeroWave({ color = "#fff", height = 48, flip = false }) {
  return (
    <div style={{
      width: "100%",
      lineHeight: 0,
      overflow: "hidden",
      ...(flip ? { transform: "rotate(180deg)" } : {}),
    }}>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style={{ width: "100%", height, display: "block" }}
      >
        <path
          d="M0,40 C240,100 480,0 720,60 C960,120 1200,20 1440,80 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

/**
 * DotGrid — creates a subtle dot pattern overlay via CSS.
 * Uses a pseudo-element approach via inline styles.
 *
 * @param {number} size — dot spacing in px (default 24)
 * @param {string} color — dot color (default "rgba(0,0,0,0.04)")
 * @param {number} dotSize — dot radius in px (default 1)
 */
export function DotGrid({ size = 24, color = "rgba(0,0,0,0.04)", dotSize = 1 }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: `radial-gradient(circle, ${color} ${dotSize}px, transparent ${dotSize}px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}
