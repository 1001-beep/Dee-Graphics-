'use client';
import Link from "next/link";
import { C, glass } from "@/lib/theme";
import GlassCard from "@/components/GlassCard";
import GoldDivider from "@/components/GoldDivider";

const Icon = ({ d, size = 22 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  palette: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
  megaphone: "M3 11l19-9-9 19-2-8-8-2z",
  video: "M23 7l-7 5 7 5V7zM1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2",
  printer: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2m-10 0v5h8v-5H6z",
  pentool: "M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z",
};

const services = [
  { icon: ICONS.palette, title: "Premium Visual Identity", desc: "Logos, dynamic brand guidelines, colour systems, and complete identity documentation built for longevity.", tag: null },
  { icon: ICONS.eye, title: "Synthetic AI Art Rendering", desc: "Custom contextual visuals produced via precision AI prompting and post-processing into commercial-grade assets.", tag: "Hot" },
  { icon: ICONS.megaphone, title: "High-Scale Social Systems", desc: "Platform-specific graphic templates engineered for maximum engagement, reach, and brand cohesion.", tag: null },
  { icon: ICONS.video, title: "Motion Design Layouts", desc: "Cinematic titles, looping promotional sequences, animated lower thirds, and branded motion graphics.", tag: "New" },
  { icon: ICONS.printer, title: "Print Layout Engineering", desc: "Ultra-high DPI books, magazines, packaging, and premium business collateral ready for commercial print.", tag: null },
  { icon: ICONS.pentool, title: "Advanced Photo Manipulation", desc: "Compositing, technical lighting correction, background removal, and commercial beauty retouching.", tag: null },
];

const process = [
  { step: "01", title: "Discovery Brief", desc: "You submit your creative brief and goals via our intake form." },
  { step: "02", title: "Creative Strategy", desc: "Our team analyses your brand and prepares a strategic direction." },
  { step: "03", title: "Design Production", desc: "Files are crafted to studio standards by our senior designers." },
  { step: "04", title: "Revision & Delivery", desc: "Up to 3 rounds of refinement, then delivery of final assets." },
];

export default function ServicesPage() {
  return (
    <main style={{ paddingBottom: 96 }}>
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px 56px", textAlign: "center" }}>
        <span style={{ fontSize: 9, letterSpacing: "0.5em", color: C.gold, textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: 12 }}>
          Full Capability Suite
        </span>
        <h1 style={{ fontSize: "clamp(30px, 4.5vw, 54px)", fontWeight: 300, letterSpacing: "-0.02em", color: C.white, marginBottom: 16 }}>
          Studio Specialisations
        </h1>
        <p style={{ color: C.gray500, fontSize: 14, fontWeight: 300, maxWidth: 520, margin: "0 auto" }}>
          Every capability is optimised for premium visibility across physical and digital channels.
        </p>
        <GoldDivider />
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {services.map((s) => (
            <GlassCard key={s.title} title={s.title} description={s.desc} icon={<Icon d={s.icon} />} tag={s.tag} />
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 300, letterSpacing: "0.05em", color: C.white }}>How It Works</h2>
          <GoldDivider />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {process.map((p) => (
            <div key={p.step} style={{ ...glass, padding: "32px 28px", borderRadius: 2 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.3em", color: C.gold, fontWeight: 700, marginBottom: 16 }}>{p.step}</div>
              <h3 style={{ fontSize: 15, fontWeight: 500, color: C.white, marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontSize: 13, color: C.gray400, lineHeight: 1.7, fontWeight: 300 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <p style={{ color: C.gray400, fontSize: 14, marginBottom: 28, fontWeight: 300 }}>
          Can&apos;t find what you&apos;re looking for? We handle bespoke requests — just describe your vision.
        </p>
        <Link href="/portal/request" style={{ background: `linear-gradient(135deg, ${C.gold}, #B8860B)`, color: C.bg, fontWeight: 700, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "16px 40px", border: "none", cursor: "pointer", borderRadius: 2, boxShadow: `0 8px 24px rgba(212,175,55,0.2)`, textDecoration: "none" }}>
          Place Your Order →
        </Link>
      </section>
    </main>
  );
  }
