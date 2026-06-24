'use client';
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { C, glass } from "@/lib/theme";
import GoldDivider from "@/components/GoldDivider";
import Link from "next/link";

const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const EYE = "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6";
const EYE_OFF = "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22";

const statusColor = (s: string) => {
  if (s.includes("Pending")) return "#FBBF24";
  if (s.includes("Production")) return "#60A5FA";
  if (s.includes("Revision")) return "#A78BFA";
  if (s.includes("Completed")) return "#10B981";
  if (s.includes("Cancelled")) return "#F87171";
  return "#9CA3AF";
};

interface Order {
  trackingId: string;
  projectType: string;
  subOption?: string;
  deliverySpeed: string;
  price: string;
  estimatedDelivery: string;
  orderState: string;
  timestampISO: string;
  scopeDetails?: string;
}

export default function LoginPage() {
  const [view, setView] = useState<"login" | "dashboard">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [clientName, setClientName] = useState("");

  const inputStyle: React.CSSProperties = {
    width: "100%", background: C.surfaceAlt, border: `1px solid ${C.border}`,
    color: C.white, fontSize: 13, padding: "14px 16px", borderRadius: 2,
    outline: "none", boxSizing: "border-box", transition: "border-color .2s",
    fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
    color: C.gray500, display: "block", marginBottom: 8,
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password.toUpperCase());
      const q = query(collection(db, "designRequests"), where("email", "==", email));
      const snap = await getDocs(q);
      const list: Order[] = [];
      let name = "";
      snap.forEach((d) => {
        const data = d.data() as Order & { name: string };
        if (!name && data.name) name = data.name;
        list.push(data);
      });
      list.sort((a, b) => new Date(b.timestampISO).getTime() - new Date(a.timestampISO).getTime());
      setOrders(list);
      setClientName(name);
      setView("dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        setError("No account found with that email and tracking ID. Please check and try again.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect tracking ID. Use the tracking ID from your order confirmation.");
      } else {
        setError("Login failed. Please check your email and tracking ID and try again.");
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    auth.signOut();
    setView("login");
    setEmail("");
    setPassword("");
    setOrders([]);
    setClientName("");
  };if (view === "dashboard") {
    return (
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "60px 24px 96px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span style={{ fontSize: 9, letterSpacing: "0.5em", color: C.gold, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 8 }}>
              Client Portal
            </span>
            <h1 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 300, color: C.white }}>
              Welcome back, {clientName || "there"} 👋
            </h1>
            <p style={{ color: C.gray500, fontSize: 13, marginTop: 6 }}>
              Here are all your Dee Graphics orders.
            </p>
          </div>
          <button onClick={handleLogout} style={{
            border: `1px solid ${C.border}`, background: "transparent", color: C.gray400,
            fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase",
            padding: "10px 20px", cursor: "pointer", borderRadius: 2,
          }}>Sign Out</button>
        </div>

        <GoldDivider />
        <div style={{ marginTop: 32 }}>
          {orders.length === 0 ? (
            <div style={{ ...glass, padding: 40, borderRadius: 2, textAlign: "center" }}>
              <p style={{ color: C.gray400, fontSize: 13 }}>No orders found for this account.</p>
              <Link href="/portal/request" style={{ display: "inline-block", marginTop: 16, color: C.gold, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", borderBottom: `1px solid rgba(212,175,55,0.4)`, paddingBottom: 3 }}>
                Place Your First Order →
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {orders.map((o, i) => (
                <div key={i} style={{ ...glass, padding: 24, borderRadius: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                    <div>
                      <code style={{ fontSize: 14, color: C.gold, fontFamily: "monospace" }}>{o.trackingId}</code>
                      <div style={{ fontSize: 11, color: C.gray500, marginTop: 4 }}>
                        {new Date(o.timestampISO).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
                      color: statusColor(o.orderState),
                      border: `1px solid ${statusColor(o.orderState)}33`,
                      padding: "6px 12px", borderRadius: 2,
                      background: statusColor(o.orderState) + "11",
                    }}>{o.orderState}</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: o.scopeDetails ? 16 : 0 }}>
                    {[
                      ["Project", o.projectType],
                      ["Service", o.subOption || "—"],
                      ["Speed", o.deliverySpeed],
                      ["Price", o.price],
                      ["Est. Delivery", o.estimatedDelivery],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div style={{ fontSize: 9, color: C.gray600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>{label}</div>
                        <div style={{ fontSize: 13, color: label === "Price" ? C.gold : C.white, fontWeight: label === "Price" ? 700 : 400 }}>{value}</div>
                      </div>
                    ))}
                  </div>

                  {o.scopeDetails && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 9, color: C.gray600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Notes</div>
                      <p style={{ fontSize: 13, color: C.gray400, lineHeight: 1.7, fontWeight: 300 }}>{o.scopeDetails}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/portal/request" style={{ background: `linear-gradient(135deg, ${C.gold}, #B8860B)`, color: C.bg, fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "14px 36px", borderRadius: 2, textDecoration: "none", boxShadow: `0 8px 24px rgba(212,175,55,0.2)` }}>
            Place a New Order →
          </Link>
        </div>
      </main>
    );
                       }return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "80px 24px 96px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.5em", color: C.gold, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 12 }}>
          Client Portal
        </span>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 38px)", fontWeight: 300, color: C.white, letterSpacing: "-0.01em" }}>
          Sign In to Your Account
        </h1>
        <p style={{ color: C.gray500, fontSize: 13, marginTop: 10, fontWeight: 300 }}>
          Use your email and tracking ID to access your order history.
        </p>
        <GoldDivider />
      </div>

      <div style={{ ...glass, padding: 36, borderRadius: 2 }}>
        <div style={{ background: "rgba(212,175,55,0.06)", border: `1px solid rgba(212,175,55,0.2)`, padding: "14px 18px", borderRadius: 2, marginBottom: 28 }}>
          <p style={{ fontSize: 12, color: C.gray400, lineHeight: 1.7, margin: 0 }}>
            💡 <strong style={{ color: C.gold }}>Your login details:</strong><br />
            <strong>Email:</strong> the email you used when ordering<br />
            <strong>Password:</strong> your tracking ID (e.g. <code style={{ color: C.gold, fontFamily: "monospace" }}>DG-XXXXXXXX</code>)
          </p>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", fontSize: 12, padding: "12px 16px", borderRadius: 2, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" required style={inputStyle} placeholder="you@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = C.gold)}
              onBlur={(e) => (e.target.style.borderColor = C.border)} />
          </div>

          <div>
            <label style={labelStyle}>Tracking ID (Password)</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                required style={{ ...inputStyle, paddingRight: 48, textTransform: "uppercase" }}
                placeholder="DG-XXXXXXXX"
                value={password} onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = C.gold)}
                onBlur={(e) => (e.target.style.borderColor = C.border)} />
              <button type="button" onClick={() => setShowPwd((v) => !v)} style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: C.gray500, padding: 0,
              }}>
                <Icon d={showPwd ? EYE_OFF : EYE} size={17} />
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            background: loading ? "rgba(212,175,55,0.3)" : `linear-gradient(135deg, ${C.gold}, #B8860B)`,
            color: C.bg, fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
            padding: "16px 0", border: "none", cursor: loading ? "not-allowed" : "pointer",
            borderRadius: 2, width: "100%", boxShadow: loading ? "none" : `0 8px 24px rgba(212,175,55,0.2)`,
          }}>
            {loading ? "Signing In…" : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: C.gray600 }}>
          Don&apos;t have an account yet?{" "}
          <Link href="/portal/request" style={{ color: C.gold, textDecoration: "none", borderBottom: `1px solid rgba(212,175,55,0.4)`, paddingBottom: 2 }}>
            Place an Order
          </Link>
        </p>
      </div>
    </main>
  );
                               }
