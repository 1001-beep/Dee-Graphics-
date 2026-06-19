'use client';
import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "2349072373852";
const DEFAULT_MESSAGE = "Hi Dee Graphics! I'd like to ask about your services.";

const WHATSAPP_PATH = "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Chat with us on WhatsApp"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 60,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: hovered ? "0 8px 28px rgba(37,211,102,0.45)" : "0 6px 20px rgba(37,211,102,0.3)",
        transform: visible ? (hovered ? "scale(1.08) translateY(0)" : "scale(1) translateY(0)") : "scale(0.6) translateY(20px)",
        opacity: visible ? 1 : 0,
        transition: "transform .3s cubic-bezier(.34,1.56,.64,1), opacity .4s, box-shadow .3s",
        textDecoration: "none",
      }}
    >
      <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#25D366", opacity: 0.5, animation: "wa-pulse 2.2s ease-out infinite" }} />
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#07070A" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ position: "relative", zIndex: 1 }}>
        <path d={WHATSAPP_PATH} />
      </svg>
      {hovered && (
        <span style={{ position: "absolute", right: 66, top: "50%", transform: "translateY(-50%)", background: "#0F0F15", border: "1px solid rgba(255,255,255,0.08)", color: "#F3F4F6", fontSize: 12, fontWeight: 500, padding: "8px 14px", borderRadius: 6, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
          Chat with us
        </span>
      )}
      <style>{`
        @keyframes wa-pulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </a>
  );
}
