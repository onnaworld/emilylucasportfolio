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
            padding: `${space.xxl}px ${space.xl}px ${space.xxl}px`,
            display: "grid",
            gridTemplateColumns: "1fr 6fr",
            gap: space.xl,
            alignItems: "start",
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
        </section>
      )}

      {showcases.map((s, i) => (
        // Vary drift per item so neighbours float at different speeds and
        // never feel mechanically synchronised.
        <Showcase key={i} {...s} driftFactor={40 + ((i * 23) % 60)} />
      ))}
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

// Hook: returns a Y translate (px) based on how the element sits inside the
// viewport. Used to give each showcase a subtle floating drift as the page
// scrolls. Per-element factor lets neighbours drift at slightly different
// rates so they never lock-step with each other.
function useScrollDrift(factor) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elCenter = rect.top + rect.height / 2;
      // Distance from element centre to viewport centre, normalised so 1 ≈
      // one viewport away. Multiplying by factor gives the parallax shift.
      const distance = (elCenter - viewportCenter) / window.innerHeight;
      setOffset(distance * factor);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
    };
  }, [factor]);
  return [ref, offset];
}

// One project block: a single asset (single media OR a flush pair grouped as
// one) centred in the page, drifting subtly on scroll. Hover fades the asset
// down and reveals the client + title overlay; no overlay by default since
// most assets already carry the brand mark on the image itself.
function Showcase({ client, title, media, driftFactor = 60 }) {
  const items = Array.isArray(media) ? media : [media];
  const [ref, offset] = useScrollDrift(driftFactor);
  const [hovered, setHovered] = useState(false);
  return (
    <section
      style={{
        width: "100%",
        padding: `${space.xxl}px ${space.xl}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: colors.bg,
      }}
    >
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          width: "min(720px, 90vw)",
          transform: `translate3d(0, ${offset}px, 0)`,
          transition: "transform 0.05s linear",
          willChange: "transform",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "grid",
            // Pair sits flush — no gap — so the two assets read as one piece.
            gridTemplateColumns: items.length > 1 ? `repeat(${items.length}, 1fr)` : "1fr",
            gap: 0,
            opacity: hovered ? 0.25 : 1,
            transition: "opacity 0.4s ease",
          }}
        >
          {items.map((src, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: items.length > 1 ? "3 / 4" : "16 / 9",
                overflow: "hidden",
                background: "#000",
              }}
            >
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
        {/* Hover-only title overlay. Sits over the dimmed asset, centre-stage. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center",
            color: colors.text,
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.35s ease, transform 0.35s ease",
          }}
        >
          <div
            style={{
              fontFamily: HEROS_FONT,
              fontWeight: 700,
              fontSize: "clamp(20px, 3.4vw, 48px)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            {client}
          </div>
          {title && (
            <div
              style={{
                marginTop: 6,
                fontFamily: TIMES,
                fontStyle: "italic",
                fontSize: "clamp(15px, 1.6vw, 22px)",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export { Brand };
