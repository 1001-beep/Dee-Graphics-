import './globals.css';
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import SocialSidebar from "@/components/SocialSidebar";

export const metadata: Metadata = {
  title: "Dee Graphics | Premium Visual Experiences",
  description: "Creative Graphic Design & AI-Powered Visual Solutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-background text-gray-100 antialiased overflow-x-hidden relative min-h-screen">
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "25%",
            width: 500,
            height: 500,
            background: "rgba(30,64,175,0.05)",
            borderRadius: "50%",
            filter: "blur(140px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "33%",
            right: "25%",
            width: 600,
            height: 600,
            background: "rgba(212,175,55,0.05)",
            borderRadius: "50%",
            filter: "blur(160px)",
            pointerEvents: "none",
          }}
        />

        <Nav />
        {children}
        <Footer />
        <SocialSidebar />
        <WhatsAppButton />
      </body>
    </html>
  );
}
