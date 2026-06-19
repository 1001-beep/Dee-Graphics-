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
        projectType: form.pro
