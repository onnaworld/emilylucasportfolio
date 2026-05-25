import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";
import { productionCases } from "../data/work";
import CustomCursor from "../components/CustomCursor";

const HEROS_FONT = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Numbered list. Items with a `slug` matching an existing productionCase open
// the case study panel on the right; the rest are placeholders for now.
// Category derived from the project's display number — used to swap the
// 'Select Work' header to the discipline name on hover.
function categoryFor(n) {
  if (n <= 12) return "Production";
  if (n <= 22) return "Cultural Strategy";
  return "Visual Research";
}

// Each entry: { n, client?, title, slug?, link?, thumb? }
// - client is rendered bold, title regular (split by " - ")
// - slug opens the in-page case study panel
// - link opens the published article in a new tab
const PROJECTS = [
  { n: 1,  client: "CONDÉ NAST",         title: "Vogue Arabia Relaunch",       slug: "vogue-relaunch",       thumb: "/work/all-work/01.jpg" },
  { n: 2,  client: "AMAN",               title: "Saudi Arabia & Dubai",        slug: "aman",                 thumb: "/work/all-work/2..jpg" },
  { n: 3,  client: "MR PORTER",          title: "In America",                  slug: "mr-porter-in-america", thumb: "/work/all-work/3..webp" },
  { n: 4,  client: "ONE&ONLY",           title: "Moonlight Basin",             slug: "moonlight-basin",      thumb: "/work/all-work/4..mp4.mp4" },
  { n: 5,  client: "CIPRIANI",           title: "MR C Residence Dubai",        slug: "mr-c-residences",      thumb: "/work/all-work/5..jpg" },
  { n: 6,  client: "COLUMBIA SPORTSWEAR", title: "Ramadan Campaign",           thumb: "/work/all-work/6..jpg" },
  { n: 7,  client: "MASTERCARD",         title: "Sail Grand Prix x Luís Figo", slug: "mastercard-sailgp" },
  { n: 8,  client: "NIKE",               title: "Global Vomero 18 Activation", slug: "nike-vomero" },
  { n: 9,  client: "J.CREW",             title: "Abraham Moon",                slug: "abraham-moon" },
  { n: 10, client: "CHARLOTTE TILBURY",  title: "Disney 100 Campaign",         thumb: "/work/all-work/10.mp4" },
  { n: 11, client: "LOUIS VUITTON",      title: "The Glass Magazine",          slug: "glass-magazine",       thumb: "/work/all-work/11..jpg" },
  { n: 12, client: "TRIPPIN",            title: "6 Photographers on What Ethical Photography Means to Them", thumb: "/work/all-work/12.avif", link: "https://trippin.world/feature/through-the-lens-6-photographers-on-what-ethical-photography-means-to-them" },
  { n: 13, client: "MR PORTER",          title: "15 Ways To Improve Your Life, Japanese Style", thumb: "/work/all-work/13.jpg", link: "https://www.mrporter.com/en-us/journal/lifestyle/life-lessons-people-tokyo-japan-style-food-24538500" },
  { n: 14, client: "TRIPPIN",            title: "An Exploration of Mexico Through the Lens of Graciela Iturbide", thumb: "/work/all-work/14.webp", link: "https://trippin.world/feature/an-exploration-of-mexico-graciela-iturbide" },
  { n: 15, client: "MR PORTER",          title: "The Stylish Gent's Guide To 2022's Freshest Menswear Trends",  thumb: "/work/all-work/15.jpg", link: "https://www.mrporter.com/en-ch/journal/fashion/menswear-trends-forecast-street-style-2022-10321430" },
  { n: 16, client: "MR PORTER",          title: "Why You Should Shop (For Yourself) On MR PORTER",              thumb: "/work/all-work/16.jpg", link: "https://www.mrporter.com/en-dk/journal/fashion/women-shopping-buying-wearing-menswear-style-24622422" },
  { n: 17, client: "MR PORTER",          title: "Meet The Next Generation Of Black British Writers Telling Stories With Style", thumb: "/work/all-work/17.jpg", link: "https://www.mrporter.com/en-us/journal/fashion/black-history-month-uk-writers-portfolio-24605122" },
  { n: 18, client: "TRIPPIN",            title: "A History of Tattooing in Japan",                              thumb: "/work/all-work/18.avif",  link: "https://trippin.world/feature/a-history-of-tattooing-in-japan" },
  { n: 19, client: "MR PORTER",          title: "Feels On Wheels: Why Roller-Skating Is Like Therapy",          thumb: "/work/all-work/19.jpeg",  link: "https://www.mrporter.com/en-us/journal/lifestyle/tee-store-london-skate-scene-mental-health-in-mind-10716186" },
  { n: 20, client: "MR PORTER",          title: "Pride",                                                        thumb: "/work/all-work/20.jpg" },
  { n: 21, client: "MR PORTER",          title: "Helping Hands" },
  { n: 22, client: "MR PORTER",          title: "Ask MR PORTER" },
  { n: 23, client: "MR PORTER",          title: "Eight Striking Images Of New York City Through The Decades",   thumb: "/work/all-work/23.jpg", link: "https://www.mrporter.com/en-gb/journal/lifestyle/new-york-street-photography-bruce-davidson-vivian-maier-10037722" },
  { n: 24, client: "MR PORTER",          title: "Five Stylish Summertime Movies To Inspire Your Warm-Weather Wardrobe", thumb: "/work/all-work/24.jpg", link: "https://www.mrporter.com/en-us/journal/fashion/stylish-summer-movies-style-aesthetic-inspiration-1292852" },
  { n: 25, client: "MR PORTER",          title: "Five Ways To Freshen Up Your Work Wardrobe In 2020",           thumb: "/work/all-work/25.jpg", link: "https://www.mrporter.com/en-gb/journal/fashion/five-ways-to-freshen-up-your-work-wardrobe-in-2020-1086428" },
  { n: 26, client: "MR PORTER",          title: "What To Read, Watch And Do This Black History Month UK",       thumb: "/work/all-work/26.jpg", link: "https://www.mrporter.com/en-gb/journal/lifestyle/what-to-read-watch-see-do-black-history-month-uk-2021-10037134" },
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
    <div className="work-page" style={{ minHeight: "100vh", background: colors.bg, color: colors.text, position: "relative" }}>
      <style>{`
        /* Page is intentionally non-scrollbar-driven on /work — list hover advances the thumbs */
        html { scrollbar-width: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0; height: 0; display: none; }
        .work-page, .work-page * { cursor: none !important; }
      `}</style>
      <CustomCursor />
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
              const clickable = !!p.slug || !!p.link;
              const isHovered = hoveredIdx === idx;
              const isDimmed = hoveredIdx !== null && !isHovered;
              const onProjectClick = () => {
                if (p.slug) setActive(isActive ? null : p.slug);
                else if (p.link) window.open(p.link, "_blank", "noopener,noreferrer");
              };
              return (
                <button
                  key={p.n}
                  onMouseEnter={() => {
                    setHoveredIdx(idx);
                    onHoverProject(idx);
                  }}
                  onClick={onProjectClick}
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
                  <span>
                    {p.client ? (
                      <>
                        <span style={{ fontWeight: 700 }}>{p.client}</span>
                        <span style={{ fontWeight: 400 }}> - {p.title}</span>
                      </>
                    ) : (
                      <span style={{ fontWeight: 700 }}>{p.title}</span>
                    )}
                  </span>
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

        {/* Soft bottom fade — anchored inside the section, scrolls with it.
            Only covers the right half (the scattered thumb area). */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            right: 0,
            height: "12vh",
            background: `linear-gradient(to bottom, transparent 0%, ${colors.bg} 55%)`,
            pointerEvents: "none",
            zIndex: 4,
          }}
        />
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
      <button
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
        aria-label="Scroll to next section"
        style={{
          position: "absolute",
          bottom: space.lg,
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          padding: 8,
          cursor: "pointer",
          color: "#fff",
          fontFamily: HEROS_FONT,
          fontSize: 18,
          fontWeight: 400,
          lineHeight: 1,
          zIndex: 4,
        }}
      >
        ↓
      </button>
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

// Inline fade-in wrapper for thumb media — opacity 0 until the file decodes,
// editorial pulsing dots placeholder while loading.
function FadeInMedia({ src, isVideo }) {
  const [loaded, setLoaded] = useState(false);
  const style = {
    width: "100%",
    height: "auto",
    display: "block",
    opacity: loaded ? 1 : 0,
    transition: "opacity 0.5s ease-out",
  };
  return (
    <div style={{ position: "relative", background: colors.surface, aspectRatio: loaded ? undefined : "4 / 3", overflow: "hidden" }}>
      {!loaded && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            pointerEvents: "none",
          }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: colors.textMuted,
                animation: `dot-pulse 1.2s ${i * 0.18}s ease-in-out infinite`,
              }}
            />
          ))}
          <style>{`
            @keyframes dot-pulse {
              0%, 80%, 100% { opacity: 0.15; transform: scale(0.8); }
              40%           { opacity: 0.9;  transform: scale(1);   }
            }
          `}</style>
        </div>
      )}
      {isVideo ? (
        <video
          src={src}
          autoPlay muted loop playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          style={style}
        />
      ) : (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={style}
        />
      )}
    </div>
  );
}

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
          // Slide above the viewport — overflow:hidden on the parent clips
          leftPct = SCATTER_SLOTS[0].leftPct;
          topPct = -70 + slot * 8;
          width = SCATTER_SLOTS[0].width;
        } else {
          // Slide below the viewport — overflow:hidden on the parent clips
          leftPct = SCATTER_SLOTS[2].leftPct;
          topPct = 130 + (slot - SCATTER_SLOTS.length) * 8;
          width = SCATTER_SLOTS[2].width;
        }

        // Hover scaling: hovered project scales up, the other two visible
        // siblings scale down so the hovered one is unmistakable.
        let scale = 1;
        if (hoveredIdx !== null && visible) {
          scale = i === hoveredIdx ? 1.12 : 0.9;
        }

        // Per-project duration variation — slow, gentle glide. Wide spread
        // so thumbs arrive at visibly different times and bump as they transit.
        const dur = 3.5 + ((i * 37) % 100) / 60; // 3.5s..5.2s, deterministic per project
        const ease = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // soft overshoot/bounce

        // Use the project's own thumb if defined; fall back to a matching
        // productionCase heroImage; otherwise blank.
        const study = p.slug ? productionCases.find(s => s.slug === p.slug) : null;
        const thumbSrc = p.thumb || study?.heroImage;
        const isVideo = thumbSrc && /\.(mp4|webm|mov)$/i.test(thumbSrc);

        return (
          <div
            key={p.n}
            style={{
              position: "absolute",
              left: `${leftPct}%`,
              top: `${topPct}%`,
              width,
              transform: `scale(${scale})`,
              transformOrigin: "center",
              transition: `top ${dur}s ${ease}, left ${dur}s ${ease}, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)`,
              pointerEvents: visible ? "auto" : "none",
              willChange: "top, left, transform",
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
              <FadeInMedia src={thumbSrc} isVideo={isVideo} />
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
