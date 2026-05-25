import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";
import { productionCases } from "../data/work";

const HEROS_FONT = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Numbered list. Items with a `slug` matching an existing productionCase open
// the case study panel on the right; the rest are placeholders for now.
// Category derived from the project's display number — used to swap the
// 'Select Work' header to the discipline name on hover.
function categoryFor(n) {
  if (n <= 12) return "Production";
  if (n <= 24) return "Cultural Strategy";
  return "Visual Research";
}

const PROJECTS = [
  { n: 1, title: "Vogue Arabia", slug: "vogue-relaunch", thumb: "/work/all-work/01.jpg" },
  { n: 2, title: "Aman", slug: "aman", thumb: "/work/all-work/2..jpg" },
  { n: 3, title: "MR PORTER", slug: "mr-porter-in-america", thumb: "/work/all-work/3..webp" },
  { n: 4, title: "One&Only", thumb: "/work/all-work/4..mp4.gif" },
  { n: 5, title: "Cipriani", slug: "mr-c-residences", thumb: "/work/all-work/5..jpg" },
  { n: 6, title: "Columbia Sportswear", thumb: "/work/all-work/6..jpg" },
  { n: 7, title: "Mastercard", slug: "mastercard-sailgp" },
  { n: 8, title: "Nike", slug: "nike-vomero" },
  { n: 10, title: "J.Crew" },
  { n: 11, title: "Charlotte Tilbury" },
  { n: 12, title: "Louis Vuitton x The Glass Magazine", slug: "glass-magazine" },
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
  const [activeSlug, setActiveSlug] = useState(null);
  const [windowStart, setWindowStart] = useState(0); // first project index in the 3-thumb window
  const [hoveredIdx, setHoveredIdx] = useState(null); // for dimming non-hovered titles
  const sectionRef = useRef(null);
  const rightPanelRef = useRef(null);

  // Restore selection from URL hash (so /work#aman deep-links)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && productionCases.find(c => c.slug === hash)) {
      setActiveSlug(hash);
    }
  }, []);

  const onHoverProject = (index) => {
    const maxStart = Math.max(0, PROJECTS.length - 3);
    setWindowStart(Math.min(index, maxStart));
  };

  const setActive = (slug) => {
    setActiveSlug(slug);
    if (slug) {
      window.history.replaceState(null, "", `#${slug}`);
      setTimeout(() => {
        if (rightPanelRef.current) rightPanelRef.current.scrollTop = 0;
      }, 0);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const activeStudy = productionCases.find(c => c.slug === activeSlug);

  return (
    <div style={{ minHeight: "100vh", background: colors.bg, color: colors.text, position: "relative" }}>
      <style>{`
        /* Page is intentionally non-scrollbar-driven on /work — list hover advances the thumbs */
        html { scrollbar-width: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0; height: 0; display: none; }
      `}</style>
      <WorkHero />

      {/* Full-width work section — fits exactly one viewport now that the
          thumbs advance from the list hover, not from page scroll. */}
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
        }}
      >
        <div
          style={{
            height: "100vh",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {/* LEFT: list centred vertically; ← Back to Home sits beneath it */}
          <div
            style={{
              alignSelf: "center",
              paddingLeft: space.xxl,
              width: "fit-content",
            }}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div
              style={{
                fontFamily: HEROS_FONT,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                color: colors.text,
                marginBottom: space.md,
                transition: "opacity 0.2s",
              }}
            >
              {hoveredIdx !== null ? categoryFor(PROJECTS[hoveredIdx].n) : "Select Work"}
            </div>
            {PROJECTS.map((p, idx) => {
              const isActive = activeSlug && p.slug === activeSlug;
              const clickable = !!p.slug;
              const isHovered = hoveredIdx === idx;
              const isDimmed = hoveredIdx !== null && !isHovered;
              return (
                <button
                  key={p.n}
                  onMouseEnter={() => {
                    setHoveredIdx(idx);
                    onHoverProject(idx);
                  }}
                  onClick={() => clickable && setActive(isActive ? null : p.slug)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: clickable ? "pointer" : "default",
                    padding: "3px 0",
                    fontFamily: HEROS_FONT,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                    color: colors.text,
                    opacity: isDimmed ? 0.25 : isActive ? 1 : 0.9,
                    transition: "opacity 0.25s ease-out",
                    display: "flex",
                    alignItems: "baseline",
                    gap: space.sm,
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    width: "100%",
                  }}
                >
                  <span style={{ width: 28, flexShrink: 0 }}>
                    {String(p.n).padStart(2, "0")}.
                  </span>
                  <span>{p.title}</span>
                </button>
              );
            })}
            <div
              style={{
                marginTop: space.lg,
                paddingTop: space.md,
                borderTop: `1px solid ${colors.text}`,
                paddingBottom: space.sm,
              }}
            >
              <Link
                to="/"
                style={{
                  fontFamily: TIMES,
                  fontSize: 14,
                  fontWeight: 400,
                  color: colors.text,
                  textDecoration: "none",
                  letterSpacing: 0,
                  lineHeight: 1,
                }}
              >
                ← Back to Home
              </Link>
            </div>
          </div>

          {/* RIGHT: 3 thumbs scattered at fixed positions inside the right half */}
          <ScatteredThumbs
            projects={PROJECTS}
            productionCases={productionCases}
            windowStart={windowStart}
            hoveredIdx={hoveredIdx}
          />
        </div>

        {/* Case study panel — fixed overlay on the right when active */}
        {activeStudy && (
          <div
            ref={rightPanelRef}
            style={{
              position: "fixed",
              top: 88,
              right: space.xl,
              width: "min(420px, 36vw)",
              maxHeight: "calc(100vh - 120px)",
              overflowY: "auto",
              background: colors.bg,
              border: `1px solid ${colors.border}`,
              padding: space.lg,
              zIndex: 60,
            }}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: space.sm,
                right: space.sm,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: HEROS_FONT,
                fontSize: 22,
                lineHeight: 1,
                color: colors.text,
              }}
            >
              ×
            </button>
            <CaseStudyView study={activeStudy} />
          </div>
        )}
      </div>

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

      {/* Top-left: ← Home + Selected */}
      <div
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

// All projects rendered as a fluid carousel — each project slides through
// the three scattered slot positions as windowStart advances. Per-project
// transition duration varies so thumbs travel at slightly different speeds,
// crossing and bumping into each other as they transit between slots.
const SCATTER_SLOTS = [
  { leftPct: 8,  topPct: 6,  width: 220 },
  { leftPct: 52, topPct: 38, width: 200 },
  { leftPct: 18, topPct: 62, width: 240 },
];

function ScatteredThumbs({ projects, productionCases, windowStart, hoveredIdx }) {
  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      {projects.map((p, i) => {
        const slot = i - windowStart; // -∞..-1 = off above, 0/1/2 = visible, 3..∞ = off below
        const visible = slot >= 0 && slot < SCATTER_SLOTS.length;

        let leftPct, topPct, width;
        if (visible) {
          ({ leftPct, topPct, width } = SCATTER_SLOTS[slot]);
        } else if (slot < 0) {
          // Stack above the viewport, further up the more negative
          leftPct = SCATTER_SLOTS[0].leftPct;
          topPct = -40 + slot * 8;
          width = SCATTER_SLOTS[0].width;
        } else {
          // Stack below the viewport, further down the more positive
          leftPct = SCATTER_SLOTS[2].leftPct;
          topPct = 110 + (slot - SCATTER_SLOTS.length) * 8;
          width = SCATTER_SLOTS[2].width;
        }

        // Per-project duration variation — slow, gentle glide. Wide spread
        // so thumbs arrive at visibly different times and bump as they transit.
        const dur = 2.2 + ((i * 37) % 100) / 100; // 2.2s..3.2s, deterministic per project
        const ease = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // soft overshoot/bounce

        // Use the project's own thumb if defined; fall back to a matching
        // productionCase heroImage; otherwise blank.
        const study = p.slug ? productionCases.find(s => s.slug === p.slug) : null;
        const thumbSrc = p.thumb || study?.heroImage;
        const isVideo = thumbSrc && /\.(mp4|webm|mov)$/i.test(thumbSrc);

        // If user is hovering a list row, the hovered project is at slot 0;
        // dim the other two visible thumbs so the hovered one stands out.
        const isHoveredThumb = hoveredIdx !== null && i === hoveredIdx;
        const isDimmedThumb = hoveredIdx !== null && visible && !isHoveredThumb;
        const targetOpacity = visible ? (isDimmedThumb ? 0.2 : 1) : 0;

        return (
          <div
            key={p.n}
            style={{
              position: "absolute",
              left: `${leftPct}%`,
              top: `${topPct}%`,
              width,
              opacity: targetOpacity,
              transition: `top ${dur}s ${ease}, left ${dur}s ${ease}, opacity 0.5s ease-out`,
              pointerEvents: visible ? "auto" : "none",
              willChange: "top, left, opacity",
            }}
          >
            <div
              style={{
                fontFamily: HEROS_FONT,
                fontWeight: 900,
                fontSize: 32,
                letterSpacing: "-0.04em",
                marginBottom: space.sm,
                color: colors.text,
              }}
            >
              {String(p.n).padStart(2, "0")}
            </div>
            {thumbSrc ? (
              isVideo ? (
                <video
                  src={thumbSrc}
                  autoPlay muted loop playsInline
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              ) : (
                <img
                  src={thumbSrc}
                  alt=""
                  loading="lazy"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              )
            ) : (
              <div style={{ background: "#f2f2f2", aspectRatio: "4 / 3" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function CaseStudyView({ study }) {
  return (
    <article style={{ paddingBottom: space.xxl }}>
      <div style={{ background: "#0a0a0a", marginBottom: space.lg, overflow: "hidden" }}>
        {study.heroVideo ? (
          <video
            src={study.heroVideo}
            poster={study.heroImage}
            autoPlay muted loop playsInline
            style={{ width: "100%", display: "block" }}
          />
        ) : study.heroImage ? (
          <img src={study.heroImage} alt={study.project} style={{ width: "100%", display: "block" }} />
        ) : null}
      </div>

      <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.sm, letterSpacing: 1.6 }}>
        {study.year} · {study.client}
      </div>

      <h2
        style={{
          fontFamily: fonts.sans,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
          marginBottom: space.md,
          color: colors.text,
        }}
      >
        {study.project}
      </h2>

      <p
        style={{
          fontFamily: fonts.sans,
          fontSize: 18,
          lineHeight: 1.4,
          color: colors.text,
          marginBottom: space.xl,
        }}
      >
        {study.title}
      </p>

      <div style={{ marginBottom: space.lg }}>
        <div style={{ ...t("label"), marginBottom: space.sm, color: colors.text }}>The Task</div>
        <p style={{ fontFamily: fonts.sans, fontSize: 14, lineHeight: 1.6, color: colors.text, margin: 0 }}>
          {study.task}
        </p>
      </div>

      <div style={{ marginBottom: space.xl }}>
        <div style={{ ...t("label"), marginBottom: space.sm, color: colors.text }}>The Outcome</div>
        <p style={{ fontFamily: fonts.sans, fontSize: 14, lineHeight: 1.6, color: colors.text, margin: 0 }}>
          {study.outcome}
        </p>
      </div>

      {study.images && study.images.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: space.md }}>
          {study.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${study.project} – ${i + 1}`}
              loading="lazy"
              style={{ width: "100%", display: "block", background: colors.surface }}
            />
          ))}
        </div>
      )}
    </article>
  );
}
