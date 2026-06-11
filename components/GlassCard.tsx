'use client';
import { useState, ReactNode } from "react";
import { C, glass } from "@/lib/theme";

interface GlassCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  tag?: string | null;
  onOrder?: () => void;
}

export default function GlassCard({ title, description, icon, tag, onOrder }: GlassCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...glass,
        border: `1px solid ${hovered ? C.borderHover : C.border}`,
        padding: 32,
        borderRadius: 2,
        transition: "border-color .4s, box-shadow .4s",
        boxShadow: hovered
          ? `0 8px 40px rgba(0,0,0,0.6), 0 0 30px ${C.goldDim}`
          : glass.boxShadow,
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1.5,
          background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)`,
          transform: hovered ? "translateX(0)" : "translateX(-100%)",
          transition: "transform .9s",
        }}
      />
      {tag && (
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.gold,
            border: `1px solid rgba(212,175,55,0.25)`,
            padding: "3px 7px",
            borderRadius: 2,
          }}
        >
          {tag}
        </span>
      )}
      {icon && (
        <div
          style={{
            color: C.gold,
            marginBottom: 24,
            transform: hovered ? "scale(1.1)" : "scale(1)",
            transition: "transform .3s",
            display: "inline-block",
          }}
        >
          {icon}
        </div>
      )}
      <h3 style={{ fontSize: 15, fontWeight: 500, color: C.white, marginBottom: 10, letterSpacing: "0.04em" }}>
        {title}
      </h3>
      <p style={{ fontSize: 13, color: C.gray400, lineHeight: 1.7, fontWeight: 300 }}>{description}</p>
      {onOrder && hovered && (
        <button
          onClick={onOrder}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.gold,
            background: C.bg,
            border: `1px solid ${C.border}`,
            padding: "6px 12px",
            cursor: "pointer",
            borderRadius: 2,
            transition: "border-color .2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.gold)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
        >
          Order →
        </button>
      )}
    </div>
  );
}
