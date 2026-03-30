import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { getBrokerData } from "../data/brokers/index";
import { SubPageLayout, VALID_TABS } from "../components/subpage";
import { TAB_RENDERERS } from "./subpage-tabs";

export default function BrokerSubPage() {
  const { slug, tab } = useParams();
  const data = getBrokerData(slug);

  /* Invalid broker → 404-style */
  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: "120px 24px", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
        <h1 style={{ fontFamily: "Outfit", fontSize: 32, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Broker Not Found</h1>
        <p style={{ color: "#374151", marginBottom: 24 }}>The broker "{slug}" doesn't exist in our database.</p>
        <Link to="/" style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}>Back to Home</Link>
      </div>
    );
  }

  /* Invalid tab → redirect to main review */
  if (!VALID_TABS.includes(tab)) {
    return <Navigate to={`/review/${slug}`} replace />;
  }

  const TabRenderer = TAB_RENDERERS[tab];
  if (!TabRenderer) {
    return <Navigate to={`/review/${slug}`} replace />;
  }

  /* useMedia inside layout */
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const fn = () => setW(window.innerWidth); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn); }, []);
  const mob = w < 640;

  return (
    <SubPageLayout data={data} slug={slug} activeTab={tab}>
      <TabRenderer data={data} slug={slug} mob={mob} />
    </SubPageLayout>
  );
}
