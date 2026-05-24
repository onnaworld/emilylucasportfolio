import { Link } from "react-router-dom";
import { colors, space } from "../theme";

const HEROS_FONT = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

const PROJECTS = [
  { n: 1, title: "Vogue Arabia" },
  { n: 2, title: "Aman" },
  { n: 3, title: "MR PORTER" },
  { n: 4, title: "One&Only" },
  { n: 5, title: "Cipriani" },
  { n: 6, title: "Columbia Sportswear" },
  { n: 7, title: "Mastercard" },
  { n: 8, title: "Nike" },
  { n: 10, title: "J.Crew" },
  { n: 11, title: "Charlotte Tilbury" },
  { n: 12, title: "Louis Vuitton x The Glass Magazine" },
  { n: 13, title: "Trippin: Through the Lens" },
  { n: 14, title: "An Exploration of Mexico Through the Lens of Graciela Iturbide" },
  { n: 15, title: "A History of Tattooing in Japan" },
  { n: 16, title: "MR PORTER: The Stylish Gent's Guide To 2022's Freshest Menswear Trends" },
  { n: 17, title: "Why You Should Shop (For Yourself) On MR PORTER" },
  { n: 18, title: "15 Ways To Improve Your Life, Japanese Style" },
  { n: 19, title: "Meet The Next Generation Of Black British Writers Telling Stories With Style" },
  { n: 20, title: "Feels On Wheels: Why Roller-Skating Is Like Therapy" },
  { n: 21, title: "MR PORTER Social Pride Takeover" },
  { n: 24, title: "MR PORTER Helping Hands" },
  { n: 25, title: "Ask MR PORTER" },
  { n: 26, title: "Eight Striking Images Of New York City Through The Decades" },
  { n: 27, title: "Five Ways To Freshen Up Your Work Wardrobe In 2020" },
  { n: 28, title: "Five Stylish Summertime Movies To Inspire Your Warm-Weather Wardrobe" },
  { n: 29, title: "What To Read, Watch And Do This Black History Month UK" },
];

export default function Work() {
  return (
    <div style={{ minHeight: "100vh", background: colors.bg, color: colors.text, position: "relative" }}>
      {/* Fixed nav — color-flips across dark hero and light content via mix-blend-mode */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: space.xl,
          left: space.xl,
          zIndex: 100,
          color: "#fff",
          mixBlendMode: "difference",
          fontFamily: TIMES,
          fontSize: 14,
          fontWeight: 400,
          opacity: 0.95,
          textDecoration: "none",
        }}
      >
        ← Home
      </Link>

      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 24,
          right: space.xl,
          zIndex: 100,
          color: "#fff",
          mixBlendMode: "difference",
          fontFamily: HEROS_FONT,
          fontSize: 56,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        +
      </div>

      <WorkHero />
      <ProjectList />
    </div>
  );
}

function WorkHero() {
  return (
    <section
      style={{
        background: "#000",
        color: "#fff",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
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

      {/* Top-left: Selected (← Home is now fixed at the page level) */}
      <div
        style={{
          position: "absolute",
          top: space.xl,
          left: space.xl,
          color: "#fff",
          zIndex: 5,
          paddingTop: 32,
        }}
      >
        <div
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

      {/* Bottom-left: All Work */}
      <div
        style={{
          position: "absolute",
          bottom: space.xl,
          left: space.xl,
          color: "#fff",
          fontFamily: TIMES,
          fontStyle: "italic",
          fontSize: 14,
          fontWeight: 400,
          lineHeight: 1.5,
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        All Work
      </div>

      {/* Bottom-center: down arrow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: space.lg,
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#fff",
          fontFamily: HEROS_FONT,
          fontSize: 18,
          fontWeight: 400,
          lineHeight: 1,
          pointerEvents: "none",
          zIndex: 4,
        }}
      >
        ↓
      </div>
    </section>
  );
}

function ProjectList() {
  return (
    <section style={{ padding: `${space.xxl}px ${space.xl}px ${space.xxl}px` }}>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, maxWidth: 760 }}>
        {PROJECTS.map(p => (
          <li
            key={p.n}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: space.lg,
              padding: "10px 0",
              borderBottom: `1px solid ${colors.border}`,
            }}
          >
            <span
              style={{
                fontFamily: HEROS_FONT,
                fontSize: 14,
                fontWeight: 400,
                color: colors.textMuted,
                width: 40,
                flexShrink: 0,
              }}
            >
              {String(p.n).padStart(2, "0")}.
            </span>
            <span
              style={{
                fontFamily: HEROS_FONT,
                fontSize: "clamp(18px, 2vw, 26px)",
                fontWeight: 700,
                color: colors.text,
                letterSpacing: "-0.01em",
                lineHeight: 1.25,
              }}
            >
              {p.title}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
