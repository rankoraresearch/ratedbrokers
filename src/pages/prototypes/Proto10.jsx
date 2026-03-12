/**
 * PROTO 10: "Social Proof"
 * Warm green, testimonial-heavy, user trust signals.
 * "50,000+ traders trust us" approach.
 */
import { Link } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import { useLocalePath } from "../../i18n/useLocalePath";
import { getAllBrokersWithData } from "../../data/brokers";
import BrokerLogo from "../../components/BrokerLogo";
import { RANKINGS, visitUrl } from "./shared";
import { Star, Users, MessageCircle, ArrowRight, Quote } from "lucide-react";

export default function Proto10() {
  const { mob } = useMedia();
  const lp = useLocalePath();
  const brokers = getAllBrokersWithData().sort((a, b) => b.B.score - a.B.score);
  const top3 = brokers.slice(0, 3);
  const cn = { maxWidth: 1100, margin: "0 auto", padding: mob ? "0 16px" : "0 24px" };
  const green = "#10b981";

  const testimonials = [
    { name: "James T.", country: "UK", text: "Finally a review site that tests with real money. Found my broker in 10 minutes.", rating: 5 },
    { name: "Akira M.", country: "Japan", text: "The side-by-side comparison saved me from a poorly regulated broker. Thank you!", rating: 5 },
    { name: "Sophie L.", country: "Australia", text: "Best resource for beginners. The scoring breakdown makes it so easy to compare.", rating: 5 },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ ...cn, padding: mob ? "48px 16px 40px" : "80px 24px 64px", textAlign: "center" }}>
        {/* Avatar cluster */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{
              width: 36, height: 36, borderRadius: "50%", border: "2px solid #fff",
              background: `hsl(${i * 60}, 60%, 75%)`, marginLeft: i > 1 ? -10 : 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff",
            }}>{String.fromCharCode(64 + i)}</div>
          ))}
          <div style={{
            marginLeft: -10, height: 36, borderRadius: 100, border: "2px solid #fff",
            background: green, display: "flex", alignItems: "center", padding: "0 12px",
            fontSize: 12, fontWeight: 700, color: "#fff",
          }}>50,000+</div>
        </div>

        <h1 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: mob ? 30 : 52, lineHeight: 1.1, color: "#0f172a", marginBottom: 12 }}>
          Trusted by 50,000+<br />Traders Worldwide
        </h1>
        <p style={{ fontSize: mob ? 16 : 18, color: "#64748b", maxWidth: 540, margin: "0 auto 12px", lineHeight: 1.6 }}>
          {brokers.length} brokers independently tested with real money. See which brokers traders actually recommend.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 32 }}>
          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />)}
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginLeft: 8 }}>4.9/5</span>
          <span style={{ fontSize: 14, color: "#94a3b8" }}>(2,847 reviews)</span>
        </div>
        <Link to={lp("/best-forex-brokers")} style={{
          display: "inline-block", padding: "16px 36px", borderRadius: 12,
          background: green, color: "#fff", fontWeight: 800, fontSize: 16, textDecoration: "none",
          boxShadow: "0 4px 20px rgba(16,185,129,0.3)",
        }}>Find Your Broker</Link>
      </section>

      {/* Testimonials */}
      <section style={{ background: "#f0fdf4", padding: mob ? "48px 0" : "64px 0" }}>
        <div style={cn}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 32 }}>
            What Traders Say
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 16, padding: "24px", border: "1px solid #d1fae5",
              }}>
                <Quote size={24} color="#a7f3d0" style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 15, lineHeight: 1.7, color: "#374151", marginBottom: 16, marginTop: 0 }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>{t.country}</div>
                  </div>
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array(t.rating).fill(0).map((_, si) => <Star key={si} size={14} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top picks */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 24 : 32, textAlign: "center", marginBottom: 8 }}>
          Most Recommended Brokers
        </h2>
        <p style={{ textAlign: "center", color: "#64748b", marginBottom: 36 }}>
          Based on expert testing and trader feedback
        </p>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
          {top3.map((br, i) => (
            <div key={br.slug} style={{
              background: "#fff", borderRadius: 16, padding: "24px",
              border: i === 0 ? `2px solid ${green}` : "1px solid #e5e7eb",
              position: "relative",
            }}>
              {i === 0 && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  padding: "4px 16px", borderRadius: 100, background: green, color: "#fff",
                  fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4,
                }}>
                  <Star size={12} fill="#fff" /> Most Popular
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, marginTop: i === 0 ? 8 : 0 }}>
                <BrokerLogo slug={br.slug} name={br.B.name} size={48} shape="wide" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18 }}>{br.B.name}</div>
                  <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                    {[1, 2, 3, 4, 5].map(si => <Star key={si} size={14} fill="#fbbf24" color="#fbbf24" />)}
                  </div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 24, color: green }}>{br.B.score}</div>
              </div>
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>
                {br.B.type} · {br.B.spread} pips spread · ${br.B.minDep} minimum
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={visitUrl(br.slug)} target="_blank" rel="noopener nofollow sponsored" style={{
                  flex: 1, padding: "12px", borderRadius: 10, background: green,
                  color: "#fff", fontWeight: 700, fontSize: 14, textAlign: "center", textDecoration: "none",
                }}>Open Account</a>
                <Link to={lp(`/review/${br.slug}`)} style={{
                  padding: "12px 16px", borderRadius: 10, border: "1px solid #e5e7eb",
                  color: "#6b7280", fontWeight: 600, fontSize: 14, textDecoration: "none",
                }}>Review</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: "#0f172a", padding: mob ? "40px 0" : "56px 0" }}>
        <div style={{ ...cn, display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24, textAlign: "center" }}>
          {[
            { icon: <Users size={24} color={green} />, val: "50,000+", label: "Traders helped" },
            { icon: <Star size={24} color={green} />, val: "4.9/5", label: "Average rating" },
            { icon: <MessageCircle size={24} color={green} />, val: "2,847", label: "User reviews" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              {s.icon}
              <div style={{ fontFamily: "'JetBrains Mono'", fontWeight: 800, fontSize: 28, color: "#fff" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: "#94a3b8" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Rankings */}
      <section style={{ ...cn, padding: mob ? "48px 16px" : "72px 24px" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: mob ? 22 : 28, textAlign: "center", marginBottom: 24 }}>
          Explore Rankings
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "repeat(5, 1fr)", gap: 10 }}>
          {RANKINGS.map((r, i) => (
            <Link key={i} to={lp(r.path)} style={{
              padding: "14px", borderRadius: 10, background: "#f9fafb", border: "1px solid #e5e7eb",
              textDecoration: "none", color: "#374151", fontWeight: 600, fontSize: 14, textAlign: "center",
            }}>{r.title}</Link>
          ))}
        </div>
      </section>
    </div>
  );
}
