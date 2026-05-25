import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";
import CustomCursor from "../components/CustomCursor";

const HEROS_FONT = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Inline brand-name treatment matching Landing's About paragraph.
function Brand({ children }) {
  return (
    <em
      style={{
        fontFamily: TIMES,
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "1.05em",
      }}
    >
      {children}
    </em>
  );
}

// Hero landing page for a single discipline (Production, Cultural Strategy,
// Visual Research). Same hero as /work, optionally followed by an About-style
// paragraph block when `body` is provided.
export default function CategoryPage({ label, heroImage = "/hero.jpg", body, showcases = [] }) {
  // Snap-scroll between the three full-viewport sections (hero, about,
  // showcase). Adds the snap class to <html> on mount, removes on unmount
  // so other routes aren't affected.
  useEffect(() => {
    document.documentElement.classList.add("category-snap-html");
    return () => document.documentElement.classList.remove("category-snap-html");
  }, []);
  return (
    <div className="category-page" style={{ background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <style>{`
        .category-page, .category-page * { cursor: none !important; }
      `}</style>
      <CustomCursor enlargeOnHover />
      <PlusMenu />

      {/* Sticky ← Home (follows scroll, mix-blend-difference for legibility) */}
      <Link
        to="/"
        className="m-portfolio-label"
        style={{
          position: "fixed",
          top: 28,
          left: space.xl,
          fontFamily: TIMES,
          fontSize: 14,
          fontWeight: 400,
          color: "#fff",
          mixBlendMode: "difference",
          textDecoration: "none",
          zIndex: 100,
        }}
      >
        ← Home
      </Link>

      <section
        className="m-hero-section category-snap-section"
        style={{
          background: "#000",
          color: "#fff",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={heroImage}
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

        {/* Top-left: Selected (← Home is now sticky outside the section) */}
        <div
          className="m-hero-tl"
          style={{
            position: "absolute",
            top: space.xl + 24,
            left: space.xl,
            color: "#fff",
            zIndex: 5,
          }}
        >
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
            fontStyle: "italic",
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

      {body && (
        <section
          className="m-section category-snap-section"
          style={{
            position: "relative",
            padding: `${space.xxl}px ${space.xl}px ${space.xxl + 40}px`,
            display: "grid",
            gridTemplateColumns: "1fr 6fr",
            gap: space.xl,
            alignItems: "start",
            height: "100vh",
          }}
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
            {label}
          </div>
          <p
            className="m-section-body"
            style={{
              fontFamily: HEROS_FONT,
              fontSize: "clamp(20px, 2.6vw, 42px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              margin: 0,
              color: colors.text,
            }}
          >
            {body}
          </p>
          {showcases.length > 0 && (
            <button
              onClick={(e) => {
                const section = e.currentTarget.closest("section");
                const next = section?.nextElementSibling;
                next?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              aria-label="Scroll to projects"
              style={{
                position: "absolute",
                bottom: space.lg,
                left: "50%",
                transform: "translateX(-50%)",
                background: "none",
                border: "none",
                padding: 8,
                cursor: "pointer",
                color: colors.text,
                fontFamily: HEROS_FONT,
                fontSize: 18,
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              ↓
            </button>
          )}
        </section>
      )}

      {showcases.length > 0 && <AutoCycleHero showcases={showcases} />}
    </div>
  );
}

function isVideoSrc(src) {
  return src && /\.(mp4|webm|mov)$/i.test(src);
}

function Media({ src, style, position }) {
  const merged = position ? { ...style, objectPosition: position } : style;
  return isVideoSrc(src) ? (
    <video
      src={src}
      autoPlay muted loop playsInline
      preload="metadata"
      style={merged}
    />
  ) : (
    <img src={src} alt="" loading="lazy" style={merged} />
  );
}

// Iconoclast-style full-bleed cycler. Active project's media fills the
// viewport (a flush pair when media is an array). The bottom strip holds
// a big number for each project — auto-advancing every few seconds, paused
// while the user is hovering a number, and hover sets that number active.
function AutoCycleHero({ showcases }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || showcases.length < 2) return;
    const id = setInterval(() => {
      setIndex(i => (i + 1) % showcases.length);
    }, 4500);
    return () => clearInterval(id);
  }, [paused, showcases.length]);

  const active = showcases[index];

  return (
    <section
      className="category-snap-section m-showcase-section"
      style={{
        width: "100%",
        height: "100vh",
        background: "#fff",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Media region — image fills this region only; footer is below, not overlaid. */}
      <div style={{ position: "relative", flex: 1, minHeight: 0, overflow: "hidden", background: "#000" }}>
        {/* Crossfade stack */}
        {showcases.map((s, i) => {
          const items = Array.isArray(s.media) ? s.media : [s.media];
          const isActive = i === index;
          return (
            <div
              key={i}
              aria-hidden={!isActive}
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: items.length > 1 ? `repeat(${items.length}, 1fr)` : "1fr",
                gap: 0,
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.7s ease",
                pointerEvents: "none",
              }}
            >
              {items.map((src, j) => (
                <div key={j} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
                  <Media
                    src={src}
                    position={s.position}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              ))}
            </div>
          );
        })}

        {/* Bottom row: tight number cluster (left) + client/title (right),
            baseline-aligned at the bottom of the digits. */}
        <div
          className="m-showcase-bottom"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: `0 ${space.xl}px`,
            gap: space.lg,
            zIndex: 3,
          }}
        >
          <div
            className="m-showcase-numbers"
            style={{
              display: "flex",
              gap: 18,
              alignItems: "flex-end",
            }}
          >
            {showcases.map((_, i) => {
              const isActive = i === index;
              return (
                <button
                  key={i}
                  onMouseEnter={() => {
                    setPaused(true);
                    setIndex(i);
                  }}
                  onMouseLeave={() => setPaused(false)}
                  onFocus={() => {
                    setPaused(true);
                    setIndex(i);
                  }}
                  onBlur={() => setPaused(false)}
                  aria-label={`Show project ${i + 1}`}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontFamily: HEROS_FONT,
                    fontSize: "clamp(18px, 2.6vw, 38px)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: "#fff",
                    opacity: isActive ? 1 : 0.35,
                    transition: "opacity 0.3s ease",
                    textShadow: "0 1px 12px rgba(0,0,0,0.35)",
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div
            className="m-showcase-overlay"
            style={{
              textAlign: "right",
              color: "#fff",
              textShadow: "0 1px 16px rgba(0,0,0,0.45)",
              pointerEvents: "none",
              maxWidth: "60vw",
              lineHeight: 1,
            }}
          >
            <div
              style={{
                fontFamily: TIMES,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(18px, 2vw, 30px)",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              {active.client}
            </div>
            {active.title && (
              <div
                style={{
                  marginTop: 4,
                  fontFamily: HEROS_FONT,
                  fontWeight: 700,
                  fontSize: "clamp(11px, 1vw, 14px)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                {active.title}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* White footer — sits BELOW the media, not on top */}
      <footer
        className="m-showcase-footer"
        style={{
          flex: "0 0 auto",
          padding: `14px ${space.xl}px`,
          background: "#fff",
          color: colors.text,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: space.lg,
          fontFamily: TIMES,
          fontSize: 14,
          fontWeight: 400,
          borderTop: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div>© {new Date().getFullYear()} Emily Lucas</div>
        <Link
          to="/work"
          style={{
            color: colors.text,
            textDecoration: "none",
            fontStyle: "italic",
          }}
        >
          Click for more work →
        </Link>
      </footer>
    </section>
  );
}

export { Brand };
