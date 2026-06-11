export const C = {
  bg: "#07070A",
  surface: "#0F0F15",
  surfaceAlt: "#13131C",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(212,175,55,0.35)",
  gold: "#D4AF37",
  goldDim: "rgba(212,175,55,0.15)",
  goldGlow: "rgba(212,175,55,0.08)",
  cyan: "#06B6D4",
  white: "#F3F4F6",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  emerald: "#10B981",
};

export const glass: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  backdropFilter: "blur(16px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
};
