import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";
import CustomCursor from "../components/CustomCursor";
import { productionCases } from "../data/work";

// Inline italic-Times treatment for known brand names inside Task/Outcome
// body copy, kept in sync with the /work popup so the two surfaces match.
const BRAND_TERMS = [
  "MR PORTER", "MR PORTER's", "Vogue", "Vogue Arabia", "Condé Nast", "British Vogue",
  "Aman", "One&Only", "Cipriani", "Mr C", "Charlotte Tilbury", "J.Crew",
  "Nike", "Mastercard", "Trippin", "Columbia Sportswear", "Harvey Nichols",
  "Hamilton", "Jumeirah", "Marsa Al Arab", "Louis Vuitton", "Imaan Hammam",
  "Achraf Hakimi", "Halima Aden", "Balqees Fathi", "Luc Braquet", "Txema Yeste",
  "Willson Project", "Finneas", "Abraham Moon", "GUESS", "SIRO",
  "IMA MENA", "Tyla", "Alessandro Michele", "Luís Figo",
];
function withBrands(text) {
  if (!text) return null;
  const sorted = [...BRAND_TERMS].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "g");
  return text.split(re).map((part, i) =>
    BRAND_TERMS.includes(part) ? (
      <em key={i} style={{ fontFamily: TIMES, fontStyle: "italic", fontWeight: 400 }}>{part}</em>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

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

        {/* Top-left: ← Home + Selected (same pattern as /work hero) */}
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
  const [activeStudy, setActiveStudy] = useState(null);

  useEffect(() => {
    if (paused || activeStudy || showcases.length < 2) return;
    const id = setInterval(() => {
      setIndex(i => (i + 1) % showcases.length);
    }, 4500);
    return () => clearInterval(id);
  }, [paused, activeStudy, showcases.length]);

  const active = showcases[index];

  // Open the case-study popup directly over the showcase image.
  const openCaseStudy = (i) => {
    const slug = showcases[i]?.slug;
    if (!slug) return;
    const study = productionCases.find((c) => c.slug === slug);
    if (!study) return;
    setIndex(i);
    setActiveStudy(study);
  };

  const closeStudy = () => setActiveStudy(null);

  return (
    <section
      className="category-snap-section m-showcase-section"
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

        {/* Click-through layer over the media — opens the case study */}
        <button
          onClick={() => openCaseStudy(index)}
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

      {/* Case-study popup — overlays the showcase image, not a route change */}
      {activeStudy && <CaseStudyModal study={activeStudy} onClose={closeStudy} />}
    </section>
  );
}

// Popup that mirrors the /work CaseStudyPopup exactly (same fonts, sizes,
// internal structure) but renders as a centered modal over whatever
// showcase image is behind it. Slight translucency so the image bleeds
// through. Hidden scrollbar.
function CaseStudyModal({ study, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "transparent",
        zIndex: 50,
        pointerEvents: "auto",
      }}
    >
      <div
        className="cs-modal-card"
        style={{
          position: "relative",
          width: "min(620px, 100%)",
          height: "min(560px, calc(100vh - 80px))",
          background: "rgba(255, 255, 255, 0.93)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          animation: "cs-modal-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        {/* Top + bottom fades, matching /work popup */}
        <div aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 32,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none", zIndex: 3,
        }} />
        <div aria-hidden="true" style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 32,
          background: "linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none", zIndex: 3,
        }} />

        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: HEROS_FONT,
            fontSize: 20,
            lineHeight: 1,
            color: colors.text,
            zIndex: 5,
          }}
        >
          ×
        </button>

        <div
          className="cs-modal-scroll"
          style={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            padding: `${space.md}px ${space.lg}px ${space.lg}px`,
          }}
        >
          <div
            style={{
              fontFamily: HEROS_FONT,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: colors.text,
              marginTop: space.sm,
              marginBottom: 4,
            }}
          >
            {study.project}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: space.md,
              marginBottom: 4,
            }}
          >
            <div
              style={{
                fontFamily: TIMES,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 15,
                lineHeight: 1.2,
                color: colors.text,
              }}
            >
              {study.client}
            </div>
            {study.viewProjectLink && (() => {
              const linksRaw = Array.isArray(study.viewProjectLink) ? study.viewProjectLink : [study.viewProjectLink];
              const links = linksRaw.map((l) => typeof l === "string" ? { label: "View Project →", url: l } : l);
              return (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  {links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontFamily: TIMES, fontSize: 14, fontWeight: 400, color: colors.text, textDecoration: "none", whiteSpace: "nowrap" }}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              );
            })()}
          </div>

          <div
            style={{
              fontFamily: HEROS_FONT,
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              color: colors.textMuted,
              marginBottom: space.md,
            }}
          >
            {study.year}
          </div>

          {study.task && (
            <div style={{ marginBottom: space.md }}>
              <div style={{ fontFamily: HEROS_FONT, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.01em", color: colors.text, marginBottom: 6 }}>
                The Task
              </div>
              <p style={{ fontFamily: HEROS_FONT, fontSize: 12, fontWeight: 400, lineHeight: 1.55, color: colors.text, margin: 0 }}>
                {withBrands(study.task)}
              </p>
            </div>
          )}

          {study.outcome && (
            <div style={{ marginBottom: space.md }}>
              <div style={{ fontFamily: HEROS_FONT, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.01em", color: colors.text, marginBottom: 6 }}>
                The Outcome
              </div>
              <p style={{ fontFamily: HEROS_FONT, fontSize: 12, fontWeight: 400, lineHeight: 1.55, color: colors.text, margin: 0 }}>
                {withBrands(study.outcome)}
              </p>
            </div>
          )}

          {study.images && study.images.length > 0 && (
            <ModalCarousel images={study.images} project={study.project} />
          )}

          {study.tags && study.tags.length > 0 && (
            <div style={{ marginTop: space.lg, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-block",
                    padding: "5px 11px",
                    borderRadius: 999,
                    background: "rgba(0,0,0,0.06)",
                    color: colors.textMuted,
                    fontFamily: HEROS_FONT,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes cs-modal-in {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
        .cs-modal-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .cs-modal-scroll::-webkit-scrollbar { display: none; width: 0; }
      `}</style>
    </div>
  );
}

function ModalCarousel({ images, project }) {
  const trackRef = useRef(null);
  const step = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };
  return (
    <div style={{ position: "relative" }}>
      <div
        ref={trackRef}
        className="cs-modal-scroll"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 4,
        }}
      >
        {images.map((src, i) => {
          // Fixed height, width follows the asset's native aspect ratio so
          // portrait images stay portrait and landscape stay landscape.
          const common = {
            flex: "0 0 auto",
            height: 220,
            width: "auto",
            maxWidth: "85%",
            display: "block",
            scrollSnapAlign: "start",
            borderRadius: 4,
            background: "rgba(0,0,0,0.05)",
            objectFit: "cover",
          };
          return /\.(mp4|webm|mov)$/i.test(src) ? (
            <video key={i} src={src} autoPlay muted loop playsInline style={common} />
          ) : (
            <img key={i} src={src} alt={`${project} – ${i + 1}`} loading="lazy" style={common} />
          );
        })}
      </div>
      <button
        onClick={() => step(-1)}
        aria-label="Previous"
        style={{
          position: "absolute", top: "50%", left: -6, transform: "translateY(-50%)",
          width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(0,0,0,0.1)", cursor: "pointer", fontFamily: HEROS_FONT,
          fontSize: 14, color: colors.text, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >‹</button>
      <button
        onClick={() => step(1)}
        aria-label="Next"
        style={{
          position: "absolute", top: "50%", right: -6, transform: "translateY(-50%)",
          width: 30, height: 30, borderRadius: 999, background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(0,0,0,0.1)", cursor: "pointer", fontFamily: HEROS_FONT,
          fontSize: 14, color: colors.text, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >›</button>
    </div>
  );
}

export { Brand };
