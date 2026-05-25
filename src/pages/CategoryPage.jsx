import { Link } from "react-router-dom";
import { colors, space } from "../theme";

const HEROS_FONT = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Hero-only landing page for a single discipline (Production, Cultural Strategy,
// Visual Research). Same hero structure as /work but with no project list
// below it — used as the destination for "View More Work →" links on Landing.
export default function CategoryPage({ label }) {
  return (
    <div style={{ background: colors.bg, color: colors.text, minHeight: "100vh" }}>
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

        {/* Top-left: ← Home + Selected */}
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
          <Link
            to="/"
            className="m-portfolio-label"
            style={{
              display: "inline-block",
              fontFamily: TIMES,
              fontSize: 14,
              fontWeight: 400,
              color: "#fff",
              marginBottom: space.sm,
              marginLeft: 2,
              opacity: 0.95,
              textDecoration: "none",
            }}
          >
            ← Home
          </Link>
          <div
            className="m-hero-title"
            style={{
              fontFamily: HEROS_FONT,
              fontSize: "clamp(44px, 7vw, 100px)",
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            Selected
          </div>
        </div>

        {/* Bottom-right: Projects */}
        <div
          className="m-hero-br m-hero-title"
          style={{
            position: "absolute",
            bottom: space.xl,
            right: space.xl,
            color: "#fff",
            fontFamily: TIMES,
            fontSize: "clamp(44px, 7vw, 100px)",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            zIndex: 5,
          }}
        >
          Projects
        </div>

        {/* Bottom-left: category label */}
        <div
          className="m-hero-bl m-hero-roles"
          style={{
            position: "absolute",
            bottom: space.xl,
            left: space.xl,
            color: "#fff",
            fontFamily: TIMES,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.5,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          {label}
        </div>

        {/* Bottom-center: down arrow (decorative — no section below) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: space.lg,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            fontFamily: HEROS_FONT,
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1,
            zIndex: 4,
          }}
        >
          ↓
        </div>
      </section>
    </div>
  );
}
