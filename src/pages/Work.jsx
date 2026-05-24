import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";
import { productionCases } from "../data/work";

const HEROS_FONT = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Numbered list. Items with a `slug` matching an existing productionCase open
// the case study panel on the right; the rest are placeholders for now.
const PROJECTS = [
  { n: 1, title: "Vogue Arabia", slug: "vogue-relaunch" },
  { n: 2, title: "Aman", slug: "aman" },
  { n: 3, title: "MR PORTER", slug: "mr-porter-in-america" },
  { n: 4, title: "One&Only" },
  { n: 5, title: "Cipriani", slug: "mr-c-residences" },
  { n: 6, title: "Columbia Sportswear" },
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
  const rightPanelRef = useRef(null);

  // Restore selection from URL hash (so /work#aman deep-links)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && productionCases.find(c => c.slug === hash)) {
      setActiveSlug(hash);
    }
  }, []);

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
      {/* Fixed nav — color-flips across dark hero and light content */}
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
          gap: space.xl,
          position: "relative",
          minHeight: "100vh",
          padding: `${space.xxl}px ${space.xl}px ${space.xxl}px`,
        }}
      >
        {/* ─── LEFT: list + aligned images, manual loop scroll ─── */}
        <div
          style={{
            position: "sticky",
            top: 80,
            alignSelf: "start",
            height: "fit-content",
          }}
        >
          <ProjectLoopList
            projects={PROJECTS}
            productionCases={productionCases}
            activeSlug={activeSlug}
            setActive={setActive}
          />
        </div>

        {/* ─── RIGHT: case study panel ─── */}
        <div
          ref={rightPanelRef}
          style={{
            paddingLeft: space.xl,
          }}
        >
          {activeStudy ? <CaseStudyView study={activeStudy} /> : <EmptyState />}
        </div>
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

      {/* Top-left: Selected */}
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

// Manual scrollable list with scatter thumbs in a second sub-column. Both
// share the same scroll container, so as the user scrolls the list, the
// scatter thumbs scroll past too. Content is tripled and scroll position
// wraps back to the middle copy at the boundaries — infinite loop feel.
function ProjectLoopList({ projects, productionCases, activeSlug, setActive }) {
  const ROW_HEIGHT = 44;
  const VISIBLE = 14; // ~14 rows of list visible at once
  const tripled = [...projects, ...projects, ...projects];
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = projects.length * ROW_HEIGHT;
    }
  }, [projects.length]);

  const onScroll = (e) => {
    const el = e.currentTarget;
    const oneSet = projects.length * ROW_HEIGHT;
    if (el.scrollTop < oneSet * 0.5) {
      el.scrollTop += oneSet;
    } else if (el.scrollTop > oneSet * 2.5) {
      el.scrollTop -= oneSet;
    }
  };

  // Scatter positions for the right-hand thumb column — recycled across rows
  // so the thumbs feel "thrown" rather than gridded.
  const positions = [
    { left: "8%",  width: 200 },
    { left: "55%", width: 170 },
    { left: "18%", width: 180 },
    { left: "62%", width: 210 },
    { left: "5%",  width: 160 },
    { left: "48%", width: 190 },
    { left: "20%", width: 220 },
    { left: "58%", width: 170 },
    { left: "10%", width: 190 },
    { left: "52%", width: 200 },
    { left: "28%", width: 175 },
  ];

  const totalHeight = tripled.length * ROW_HEIGHT;

  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      style={{
        height: ROW_HEIGHT * VISIBLE,
        overflowY: "auto",
        scrollbarWidth: "thin",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
          gap: space.xl,
          minHeight: totalHeight,
          position: "relative",
        }}
      >
        {/* LIST */}
        <div>
          {tripled.map((p, i) => {
            const isActive = activeSlug && p.slug === activeSlug;
            const clickable = !!p.slug;
            return (
              <button
                key={i}
                onClick={() => clickable && setActive(isActive ? null : p.slug)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: clickable ? "pointer" : "default",
                  padding: 0,
                  fontFamily: HEROS_FONT,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  color: colors.text,
                  opacity: isActive ? 1 : 0.9,
                  height: ROW_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                  gap: space.md,
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  width: "100%",
                }}
              >
                <span style={{ width: 30, flexShrink: 0 }}>
                  {String(p.n).padStart(2, "0")}.
                </span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {p.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* SCATTER THUMBS — absolutely positioned within this column */}
        <div style={{ position: "relative" }}>
          {tripled.map((p, i) => {
            const study = p.slug ? productionCases.find(s => s.slug === p.slug) : null;
            if (!study?.heroImage) return null;
            const pos = positions[i % positions.length];
            // Center the thumb roughly on the row it pairs with
            const top = i * ROW_HEIGHT - (pos.width * 0.6);
            const isActive = activeSlug === p.slug;
            return (
              <div
                key={i}
                onClick={() => setActive(isActive ? null : p.slug)}
                style={{
                  position: "absolute",
                  top,
                  left: pos.left,
                  width: pos.width,
                  cursor: "pointer",
                  opacity: isActive ? 1 : 0.95,
                }}
              >
                <div
                  style={{
                    fontFamily: HEROS_FONT,
                    fontWeight: 900,
                    fontSize: 28,
                    letterSpacing: "-0.04em",
                    marginBottom: space.xs,
                    color: colors.text,
                  }}
                >
                  {String(p.n).padStart(2, "0")}
                </div>
                <div style={{ background: "#eee", overflow: "hidden" }}>
                  <img
                    src={study.heroImage}
                    alt=""
                    loading="lazy"
                    style={{
                      width: "100%",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        padding: `${space.xl}px ${space.md}px`,
        ...t("small"),
        color: colors.textSubtle,
        fontStyle: "italic",
      }}
    >
      Select a project →
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
