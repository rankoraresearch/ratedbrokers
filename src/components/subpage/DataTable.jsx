const NAVY = "#0f172a";
const GREEN = "#059669";
const GRAY_MUTED = "#64748b";
const GRAY_LIGHT = "#f8f9fb";
const BORDER = "#e8ecf1";

export default function DataTable({ headers, rows, highlightFirst, mob }) {
  return (
    <div style={{ position: "relative", marginBottom: 20 }}>
      <div style={{ overflowX: "auto", borderRadius: 10, border: `1px solid ${BORDER}`, WebkitOverflowScrolling: "touch" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: mob ? 13 : 14, minWidth: mob ? 500 : "auto" }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{ background: GRAY_LIGHT, color: GRAY_MUTED, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, padding: "10px 14px", textAlign: i === 0 ? "left" : "center", borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap", position: i === 0 && mob ? "sticky" : "static", left: 0, zIndex: i === 0 ? 1 : 0 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : GRAY_LIGHT }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: "10px 14px",
                    textAlign: ci === 0 ? "left" : "center",
                    borderBottom: `1px solid ${BORDER}`,
                    fontWeight: ci === 0 || (highlightFirst && ci === 1) ? 600 : (cell === "Yes" || cell === "No" || cell === "None") ? 600 : 400,
                    color: highlightFirst && ci === 1 ? GREEN : cell === "Yes" ? GREEN : cell === "No" || cell === "None" ? "#94a3b8" : NAVY,
                    fontFamily: ci > 0 ? "'JetBrains Mono',monospace" : "inherit",
                    fontSize: ci > 0 ? 13 : 14,
                    whiteSpace: "nowrap",
                    position: ci === 0 && mob ? "sticky" : "static",
                    left: 0,
                    background: ci === 0 && mob ? (ri % 2 === 0 ? "#fff" : GRAY_LIGHT) : "inherit",
                    zIndex: ci === 0 ? 1 : 0,
                  }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mob && <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 28, background: "linear-gradient(90deg, transparent, rgba(232,236,241,0.7))", borderRadius: "0 10px 10px 0", pointerEvents: "none" }} />}
    </div>
  );
}
