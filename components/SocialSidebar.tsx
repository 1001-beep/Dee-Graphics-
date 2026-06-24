'use client';

const ICONS = {
  instagram: "M16 2H8a6 6 0 0 0-6 6v8a6 6 0 0 0 6 6h8a6 6 0 0 0 6-6V8a6 6 0 0 0-6-6zm-4 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2z",
  linkedin:  "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M2 4a2 2 0 1 1 4 0 2 2 0 0 1-4 0",
  facebook:  "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  tiktok:    "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5",
  whatsapp:  "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
};

const socials = [
  { label: "Instagram", icon: ICONS.instagram, url: "https://www.instagram.com/dee_graphics001?igsh=MWMxNnp5ODM5c2dxcQ==", color: "#E1306C" },
  { label: "LinkedIn",  icon: ICONS.linkedin,  url: "https://www.linkedin.com/in/daniel-benedict-ab1a6b3a9", color: "#0A66C2" },
  { label: "Facebook",  icon: ICONS.facebook,  url: "https://www.facebook.com/deegraphics01", color: "#1877F2" },
  { label: "TikTok",    icon: ICONS.tiktok,    url: "https://www.tiktok.com/@little_dee001", color: "#FF0050" },
  { label: "WhatsApp",  icon: ICONS.whatsapp,  url: "https://wa.me/qr/GUZIO4L6RYAHA1", color: "#25D366" },
];

export default function SocialSidebar() {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      padding: "12px 24px",
      background: "rgba(7,7,10,0.92)",
      backdropFilter: "blur(16px)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}>
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.url}
          target="_blank"
          rel="noreferrer"
          title={s.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            padding: "8px 14px",
            borderRadius: 8,
            textDecoration: "none",
            transition: "background .2s, transform .2s",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${s.color}18`;
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d={s.icon} />
          </svg>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: s.color,
          }}>{s.label}</span>
        </a>
      ))}
    </div>
  );
  }
