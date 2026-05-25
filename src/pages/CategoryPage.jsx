import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";

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
  return (
    <div style={{ background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <PlusMenu />
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
          className="m-section"
          style={{
            position: "relative",
            padding: `${space.xxl}px ${space.xl}px ${space.xxl + 40}px`,
            display: "grid",
            gridTemplateColumns: "1fr 6fr",
            gap: space.xl,
            alignItems: "start",
            minHeight: "100vh",
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

function Media({ src, style }) {
  return isVideoSrc(src) ? (
    <video
      src={src}
      autoPlay muted loop playsInline
      preload="metadata"
      style={style}
    />
  ) : (
    <img src={src} alt="" loading="lazy" style={style} />
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
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
        color: "#fff",
      }}
    >
      {/* Crossfade stack — every project rendered once, only active visible. */}
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

      {/* Brand + title overlay, bottom-right */}
      <div
        style={{
          position: "absolute",
          right: space.xl,
          bottom: 120,
          textAlign: "right",
          color: "#fff",
          textShadow: "0 1px 16px rgba(0,0,0,0.45)",
          pointerEvents: "none",
          maxWidth: "60vw",
        }}
      >
        <div
          style={{
            fontFamily: HEROS_FONT,
            fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 56px)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textTransform: "uppercase",
          }}
        >
          {active.client}
        </div>
        {active.title && (
          <div
            style={{
              marginTop: 6,
              fontFamily: TIMES,
              fontStyle: "italic",
              fontSize: "clamp(18px, 2vw, 30px)",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            {active.title}
          </div>
        )}
      </div>

      {/* Big numbers along the bottom */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 12,
          display: "flex",
          justifyContent: "space-between",
          padding: `0 ${space.xl}px`,
          gap: 12,
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
                flex: "1 1 0",
                background: "none",
                border: "none",
                padding: "8px 0",
                cursor: "pointer",
                fontFamily: HEROS_FONT,
                fontSize: "clamp(36px, 6vw, 96px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "#fff",
                opacity: isActive ? 1 : 0.35,
                transition: "opacity 0.3s ease",
                textAlign: "left",
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export { Brand };
