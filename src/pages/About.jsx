import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";
import ContactModal from "../components/ContactModal";
import RouteMeta from "../components/RouteMeta";

const HEROS = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";
const HINOMARU = "#BC002D";

// Vertical breathing room between top/bottom hairlines and the
// content/contact rows. Used twice so the spacing reads symmetric.
const RAIL_PAD = "clamp(20px, 2.4vw, 36px)";

function SectionHeading({ children }) {
  return (
    <div
      style={{
        fontFamily: TIMES,
        fontStyle: "italic",
        fontSize: "clamp(16px, 1.3vw, 20px)",
        fontWeight: 400,
        textTransform: "none",
        letterSpacing: 0,
        lineHeight: 1,
        color: colors.text,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  );
}

function DotItem({ children }) {
  return (
    <li
      style={{
        display: "flex",
        gap: 10,
        alignItems: "baseline",
        marginBottom: 4,
        fontFamily: HEROS,
        fontStyle: "normal",
        fontSize: "clamp(13px, 0.95vw, 16px)",
        fontWeight: 400,
        lineHeight: 1.3,
        color: colors.text,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: HINOMARU,
          alignSelf: "center",
          transform: "translateY(-1px)",
        }}
      />
      <span>{children}</span>
    </li>
  );
}

export default function About() {
  const [contactOpen, setContactOpen] = useState(false);

  // Lock body/html scroll while About is mounted — the page is designed
  // to live entirely on one screen with no scrollbar of any kind.
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  // + button position is now handled globally by PlusMenu — open state
  // animates into the modal corner. The previous About-specific
  // imperative overrides aren't needed.

  return (
    <div
      className="about-page page-fade-in"
      style={{
        background: colors.bg,
        color: colors.text,
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RouteMeta
        path="/about"
        title="About | Emily Lucas | Creative Producer & Strategist"
        description="Multidisciplinary creative specializing in production, strategy and visual research for luxury brands across fashion, beauty, hospitality and editorial. Tokyo-born, Japanese-US-UK heritage, industry experience across the US, UK, GCC and Japan. Brand-side at Net-a-Porter Group; direct-to-client with Aman, One&Only and Condé Nast; agency partner for Columbia, Mastercard and Nike."
        image="/hero.jpg"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          mainEntity: {
            "@type": "Person",
            name: "Emily Lucas",
            jobTitle: "Creative Producer & Strategist",
            url: "https://emilyelucas.com/about",
            image: "https://emilyelucas.com/hero.jpg",
            sameAs: ["https://www.linkedin.com/in/emilyelucas/"],
            email: "emily@emilyelucas.com",
            alumniOf: [
              { "@type": "Organization", name: "Harvey Nichols" },
              { "@type": "Organization", name: "MR PORTER, Net-a-Porter Group" },
            ],
          },
        }}
      />
      <style>{`
        .about-page, .about-page * { cursor: none !important; }
      `}</style>
      {/* CustomCursor mounted globally in App.jsx */}
      <PlusMenu />

      {/* Top row: ← Home (left). + lives in PlusMenu (fixed top-right).
          Desktop: pull + up so its centre aligns with the ← Home baseline.
          Mobile alignment lives in index.html (inside the mobile @media
          block — Safari sometimes ignores nested @media inside injected
          style tags, so it's safer kept in the static head CSS). */}
      <style>{`
        /* About header is just one 14px text line (← Home) — the default
           + position sits visually far below it. Pull the CLOSED-state +
           up on desktop so its glyph centre lines up with ← Home.
           Scoped to [aria-expanded="false"] so the open-state inline
           top:60 (slide into modal corner) still wins. Mobile uses the
           global .m-plus rules in index.html. */
        @media (min-width: 769px) {
          .about-page .m-plus[aria-expanded="false"] { top: -8px !important; }
        }
        @keyframes about-fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .about-fade-in {
          animation: about-fade-in 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        /* Mobile: skip the per-element stagger — it stacks on top of
           the page-fade-in transform and creates a visible double-bump
           on the smaller viewport. Page-level fade alone is enough. */
        @media (max-width: 768px) {
          .about-fade-in {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
      <div
        className="m-about-header"
        style={{
          padding: `${space.md}px ${space.xl}px ${space.md + 4}px`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          className="hover-text"
          style={{
            fontFamily: TIMES,
            fontSize: 14,
            fontWeight: 400,
            color: colors.text,
            textDecoration: "none",
          }}
        >
          ← Home
        </Link>
      </div>

      {/* Top hairline — sits below ← Home and + */}
      <div style={{ borderTop: `1px solid ${colors.text}`, width: "100%" }} />

      {/* Main content body — fills the remaining viewport */}
      <div
        className="m-about-body"
        style={{
          flex: 1,
          minHeight: 0,
          padding: `${RAIL_PAD} ${space.xl}px`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* About title */}
        <h1
          className="m-about-title about-fade-in"
          style={{
            fontFamily: HEROS,
            fontWeight: 700,
            fontSize: "clamp(56px, 7.5vw, 112px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            margin: 0,
            color: colors.text,
            animationDelay: "60ms",
          }}
        >
          About
        </h1>

        {/* Bio paragraph — same maxWidth as the grid below so the
            right edges of bio and bullets columns line up. */}
        <p
          className="m-about-bio about-fade-in"
          style={{
            fontFamily: HEROS,
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "clamp(16px, 1.35vw, 21px)",
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            color: colors.text,
            margin: `clamp(40px, 4.5vw, 72px) 0 0`,
            maxWidth: "min(1180px, 92%)",
            animationDelay: "180ms",
          }}
        >
          Multidisciplinary creative specializing in production,
          strategy and visual research for luxury brands across
          fashion, beauty, hospitality and editorial. Tokyo-born,
          with Japanese-US-UK heritage and industry experience across
          the US, UK, GCC and Japan. Brand-side at Net-a-Porter
          Group, producing MR PORTER's editorial, commercial and
          brand partnerships. Direct-to-client relationships with
          Aman, One&Only and Condé Nast; production partner to
          agencies for Columbia, Mastercard and Nike.
        </p>

        {/* Contact link — marginTop:auto pushes it to the bottom of the
            flex content rail, just above the footer hairline. */}
        <div className="m-about-contact about-fade-in" style={{ marginTop: "auto", paddingTop: "clamp(28px, 3.5vw, 48px)", animationDelay: "460ms" }}>
          <button
            onClick={() => setContactOpen(true)}
            className="hover-text"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: TIMES,
              fontStyle: "italic",
              fontSize: "clamp(16px, 1.2vw, 20px)",
              fontWeight: 400,
              color: colors.text,
              cursor: "pointer",
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            Contact →
          </button>
        </div>
      </div>

      {/* Bottom hairline + © footer — hairline matches the top hairline
          (1px solid colors.text) so the two read as a matched pair. */}
      <footer
        className="m-about-footer"
        style={{
          padding: `${space.md}px ${space.xl}px`,
          borderTop: `1px solid ${colors.text}`,
          background: colors.bg,
          fontFamily: TIMES,
          fontSize: 14,
          fontWeight: 400,
          color: colors.textMuted,
          textAlign: "left",
        }}
      >
        © {new Date().getFullYear()} Emily Lucas
      </footer>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}
