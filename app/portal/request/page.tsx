'use client';
import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import emailjs from "@emailjs/browser";
import { db, auth, EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY } from "@/lib/firebase";
import { C, glass } from "@/lib/theme";
import GoldDivider from "@/components/GoldDivider";
import Link from "next/link";

const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const CHECK = "M20 6L9 17l-5-5";
const WHATSAPP_ICON = "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z";
const WHATSAPP_NUMBER = "2349072373852";
const CHEVRON = "M6 9l6 6 6-6";
const CLIENT_TEMPLATE_ID = "template_dra9dap";

const PRICING: Record<string, Record<string, string>> = {
  "Visual Identity":          { Standard: "₦8,000",      Priority: "₦9,000",      Rush: "₦10,000" },
  "AI Art Rendering":         { Standard: "₦3,000",      Priority: "₦5,000",      Rush: "₦7,000"  },
  "Social Campaign":          { Standard: "₦4,000",      Priority: "₦6,000",      Rush: "₦8,000"  },
  "Motion Design":            { Standard: "₦6,000",      Priority: "₦8,000",      Rush: "₦10,000" },
  "Print Layout":             { Standard: "₦3,500",      Priority: "₦5,500",      Rush: "₦7,500"  },
  "Photo Manipulation":       { Standard: "₦2,500",      Priority: "₦4,500",      Rush: "₦6,500"  },
  "Bespoke — Describe Below": { Standard: "From ₦5,000", Priority: "From ₦8,000", Rush: "From ₦10,000" },
};

const SUB_OPTIONS: Record<string, string[]> = {
  "Visual Identity": ["Logo design","Business card design","Brand color palette","Brand guidelines","Letterhead design","Email signature design","Social media profile branding"],
  "AI Art Rendering": ["AI portraits","Cartoon versions of photos","Fantasy character artwork","AI product mockups","AI-generated wallpapers","AI birthday portraits","AI fashion concepts"],
  "Social Campaign": ["Promotional flyers","Instagram posts","Carousel designs","Facebook ads","Event announcements","Product launch graphics","Holiday campaign designs"],
  "Motion Design": ["Logo animation","Animated flyers","Intro videos","Outro videos","WhatsApp status animations","Instagram reel graphics","Text animations"],
  "Print Layout": ["Flyers","Posters","Brochures","Magazines","Church programs","Event programs","Menus","Books and eBooks"],
  "Photo Manipulation": ["Background replacement","Studio edits","Birthday edits","Removing unwanted objects","Skin retouching","Fantasy composites","Adding effects and lighting"],
  "Bespoke — Describe Below": [],
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

function SelectWithArrow({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "#13131C", border: "1px solid rgba(255,255,255,0.06)", color: "#F3F4F6", fontSize: 13, padding: "14px 44px 14px 16px", borderRadius: 2, outline: "none", appearance: "none", cursor: "pointer", fontFamily: "inherit", transition: "border-color .2s" }}
        onFocus={(e) => (e.target.style.borderColor = "#D4AF37")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.06)")}>
        {options.map((o) => <option key={o} value={o} style={{ background: "#0F0F15" }}>{o}</option>)}
      </select>
      <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#D4AF37" }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <path d={CHEVRON} />
        </svg>
      </div>
    </div>
  );
}

export default function RequestPage() {
  const [form, setForm] = useState({
    projectType: "Visual Identity", subOption: SUB_OPTIONS["Visual Identity"][0],
    speed: "Standard", scopeDoc: "", name: "", email: "",
  });
  const [state, setState] = useState({
    submitted: false, processing: false, trackingId: "", error: "", estimatedDelivery: "",
  });

  useEffect(() => {
    const opts = SUB_OPTIONS[form.projectType] || [];
    setForm((f) => ({ ...f, subOption: opts[0] || "" }));
  }, [form.projectType]);

  const currentPrice = PRICING[form.projectType]?.[form.speed] ?? "—";
  const isBespoke = form.projectType === "Bespoke — Describe Below";

  const buildWhatsAppLink = (trackingId: string) => {
    const price = PRICING[form.projectType]?.[form.speed] ?? "—";
    const message =
      `🎨 *New Dee Graphics Order*\n\n` +
      `👤 *Name:* ${form.name}\n` +
      `📧 *Email:* ${form.email}\n` +
      `🗂 *Project Type:* ${form.projectType}\n` +
      (form.subOption ? `🔧 *Specific Service:* ${form.subOption}\n` : "") +
      `⚡ *Delivery Speed:* ${form.speed}\n` +
      `💰 *Price:* ${price}\n` +
      `🔖 *Tracking ID:* ${trackingId}\n\n` +
      `📋 *Notes:*\n${form.scopeDoc || "—"}\n\n` +
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
      // Save order to Firestore
      await addDoc(collection(db, "designRequests"), {
        trackingId, name: form.name, email: form.email,
        projectType: form.projectType, subOption: form.subOption || "Custom (Bespoke)",
        deliverySpeed: form.speed, price, estimatedDelivery,
        scopeDetails: form.scopeDoc, orderState: "Pending Technical Review",
        timestampISO: submittedAt,
      });

      // Create Firebase Auth account (email + trackingId as password)
      try {
        await createUserWithEmailAndPassword(auth, form.email, trackingId);
      } catch (authErr: any) {
        // If account already exists, that's fine — client already has login
        if (authErr.code !== "auth/email-already-in-use") {
          console.warn("Auth account creation failed:", authErr);
        }
      }

      // Send confirmation email to client
      try {
        await emailjs.send(EMAILJS_SERVICE_ID, CLIENT_TEMPLATE_ID, {
          client_name: form.name, client_email: form.email,
          project_type: form.projectType, sub_option: form.subOption || "Custom (Bespoke)",
          speed: form.speed, tracking_id: trackingId, price,
          estimated_delivery: estimatedDelivery,
        }, EMAILJS_PUBLIC_KEY);
      } catch (emailErr) {
        console.warn("Client email failed:", emailErr);
      }

      setState({ submitted: true, processing: false, trackingId, error: "", estimatedDelivery });
    } catch (err) {
      console.error("Order failed:", err);
      setState({ submitted: false, processing: false, trackingId: "", estimatedDelivery: "", error: "Something went wrong. Please try again or contact us directly." });
    }
  };return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "80px 24px 96px" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.5em", color: C.gold, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 12 }}>New Project</span>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: C.white, letterSpacing: "-0.01em" }}>Initialise Creative Production</h1>
        <p style={{ color: C.gray500, fontSize: 13, marginTop: 10, fontWeight: 300 }}>Brief our creative engineers. We respond within 2 business hours.</p>
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
              Thank you for choosing Dee Graphics. A confirmation email is on its way to your inbox.
            </p>

            {/* Order summary */}
            <div style={{ ...glass, padding: "16px 24px", borderRadius: 2, marginBottom: 20, border: `1px solid rgba(212,175,55,0.2)` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "left" }}>
                {[
                  ["Project", form.projectType],
                  ["Service", form.subOption || "Custom (Bespoke)"],
                  ["Speed", form.speed],
                  ["Price", PRICING[form.projectType]?.[form.speed] ?? "—"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div style={{ fontSize: 9, color: C.gray600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, color: label === "Price" ? C.gold : C.white, fontWeight: label === "Price" ? 700 : 400 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, textAlign: "left" }}>
                <div style={{ fontSize: 9, color: C.gray600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>Tracking ID</div>
                <code style={{ fontSize: 15, color: C.gold, fontFamily: "monospace", fontWeight: 700 }}>{state.trackingId}</code>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.border}`, textAlign: "left" }}>
                <div style={{ fontSize: 9, color: C.gray600, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 3 }}>Estimated Delivery</div>
                <div style={{ fontSize: 14, color: C.emerald, fontWeight: 600 }}>{state.estimatedDelivery}</div>
              </div>
            </div>

            {/* ⚠️ Warning box */}
            <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 2, padding: "16px 20px", marginBottom: 20, textAlign: "left" }}>
              <p style={{ fontSize: 13, color: "#FBBF24", fontWeight: 600, marginBottom: 8 }}>⚠️ Important — Save Your Login Details</p>
              <p style={{ fontSize: 12, color: C.gray400, lineHeight: 1.7, margin: 0 }}>
                Your account has been created automatically. To view your order history anytime, log in at{" "}
                <Link href="/login" style={{ color: C.gold, textDecoration: "none", borderBottom: `1px solid rgba(212,175,55,0.4)` }}>
                  the Client Portal
                </Link>{" "}using:
              </p>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 12, color: C.white }}>
                  📧 <strong>Email:</strong> <code style={{ color: C.gold, fontFamily: "monospace" }}>{form.email}</code>
                </div>
                <div style={{ fontSize: 12, color: C.white }}>
                  🔑 <strong>Password (Tracking ID):</strong> <code style={{ color: C.gold, fontFamily: "monospace" }}>{state.trackingId}</code>
                </div>
              </div>
              <p style={{ fontSize: 11, color: C.gray500, marginTop: 10, marginBottom: 0 }}>
                Screenshot this or write it down — you&apos;ll need it to check your order status anytime.
              </p>
            </div>

            {/* WhatsApp */}
            <div style={{ ...glass, padding: 24, borderRadius: 2, border: `1px solid rgba(37,211,102,0.25)`, background: "rgba(37,211,102,0.05)", marginBottom: 24 }}>
              <p style={{ color: C.gray400, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
                Tap below to send your full order details to us on WhatsApp automatically.
              </p>
              <a href={buildWhatsAppLink(state.trackingId)} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#25D366", color: "#07070A", fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: "14px 28px", borderRadius: 2, textDecoration: "none", boxShadow: "0 8px 24px rgba(37,211,102,0.2)" }}>
                <Icon d={WHATSAPP_ICON} size={16} />
                Send Details to WhatsApp
              </a>
            </div>

            <button onClick={() => setState({ submitted: false, processing: false, trackingId: "", error: "", estimatedDelivery: "" })} style={{ background: "none", border: `1px solid ${C.border}`, color: C.gray400, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "10px 24px", cursor: "pointer", borderRadius: 2 }}>
              Submit Another Order
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
              <SelectWithArrow value={form.projectType} onChange={(v) => setForm((f) => ({ ...f, projectType: v }))} options={Object.keys(PRICING)} />
            </div>

            {!isBespoke && (
              <div>
                <label style={labelStyle}>Specific Service</label>
                <SelectWithArrow value={form.subOption} onChange={(v) => setForm((f) => ({ ...f, subOption: v }))} options={SUB_OPTIONS[form.projectType] || []} />
              </div>
            )}

            <div>
              <label style={labelStyle}>Delivery Speed</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {DELIVERY_OPTIONS.map(({ label, note }) => (
                  <button type="button" key={label} onClick={() => setForm((f) => ({ ...f, speed: label }))}
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
              <label style={labelStyle}>{isBespoke ? "Describe Your Project" : "Additional Notes (optional)"}</label>
              <textarea style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} required={isBespoke}
                placeholder={isBespoke ? "Describe your custom project — what you need, style references, deliverables..." : "Any specific style, colors, references or details you'd like us to know..."}
                value={form.scopeDoc} onChange={(e) => setForm((f) => ({ ...f, scopeDoc: e.target.value }))}
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
