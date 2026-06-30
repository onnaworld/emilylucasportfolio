import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";
import RouteMeta from "../components/RouteMeta";

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

// Hero landing page for a single discipline (Production, Strategy & Editorial,
// Visual Research). Same hero as /work, optionally followed by an About-style
// paragraph block when `body` is provided.
export default function CategoryPage({ label, heroImage = "/hero.jpg", body, showcases = [], metaPath, metaTitle, metaDescription, metaImage, suppressMeta = false, heroOverlayColor = "#fff" }) {
  // Snap-scroll removed — proximity-snap was pulling the user back from
  // the footer onto the showcase. Free scroll feels better for these
  // pages now that there's a footer below the last full-bleed section.

  // Once the hero has scrolled mostly out of view, show a fixed ← Home
  // top-left so the user always has a way back.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="category-page page-fade-in" style={{ background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      {metaPath && !suppressMeta && (
        <RouteMeta
          path={metaPath}
          title={metaTitle || `${label} | Emily Lucas | Creative Producer & Strategist`}
          description={metaDescription}
          image={metaImage || heroImage}
        />
      )}
      <style>{`
        .category-page, .category-page * { cursor: none !important; }
      `}</style>
      {/* CustomCursor mounted globally in App.jsx */}
      <PlusMenu />

      {/* Fixed ← Home, appears once you scroll past the hero. mix-blend
          difference keeps it legible on both dark and light sections. */}
      <Link
        to="/"
        style={{
          position: "fixed",
          top: 24,
          left: space.xl,
          fontFamily: TIMES,
          fontSize: 14,
          fontWeight: 400,
          color: "#fff",
          mixBlendMode: "difference",
          textDecoration: "none",
          zIndex: 100,
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        onMouseEnter={(e) => { if (scrolled) e.currentTarget.style.opacity = "0.7"; }}
        onMouseLeave={(e) => { if (scrolled) e.currentTarget.style.opacity = "1"; }}
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
          alt={`${label} — Emily Lucas portfolio hero`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Top-left: ← Home + Selected (same pattern as /work hero) */}
        <div
          className="m-hero-tl"
          style={{
            position: "absolute",
            top: space.xl,
            left: space.xl,
            color: heroOverlayColor,
            zIndex: 5,
          }}
        >
          <Link
            to="/"
            className="m-portfolio-label hover-text"
            style={{
              display: "inline-block",
              fontFamily: TIMES,
              fontSize: 14,
              fontWeight: 400,
              color: heroOverlayColor,
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
            color: heroOverlayColor,
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
            color: heroOverlayColor,
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

        {/* Bottom-center: down arrow — scrolls to the next section
            (body when present, otherwise the showcase). */}
        <button
          onClick={(e) => {
            const section = e.currentTarget.closest("section");
            section?.nextElementSibling?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          aria-label="Scroll down"
          style={{
            position: "absolute",
            bottom: space.lg,
            left: "50%",
            transform: "translateX(-50%)",
            background: "none",
            border: "none",
            padding: 8,
            cursor: "pointer",
            color: heroOverlayColor,
            fontFamily: HEROS_FONT,
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1,
            zIndex: 6,
          }}
        >
          ↓
        </button>
      </section>

      {body && (
        <section
          className="m-section category-snap-section"
          style={{
            position: "relative",
            // Symmetric top/bottom padding so the arrow sits with equal
            // whitespace above (between body and arrow) and below
            // (between arrow and section edge). space.xxl=96 was too
            // airy after dense body copy — drop the bottom rail to lg.
            padding: `${space.xxl}px ${space.xl}px ${space.lg}px`,
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
          {showcases.length > 0 && (
            <button
              onClick={(e) => {
                const section = e.currentTarget.closest("section");
                const next = section?.nextElementSibling;
                next?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              aria-label="Scroll to projects"
              className="m-category-arrow"
              style={{
                gridColumn: "1 / -1",
                justifySelf: "center",
                marginTop: space.lg,
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

      {/* Page footer — sits below the showcase as a separate row so the
          page extends slightly past the last full-bleed section. */}
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: space.lg,
        }}
      >
        <span>© {new Date().getFullYear()} Emily Lucas</span>
        <Link
          to="/work"
          className="hover-text"
          style={{
            fontFamily: TIMES,
            fontSize: 18,
            fontWeight: 400,
            color: colors.text,
            letterSpacing: 0,
            lineHeight: 1,
            textDecoration: "none",
          }}
        >
          View All Work →
        </Link>
      </footer>
    </div>
  );
}

function isVideoSrc(src) {
  return src && /\.(mp4|webm|mov)$/i.test(src);
}

function Media({ src, style, position, alt }) {
  // Placeholder when no asset is wired yet — soft tonal gradient block,
  // same dimensions as the real media so layout doesn't shift on swap.
  if (!src) {
    return (
      <div
        aria-hidden="true"
        style={{
          ...style,
          background: "linear-gradient(135deg, #2a2a2a 0%, #525252 50%, #2a2a2a 100%)",
        }}
      />
    );
  }
  const merged = position ? { ...style, objectPosition: position } : style;
  // Soft gradient as the underlying background so a video that hasn't
  // loaded its first frame yet doesn't flash pure black.
  const videoBg = "linear-gradient(135deg, #2a2a2a 0%, #525252 50%, #2a2a2a 100%)";
  return isVideoSrc(src) ? (
    <video
      src={src}
      autoPlay muted loop playsInline
      preload="auto"
      style={{ ...merged, background: videoBg }}
    />
  ) : (
    <img src={src} alt={alt || ""} loading="lazy" style={merged} />
  );
}

// Iconoclast-style full-bleed cycler. Active project's media fills the
// viewport (a flush pair when media is an array). The bottom strip holds
// a big number for each project — auto-advancing every few seconds, paused
// while the user is hovering a number, and hover sets that number active.
function AutoCycleHero({ showcases }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (paused || showcases.length < 2) return;
    const id = setInterval(() => {
      setIndex(i => (i + 1) % showcases.length);
    }, 4500);
    return () => clearInterval(id);
  }, [paused, showcases.length]);

  const active = showcases[index];

  // Navigate to /work/:slug with the current location as background.
  // The modal route in App.jsx handles rendering the overlay; closing
  // pops back to here without reloading the category page.
  const openCaseStudy = (i) => {
    const slug = showcases[i]?.slug;
    if (!slug) return;
    setIndex(i);
    navigate(`/work/${slug}`, { state: { backgroundLocation: location } });
  };

  // Mobile swipe-to-next on the showcase. Tracks the starting touch and
  // on release decides: swipe → change index; otherwise let the
  // click-through fire so the tap still opens the case study.
  const touchRef = useRef({ x: 0, y: 0, swiped: false });
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, swiped: false };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      touchRef.current.swiped = true;
      setPaused(true);
      setIndex(i => {
        const next = dx < 0 ? i + 1 : i - 1 + showcases.length;
        return next % showcases.length;
      });
      // Resume the auto-cycle after a beat
      setTimeout(() => setPaused(false), 3500);
    }
  };
  // Suppress the click-through tap if we just swiped, so the case study
  // doesn't open when the user is just navigating between projects.
  const onClickThrough = () => {
    if (touchRef.current.swiped) {
      touchRef.current.swiped = false;
      return;
    }
    openCaseStudy(index);
  };

  return (
    <section
      className="category-snap-section m-showcase-section"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#000",
        color: "#fff",
        overflow: "hidden",
      }}
    >
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
                    alt={`${s.client} — ${s.title}, produced by Emily Lucas`}
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

        {/* Click-through layer over the media — opens the case study
            (swipe is intercepted by the section's touch handlers above). */}
        <button
          onClick={onClickThrough}
          aria-label={`Open ${active.client} case study`}
          style={{
            position: "absolute",
            inset: 0,
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            zIndex: 2,
          }}
        />


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
              flex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 12,
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
                  onClick={(e) => { e.stopPropagation(); openCaseStudy(i); }}
                  aria-label={`Open project ${i + 1}: ${showcases[i].client}`}
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
                    // Slight enlarge on active/hover. transform doesn't
                    // affect layout, so neighbours don't shift.
                    transform: isActive ? "scale(1.18)" : "scale(1)",
                    transformOrigin: "center bottom",
                    transition: "opacity 0.3s ease, transform 0.25s ease",
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
              // Fixed reserve so changing-length client/title doesn't
              // redistribute the flex:1 numbers row (was causing them to
              // drift left/right when hover changed the active project).
              flex: "0 0 260px",
              maxWidth: 260,
              textAlign: "right",
              color: "#fff",
              textShadow: "0 1px 16px rgba(0,0,0,0.45)",
              pointerEvents: "none",
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

      {/* The case-study modal is rendered globally by App.jsx whenever
          the URL matches /work/:slug. Opening from here is a navigate()
          call so the URL changes and refresh-to-modal works. */}
    </section>
  );
}

export { Brand };
