const NAVY = "#0f172a";
const GRAY_TEXT = "#374151";
const BORDER = "#e8ecf1";

export function H2({ children, id }) {
  return (
    <h2 id={id} style={{ fontFamily: "Outfit", fontSize: 24, fontWeight: 800, color: NAVY, marginBottom: 14, marginTop: 36, scrollMarginTop: 80 }}>
      {children}
    </h2>
  );
}

export function H3({ children }) {
  return (
    <h3 style={{ fontFamily: "Outfit", fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 10, marginTop: 24 }}>
      {children}
    </h3>
  );
}

export function P({ children }) {
  return (
    <p style={{ fontSize: 16, color: GRAY_TEXT, lineHeight: 1.8, marginBottom: 14 }}>
      {children}
    </p>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 22, marginBottom: 16, ...style }}>
      {children}
    </div>
  );
}
