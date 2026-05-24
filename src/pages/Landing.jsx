import { useState } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";
import { productionCases } from "../data/work";

const SERVICES = ["PRODUCTION", "VISUAL RESEARCH", "JOURNALISM", "STRATEGY"];

const BRANDS = [
  "Aman", "Bvlgari", "Cartier", "Cipriani", "Condé Nast",
  "Huda Beauty", "J.Crew", "Louis Vuitton", "Lululemon",
  "Mastercard", "MR PORTER", "Net-a-Porter Group",
  "Nike", "One&Only", "Richemont", "Tiffany & Co.",
  "Yasmin Mansour",
];

const PUBLICATIONS = [
  "The Glass Magazine",
  "MR PORTER, The Journal",
  "Trippin",
  "Vogue Arabia",
];

const ACCENT = "#ff5a2a"; // small "+" colour, like Aalto's

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#fff", color: colors.text }}>
      {/* ───── 1. HERO: black, wordmark, showreel ───── */}
      <section
        style={{
          background: "#000",
          color: "#fff",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Showreel */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
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
          <video
            src="/showreel.mp4"
            poster="/showreel-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}
      </section>

      {/* ───── 2. MARQUEE ───── */}
      <Marquee items={SERVICES} />

      {/* ───── 3. SUMMARY ───── */}
      <section
        style={{
          padding: `${space.xxl}px ${space.xl}px ${space.xl}px`,
          maxWidth: 1100,
        }}
      >
        <p
          style={{
            fontFamily: fonts.sans,
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
          built to eliminate operational bottlenecks and increase output velocity. Production
          fluency across in-house brand, agency, and editorial.
        </p>
      </section>

      {/* ───── 4. BRANDS AND PUBLICATIONS ───── */}
      <section
        style={{
          padding: `${space.xl}px ${space.xl}px ${space.xxl}px`,
        }}
      >
        <ListBlock label="BRANDS AND PUBLICATIONS" items={[...BRANDS, ...PUBLICATIONS]} />
      </section>

      {/* ───── 5. SELECTED WORK GRID ───── */}
      <section>
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

function ListBlock({ label, items }) {
  return (
    <div>
      <h3
        style={{
          fontFamily: fonts.sans,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 1.6,
          marginBottom: space.lg,
          color: colors.text,
        }}
      >
        {label}
      </h3>
      <p
        style={{
          fontFamily: fonts.sans,
          fontSize: 15,
          lineHeight: 1.7,
          color: colors.text,
          margin: 0,
        }}
      >
        {items.join(" / ")}
      </p>
    </div>
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

function Marquee({ items }) {
  const segment = items.join("   ·   ");
  // Repeat enough segments to fill the screen + cushion for the slide
  const copies = Array.from({ length: 8 }, (_, i) => (
    <span key={i} style={{ paddingRight: 60 }}>
      {segment}
    </span>
  ));
  return (
    <div
      style={{
        background: "#fff",
        color: colors.text,
        borderTop: `1px solid ${colors.text}`,
        borderBottom: `1px solid ${colors.text}`,
        padding: "16px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "inline-block",
          animation: "marquee-slide 45s linear infinite",
          fontFamily: fonts.sans,
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 2.5,
        }}
      >
        {copies}
      </div>
      <style>{`
        @keyframes marquee-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
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
