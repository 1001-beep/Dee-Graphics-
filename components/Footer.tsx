'use client';
import Link from "next/link";
import { C } from "@/lib/theme";

export default function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, marginTop: 80 }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 24px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div>
          <div className="gold-gradient-text" style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.28em", marginBottom: 6 }}>
            DEE GRAPHICS
          </div>
          <p style={{ fontSize: 11, color: C.gray600, letterSpacing: "0.05em" }}>Premium Visual Experiences</p>
        </div>

        <nav style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          {[
            ["Home", "/"],
["Services", "/services"],
["Order", "/portal/request"],
["Portal", "/portal"],
["Login", "/login"], 
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.gray600,
                textDecoration: "none",
                transition: "color .2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.gray600)}
            >
              {label}
            </Link>
          ))}
        </nav>

        <p style={{ fontSize: 10, color: C.gray600, letterSpacing: "0.08em" }}>
          © {new Date().getFullYear()} Dee Graphics. All rights reserved.
          {" · "}
          <Link href="/admin" style={{ color: C.gray600, fontSize: 10, letterSpacing: "0.08em", textDecoration: "underline" }}>
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
