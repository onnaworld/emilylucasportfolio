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
const IMPACT = "'Impact', 'Helvetica Neue Condensed Bold', 'Arial Narrow', sans-serif";
const HEROS = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";

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
        background: "#fff",
        color: colors.text,
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

        {/* Bottom-center: Scroll Down */}
        <div
          style={{
            position: "absolute",
            bottom: space.xl,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#fff",
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: 0,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          Scroll Down
        </div>
      </section>

      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}

      {/* ───── 2. ABOUT row: label + role list LEFT, summary RIGHT ───── */}
      <section
        style={{
          padding: `${space.xl}px ${space.xl}px ${space.lg}px`,
          borderBottom: `1px solid ${colors.text}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: space.xl,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: HEROS,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                marginBottom: space.lg,
                color: colors.text,
              }}
            >
              ABOUT
            </div>
            <h2
              style={{
                fontFamily: "'Times New Roman', Times, serif",
                fontSize: 14,
                fontWeight: 400,
                letterSpacing: 0,
                lineHeight: 1.5,
                margin: 0,
                color: colors.text,
              }}
            >
              Executive Producer<br />
              Cultural Consultant<br />
              Visual Researcher
            </h2>
          </div>
          <div>
            <p
              style={{
                fontFamily: HEROS,
                fontSize: 15,
                fontWeight: 700,
                lineHeight: 1.5,
                margin: 0,
                color: colors.text,
                maxWidth: 820,
              }}
            >
              Executive Producer specialising in photo and video production for luxury and
              lifestyle brands across the US, UK, and GCC. Delivered campaigns for{" "}
              <Brand>MR PORTER</Brand> (2.65M views on 'In America'),{" "}
              <Brand>Aman</Brand>, <Brand>Nike</Brand> and{" "}
              <Brand>Condé Nast</Brand>, with a $500k+ brand partnership framework built
              inside the <Brand>Richemont Group</Brand>. Run an 11-agent AI production
              system that handles estimating, SOWs, and crew logistics end-to-end, built
              to eliminate operational bottlenecks and increase output velocity. Production
              fluency across in-house brand, agency, and editorial.
            </p>
          </div>
        </div>
      </section>

      {/* ───── 3. BRANDS & COLLABORATORS ───── */}
      <section
        style={{
          padding: `${space.xl}px ${space.xl}px ${space.xl}px`,
          borderBottom: `1px solid ${colors.text}`,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: space.xl,
            alignItems: "start",
          }}
        >
          <div
            style={{
              fontFamily: HEROS,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: colors.text,
            }}
          >
            BRANDS &amp; COLLABORATORS
          </div>
          <p
            style={{
              fontFamily: HEROS,
              fontSize: 15,
              fontWeight: 700,
              lineHeight: 1.6,
              color: colors.text,
              maxWidth: 820,
              margin: 0,
            }}
          >
            Commercial:{" "}
            <Brand>
              Aman, Nike, MR PORTER, Jumeirah, Janu, Cipriani, Anantara, Emirates,
              Siro Hotel, Charlotte Tillbury, Columbia Sportswear, Harvey Nichols,
              Mastercard, J.Crew, GUESS, The Fold, Hamilton Watches, Puma
            </Brand>
            . Partnerships:{" "}
            <Brand>
              Louis Vuitton, Bvlgari, Hennessy, Loro Piana, Stone Island, Brunello
              Cucinneli, Tiffany &amp; Co., The Frankie Shop, New Balance, Loewe,
              Gucci, SMR Days, The Elder Statesman, Greg Lauren, INCOTEX, Gucci,
              Burberry, Bogner
            </Brand>
            . Editorial:{" "}
            <Brand>
              The Glass Magazine, Vogue Arabia, Trippin, MR PORTER The Journal, MR
              PORTER The Post
            </Brand>
            .
          </p>
        </div>
      </section>

      {/* ───── 4. PRODUCTION row: label + view-more LEFT, image strip RIGHT ───── */}
      <section
        style={{
          padding: `${space.xl}px ${space.xl}px ${space.xl}px`,
          borderBottom: `1px solid ${colors.text}`,
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: space.xl,
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: HEROS,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              marginBottom: space.xl,
              color: colors.text,
            }}
          >
            PRODUCTION
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
            View More →
          </Link>
        </div>
        <CredentialsCarousel images={CREDENTIAL_IMAGES} />
      </section>

      {/* ───── 4. WRITING & CULTURAL COMMENTARY row ───── */}
      <section
        style={{
          padding: `${space.xl}px ${space.xl}px ${space.xl}px`,
          borderBottom: `1px solid ${colors.text}`,
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: space.xl,
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: HEROS,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              marginBottom: space.xl,
              color: colors.text,
            }}
          >
            WRITING &amp; CULTURAL COMMENTARY
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
            View More →
          </Link>
        </div>
        <CredentialsCarousel images={CREDENTIAL_IMAGES} />
      </section>

      {/* ───── 5. VISUAL RESEARCH row ───── */}
      <section
        style={{
          padding: `${space.xl}px ${space.xl}px ${space.xl}px`,
          borderBottom: `1px solid ${colors.text}`,
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: space.xl,
          alignItems: "start",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: HEROS,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              marginBottom: space.xl,
              color: colors.text,
            }}
          >
            VISUAL RESEARCH
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
            View More →
          </Link>
        </div>
        <CredentialsCarousel images={CREDENTIAL_IMAGES} />
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
        fontSize: "1.12em",
        letterSpacing: 0,
      }}
    >
      {children}
    </em>
  );
}

// Horizontal infinite carousel of credential images, with gaps between each.
function CredentialsCarousel({ images }) {
  const row = (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 16, paddingRight: 16 }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          loading="lazy"
          style={{
            height: 420,
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
