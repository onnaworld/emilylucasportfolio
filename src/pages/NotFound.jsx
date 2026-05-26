import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";

const HEROS = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Real 404 page (no longer falling back to Landing). Matches the
// minimal language of the rest of the site: top + bottom hairlines,
// big TeX Gyre Heros title, Times italic links back into the site.
export default function NotFound() {
  return (
    <div
      className="page-fade-in"
      style={{
        background: colors.bg,
        color: colors.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <PlusMenu />

      <div style={{ borderTop: `1px solid ${colors.text}`, width: "100%" }} />

      <main
        style={{
          flex: 1,
          padding: `${space.xl}px ${space.xl}px`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          maxWidth: "min(960px, 92%)",
        }}
      >
        <h1
          style={{
            fontFamily: HEROS,
            fontWeight: 700,
            fontSize: "clamp(56px, 8vw, 128px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            margin: 0,
            color: colors.text,
          }}
        >
          404
        </h1>
        <p
          style={{
            fontFamily: TIMES,
            fontStyle: "italic",
            fontSize: "clamp(18px, 1.6vw, 24px)",
            fontWeight: 400,
            color: colors.textMuted,
            marginTop: space.lg,
            marginBottom: 0,
          }}
        >
          This page doesn&rsquo;t exist.
        </p>
        <nav
          style={{
            marginTop: space.xl,
            display: "flex",
            flexDirection: "column",
            gap: space.sm,
          }}
        >
          <Link to="/" className="hover-text" style={{ fontFamily: TIMES, fontSize: 18, color: colors.text, textDecoration: "none" }}>
            ← Back to Home
          </Link>
          <Link to="/work" className="hover-text" style={{ fontFamily: TIMES, fontSize: 18, color: colors.text, textDecoration: "none" }}>
            View All Work →
          </Link>
        </nav>
      </main>

      <footer
        style={{
          padding: `${space.md}px ${space.xl}px`,
          borderTop: `1px solid ${colors.text}`,
          fontFamily: TIMES,
          fontSize: 14,
          color: colors.textMuted,
        }}
      >
        © {new Date().getFullYear()} Emily Lucas
      </footer>
    </div>
  );
}
