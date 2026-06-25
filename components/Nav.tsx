'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { C } from "@/lib/theme";

const const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Order", href: "/portal/request" },
  { label: "Portal", href: "/portal" },
  { label: "Login", href: "/login" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: `1px solid ${C.border}`,
        background: "rgba(15,15,21,0.75)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          className="gold-gradient-text"
          style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.28em", textDecoration: "none" }}
        >
          DEE GRAPHICS
        </Link>

        <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: pathname === l.href ? C.gold : C.gray400,
                textDecoration: "none",
                transition: "color .2s",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/login"
          style={{
            border: `1px solid rgba(212,175,55,0.4)`,
            padding: "10px 20px",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: C.gold,
            background: "transparent",
            cursor: "pointer",
            transition: "all .3s",
            borderRadius: 2,
            boxShadow: `0 0 20px ${C.goldDim}`,
            textDecoration: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = C.gold;
            e.currentTarget.style.color = C.bg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = C.gold;
          }}
        >
          Client Hub
        </Link>
      </div>
    </header>
  );
}
