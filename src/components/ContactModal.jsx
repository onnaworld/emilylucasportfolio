import { useEffect } from "react";
import { createPortal } from "react-dom";
import { colors, space } from "../theme";

const HEROS = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Corner-anchored contact card. Used from the + menu and from the
// Contact → link on /about. Esc / outside-click / × all close.
export default function ContactModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const rows = [
    { label: "EMAIL",    value: "emilyelucas@gmail.com",       href: "mailto:emilyelucas@gmail.com" },
    { label: "PHONE",    phones: [
      { prefix: "UK", value: "+44 7766 546348",  href: "tel:+447766546348" },
      { prefix: "US", value: "+1 (917) 735-8545", href: "tel:+19177358545" },
    ]},
    { label: "LINKEDIN", value: "linkedin.com/in/emilyelucas", href: "https://www.linkedin.com/in/emilyelucas/", external: true },
    { label: "RESUME",   value: "Available on request" },
  ];

  const valueStyle = {
    fontFamily: TIMES,
    fontStyle: "italic",
    fontSize: 17,
    fontWeight: 400,
    lineHeight: 1.15,
  };

  // Portal to document.body so position: fixed is genuinely relative
  // to the viewport. Without this, .page-fade-in's transform makes any
  // fixed descendant relative to the page wrapper instead — the modal
  // then renders at the bottom of a tall page (off-screen) on routes
  // like /cultural-strategy.
  return createPortal(
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
        className="m-corner-modal m-contact-modal"
        style={{
          position: "absolute",
          bottom: space.xl,
          right: space.xl,
          width: "min(340px, calc(100vw - 48px))",
          aspectRatio: "4 / 5",
          color: "#fff",
          padding: `${space.md}px ${space.lg}px`,
          borderRadius: 18,
          border: `1px solid ${colors.text}`,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
          backgroundImage: "url(/contact-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "center",
          transformOrigin: "bottom right",
          animation: "contact-modal-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both",
          opacity: 0.94,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14, right: 14, width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: HEROS, fontSize: 22, lineHeight: 1, color: "#fff", zIndex: 2,
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
            marginBottom: space.sm,
          }}
        >
          Get in touch
        </div>
        <p
          style={{
            fontFamily: HEROS,
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1.4,
            color: "#fff",
            margin: 0,
            marginBottom: space.md,
            maxWidth: 260,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Contact for production, editorial and consulting engagements across
          New York, Tokyo, Dubai and London.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: space.sm }}>
          {rows.map((row, i) => {
            const animation = `contact-row-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${0.25 + i * 0.1}s both`;
            const label = (
              <div style={{ fontFamily: HEROS, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.01em", marginBottom: 3 }}>
                {row.label}
              </div>
            );
            if (row.phones) {
              return (
                <div key={row.label} style={{ animation }}>
                  {label}
                  {row.phones.map((p) => (
                    <a
                      key={p.prefix}
                      href={p.href}
                      onClick={() => { window.location.href = p.href; }}
                      className="hover-text"
                      style={{ display: "block", color: "#fff", textDecoration: "none", ...valueStyle }}
                    >
                      {p.prefix} - {p.value}
                    </a>
                  ))}
                </div>
              );
            }
            if (!row.href) {
              return (
                <div key={row.label} style={{ color: "#fff", animation }}>
                  {label}
                  <div style={valueStyle}>{row.value}</div>
                </div>
              );
            }
            return (
              <a
                key={row.label}
                href={row.href}
                target={row.external ? "_blank" : undefined}
                rel={row.external ? "noopener noreferrer" : undefined}
                onClick={() => {
                  if (row.href.startsWith("mailto:") || row.href.startsWith("tel:")) {
                    window.location.href = row.href;
                  }
                }}
                className="hover-text"
                style={{ display: "block", color: "#fff", textDecoration: "none", animation }}
              >
                {label}
                <div style={valueStyle}>{row.value}</div>
              </a>
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes contact-modal-in {
          from { opacity: 0; transform: scale(0.82); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes contact-row-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>,
    document.body
  );
}
