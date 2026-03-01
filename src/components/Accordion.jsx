import { ChevronDown } from "lucide-react";

export default function Accordion({ items, expanded, setExpanded }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            borderRadius: 12,
            border: "1px solid #f1f5f9",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              width: "100%",
              padding: "14px 16px",
              background: expanded === i ? "#f8fafc" : "#fff",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              textAlign: "left",
              gap: 12,
            }}
          >
            <span
              style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", flex: 1 }}
            >
              {item.q}
            </span>
            <span
              style={{
                color: "#94a3b8",
                transform: expanded === i ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
                flexShrink: 0,
                display: "inline-flex",
              }}
            >
              <ChevronDown size={16} />
            </span>
          </button>
          {expanded === i && (
            <div style={{ padding: "0 16px 16px" }}>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#475569",
                  margin: 0,
                }}
              >
                {item.a}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
