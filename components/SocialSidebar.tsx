'use client';
import { C } from "@/lib/theme";

const Icon = ({ d, size = 15 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  instagram: "M16 2H8a6 6 0 0 0-6 6v8a6 6 0 0 0 6 6h8a6 6 0 0 0 6-6V8a6 6 0 0 0-6-6zm-4 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  linkedin: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M2 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0",
  facebook: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  tiktok: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5",
  whatsapp: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
};

const socials = [
  { label: "Instagram", icon: ICONS.instagram, url: "https://www.instagram.com/dee_graphics001?igsh=MWMxNnp5ODM5c2dxcQ==" },
  { label: "LinkedIn", icon: ICONS.linkedin, url: "https://www.linkedin.com/in/daniel-benedict-ab1a6b3a9" },
  { label: "Facebook", icon: ICONS.facebook, url: "https://www.facebook.com/deegraphics01" },
  { label: "TikTok", icon: ICONS.tiktok, url: "https://www.tiktok.com/@little_dee001" },
  { label: "WhatsApp", icon: ICONS.whatsapp, url: "https://wa.me/qr/GUZIO4L6RYAHA1" },
];

export default function SocialSidebar() {
  return (
    <div
      style={{
        position: "fixed",
        left: 20,
        bottom: 40,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        borderLeft: `1px solid ${C.border}`,
        paddingLeft: 12,
      }}
      className="hidden md:flex"
    >
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.url}
          target="_blank"
          rel="noreferrer"
          title={s.label}
          style={{ color: C.gray600, transition: "color .2s", display: "block" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.color = C.gray600)}
        >
          <Icon d={s.icon} />
        </a>
      ))}
    </div>
  );
}
