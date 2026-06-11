'use client';
import { useState, useRef } from "react";
import { C } from "@/lib/theme";

export default function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const calc = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
    setPos(p);
  };

  return (
    <div
      ref={ref}
      onMouseMove={(e) => dragging && calc(e.clientX)}
      onMouseDown={(e) => {
        setDragging(true);
        calc(e.clientX);
      }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={(e) => calc(e.touches[0].clientX)}
      style={{
        position: "relative",
        width: "100%",
        height: 420,
        borderRadius: 2,
        overflow: "hidden",
        cursor: "ew-resize",
        userSelect: "none",
        border: `1px solid ${C.border}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=900"
        alt="After"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)`,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=900"
          alt="Before"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.72)",
          }}
        />
      </div>
      <span
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.6)",
          background: "rgba(0,0,0,0.4)",
          padding: "4px 10px",
          borderRadius: 2,
        }}
      >
        Before
      </span>
      <span
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: C.gold,
          background: "rgba(0,0,0,0.4)",
          padding: "4px 10px",
          borderRadius: 2,
        }}
      >
        After
      </span>
      <div style={{ position: "absolute", top: 0, bottom: 0, width: 1.5, background: C.gold, left: `${pos}%`, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: C.bg,
            border: `1.5px solid ${C.gold}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.gold,
            fontSize: 12,
            fontWeight: 700,
            boxShadow: `0 0 12px ${C.goldDim}`,
          }}
        >
          ⇄
        </div>
      </div>
    </div>
  );
}
