'use client';
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { db, EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY } from "@/lib/firebase";
import { C, glass } from "@/lib/theme";
import GoldDivider from "@/components/GoldDivider";

const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const CHECK = "M20 6L9 17l-5-5";
const WHATSAPP_ICON = "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z";
const WHATSAPP_NUMBER = "2349072373852";

const CLIENT_TEMPLATE_ID = "template_dra9dap";

const PRICING: Record<string, Record<string, string>> = {
  "Visual Identity":     { Standard: "₦8,000",      Priority: "₦9,000",      Rush: "₦10,000" },
  "AI Art Rendering":    { Standard: "₦3,000",      Priority: "₦5,000",      Rush: "₦7,000"  },
  "Social Campaign":     { Standard: "₦4,000",      Priority: "₦6,000",      Rush: "₦8,000"  },
  "Motion Design":       { Standard: "₦6,000",      Priority: "₦8,000",      Rush: "₦10,000" },
  "Print Layout":        { Standard: "₦3,500",      Priority: "₦5,500",      Rush: "₦7,500"  },
  "Photo Manipulation":  { Standard: "₦2,500",      Priority: "₦4,500",      Rush: "₦6,500"  },
  "Bespoke — Describe Below": { Standard: "From ₦5,000", Priority: "From ₦8,000", Rush: "From ₦10,000" },
};

const DELIVERY_OPTIONS = [
  { label: "Standard", note: "3–5 days", days: 5 },
  { label: "Priority", note: "48 hours", days: 2 },
  { label: "Rush",     note: "24 hours", days: 1 },
];

function getEstimatedDeliveryDate(speedLabel: string): string {
  const opt = DELIVERY_OPTIONS.find((d) => d.label === speedLabel);
  const days = opt?.days ?? 5;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function RequestPage() {
  const [form, setForm] = useState({
    projectType: "Visual Identity",
    speed: "Standard",
    scopeDoc: "",
    name: "",
    email: "",
  });
  const [state, setState] = useState({
    submitted: false, processing: false, trackingId: "", error: "", estimatedDelivery: "",
  });

  const currentPrice = PRICING[form.projectType]?.[form.speed] ?? "—";

  const buildWhatsAppLink = (trackingId: string) => {
    const price = PRICING[form.projectType]?.[form.speed] ?? "—";
    const message =
      `🎨 *New Dee Graphics Order*\n\n` +
      `👤 *Name:* ${form.name}\n` +
      `📧 *Email:* ${form.email}\n` +
      `🗂 *Project Type:* ${form.projectType}\n` +
      `⚡ *Delivery Speed:* ${form.speed}\n` +
      `💰 *Price:* ${price}\n` +
      `🔖 *Tracking ID:* ${trackingId}\n\n` +
      `📋 *Brief:*\n${form.scopeDoc}\n\n` +
      `Please confirm receipt and next steps. Thank you!`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.white,
    fontSize: 13, padding: "14px 16px", borderRadius: 2, outline: "none", boxSizing: "border-box",
    transition: "border-color .2s", fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.gray500,
    display: "block", marginBottom: 8,
  };

  const realSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, processing: true, error: "" }));

    const trackingId = "DG-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    const submittedAt = new Date().toISOString();
    const price = PRICING[form.projectType]?.[form.speed] ?? "—";
    const estimatedDelivery = getEstimatedDeliveryDate(form.speed);

    try {
      await addDoc(collection(db, "designRequests"), {
        trackingId,
        name: form.name,
        email: form.email,
        projectType: form.projectType,
        deliverySpeed: form.speed,
        price,
        estimatedDelivery,
        scopeDetails: form.scopeDoc,
        orderState: "Pending Technical Review",
        timestampISO: submittedAt,
      });try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          CLIENT_TEMPLATE_ID,
          {
            client_name: form.name,
            client_email: form.email,
            project_type: form.projectType,
            speed: form.speed,
            tracking_id: trackingId,
            price,
            estimated_delivery: estimatedDelivery,
          },
          EMAILJS_PUBLIC_KEY
        );
      } catch (emailErr) {
        console.warn("Client email failed (order still saved):", emailErr);
      }

      setState({ submitted: true, processing: false, trackingId, error: "", estimatedDelivery });

    } catch (err) {
      console.error("Order submission failed:", err);
      setState({ submitted: false, processing: false, trackingId: "", error: "Something went wrong. Please try again or contact us directly.", estimatedDelivery: "" });
    }
  };

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px 96px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.5em", color: C.gold, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 12 }}>
          New Project
        </span>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: C.white, letterSpacing: "-0.01em" }}>
          Initialise Creative Production
        </h1>
        <p style={{ color: C.gray500, fontSize: 13, marginTop: 10, fontWeight: 300 }}>
          Brief our creative engineers. We respond within 2 business hours.
        </p>
        <GoldDivider />
      </div>

      <div style={{ ...glass, padding: 40, borderRadius: 2 }}>
        {state.submitted ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(16,185,129,0.1)", border: `1px solid rgba(16,185,129,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: C.emerald }}>
              <Icon d={CHECK} size={22} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 500, color: C.white, marginBottom: 8 }}>
              🎉 Congratulations, {form.name || "there"}!
            </h3>
            <p style={{ color: C.gray400, fontSize: 13, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 20px" }}>
              Thank you for choosing Dee Graphics. A confirmation email is on its way to your inbox. Our creative team will begin reviewing your brief shortly.
            </p>

            <div style={{ ...glass, padding: "16px 24px", borderRadius: 2, marginBottom: 20, border: `1px solid rgba(212,175,55,0.2)` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "left" }}>
                {[
                  ["Project", form.projectType],
                  ["Speed", form.speed],
                  ["Price", PRICING[form.projectType]?.[form.speed] ?? "—"],
                  ["Tracking ID", state.trackingId],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 9, color: C.gray600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: label === "Price" || label === "Tracking ID" ? C.gold : C.white, fontFamily: label === "Tracking ID" ? "monospace" : "inherit", fontWeight: label === "Price" ? 700 : 400 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, textAlign: "left" }}>
                <div style={{ fontSize: 9, color: C.gray600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>Estimated Delivery</div>
                <div style={{ fontSize: 14, color: C.emerald, fontWeight: 600 }}>{state.estimatedDelivery}</div>
              </div>
            </div>

            <p style={{ color: C.gray600, fontSize: 11, marginBottom: 24, letterSpacing: "0.05em" }}>
              Save your Tracking ID to check project status in the Client Portal.
            </p>

            <div style={{ ...glass, padding: 24, borderRadius: 2, border: `1px solid rgba(37,211,102,0.25)`, background: "rgba(37,211,102,0.05)", marginBottom: 24 }}>
              <p style={{ color: C.gray400, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
                Tap below to send your full order details to us on WhatsApp — your tracking ID, project brief, and price will be included automatically.
              </p>
              <a href={buildWhatsAppLink(state.trackingId)} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#25D366", color: "#07070A", fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px 28px", borderRadius: 2, textDecoration: "none", boxShadow: "0 8px 24px rgba(37,211,102,0.2)" }}>
                <Icon d={WHATSAPP_ICON} size={16} />
                Send Details to WhatsApp
              </a>
            </div>

            <button onClick={() => setState({ submitted: false, processing: false, trackingId: "", error: "", estimatedDelivery: "" })} style={{ background: "none", border: `1px solid ${C.border}`, color: C.gray400, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "10px 24px", cursor: "pointer", borderRadius: 2 }}>
              Submit Another
            </button>
          </div>
        ) : (<form onSubmit={realSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {state.error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", fontSize: 12, padding: "12px 16px", borderRadius: 2 }}>
                {state.error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Your Name</label>
                <input style={inputStyle} required placeholder="e.g. Alex Morgan" value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onFocus={(e) => (e.target.style.borderColor = C.gold)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" style={inputStyle} required placeholder="you@company.com" value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onFocus={(e) => (e.target.style.borderColor = C.gold)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Project Type</label>
              <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                value={form.projectType}
                onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}>
                {Object.keys(PRICING).map((o) => (
                  <option key={o} value={o} style={{ background: C.surface }}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Delivery Speed</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {DELIVERY_OPTIONS.map(({ label, note }) => (
                  <button type="button" key={label}
                    onClick={() => setForm((f) => ({ ...f, speed: label }))}
                    style={{ padding: "12px 8px", border: `1px solid ${form.speed === label ? C.gold : C.border}`, background: form.speed === label ? `rgba(212,175,55,0.08)` : C.surfaceAlt, color: form.speed === label ? C.gold : C.gray400, fontSize: 11, cursor: "pointer", borderRadius: 2, transition: "all .2s" }}>
                    <div style={{ fontWeight: 600, letterSpacing: "0.1em" }}>{label}</div>
                    <div style={{ fontSize: 9, marginTop: 3, opacity: 0.7 }}>{note}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(212,175,55,0.06)", border: `1px solid rgba(212,175,55,0.2)`, padding: "14px 20px", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.gray400, letterSpacing: "0.1em", textTransform: "uppercase" }}>Estimated Price</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: C.gold }}>{currentPrice}</span>
            </div>

            <div>
              <label style={labelStyle}>Project Brief</label>
              <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} required
                placeholder="Describe your project — brand name, target audience, style references, deliverables needed..."
                value={form.scopeDoc}
                onChange={(e) => setForm((f) => ({ ...f, scopeDoc: e.target.value }))}
                onFocus={(e) => (e.target.style.borderColor = C.gold)}
                onBlur={(e) => (e.target.style.borderColor = C.border)} />
            </div>

            <button type="submit" disabled={state.processing} style={{ background: state.processing ? "rgba(212,175,55,0.3)" : `linear-gradient(135deg, ${C.gold}, #B8860B)`, color: C.bg, fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "17px 0", border: "none", cursor: state.processing ? "not-allowed" : "pointer", borderRadius: 2, width: "100%", boxShadow: state.processing ? "none" : `0 8px 24px rgba(212,175,55,0.2)` }}>
              {state.processing ? "Processing…" : "Submit Creative Brief →"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
                              }
