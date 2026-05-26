import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { colors, fonts, space, t } from "../theme";
import { productionCases } from "../data/work";
import CustomCursor from "../components/CustomCursor";
import ContactModal from "../components/ContactModal";
import { useIsMobile } from "../hooks/useIsMobile";

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
// Items can be a string OR { src, landscape?, client?, title? }. When client/title
// are set, a dark gradient + label fades in over the image on hover.
const PRODUCTION_IMAGES = [
  { src: "/Production/01.jpg",        client: "VOGUE ARABIA",        title: "March Cover" },
  { src: "/Production/2..mov.mp4",    client: "NIKE",                title: "Vomero 18 Activation" },
  { src: "/Production/3..webp",       client: "MR PORTER",           title: "Finneas" },
  { src: "/Production/4.%20.jpg",     client: "COLUMBIA SPORTSWEAR", title: "Ramadan Campaign" },
  { src: "/Production/5..mp4",        client: "J.CREW",              title: "Abraham Moon" },
  { src: "/Production/6..jpg",        client: "AMAN",                title: "Saudi Arabia & Dubai" },
  { src: "/Production/6..mp4.mp4",    client: "ONE&ONLY",            title: "Moonlight Basin" },
  { src: "/Production/7.mp4",         client: "CIPRIANI",            title: "Mr C Residences Dubai" },
];
const WRITING_IMAGES = [
  { src: "/Cultural%20Strategy/4ba827b33bdd00f5f3f83428a7e1ae3310f31833-4000x3200.avif",                     client: "TRIPPIN",   title: "6 Photographers on Ethical Photography" },
  { src: "/Cultural%20Strategy/w1500_q80%20(1).jpg",                                                          client: "MR PORTER", title: "15 Ways To Improve Your Life, Japanese Style", landscape: true },
  { src: "/Cultural%20Strategy/a3cb25a58717bc13af849caf71d30ea83ccad8f1-3107x3308.avif",                      client: "TRIPPIN",   title: "An Exploration of Mexico Through Graciela Iturbide" },
  { src: "/Cultural%20Strategy/fde0b3f980e5e6973e1feee0c30baa5717e56588-1072x1072.avif",                      client: "TRIPPIN",   title: "A History of Tattooing in Japan" },
  { src: "/Cultural%20Strategy/w1500_q80.jpg",                                                                client: "MR PORTER", title: "Calling All Women" },
  { src: "/Cultural%20Strategy/w1500_q80.jpeg",                                                               client: "MR PORTER", title: "Tee Store", landscape: true },
  { src: "/Cultural%20Strategy/Black%20british%20writersOtamere.jpg",                                         client: "MR PORTER", title: "Black British Writers" },
  { src: "/Cultural%20Strategy/Group_Shot.jpg",                                                                client: "MR PORTER", title: "Pride" },
];
const VISUAL_RESEARCH_IMAGES = [
  { src: "/Visual%20Research/w1500_q80%20(2).jpg", client: "MR PORTER", title: "Eight Striking Images Of New York City Through The Decades" },
  { src: "/Visual%20Research/w1500_q80%20(3).jpg", client: "MR PORTER", title: "The Stylish Gent's Guide To 2022's Freshest Menswear Trends" },
  { src: "/Visual%20Research/w1500_q80%20(4).jpg", client: "MR PORTER", title: "What To Read, Watch And Do This Black History Month UK" },
  { src: "/Visual%20Research/w1500_q80%20(5).jpg", client: "MR PORTER", title: "Five Stylish Summertime Movies To Inspire Your Warm-Weather Wardrobe" },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Heavy/bouncy smooth scroll, long duration + gentle easing.
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
      <CustomCursor enlargeOnHover />
      <style>{`
        .landing-snap, .landing-snap * { cursor: none !important; }
      `}</style>

      {/* + menu, fixed top-right, color-flips across all sections */}
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

      {/* ───── 1. HERO: showreel with editorial cover-spread overlay ───── */}
      <section
        className="m-hero-section"
        style={{
          background: "#000",
          color: "#fff",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Hero showreel video */}
        <video
          src="/showreel.mp4"
          poster="/showreel-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
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
          className="m-hero-tl"
          style={{
            position: "absolute",
            top: space.xl,
            left: space.xl,
            color: "#fff",
            zIndex: 5,
          }}
        >
          <div
            className="m-portfolio-label"
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
            className="m-hero-title"
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
          className="m-hero-br m-hero-title"
          style={{
            position: "absolute",
            bottom: space.xl,
            right: space.xl,
            color: "#fff",
            fontFamily: "'Times New Roman', Times, serif",
            fontStyle: "italic",
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
          className="m-hero-bl m-hero-roles"
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
          Cultural Strategist<br />
          Editorial Consultant
        </div>

        <DownArrow color="#fff" />
      </section>

      {menuOpen && (
        <MenuOverlay
          onClose={() => setMenuOpen(false)}
          onContact={() => { setMenuOpen(false); setContactOpen(true); }}
        />
      )}

      {/* ───── 2. ABOUT (Studio Move-style giant intro paragraph) ───── */}
      <section
        className="m-section m-section-about"
        style={{
          padding: `${space.xxl}px ${space.xl}px ${space.xl}px`,
          display: "grid",
          gridTemplateColumns: "1fr 6fr",
          gap: space.xl,
          alignItems: "start",
          borderBottom: `1px solid ${colors.text}`,
        }}
      >
        <div
          className="m-section-title"
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontStyle: "italic",
            fontSize: "clamp(20px, 2.2vw, 32px)",
            fontWeight: 400,
            color: colors.text,
            lineHeight: 1,
            paddingTop: 8,
          }}
        >
          About
        </div>
        <div>
          <p
            className="m-section-body"
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
            Executive Producer and Consultant specializing in production, strategy
            and visual research for luxury brands across fashion, beauty,
            hospitality and editorial. Tokyo-born, with Japanese-US-UK background
            and industry experience across the US, UK, GCC and Japan. Brand-side
            at <Brand>Net-a-Porter Group</Brand>, producing <Brand>MR PORTER</Brand>'s
            editorial, commercial and brand partnerships. Direct-to-client
            relationships with <Brand>Aman</Brand>, <Brand>One&amp;Only</Brand> and{" "}
            <Brand>Condé Nast</Brand>; production partner to agencies for{" "}
            <Brand>Columbia</Brand>, <Brand>Mastercard</Brand> and{" "}
            <Brand>Nike</Brand>.
          </p>
          <p
            className="m-section-coda"
            style={{
              marginTop: space.lg,
              marginBottom: 0,
              fontFamily: "'Times New Roman', Times, serif",
              fontStyle: "italic",
              fontSize: "clamp(22px, 2.1vw, 32px)",
              fontWeight: 400,
              lineHeight: 1.3,
              color: colors.textMuted,
            }}
          >
            EP, consultancy and advisory engagements across New York, Tokyo, Dubai, and London.
          </p>
        </div>
      </section>

      {/* About link row — same centered/bordered treatment as "View All Work →" */}
      <div
        className="m-link-row"
        style={{
          padding: `${space.md}px ${space.xl}px ${space.md}px`,
          borderBottom: `1px solid ${colors.text}`,
          textAlign: "center",
        }}
      >
        <Link
          to="/about"
          style={{
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: 18,
            fontWeight: 400,
            color: colors.text,
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          About →
        </Link>
      </div>

      <CategorySlide label="PRODUCTION" images={PRODUCTION_IMAGES} viewMoreHref="/production" />
      <CategorySlide label="STRATEGY & EDITORIAL" images={WRITING_IMAGES} compact viewMoreHref="/cultural-strategy" />
      <CategorySlide label="VISUAL RESEARCH" images={VISUAL_RESEARCH_IMAGES} compact landscape viewMoreHref="/visual-research" />

      {/* View all work, small Times link, centered between two lines */}
      <div
        className="m-link-row"
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
        className="m-section"
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
          className="m-section-title"
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
          className="m-section-body"
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
          BRAND PARTNERSHIPS <Brand>Louis Vuitton</Brand>, <Brand>Bvlgari</Brand>,{" "}
          <Brand>Hennessy</Brand>, <Brand>Loro Piana</Brand>, <Brand>Stone Island</Brand>,{" "}
          <Brand>Brunello Cucinelli</Brand>, <Brand>Tiffany & Co.</Brand>,{" "}
          <Brand>The Frankie Shop</Brand>, <Brand>New Balance</Brand>, <Brand>Loewe</Brand>,{" "}
          <Brand>Gucci</Brand>, <Brand>SMR Days</Brand>, <Brand>The Elder Statesman</Brand>,{" "}
          <Brand>Greg Lauren</Brand>, <Brand>Burberry</Brand>, <Brand>Bogner</Brand>. EDITORIAL <Brand>The Glass Magazine</Brand>,{" "}
          <Brand>Vogue Arabia</Brand>, <Brand>Trippin</Brand>,{" "}
          <Brand>MR PORTER The Journal</Brand>, <Brand>MR PORTER The Post</Brand>.
        </p>
      </section>

      {/* Contact, small Times link, centered between two lines. Opens the
          Get-in-Touch modal instead of routing to a dedicated page. */}
      <div
        className="m-link-row"
        style={{
          padding: `${space.md}px ${space.xl}px ${space.md}px`,
          borderBottom: `1px solid ${colors.text}`,
          textAlign: "center",
        }}
      >
        <button
          onClick={() => setContactOpen(true)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: 18,
            fontWeight: 400,
            color: colors.text,
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          Contact →
        </button>
      </div>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}

      <footer
        className="m-category-footer"
        style={{
          padding: `${space.xl}px ${space.xl}px ${space.lg}px`,
          borderTop: `1px solid ${colors.border}`,
          background: colors.bg,
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: 14,
          fontWeight: 400,
          color: colors.textMuted,
          textAlign: "left",
        }}
      >
        © {new Date().getFullYear()} Emily Lucas
      </footer>

    </div>
  );
}


function CategorySlide({ label, images, compact = false, landscape = false, viewMoreHref = "/work" }) {
  // Vertical padding stays constant across all three rows so the gap
  // between them reads as a uniform rhythm — image heights still vary
  // by `compact` / `landscape`, but row-to-row spacing is even.
  const padV = space.md;
  return (
    <section
      className="m-category-slide"
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
          to={viewMoreHref}
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
  const onClick = (e) => {
    const section = e.currentTarget.closest("section");
    const next = section?.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };
  return (
    <button
      onClick={onClick}
      aria-label="Scroll to next section"
      style={{
        position: "absolute",
        bottom: space.lg,
        left: "50%",
        transform: "translateX(-50%)",
        background: "none",
        border: "none",
        padding: 8,
        cursor: "pointer",
        color,
        fontFamily: HEROS,
        fontSize: 18,
        fontWeight: 400,
        lineHeight: 1,
        zIndex: 4,
      }}
    >
      ↓
    </button>
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
            fontFamily: "'Times New Roman', Times, serif",
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
              fontFamily: "'Times New Roman', Times, serif",
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
        /* Container scales in only, no opacity, so the row stagger fade
           below is fully visible instead of being multiplied by the
           container's opacity ramp. */
        @keyframes menu-modal-pop {
          from { transform: scale(0.85); }
          to   { transform: scale(1); }
        }
        /* Local copy of the contact-row-in keyframe, without it, the menu
           items reference an animation name that only exists when the
           ContactModal is also mounted, so they don't fade in. */
        @keyframes contact-row-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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

// Horizontal infinite carousel, fixed-width images, marginRight pattern
// so translateX(-50%) lands exactly on the duplicate boundary (no overlap).
// Shared media element that fades in from opacity 0 once the file is decoded.
// While !loaded, three editorial pulsing dots sit centred in the slot.
function FadeInMedia({ src, width, height, objectFit = "cover", client, title }) {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  const mediaStyle = {
    width: "100%",
    height: "100%",
    objectFit,
    display: "block",
    opacity: loaded ? 1 : 0,
    transition: "opacity 0.5s ease-out",
  };
  const hasLabel = !!(client || title);
  return (
    <div
      onMouseEnter={() => hasLabel && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        height,
        width,
        marginRight: 12,
        background: colors.surface,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {!loaded && <LoadingDots />}
      {isVideo ? (
        <video
          src={src}
          autoPlay muted loop playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          style={mediaStyle}
          draggable={false}
        />
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={mediaStyle}
          draggable={false}
        />
      )}
      {hasLabel && (
        <>
          {/* Dark gradient overlay, fades in on hover */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 100%)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.35s ease",
              pointerEvents: "none",
            }}
          />
          {/* Brand + title block, bottom-left */}
          <div
            style={{
              position: "absolute",
              left: 12,
              bottom: 10,
              color: "#fff",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
              pointerEvents: "none",
              maxWidth: "calc(100% - 24px)",
            }}
          >
            {client && (
              <div
                style={{
                  fontFamily: HEROS,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  lineHeight: 1.2,
                  marginBottom: 2,
                }}
              >
                {client}
              </div>
            )}
            {title && (
              <div
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  fontStyle: "italic",
                  fontSize: 13,
                  fontWeight: 400,
                  lineHeight: 1.25,
                }}
              >
                {title}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Three pulsing dots, staggered, minimal editorial loader.
function LoadingDots() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        pointerEvents: "none",
      }}
    >
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: colors.textMuted,
            animation: `dot-pulse 1.2s ${i * 0.18}s ease-in-out infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes dot-pulse {
          0%, 80%, 100% { opacity: 0.15; transform: scale(0.8); }
          40%           { opacity: 0.9;  transform: scale(1);   }
        }
      `}</style>
    </div>
  );
}

function CredentialsCarousel({ images, compact = false, landscape = false }) {
  const doubled = [...images, ...images];
  const h = compact ? 240 : 420;
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, offset: 0 });

  // JS-driven auto-drift + drag. rAF runs continuously; when draggingRef is
  // true, the loop skips the auto-decrement so user pointer motion fully
  // controls offset. Wraps in [-halfWidth, 0] so duplicate halves stitch
  // seamlessly.
  useEffect(() => {
    if (!trackRef.current) return;
    const measure = () => {
      if (trackRef.current) halfWidthRef.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);
    // Re-measure after images decode (initial scrollWidth often comes back short)
    const re1 = setTimeout(measure, 500);
    const re2 = setTimeout(measure, 1500);

    let rafId;
    let lastTime = performance.now();
    const tick = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      const hw = halfWidthRef.current;
      if (!draggingRef.current && hw > 0) {
        const pxPerSec = hw / 70; // matches the previous 70s loop
        offsetRef.current -= pxPerSec * dt;
      }
      if (hw > 0) {
        while (offsetRef.current <= -hw) offsetRef.current += hw;
        while (offsetRef.current > 0) offsetRef.current -= hw;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
      clearTimeout(re1);
      clearTimeout(re2);
    };
  }, []);

  const onPointerDown = (e) => {
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX, offset: offsetRef.current };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const delta = e.clientX - dragStartRef.current.x;
    offsetRef.current = dragStartRef.current.offset + delta;
  };
  const onPointerUp = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    e.currentTarget?.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      className={`m-carousel${landscape ? " m-carousel-landscape" : ""}`}
      style={{ overflow: "hidden", width: "100%", touchAction: "pan-y" }}
    >
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          display: "flex",
          width: "max-content",
          willChange: "transform",
          cursor: "grab",
          userSelect: "none",
          touchAction: "pan-y",
        }}
      >
        {doubled.map((item, i) => {
          const isObj = typeof item !== "string";
          const src = isObj ? item.src : item;
          const itemLandscape = isObj ? (item.landscape ?? landscape) : landscape;
          const w = itemLandscape ? 360 : compact ? 180 : 320;
          return (
            <FadeInMedia
              key={i}
              src={src}
              width={w}
              height={h}
              objectFit="cover"
              client={isObj ? item.client : undefined}
              title={isObj ? item.title : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}

// Small white dot that follows the cursor. mix-blend-mode: difference inverts
// it automatically, appears black on white sections, white on dark ones.
