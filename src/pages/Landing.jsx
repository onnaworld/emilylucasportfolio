import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";
import { productionCases } from "../data/work";

const BRAND_LOGOS = [
  "TIFFANY & CO.",
  "AMAN",
  "ONE&ONLY",
  "NIKE",
  "VOGUE",
  "LORO PIANA",
  "MR PORTER",
  "HENNESSY",
  "BVLGARI",
  "CONDÉ NAST",
  "LOUIS VUITTON",
  "CARTIER",
  "MASTERCARD",
  "RICHEMONT",
];

const ACCENT = "#ff5a2a"; // small "+" colour, like Aalto's

// Custom display fonts loaded via @font-face in index.html.
const SACKERS = "'Sackers Gothic Std', 'Optima', sans-serif";
const UNICA = "'Unica 77', 'Helvetica Neue', sans-serif";
const AVENIR = "'Avenir', 'Avenir Next', 'Helvetica Neue', sans-serif";

// Slide-2 work imagery
const CREDENTIAL_IMAGES = [
  "/credentials/01.jpg",
  "/credentials/02.jpg",
  "/credentials/03.jpg",
  "/credentials/04.jpg",
  "/credentials/05.jpg",
  "/credentials/06.jpg",
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="landing-snap"
      style={{
        height: "100vh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
        background: "#fff",
        color: colors.text,
      }}
    >
      <CustomCursor />
      <style>{`
        .landing-snap, .landing-snap * { cursor: none !important; }
      `}</style>

      {/* ───── 1. HERO: cover image + typography ───── */}
      <section
        style={{
          background: "#000",
          color: "#fff",
          height: "100vh",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Hero photo */}
          <img
            src="/hero.jpg"
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />

          {/* + menu */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            style={{
              position: "absolute",
              top: space.lg,
              right: space.xl,
              zIndex: 10,
              background: "none",
              border: "none",
              color: ACCENT,
              fontSize: 28,
              lineHeight: 1,
              cursor: "pointer",
              padding: 0,
              fontWeight: 300,
            }}
          >
            {menuOpen ? "×" : "+"}
          </button>

          {/* Centered wordmark + role */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "#fff",
              padding: `0 ${space.xl}px`,
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            <h1
              style={{
                fontFamily: SACKERS,
                fontSize: "clamp(20px, 2.8vw, 36px)",
                fontWeight: 900,
                letterSpacing: 0,
                lineHeight: 1.05,
                margin: 0,
                WebkitTextStroke: "0.4px #fff",
              }}
            >
              EMILY LUCAS
            </h1>
            <div
              style={{
                fontFamily: SACKERS,
                fontSize: "clamp(8px, 0.7vw, 11px)",
                fontWeight: 400,
                letterSpacing: 0,
                marginTop: space.sm,
              }}
            >
              EXECUTIVE PRODUCER &amp; CULTURAL CONSULTANT
            </div>
          </div>

        </div>

        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      </section>

      {/* ───── 2. SUMMARY + credentials carousel ───── */}
      <section
        style={{
          minHeight: "100vh",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
          display: "flex",
          flexDirection: "column",
          paddingTop: space.xxl,
        }}
      >
        <div style={{ padding: `0 ${space.xl}px ${space.xl}px` }}>
          <p
            style={{
              fontFamily: AVENIR,
              fontSize: 15,
              fontWeight: 400,
              lineHeight: 1.6,
              margin: 0,
              color: colors.text,
              maxWidth: 760,
            }}
          >
            Executive Producer specialising in photo and video production for luxury and
            lifestyle brands across the US, UK, and GCC. Delivered campaigns for MR PORTER
            (2.65M views on 'In America'), Aman, Nike and Condé Nast, with a $500k+ brand
            partnership framework built inside the Richemont Group. Run an 11-agent AI
            production system that handles estimating, SOWs, and crew logistics end-to-end,
            built to eliminate operational bottlenecks and increase output velocity.
            Production fluency across in-house brand, agency, and editorial.
          </p>
        </div>
        <CredentialsCarousel images={CREDENTIAL_IMAGES} />
      </section>

      {/* ───── 3. BRAND LOGO CAROUSEL ───── */}
      <LogoCarousel logos={BRAND_LOGOS} />

      {/* ───── 4. SHOWREEL ───── */}
      <section
        style={{
          background: "#000",
          padding: 0,
          minHeight: "100vh",
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: `${space.lg}px ${space.xl}px`,
            color: "#fff",
            fontFamily: fonts.sans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          SHOWREEL
        </div>
        <div style={{ width: "100%", aspectRatio: "16 / 9", background: "#000" }}>
          <video
            src="/showreel.mp4"
            poster="/showreel-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </section>

      {/* ───── 5. SELECTED WORK GRID ───── */}
      <section style={{ scrollSnapAlign: "start" }}>
        <div
          style={{
            textAlign: "center",
            padding: `${space.md}px ${space.xl}px`,
            borderTop: `1px solid ${colors.text}`,
            borderBottom: `1px solid ${colors.text}`,
          }}
        >
          <Link
            to="/work"
            style={{
              fontFamily: fonts.sans,
              color: colors.text,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 2,
              fontSize: 13,
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            ALL WORK
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
          }}
        >
          {productionCases.map(study => (
            <GridTile key={study.slug} study={study} />
          ))}
        </div>
      </section>
    </div>
  );
}

function LogoCarousel({ logos }) {
  // Render each logo in a row, then repeat the whole row twice for seamless looping.
  const row = (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 80, paddingRight: 80 }}>
      {logos.map((logo, i) => (
        <span
          key={i}
          style={{
            fontFamily: fonts.sans,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 3,
            color: colors.text,
            whiteSpace: "nowrap",
          }}
        >
          {logo}
        </span>
      ))}
    </div>
  );
  return (
    <section
      style={{
        background: "#fff",
        minHeight: "100vh",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          animation: "logo-slide 60s linear infinite",
          willChange: "transform",
        }}
      >
        {row}
        {row}
      </div>
      <style>{`
        @keyframes logo-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

function GridTile({ study }) {
  return (
    <Link
      to={`/work#${study.slug}`}
      style={{
        position: "relative",
        display: "block",
        aspectRatio: "3 / 4",
        overflow: "hidden",
        background: "#000",
      }}
      onMouseEnter={e => {
        const cap = e.currentTarget.querySelector("[data-cap]");
        if (cap) cap.style.opacity = "1";
      }}
      onMouseLeave={e => {
        const cap = e.currentTarget.querySelector("[data-cap]");
        if (cap) cap.style.opacity = "0";
      }}
    >
      {study.heroImage && (
        <img
          src={study.heroImage}
          alt={study.project}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
      <div
        data-cap
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0) 60%)",
          color: "#fff",
          padding: space.lg,
          display: "flex",
          alignItems: "flex-end",
          opacity: 0,
          transition: "opacity 0.2s",
          fontFamily: fonts.sans,
        }}
      >
        <div>
          <div style={{ fontSize: 11, letterSpacing: 1.5, opacity: 0.8, marginBottom: 4 }}>
            {study.client.toUpperCase()}
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {study.project}
          </div>
        </div>
      </div>
    </Link>
  );
}


function MenuOverlay({ onClose }) {
  const linkStyle = {
    color: "#fff",
    fontFamily: fonts.sans,
    fontSize: 36,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    textDecoration: "none",
    padding: "8px 0",
  };
  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <Link to="/work" style={linkStyle}>Work</Link>
      <Link to="/about" style={linkStyle}>About</Link>
      <Link to="/contact" style={linkStyle}>Contact</Link>
    </div>
  );
}

// Horizontal infinite carousel of credential images, with gaps between each.
function CredentialsCarousel({ images }) {
  const row = (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 32, paddingRight: 32 }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          style={{
            height: "44vh",
            width: "auto",
            objectFit: "cover",
            display: "block",
            background: colors.surface,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          animation: "credentials-slide 70s linear infinite",
          willChange: "transform",
        }}
      >
        {row}
        {row}
      </div>
      <style>{`
        @keyframes credentials-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// Small white dot that follows the cursor. mix-blend-mode: difference inverts
// it automatically — appears black on white sections, white on dark ones.
function CustomCursor() {
  const ref = useRef(null);

  useEffect(() => {
    // Don't render a custom cursor on touch devices.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e) => {
      if (ref.current) {
        ref.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "#fff",
        mixBlendMode: "difference",
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-100px, -100px)",
      }}
    />
  );
}
