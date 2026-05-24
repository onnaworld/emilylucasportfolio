import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
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
const IMPACT = "'Impact', 'Helvetica Neue Condensed Bold', 'Arial Narrow', sans-serif";
const HEROS = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";

// Per-section work imagery (URL-encoded spaces in folder names)
const PRODUCTION_IMAGES = [
  "/Production/01.jpg",
  "/Production/2..mov.gif",
  "/Production/3..webp",
  "/Production/4.%20.jpg",
  "/Production/5..mp4",
  "/Production/6..jpg",
  "/Production/6..mp4.gif",
  "/Production/7.gif",
];
// Items can be a string OR { src, landscape? } so individual images can opt
// into a wider crop without changing the rest of the row.
const WRITING_IMAGES = [
  "/Cultural%20Strategy/4ba827b33bdd00f5f3f83428a7e1ae3310f31833-4000x3200.avif",
  { src: "/Cultural%20Strategy/w1500_q80%20(1).jpg", landscape: true },
  "/Cultural%20Strategy/a3cb25a58717bc13af849caf71d30ea83ccad8f1-3107x3308.avif",
  "/Cultural%20Strategy/fde0b3f980e5e6973e1feee0c30baa5717e56588-1072x1072.avif",
  "/Cultural%20Strategy/w1500_q80.jpg",
  { src: "/Cultural%20Strategy/w1500_q80.jpeg", landscape: true },
  "/Cultural%20Strategy/Black%20british%20writersOtamere.jpg",
  "/Cultural%20Strategy/Group_Shot.jpg",
];
const VISUAL_RESEARCH_IMAGES = [
  "/Visual%20Research/w1500_q80%20(2).jpg",
  "/Visual%20Research/w1500_q80%20(3).jpg",
  "/Visual%20Research/w1500_q80%20(4).jpg",
  "/Visual%20Research/w1500_q80%20(5).jpg",
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Heavy/bouncy smooth scroll — long duration + gentle easing.
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 1.3,
      touchMultiplier: 1.6,
    });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      className="landing-snap"
      style={{
        background: "#fff",
        color: colors.text,
        scrollBehavior: "smooth",
      }}
    >
      <CustomCursor />
      <style>{`
        .landing-snap, .landing-snap * { cursor: none !important; }
      `}</style>

      {/* + menu — fixed top-right, color-flips across all sections */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Menu"
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
        }}
      >
        {menuOpen ? "×" : "+"}
      </button>

      {/* ───── 1. HERO: showreel with editorial cover-spread overlay ───── */}
      <section
        style={{
          background: "#000",
          color: "#fff",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
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

        {/* Top-left: Portfolio 2026 (above) + Emily */}
        <div
          style={{
            position: "absolute",
            top: space.xl,
            left: space.xl,
            color: "#fff",
            zIndex: 5,
          }}
        >
          <div
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: 0,
              marginBottom: space.sm,
              marginLeft: 2,
              opacity: 0.95,
            }}
          >
            Portfolio 2026
          </div>
          <div
            style={{
              fontFamily: HEROS,
              fontSize: "clamp(44px, 7vw, 100px)",
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              margin: 0,
            }}
          >
            Emily
          </div>
        </div>

        {/* Bottom-right: Lucas */}
        <div
          style={{
            position: "absolute",
            bottom: space.xl,
            right: space.xl,
            color: "#fff",
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: "clamp(44px, 7vw, 100px)",
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            zIndex: 5,
          }}
        >
          Lucas
        </div>

        {/* Bottom-left: role list */}
        <div
          style={{
            position: "absolute",
            bottom: space.xl,
            left: space.xl,
            color: "#fff",
            fontFamily: "'Times New Roman', Times, serif",
            fontStyle: "italic",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.5,
            letterSpacing: 0,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          Executive Producer<br />
          Cultural Consultant<br />
          Visual Researcher
        </div>

        <DownArrow color="#fff" />
      </section>

      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}

      {/* ───── 2. ABOUT (Studio Move-style giant intro paragraph) ───── */}
      <section
        style={{
          padding: `${space.xxl}px ${space.xl}px ${space.xxl}px`,
          display: "grid",
          gridTemplateColumns: "1fr 6fr",
          gap: space.xl,
          alignItems: "start",
          borderBottom: `1px solid ${colors.text}`,
        }}
      >
        <div
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontStyle: "italic",
            fontSize: "clamp(28px, 3.4vw, 48px)",
            fontWeight: 400,
            color: colors.text,
            lineHeight: 1,
            paddingTop: 8,
          }}
        >
          About
        </div>
        <p
          style={{
            fontFamily: HEROS,
            fontSize: "clamp(20px, 2.6vw, 42px)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            margin: 0,
            color: colors.text,
          }}
        >
          Executive Producer specialising in luxury campaigns across fashion,
          beauty, hospitality and editorial. Tokyo-born, with Japanese-US-UK
          heritage and fluency across the US, UK, GCC and Japan. After{" "}
          <Brand>Net-a-Porter Group</Brand> — <Brand>MR PORTER</Brand>'s
          'In America', tier 1 talent shoots, inaugural brand partnerships —
          building client relationships with <Brand>Aman</Brand>,{" "}
          <Brand>One&amp;Only</Brand> and <Brand>Condé Nast</Brand>, and
          agency-side with <Brand>Omnicom</Brand>, <Brand>IMA</Brand>,{" "}
          <Brand>Noe &amp; Associates</Brand> and <Brand>Free Practice</Brand>.
          Integrating AI agents and tools across budget estimating, SOWs and
          crew/vendor management.
        </p>
      </section>

      <CategorySlide label="PRODUCTION" images={PRODUCTION_IMAGES} />
      <CategorySlide label="CULTURAL STRATEGY & COMMENTARY" images={WRITING_IMAGES} compact />
      <CategorySlide label="VISUAL RESEARCH" images={VISUAL_RESEARCH_IMAGES} compact landscape />

      {/* View all work — small Times link, centered between two lines */}
      <div
        style={{
          padding: `${space.md}px ${space.xl}px ${space.md}px`,
          borderBottom: `1px solid ${colors.text}`,
          textAlign: "center",
        }}
      >
        <Link
          to="/work"
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: 18,
            fontWeight: 400,
            color: colors.text,
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          View All Work →
        </Link>
      </div>

      {/* ───── BRANDS (formatted like ABOUT) ───── */}
      <section
        style={{
          padding: `${space.xxl}px ${space.xl}px ${space.xxl}px`,
          display: "grid",
          gridTemplateColumns: "1fr 6fr",
          gap: space.xl,
          alignItems: "start",
          borderBottom: `1px solid ${colors.text}`,
        }}
      >
        <div
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontStyle: "italic",
            fontSize: "clamp(28px, 3.4vw, 48px)",
            fontWeight: 400,
            color: colors.text,
            lineHeight: 1,
            paddingTop: 8,
          }}
        >
          Brands
        </div>
        <p
          style={{
            fontFamily: HEROS,
            fontSize: "clamp(20px, 2.6vw, 42px)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            margin: 0,
            color: colors.text,
          }}
        >
          COMMERCIAL <Brand>Aman</Brand>, <Brand>Nike</Brand>,{" "}
          <Brand>MR PORTER</Brand>, <Brand>Jumeirah</Brand>, <Brand>Janu</Brand>,{" "}
          <Brand>Cipriani</Brand>, <Brand>Anantara</Brand>, <Brand>Emirates</Brand>,{" "}
          <Brand>Siro Hotel</Brand>, <Brand>Charlotte Tilbury</Brand>,{" "}
          <Brand>Columbia Sportswear</Brand>, <Brand>Harvey Nichols</Brand>,{" "}
          <Brand>Mastercard</Brand>, <Brand>J.Crew</Brand>, <Brand>GUESS</Brand>,{" "}
          <Brand>The Fold</Brand>, <Brand>Hamilton Watches</Brand>, <Brand>Puma</Brand>.{" "}
          PARTNERSHIPS <Brand>Louis Vuitton</Brand>, <Brand>Bvlgari</Brand>,{" "}
          <Brand>Hennessy</Brand>, <Brand>Loro Piana</Brand>, <Brand>Stone Island</Brand>,{" "}
          <Brand>Brunello Cucinelli</Brand>, <Brand>Tiffany & Co.</Brand>,{" "}
          <Brand>The Frankie Shop</Brand>, <Brand>New Balance</Brand>, <Brand>Loewe</Brand>,{" "}
          <Brand>Gucci</Brand>, <Brand>SMR Days</Brand>, <Brand>The Elder Statesman</Brand>,{" "}
          <Brand>Greg Lauren</Brand>, <Brand>INCOTEX</Brand>, <Brand>Burberry</Brand>,{" "}
          <Brand>Bogner</Brand>. EDITORIAL <Brand>The Glass Magazine</Brand>,{" "}
          <Brand>Vogue Arabia</Brand>, <Brand>Trippin</Brand>,{" "}
          <Brand>MR PORTER The Journal</Brand>, <Brand>MR PORTER The Post</Brand>.
        </p>
      </section>

      {/* Contact — small Times link, centered between two lines (mirrors View All Work) */}
      <div
        style={{
          padding: `${space.md}px ${space.xl}px ${space.md}px`,
          borderBottom: `1px solid ${colors.text}`,
          textAlign: "center",
        }}
      >
        <Link
          to="/contact"
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: 18,
            fontWeight: 400,
            color: colors.text,
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          Contact →
        </Link>
      </div>

    </div>
  );
}

function CategorySlide({ label, images, compact = false, landscape = false }) {
  const padV = compact ? space.sm : space.md;
  return (
    <section
      style={{
        padding: `${padV}px ${space.xl}px ${padV}px`,
        borderBottom: `1px solid ${colors.text}`,
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: space.md,
        alignItems: "end",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        <div
          style={{
            fontFamily: HEROS,
            fontSize: 12,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1,
            color: colors.text,
            marginBottom: space.sm,
          }}
        >
          {label}
        </div>
        <Link
          to="/work"
          style={{
            fontFamily: HEROS,
            fontSize: 13,
            fontWeight: 400,
            color: colors.text,
            letterSpacing: "-0.01em",
          }}
        >
          View More Work →
        </Link>
      </div>
      <CredentialsCarousel images={images} compact={compact} landscape={landscape} />
    </section>
  );
}

function DownArrow({ color }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: space.lg,
        left: 0,
        right: 0,
        textAlign: "center",
        color,
        fontFamily: HEROS,
        fontSize: 18,
        fontWeight: 400,
        lineHeight: 1,
        pointerEvents: "none",
        zIndex: 4,
      }}
    >
      ↓
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
        padding: `${space.xxl}px 0`,
        borderBottom: `1px solid ${colors.text}`,
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
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.92)",
        zIndex: 90,
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

// Inline brand-name treatment: italic Times, slightly larger so the names pop.
function Brand({ children }) {
  return (
    <em
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "1.05em",
        letterSpacing: 0,
        textTransform: "none",
      }}
    >
      {children}
    </em>
  );
}

// Horizontal infinite carousel — fixed-width images, marginRight pattern
// so translateX(-50%) lands exactly on the duplicate boundary (no overlap).
function CredentialsCarousel({ images, compact = false, landscape = false }) {
  const doubled = [...images, ...images];
  const h = compact ? 240 : 420;
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: "credentials-slide 70s linear infinite",
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => {
          const src = typeof item === "string" ? item : item.src;
          const itemLandscape = typeof item === "string" ? landscape : (item.landscape ?? landscape);
          const w = itemLandscape ? 360 : compact ? 180 : 320;
          const isVideo = /\.(mp4|webm|mov)$/i.test(src);
          const sharedStyle = {
            height: h,
            width: w,
            marginRight: 12,
            objectFit: "cover",
            display: "block",
            background: colors.surface,
            flexShrink: 0,
          };
          return isVideo ? (
            <video
              key={i}
              src={src}
              autoPlay
              muted
              loop
              playsInline
              style={sharedStyle}
            />
          ) : (
            <img
              key={i}
              src={src}
              alt=""
              loading="lazy"
              style={sharedStyle}
            />
          );
        })}
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
