export default function Stars({ r, size = 14 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            background:
              i <= Math.floor(r)
                ? "#00B67A"
                : i - 0.5 <= r
                ? "linear-gradient(90deg,#00B67A 50%,#d1d5db 50%)"
                : "#d1d5db",
            clipPath:
              "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
          }}
        />
      ))}
    </div>
  );
}
