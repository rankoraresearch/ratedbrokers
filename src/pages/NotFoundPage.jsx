import { Link } from "react-router-dom";
import { useLocalePath } from "../i18n/useLocalePath";
import HeroBand from "../components/HeroBand";
import { useMedia } from "../hooks/useMedia";
import { Home, BarChart3, BookOpen, Search } from "lucide-react";

export default function NotFoundPage() {
  const { mob } = useMedia();
  const lp = useLocalePath();

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#f8f9fb" }}>
      <HeroBand mob={mob}>
        <div style={{ textAlign: "center", padding: mob ? "20px 0" : "40px 0" }}>
          <div style={{
            fontFamily: "'JetBrains Mono',monospace", fontSize: mob ? 56 : 80,
            fontWeight: 800, color: "rgba(255,255,255,0.15)", lineHeight: 1,
          }}>404</div>
          <h1 style={{
            fontFamily: "Outfit", fontSize: mob ? 24 : 32, fontWeight: 800,
            color: "#fff", marginTop: 8,
          }}>Page Not Found</h1>
          <p style={{
            fontSize: mob ? 14 : 16, color: "rgba(255,255,255,0.6)",
            maxWidth: 480, margin: "12px auto 0",
          }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
      </HeroBand>

      <div style={{
        maxWidth: 600, margin: "0 auto", padding: mob ? "32px 16px" : "48px 24px",
      }}>
        <div style={{
          display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
          gap: 12,
        }}>
          {[
            { icon: Home, label: "Homepage", desc: "Back to the main page", path: "/" },
            { icon: BarChart3, label: "All Rankings", desc: "Browse 293+ broker rankings", path: "/rankings" },
            { icon: BookOpen, label: "Broker Reviews", desc: "Read expert broker reviews", path: "/reviews" },
            { icon: Search, label: "Find Your Broker", desc: "Take our matching quiz", path: "/find-your-broker" },
          ].map(({ icon: Icon, label, desc, path }) => (
            <Link key={path} to={lp(path)} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "16px 20px", borderRadius: 12,
              background: "#fff", border: "1px solid #e2e8f0",
              textDecoration: "none", transition: "all 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#059669"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "#ecfdf5", display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Icon size={20} color="#059669" />
              </div>
              <div>
                <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{label}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
