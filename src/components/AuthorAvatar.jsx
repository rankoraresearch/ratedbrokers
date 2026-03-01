import { Check } from "lucide-react";

export default function AuthorAvatar({ author, size = 48, showVerified = false }) {
  if (!author) return null;

  const hasImage = !!author.image;
  const badgeSize = Math.max(16, Math.round(size * 0.35));

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {hasImage ? (
        <img
          src={author.image}
          alt={author.name}
          width={size}
          height={size}
          loading="lazy"
          style={{
            width: size, height: size, borderRadius: "50%",
            objectFit: "cover", display: "block",
          }}
        />
      ) : (
        <div style={{
          width: size, height: size, borderRadius: "50%",
          background: "linear-gradient(135deg,#1e3a5f,#2d5a8e)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "Outfit", fontWeight: 700,
          fontSize: Math.round(size * 0.3), color: "#fff",
        }}>
          {author.initials}
        </div>
      )}
      {showVerified && author.verified && (
        <div style={{
          position: "absolute", bottom: -1, right: -1,
          width: badgeSize, height: badgeSize, borderRadius: "50%",
          background: "#16a34a", border: "2px solid #fff",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Check size={Math.round(badgeSize * 0.55)} color="#fff" strokeWidth={3} />
        </div>
      )}
    </div>
  );
}
