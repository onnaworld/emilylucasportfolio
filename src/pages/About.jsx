import { useEffect } from "react";
import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";
import CustomCursor from "../components/CustomCursor";

const HEROS = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Placeholder About page — chrome and footer in place, body intentionally
// minimal so Emily can fill in the copy / imagery without scaffolding work.
export default function About() {
  // Same cursor + chrome pattern as the category pages.
  return (
    <div className="about-page" style={{ background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <style>{`
        .about-page, .about-page * { cursor: none !important; }
      `}</style>
      <CustomCursor enlargeOnHover />
      <PlusMenu />

      <section
        style={{
          minHeight: "calc(100vh - 80px)",
          padding: `${space.xxl}px ${space.xl}px ${space.xxl}px`,
          display: "grid",
          gridTemplateColumns: "1fr 6fr",
          gap: space.xl,
          alignItems: "start",
        }}
        className="m-section"
      >
        <div
          className="m-section-title"
          style={{
            fontFamily: TIMES,
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
        <div>
          <Link
            to="/"
            style={{
              display: "inline-block",
              fontFamily: TIMES,
              fontSize: 14,
              fontWeight: 400,
              color: colors.textMuted,
              textDecoration: "none",
              marginBottom: space.lg,
            }}
          >
            ← Home
          </Link>
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
            {/* Placeholder — fill in About copy. */}
          </p>
        </div>
      </section>

      <footer
        className="m-category-footer"
        style={{
          padding: `${space.xl}px ${space.xl}px ${space.lg}px`,
          borderTop: `1px solid ${colors.border}`,
          background: colors.bg,
          fontFamily: TIMES,
          fontSize: 14,
          fontWeight: 400,
          color: colors.textMuted,
        }}
      >
        © {new Date().getFullYear()} Emily Lucas
      </footer>
    </div>
  );
}
