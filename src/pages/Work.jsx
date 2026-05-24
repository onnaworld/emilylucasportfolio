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
  const [windowStart, setWindowStart] = useState(0); // first project index in the 3-thumb window
  const hoverPinned = useRef(false); // once user hovers, scroll-driven advance stops
  const sectionRef = useRef(null);
  const rightPanelRef = useRef(null);

  // Restore selection from URL hash (so /work#aman deep-links)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && productionCases.find(c => c.slug === hash)) {
      setActiveSlug(hash);
    }
  }, []);

  // Scroll-driven advance of the 3-thumb window (only until user hovers something)
  useEffect(() => {
    const maxStart = Math.max(0, PROJECTS.length - 3);
    const onScroll = () => {
      if (hoverPinned.current) return;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const scrollable = section.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (window.scrollY - sectionTop) / scrollable));
      setWindowStart(Math.round(progress * maxStart));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHoverProject = (index) => {
    const maxStart = Math.max(0, PROJECTS.length - 3);
    hoverPinned.current = true;
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
      <WorkHero />

      {/* Full-width work section. Section is taller than viewport so the
          sticky inner container stays pinned while scroll advances the
          3-thumb window on the right. */}
      <div
        ref={sectionRef}
        style={{
          position: "relative",
          width: "100%",
          // Enough scroll distance to cycle through all projects in the window
          minHeight: `${100 + PROJECTS.length * 12}vh`,
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
          }}
        >
          {/* LEFT: project list */}
          <div style={{ paddingLeft: space.xxl }}>
            {PROJECTS.map((p, idx) => {
              const isActive = activeSlug && p.slug === activeSlug;
              const clickable = !!p.slug;
              return (
                <button
                  key={p.n}
                  onMouseEnter={() => onHoverProject(idx)}
                  onClick={() => clickable && setActive(isActive ? null : p.slug)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: clickable ? "pointer" : "default",
                    padding: "2px 0",
                    fontFamily: HEROS_FONT,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                    color: colors.text,
                    opacity: isActive ? 1 : 0.85,
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
          </div>

          {/* RIGHT: 3-thumb window stacked vertically */}
          <ThumbWindow
            projects={PROJECTS}
            productionCases={productionCases}
            windowStart={windowStart}
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

      {/* Back to Home — small Times link between two lines (mirrors home page) */}
      <div
        style={{
          padding: `${space.md}px ${space.xl}px ${space.md}px`,
          borderTop: `1px solid ${colors.text}`,
          borderBottom: `1px solid ${colors.text}`,
          textAlign: "center",
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: TIMES,
            fontSize: 18,
            fontWeight: 400,
            color: colors.text,
            letterSpacing: 0,
            lineHeight: 1,
          }}
        >
          ← Back to Home
        </Link>
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

// Three thumb slots stacked vertically on the right. Each slot pulls from
// projects[windowStart + slotIndex]. Number on top (matches the list's p.n),
// image below if a productionCase with that slug exists, else blank placeholder.
function ThumbWindow({ projects, productionCases, windowStart }) {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        paddingRight: space.xxl,
        paddingLeft: space.xl,
        paddingTop: space.xl,
        paddingBottom: space.xl,
      }}
    >
      {[0, 1, 2].map(slot => {
        const p = projects[windowStart + slot];
        if (!p) return <div key={slot} />;
        const study = p.slug ? productionCases.find(s => s.slug === p.slug) : null;
        const heroImg = study?.heroImage;
        return (
          <div
            key={slot}
            style={{
              maxWidth: 320,
              transition: "opacity 0.25s",
            }}
          >
            <div
              style={{
                fontFamily: HEROS_FONT,
                fontWeight: 900,
                fontSize: 36,
                letterSpacing: "-0.04em",
                marginBottom: space.sm,
                color: colors.text,
              }}
            >
              {String(p.n).padStart(2, "0")}
            </div>
            <div
              style={{
                background: heroImg ? "transparent" : "#f2f2f2",
                aspectRatio: "4 / 3",
                overflow: "hidden",
              }}
            >
              {heroImg && (
                <img
                  src={heroImg}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              )}
            </div>
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
