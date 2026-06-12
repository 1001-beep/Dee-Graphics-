'use client';
import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { C, glass } from "@/lib/theme";
import GoldDivider from "@/components/GoldDivider";

// Change this to your own password before deploying
const ADMIN_PASSWORD = "Danny@dee123";
const STATUS_OPTIONS = ["Pending Technical Review", "In Design Production", "In Revision", "Completed", "Cancelled"];

interface Order {
  docId: string;
  trackingId: string;
  name: string;
  email: string;
  projectType: string;
  deliverySpeed: string;
  scopeDetails: string;
  orderState: string;
  timestampISO: string;
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [savingId, setSavingId] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "designRequests"));
      const list: Order[] = [];
      snap.forEach((d) => list.push({ docId: d.id, ...(d.data() as Omit<Order, "docId">) }));
      list.sort((a, b) => new Date(b.timestampISO).getTime() - new Date(a.timestampISO).getTime());
      setOrders(list);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwdError("");
    } else {
      setPwdError("Incorrect password.");
    }
  };

  const updateStatus = async (docId: string, newStatus: string) => {
    setSavingId(docId);
    try {
      await updateDoc(doc(db, "designRequests", docId), { orderState: newStatus });
      setOrders((o) => o.map((ord) => (ord.docId === docId ? { ...ord, orderState: newStatus } : ord)));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Try again.");
    }
    setSavingId("");
  };

  const statusColor = (s: string) => {
    if (s.includes("Pending")) return "#FBBF24";
    if (s.includes("Production")) return "#60A5FA";
    if (s.includes("Revision")) return "#A78BFA";
    if (s.includes("Completed")) return C.emerald;
    if (s.includes("Cancelled")) return "#F87171";
    return C.gray400;
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: C.surfaceAlt,
    border: `1px solid ${C.border}`,
    color: C.white,
    fontSize: 13,
    padding: "14px 16px",
    borderRadius: 2,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color .2s",
    fontFamily: "inherit",
  };

  if (!authed) {
    return (
      <main style={{ maxWidth: 420, margin: "0 auto", padding: "100px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <span style={{ fontSize: 9, letterSpacing: "0.5em", color: C.gold, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 12 }}>
            Restricted Access
          </span>
          <h1 style={{ fontSize: 30, fontWeight: 300, color: C.white }}>Admin Login</h1>
          <GoldDivider />
        </div>
        <form onSubmit={handleLogin} style={{ ...glass, padding: 32, borderRadius: 2, display: "flex", flexDirection: "column", gap: 16 }}>
          {pwdError && (
            <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", fontSize: 12, padding: "10px 14px", borderRadius: 2 }}>
              {pwdError}
            </div>
          )}
          <input
            type="password"
            placeholder="Enter admin password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = C.gold)}
            onBlur={(e) => (e.target.style.borderColor = C.border)}
            autoFocus
          />
          <button
            type="submit"
            style={{
              background: `linear-gradient(135deg, ${C.gold}, #B8860B)`,
              color: C.bg,
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "15px 0",
              border: "none",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            Login
          </button>
        </form>
      </main>
    );
  }

  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.orderState === filter);
  const counts = STATUS_OPTIONS.reduce((acc, s) => ({ ...acc, [s]: orders.filter((o) => o.orderState === s).length }), {} as Record<string, number>);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 96px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <span style={{ fontSize: 9, letterSpacing: "0.5em", color: C.gold, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 8 }}>
            Admin Dashboard
          </span>
          <h1 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 300, color: C.white }}>Order Management</h1>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          style={{
            border: `1px solid ${C.border}`,
            background: "rgba(255,255,255,0.04)",
            color: C.gray400,
            fontSize: 10,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "10px 20px",
            cursor: loading ? "wait" : "pointer",
            borderRadius: 2,
          }}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
        {["All", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              border: `1px solid ${filter === s ? C.gold : C.border}`,
              background: filter === s ? "rgba(212,175,55,0.08)" : C.surfaceAlt,
              color: filter === s ? C.gold : C.gray400,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "8px 16px",
              cursor: "pointer",
              borderRadius: 2,
              transition: "all .2s",
            }}
          >
            {s} {s !== "All" && `(${counts[s] || 0})`}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: C.gray500, fontSize: 13, textAlign: "center", padding: "60px 0" }}>Loading orders…</p>
      ) : filteredOrders.length === 0 ? (
        <div style={{ ...glass, padding: 48, borderRadius: 2, textAlign: "center" }}>
          <p style={{ color: C.gray400, fontSize: 13 }}>No orders found{filter !== "All" ? ` with status "${filter}"` : ""}.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredOrders.map((o) => (
            <div key={o.docId} style={{ ...glass, padding: 24, borderRadius: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                <div>
                  <code style={{ fontSize: 14, color: C.gold, fontFamily: "monospace" }}>{o.trackingId}</code>
                  <div style={{ fontSize: 11, color: C.gray500, marginTop: 4 }}>
                    {new Date(o.timestampISO).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: statusColor(o.orderState),
                    border: `1px solid ${statusColor(o.orderState)}33`,
                    padding: "6px 12px",
                    borderRadius: 2,
                    background: statusColor(o.orderState) + "11",
                    height: "fit-content",
                  }}
                >
                  {o.orderState}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
                {[
                  ["Client", o.name],
                  ["Email", o.email],
                  ["Project Type", o.projectType],
                  ["Speed", o.deliverySpeed],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: 9, letterSpacing: "0.15em", color: C.gray600, textTransform: "uppercase", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: C.white }}>{val}</div>
                  </div>
                ))}
              </div>

              {o.scopeDetails && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.15em", color: C.gray600, textTransform: "uppercase", marginBottom: 6 }}>Brief</div>
                  <p style={{ fontSize: 13, color: C.gray400, lineHeight: 1.7, fontWeight: 300, background: "rgba(0,0,0,0.2)", padding: "12px 14px", borderRadius: 2 }}>
                    {o.scopeDetails}
                  </p>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 9, letterSpacing: "0.15em", color: C.gray600, textTransform: "uppercase", marginRight: 4 }}>Update Status:</span>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    disabled={savingId === o.docId}
                    onClick={() => updateStatus(o.docId, s)}
                    style={{
                      border: `1px solid ${o.orderState === s ? statusColor(s) : C.border}`,
                      background: o.orderState === s ? statusColor(s) + "11" : "transparent",
                      color: o.orderState === s ? statusColor(s) : C.gray500,
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "6px 12px",
                      cursor: savingId === o.docId ? "wait" : "pointer",
                      borderRadius: 2,
                      transition: "all .15s",
                      opacity: savingId === o.docId ? 0.5 : 1,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
