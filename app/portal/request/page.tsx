'use client';
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { db, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY } from "@/lib/firebase";
import { C, glass } from "@/lib/theme";
import GoldDivider from "@/components/GoldDivider";

const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const CHECK = "M20 6L9 17l-5-5";
const WHATSAPP_ICON = "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z";
const WHATSAPP_LINK = "https://wa.me/qr/GUZIO4L6RYAHA1";

export default function RequestPage() {
  const [form, setForm] = useState({
    projectType: "Visual Identity",
    speed: "Standard",
    scopeDoc: "",
    name: "",
    email: "",
  });
  const [state, setState] = useState({ submitted: false, processing: false, trackingId: "", error: "" });

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
  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: C.gray500,
    display: "block",
    marginBottom: 8,
  };

  const realSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, processing: true, error: "" }));

    const trackingId = "DG-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    const submittedAt = new Date().toISOString();

    try {
      await addDoc(collection(db, "designRequests"), {
        trackingId,
        name: form.name,
        email: form.email,
        projectType: form.projectType,
        deliverySpeed: form.speed,
        scopeDetails: form.scopeDoc,
        orderState: "Pending Technical Review",
        timestampISO: submittedAt,
      });

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          client_name: form.name,
          client_email: form.email,
          project_type: form.projectType,
          speed: form.speed,
          tracking_id: trackingId,
          brief: form.scopeDoc,
          submitted_at: submittedAt,
        },
        EMAILJS_PUBLIC_KEY
      );

      setState({ submitted: true, processing: false, trackingId, error: "" });
    } catch (err) {
      console.error("Order submission failed:", err);
      setState({ submitted: false, processing: false, trackingId: "", error: "Something went wrong. Please try again or contact us directly." });
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
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(16,185,129,0.1)",
                border: `1px solid rgba(16,185,129,0.3)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                color: C.emerald,
              }}
            >
              <Icon d={CHECK} size={22} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 500, color: C.white, marginBottom: 8 }}>
              🎉 Congratulations, {form.name || "there"}!
            </h3>
            <p style={{ color: C.gray400, fontSize: 13, marginBottom: 24, lineHeight: 1.7, maxWidth: 440, margin: "0 auto 24px" }}>
              Thank you for choosing Dee Graphics. Your project has entered our production queue and our creative team will begin reviewing your brief shortly.
            </p>

            <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, padding: "12px 20px", borderRadius: 2, display: "inline-block", marginBottom: 24 }}>
              <span style={{ fontSize: 10, letterSpacing: "0.15em", color: C.gray500, marginRight: 12, textTransform: "uppercase" }}>Tracking ID</span>
              <code style={{ fontSize: 13, color: C.gold, fontFamily: "monospace" }}>{state.trackingId}</code>
            </div>

            <p style={{ color: C.gray600, fontSize: 11, marginBottom: 28, letterSpacing: "0.05em" }}>
              Save this ID to check your project status anytime in the Client Portal.
            </p>

            {/* WhatsApp tracking CTA */}
            <div style={{
              ...glass,
              padding: 24,
              borderRadius: 2,
              border: `1px solid rgba(37,211,102,0.25)`,
              background: "rgba(37,211,102,0.05)",
              marginBottom: 24,
            }}>
              <p style={{ color: C.gray400, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
                Want updates in real time? Message us on WhatsApp with your tracking ID and we&apos;ll keep you posted on your project&apos;s progress.
              </p>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#25D366",
                  color: "#07070A",
                  fontWeight: 700,
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "12px 28px",
                  borderRadius: 2,
                  textDecoration: "none",
                  boxShadow: "0 8px 24px rgba(37,211,102,0.2)",
                }}
              >
                <Icon d={WHATSAPP_ICON} size={16} />
                Track on WhatsApp
              </a>
            </div>

            <button
              onClick={() => setState({ submitted: false, processing: false, trackingId: "", error: "" })}
              style={{
                background: "none",
                border: `1px solid ${C.border}`,
                color: C.gray400,
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "10px 24px",
                cursor: "pointer",
                borderRadius: 2,
              }}
            >
              Submit Another
            </button>
          </div>
        ) : (
          <form onSubmit={realSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {state.error && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171", fontSize: 12, padding: "12px 16px", borderRadius: 2 }}>
                {state.error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={labelStyle}>Your Name</label>
                <input
                  style={inputStyle}
                  required
                  placeholder="e.g. Alex Morgan"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  onFocus={(e) => (e.target.style.borderColor = C.gold)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)}
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  style={inputStyle}
                  required
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onFocus={(e) => (e.target.style.borderColor = C.gold)}
                  onBlur={(e) => (e.target.style.borderColor = C.border)}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Project Type</label>
              <select
                style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                value={form.projectType}
                onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))}
              >
                {["Visual Identity", "AI Art Rendering", "Social Campaign", "Motion Design", "Print Layout", "Photo Manipulation", "Bespoke — Describe Below"].map((o) => (
                  <option key={o} value={o} style={{ background: C.surface }}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Delivery Speed</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  ["Standard", "5–7 days"],
                  ["Priority", "48 hours"],
                  ["Rush", "24 hours"],
                ].map(([speed, note]) => (
                  <button
                    type="button"
                    key={speed}
                    onClick={() => setForm((f) => ({ ...f, speed }))}
                    style={{
                      padding: "12px 8px",
                      border: `1px solid ${form.speed === speed ? C.gold : C.border}`,
                      background: form.speed === speed ? `rgba(212,175,55,0.08)` : C.surfaceAlt,
                      color: form.speed === speed ? C.gold : C.gray400,
                      fontSize: 11,
                      cursor: "pointer",
                      borderRadius: 2,
                      transition: "all .2s",
                    }}
                  >
                    <div style={{ fontWeight: 600, letterSpacing: "0.1em" }}>{speed}</div>
                    <div style={{ fontSize: 9, marginTop: 4, opacity: 0.7 }}>{note}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Project Brief</label>
              <textarea
                style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
                required
                placeholder="Describe your project — brand name, target audience, style references, deliverables needed..."
                value={form.scopeDoc}
                onChange={(e) => setForm((f) => ({ ...f, scopeDoc: e.target.value }))}
                onFocus={(e) => (e.target.style.borderColor = C.gold)}
                onBlur={(e) => (e.target.style.borderColor = C.border)}
              />
            </div>

            <button
              type="submit"
              disabled={state.processing}
              style={{
                background: state.processing ? "rgba(212,175,55,0.3)" : `linear-gradient(135deg, ${C.gold}, #B8860B)`,
                color: C.bg,
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "17px 0",
                border: "none",
                cursor: state.processing ? "not-allowed" : "pointer",
                borderRadius: 2,
                transition: "opacity .2s",
                width: "100%",
                boxShadow: state.processing ? "none" : `0 8px 24px rgba(212,175,55,0.2)`,
              }}
            >
              {state.processing ? "Processing…" : "Submit Creative Brief →"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
