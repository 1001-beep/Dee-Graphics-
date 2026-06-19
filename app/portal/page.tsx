'use client';
import { useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { C, glass } from "@/lib/theme";
import GoldDivider from "@/components/GoldDivider";

interface OrderData {
  trackingId: string;
  name: string;
  email: string;
  projectType: string;
  deliverySpeed: string;
  scopeDetails: string;
  orderState: string;
  timestampISO: string;
}

export default function PortalPage() {
  const [id, setId] = useState("");
  const [lookup, setLookup] = useState<OrderData | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAttempted(false);
    try {
      const q = query(collection(db, "designRequests"), where("trackingId", "==", id.trim().toUpperCase()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setLookup(snap.docs[0].data() as OrderData);
      } else {
        setLookup(null);
      }
    } catch (err) {
      console.error("Lookup failed:", err);
      setLookup(null);
    }
    setAttempted(true);
    setLoading(false);
  };

  const statusColor = (s: string) => {
    if (s.includes("Pending")) return "#FBBF24";
    if (s.includes("Production")) return "#60A5FA";
    if (s.includes("Revision")) return "#A78BFA";
    if (s.includes("Completed")) return C.emerald;
    if (s.includes("Cancelled")) return "#F87171";
    return C.gray400;
  };

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px 96px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.5em", color: C.gold, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 12 }}>
          Client Hub
        </span>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: C.white, letterSpacing: "-0.01em" }}>
          Project Status Portal
        </h1>
        <p style={{ color: C.gray500, fontSize: 13, marginTop: 10, fontWeight: 300 }}>
          Enter your tracking ID to check your project&apos;s current status.
        </p>
        <GoldDivider />
      </div>

      <div style={{ ...glass, padding: 36, borderRadius: 2, marginBottom: 24 }}>
        <form onSubmit={handleLookup} style={{ display: "flex", gap: 12 }}>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g. DG-A1B2C3D4"
            style={{ flex: 1, background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.white, fontSize: 13, padding: "14px 16px", borderRadius: 2, outline: "none", fontFamily: "monospace" }} />
          <button type="submit" disabled={loading}
            style={{ background: `linear-gradient(135deg, ${C.gold}, #B8860B)`, color: C.bg, fontWeight: 700, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px 24px", border: "none", cursor: loading ? "wait" : "pointer", borderRadius: 2, whiteSpace: "nowrap", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Searching…" : "Look Up"}
          </button>
        </form>
      </div>

      {attempted && lookup && (
        <div style={{ ...glass, padding: 36, borderRadius: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", color: C.gray500, marginBottom: 6 }}>ORDER ID</div>
              <code style={{ fontSize: 15, color: C.gold, fontFamily: "monospace" }}>{lookup.trackingId}</code>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: statusColor(lookup.orderState), border: `1px solid ${statusColor(lookup.orderState)}33`, padding: "6px 12px", borderRadius: 2, background: statusColor(lookup.orderState) + "11" }}>
              {lookup.orderState}
            </span>
          </div>
          {[
            ["Client Name", lookup.name],
            ["Project Type", lookup.projectType],
            ["Delivery Speed", lookup.deliverySpeed],
            ["Order Placed", new Date(lookup.timestampISO).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}`, alignItems: "center" }}>
              <span style={{ fontSize: 11, letterSpacing: "0.12em", color: C.gray500, textTransform: "uppercase" }}>{label}</span>
              <span style={{ fontSize: 13, color: C.white }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {attempted && !lookup && (
        <div style={{ ...glass, padding: 28, borderRadius: 2, textAlign: "center" }}>
          <p style={{ color: C.gray400, fontSize: 13 }}>No project found for that ID. Check the ID and try again.</p>
        </div>
      )}

      {!attempted && (
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <p style={{ color: C.gray500, fontSize: 13, marginBottom: 16 }}>Don&apos;t have a project yet?</p>
          <Link href="/portal/request" style={{ border: `1px solid ${C.border}`, color: C.gray400, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "12px 28px", borderRadius: 2, textDecoration: "none", display: "inline-block" }}>
            Place a New Order
          </Link>
        </div>
      )}
    </main>
  );
}
