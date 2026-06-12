'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { C, glass } from "@/lib/theme";
import GlassCard from "@/components/GlassCard";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import GoldDivider from "@/components/GoldDivider";

const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  layers: "M2 20h20M2 16l10-4 10 4M2 12l10-4 10 4",
  cpu: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 0 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 0-2-2v-4m0 0h18",
  sparkles: "M12 3v1m0 16v1M4.22 4.22l.7.7m14.16 14.16.7.7M3 12h1m16 0h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z",
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        className="title-gradient-text"
        style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.02em" }}
      >
        {value}
      </div>
      <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.gray500, marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const features = [
    { icon: ICONS.layers, title: "Luxury Corporate Branding", desc: "Complete design ecosystems — logomarks, typography systems, and comprehensive brand manuals built to last decades.", tag: null },
    { icon: ICONS.cpu, title: "AI Artwork Engineering", desc: "Hyper-realistic renders and synthetic concepts processed into studio-grade marketing assets.", tag: "Next-Gen" },
    { icon: ICONS.sparkles, title: "Social Campaign Design", desc: "High-converting layouts optimised for platform engagement, built to stop the scroll and convert.", tag: null },
  ];

  return (
    <main style={{ paddingBottom: 96 }}>
      <section style={{ minHeight: "88vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px", textAlign: "center", position: "relative" }}>
        <div
          style={{
            maxWidth: 800,
            position: "relative",
            zIndex: 1,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity .9s, transform .9s",
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: "0.6em", textTransform: "uppercase", color: C.gold, fontWeight: 600, display: "block", marginBottom: 24 }}>
            The Horizon of Digital Presentation
          </span>
          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 300, letterSpacing: "-0.02em", color: C.white, lineHeight: 1.15, marginBottom: 28 }}>
            Creative Graphic Design &amp;{" "}
            <span className="title-gradient-text" style={{ fontWeight: 500 }}>
              AI-Powered Realities
            </span>
          </h1>
          <p style={{ color: C.gray400, fontSize: 16, fontWeight: 300, maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.8 }}>
            Transforming corporate briefs into breathtaking visual identities. Bleeding-edge UI frameworks fused with luxurious design craft.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link
              href="/portal/request"
              style={{
                background: `linear-gradient(135deg, ${C.gold}, #B8860B)`,
                color: C.bg,
                fontWeight: 700,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "16px 36px",
                border: "none",
                cursor: "pointer",
                borderRadius: 2,
                boxShadow: `0 8px 24px rgba(212,175,55,0.2)`,
                transition: "opacity .2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Book Creative Request
            </Link>
            <Link
              href="/services"
              style={{
                border: `1px solid ${C.border}`,
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                color: C.white,
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                padding: "16px 36px",
                cursor: "pointer",
                borderRadius: 2,
                transition: "background .2s",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            >
              Browse Capabilities
            </Link>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 24,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {[
          ["250+", "Projects Delivered"],
          ["98%", "Client Satisfaction"],
          ["7", "Design Disciplines"],
          ["48h", "Avg. Turnaround"],
        ].map(([v, l]) => (
          <Stat key={l} value={v} label={l} />
        ))}
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <span style={{ fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase", color: C.gold, fontWeight: 700, display: "block", marginBottom: 12 }}>
            AI Engine Processing
          </span>
          <h2 style={{ fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 300, color: C.white, letterSpacing: "-0.02em", marginBottom: 20, lineHeight: 1.2 }}>
            Fusing Organic Synthesis with Synthetic Imagery
          </h2>
          <p style={{ color: C.gray400, fontSize: 14, lineHeight: 1.8, fontWeight: 300, marginBottom: 28 }}>
            Drag the slider to witness how our post-processing frameworks elevate raw AI renders into polished, studio-grade marketing assets.
          </p>
          <Link
            href="/portal/request"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.gold,
              borderBottom: `1px solid rgba(212,175,55,0.4)`,
              paddingBottom: 4,
              transition: "border-color .2s",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderBottomColor = C.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.borderBottomColor = "rgba(212,175,55,0.4)")}
          >
            Order Similar Refinement →
          </Link>
        </div>
        <BeforeAfterSlider />
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 300, letterSpacing: "0.06em", color: C.white }}>Engineering Architecture</h2>
          <GoldDivider />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {features.map((f) => (
            <GlassCard key={f.title} title={f.title} description={f.desc} icon={<Icon d={f.icon} />} tag={f.tag} />
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            ...glass,
            padding: "60px 48px",
            borderRadius: 2,
            textAlign: "center",
            background: `linear-gradient(135deg, ${C.surfaceAlt}, ${C.surface})`,
            border: `1px solid rgba(212,175,55,0.15)`,
            boxShadow: `inset 0 0 80px ${C.goldGlow}, 0 8px 32px rgba(0,0,0,0.5)`,
          }}
        >
          <span style={{ fontSize: 9, letterSpacing: "0.5em", color: C.gold, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 16 }}>
            Start Your Project
          </span>
          <h2 style={{ fontSize: "clamp(26px, 3vw, 42px)", fontWeight: 300, color: C.white, marginBottom: 12, letterSpacing: "-0.01em" }}>
            Ready to elevate your visual identity?
          </h2>
          <p style={{ color: C.gray400, fontSize: 14, marginBottom: 36, fontWeight: 300 }}>Let&apos;s craft something extraordinary together.</p>
          <Link
            href="/portal/request"
            style={{
              background: `linear-gradient(135deg, ${C.gold}, #B8860B)`,
              color: C.bg,
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              padding: "16px 44px",
              border: "none",
              cursor: "pointer",
              borderRadius: 2,
              boxShadow: `0 8px 24px rgba(212,175,55,0.25)`,
              textDecoration: "none",
            }}
          >
            Begin Your Brief →
          </Link>
        </div>
      </section>
    </main>
  );
}
