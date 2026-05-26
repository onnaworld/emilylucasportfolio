import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { colors, space } from "../theme";
import ContactModal from "./ContactModal";

const HEROS = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Fixed top-right "+" button + Menu + Contact modals. Shared across the
// landing page, the work index, and the three category landing pages so
// the menu UX is identical everywhere.
export default function PlusMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Menu"
        className="m-plus"
        style={{
          position: "fixed",
          top: 24,
          right: space.xl,
          margin: 0,
          background: "none",
          border: "none",
          padding: 0,
          fontFamily: HEROS,
          fontSize: 56,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          color: "#fff",
          mixBlendMode: "difference",
          zIndex: 100,
          opacity: menuOpen ? 0 : 1,
          pointerEvents: menuOpen ? "none" : "auto",
          transition: "opacity 0.3s",
        }}
      >
        +
      </button>
      {menuOpen && (
        <MenuOverlay
          onClose={() => setMenuOpen(false)}
          onContact={() => { setMenuOpen(false); setContactOpen(true); }}
        />
      )}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  );
}

function MenuOverlay({ onClose, onContact }) {
  const { pathname } = useLocation();
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const items = [
    { label: "Home Page",         to: "/" },
    { label: "About",             to: "/about" },
    { label: "All Work",          to: "/work" },
    { label: "Production",        to: "/production" },
    { label: "Strategy & Editorial", to: "/cultural-strategy" },
    { label: "Visual Research",   to: "/visual-research" },
  ];
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "transparent",
        zIndex: 200,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="m-corner-modal m-menu-modal"
        style={{
          position: "absolute",
          top: space.xl,
          right: space.xl,
          width: "min(340px, calc(100vw - 48px))",
          aspectRatio: "4 / 5",
          color: "#fff",
          padding: `${space.md}px ${space.lg}px`,
          borderRadius: 18,
          border: `1px solid ${colors.text}`,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
          backgroundImage: "url(/menu-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "left",
          transformOrigin: "top right",
          animation: "menu-modal-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          opacity: 0.94,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: HEROS,
            fontSize: 22,
            lineHeight: 1,
            color: "#fff",
            zIndex: 2,
          }}
        >
          ×
        </button>

        <div
          style={{
            fontFamily: TIMES,
            fontStyle: "italic",
            fontSize: "clamp(22px, 2.4vw, 28px)",
            fontWeight: 400,
            color: "#fff",
            lineHeight: 1,
            marginBottom: space.lg,
            textAlign: "center",
          }}
        >
          Menu
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {items.map((item, i) => {
            const isCurrent = pathname === item.to;
            const rowStyle = {
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#fff",
              textDecoration: "none",
              fontFamily: HEROS,
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              padding: `${space.sm + 2}px 0`,
              borderBottom: "1px solid rgba(255,255,255,0.28)",
              animation: `contact-row-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${0.25 + i * 0.1}s both`,
              opacity: isCurrent ? 0.55 : 1,
              pointerEvents: isCurrent ? "none" : "auto",
              cursor: isCurrent ? "default" : "pointer",
            };
            const inner = (
              <>
                <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1, opacity: 0.85 }}>•</span>
                <span style={{ textDecoration: isCurrent ? "line-through" : "none" }}>{item.label}</span>
              </>
            );
            if (isCurrent) {
              return (
                <div key={item.label} style={rowStyle} aria-current="page">
                  {inner}
                </div>
              );
            }
            return (
              <Link key={item.label} to={item.to} onClick={onClose} style={rowStyle}>
                {inner}
              </Link>
            );
          })}
          <button
            onClick={(e) => { e.stopPropagation(); onContact(); }}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              background: "none",
              border: "none",
              padding: `${space.md}px 0 0`,
              fontFamily: TIMES,
              fontStyle: "italic",
              fontSize: 17,
              fontWeight: 400,
              color: "#fff",
              cursor: "pointer",
              animation: `contact-row-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${0.25 + items.length * 0.1}s both`,
            }}
          >
            Contact →
          </button>
        </div>
      </div>
      <style>{`
        @keyframes menu-modal-pop {
          from { transform: scale(0.85); }
          to   { transform: scale(1); }
        }
        @keyframes contact-row-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

