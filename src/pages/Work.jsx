import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";
import { productionCases } from "../data/work";
import CustomCursor from "../components/CustomCursor";
import PlusMenu from "../components/PlusMenu";
import CaseStudyCard from "../components/CaseStudyCard";
import { useIsMobile } from "../hooks/useIsMobile";

const HEROS_FONT = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Numbered list. Items with a `slug` matching an existing productionCase open
// the case study panel on the right; the rest are placeholders for now.
// Category derived from the project's display number, used to swap the
// 'Select Work' header to the discipline name on hover.
function categoryFor(n) {
  if (n <= 17) return "Production";
  if (n <= 25) return "Strategy & Editorial";
  return "Visual Research";
}

// Each entry: { n, client?, title, slug?, link?, thumb? }
// - client is rendered bold, title regular (split by " - ")
// - slug opens the in-page case study panel
// - link opens the published article in a new tab
// Every project has a slug, used both for case-study popups (when a slug
// matches an entry in productionCases) and for stable deep-link URLs like
// /work#mr-porter-finneas regardless of whether a case study exists yet.
const PROJECTS = [
  { n: 1,  client: "CONDÉ NAST",          title: "Vogue Arabia Relaunch",       slug: "vogue-relaunch",                       thumb: "/work/all-work/01.jpg" },
  { n: 2,  client: "AMAN",                title: "Saudi Arabia & Dubai",        slug: "aman",                                 thumb: "/work/all-work/2..jpg" },
  { n: 3,  client: "MR PORTER",           title: "Finneas",                     slug: "mr-porter-finneas",                    thumb: "/work/all-work/3..webp" },
  { n: 4,  client: "ONE&ONLY",            title: "Moonlight Basin",             slug: "moonlight-basin",                      thumb: "/work/all-work/4..mp4.mp4" },
  { n: 5,  client: "CIPRIANI",            title: "MR C Residence Dubai",        slug: "mr-c-residences",                      thumb: "/work/all-work/5..jpg" },
  { n: 6,  client: "MR PORTER",           title: "In America",                  slug: "mr-porter-in-america",                 thumb: "/work/all-work/06.jpg" },
  { n: 7,  client: "COLUMBIA SPORTSWEAR", title: "Ramadan Campaign",            slug: "columbia-ramadan",                     thumb: "/work/all-work/7.jpg" },
  { n: 8,  client: "MASTERCARD",          title: "Sail Grand Prix x Luís Figo", slug: "mastercard-sailgp" },
  { n: 9,  client: "NIKE",                title: "Global Vomero 18 Activation", slug: "nike-vomero" },
  { n: 10, client: "J.CREW",              title: "Abraham Moon",                slug: "abraham-moon",                         thumb: "/work/all-work/10.mp4" },
  { n: 11, client: "CHARLOTTE TILBURY",   title: "Disney 100 Campaign",         slug: "charlotte-tilbury-disney",             thumb: "/work/all-work/11..jpg" },
  { n: 12, client: "LOUIS VUITTON",       title: "The Glass Magazine",          slug: "glass-magazine",                       thumb: "/work/all-work/12.jpg" },
  { n: 13, client: "HARVEY NICHOLS",      title: "Festive, Beauty",             slug: "harvey-nichols-festive-beauty",        thumb: "/work/all-work/13.jpg" },
  { n: 14, client: "GUESS",               title: "Global Ramadan Campaign",     slug: "guess-ramadan",                        thumb: "/work/all-work/14.jpg" },
  { n: 15, client: "SIRO HOTEL",          title: "Campaign",                    slug: "siro-hotel",                           thumb: "/work/all-work/15.jpg" },
  { n: 16, client: "HAMILTON WATCHES",    title: "Campaign",                    slug: "hamilton-watches",                     thumb: "/work/all-work/16.jpg" },
  { n: 17, client: "JUMEIRAH",            title: "Marsa Al Arab",               slug: "jumeirah-marsa-al-arab",               thumb: "/work/all-work/17.jpg" },
  { n: 18, client: "MR PORTER",           title: "Championing Subcultures",     slug: "mr-porter-championing-subcultures",    thumb: "/work/all-work/18.jpg", link: "https://www.mrporter.com/en-us/journal/lifestyle/tee-store-london-skate-scene-mental-health-in-mind-10716186" },
  { n: 19, client: "MR PORTER",           title: "Social Media Strategy",       slug: "mr-porter-social-media",               thumb: "/work/all-work/19.jpg" },
  { n: 20, client: "TRIPPIN",             title: "6 Photographers on What Ethical Photography Means to Them",                  slug: "trippin-ethical-photography",       thumb: "/work/all-work/20.avif", link: "https://trippin.world/feature/through-the-lens-6-photographers-on-what-ethical-photography-means-to-them" },
  { n: 21, client: "TRIPPIN",             title: "An Exploration of Mexico Through the Lens of Graciela Iturbide",              slug: "trippin-graciela-iturbide",         thumb: "/work/all-work/21.webp", link: "https://trippin.world/feature/an-exploration-of-mexico-graciela-iturbide" },
  { n: 22, client: "TRIPPIN",             title: "A History of Tattooing in Japan",                                            slug: "trippin-tattooing-japan",           thumb: "/work/all-work/22.avif", link: "https://trippin.world/feature/a-history-of-tattooing-in-japan" },
  { n: 23, client: "MR PORTER",           title: "The Stylish Gent's Guide To 2022's Freshest Menswear Trends",                slug: "mr-porter-menswear-trends-2022",    thumb: "/work/all-work/23.jpg",  link: "https://www.mrporter.com/en-ch/journal/fashion/menswear-trends-forecast-street-style-2022-10321430" },
  { n: 24, client: "MR PORTER",           title: "Why You Should Shop (For Yourself) On MR PORTER",                            slug: "mr-porter-women-shopping-menswear", thumb: "/work/all-work/24.jpg",  link: "https://www.mrporter.com/en-dk/journal/fashion/women-shopping-buying-wearing-menswear-style-24622422" },
  { n: 25, client: "MR PORTER",           title: "15 Ways To Improve Your Life, Japanese Style",                               slug: "mr-porter-japanese-style",          thumb: "/work/all-work/25.jpg",  link: "https://www.mrporter.com/en-us/journal/lifestyle/life-lessons-people-tokyo-japan-style-food-24538500" },
  { n: 26, client: "MR PORTER",           title: "Eight Striking Images Of New York City Through The Decades",                 slug: "mr-porter-new-york-street",         thumb: "/work/all-work/26.jpg",  link: "https://www.mrporter.com/en-gb/journal/lifestyle/new-york-street-photography-bruce-davidson-vivian-maier-10037722" },
  { n: 27, client: "MR PORTER",           title: "Five Stylish Summertime Movies To Inspire Your Warm-Weather Wardrobe",       slug: "mr-porter-summertime-movies",       thumb: "/work/all-work/27.jpg",  link: "https://www.mrporter.com/en-us/journal/fashion/stylish-summer-movies-style-aesthetic-inspiration-1292852" },
  { n: 28, client: "MR PORTER",           title: "Five Ways To Freshen Up Your Work Wardrobe In 2020",                         slug: "mr-porter-work-wardrobe-2020",      thumb: "/work/all-work/28.jpg",  link: "https://www.mrporter.com/en-gb/journal/fashion/five-ways-to-freshen-up-your-work-wardrobe-in-2020-1086428" },
  { n: 29, client: "MR PORTER",           title: "What To Read, Watch And Do This Black History Month UK",                     slug: "mr-porter-black-history-month-uk",  thumb: "/work/all-work/29.jpg",  link: "https://www.mrporter.com/en-gb/journal/lifestyle/what-to-read-watch-see-do-black-history-month-uk-2021-10037134" },
];

export default function Work() {
  const [activeSlug, setActiveSlug] = useState(null);
  const [windowStart, setWindowStart] = useState(0); // first project index in the 3-thumb window
  const [hoveredIdx, setHoveredIdx] = useState(null); // for dimming non-hovered titles
  const sectionRef = useRef(null);
  const rightPanelRef = useRef(null);
  const wheelTsRef = useRef(0);
  const isMobile = useIsMobile();

  // Declared up here so the wheel useEffect below can reference it without
  // hitting a TDZ error. Falls back to a minimal study object built from
  // the PROJECTS entry so deep links to slug-only projects (no productionCase
  // entry yet) still render a popup with the title / client / year fields
  // filled in. task / outcome / images are blank until data is added.
  const activeProject = activeSlug ? PROJECTS.find(p => p.slug === activeSlug) : null;
  const baseCase = productionCases.find(c => c.slug === activeSlug);
  // Merge minimal PROJECTS data into the case so editorial pieces that only
  // exist in PROJECTS still render the popup, and full case studies pick up
  // the project's `link` as viewProjectLink and `tags` if not explicitly
  // set in productionCases.
  const activeStudy = activeSlug && activeProject
    ? {
        slug: activeProject.slug,
        client: baseCase?.client ?? activeProject.client,
        project: baseCase?.project ?? activeProject.title,
        year: baseCase?.year ?? activeProject.year ?? "",
        task: baseCase?.task ?? "",
        outcome: baseCase?.outcome ?? "",
        images: baseCase?.images ?? activeProject.images ?? [],
        tags: baseCase?.tags ?? activeProject.tags ?? [],
        viewProjectLink: baseCase?.viewProjectLink ?? activeProject.link ?? null,
      }
    : null;

  // Restore selection from URL hash (so /work#aman or /work#siro-hotel deep-link)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && PROJECTS.find(p => p.slug === hash)) {
      setActiveSlug(hash);
    }
  }, []);

  // Snap-scroll between hero and work section, toggled on <html> for the
  // duration of this page only, removed on unmount.
  useEffect(() => {
    if (isMobile) return;
    document.documentElement.classList.add("work-snap-html");
    return () => document.documentElement.classList.remove("work-snap-html");
  }, [isMobile]);

  const onHoverProject = (index) => {
    const maxStart = Math.max(0, PROJECTS.length - 3);
    setWindowStart(Math.min(index, maxStart));
  };

  // Wheel inside the work section is locked to scatter advance, page
  // scroll is blocked, so the only way back to the hero is the ↑ button.
  // Uses a native non-passive listener so preventDefault() actually works.
  useEffect(() => {
    if (isMobile) return;
    const el = sectionRef.current;
    if (!el) return;
    const handler = (e) => {
      // If the wheel event originated inside the open popup, let it scroll
      // the popup natively, no preventDefault, no carousel advance.
      if (rightPanelRef.current && rightPanelRef.current.contains(e.target)) return;
      e.preventDefault();
      if (activeStudy) return;
      const now = Date.now();
      if (now - wheelTsRef.current < 180) return;
      wheelTsRef.current = now;
      const maxStart = Math.max(0, PROJECTS.length - 3);
      if (e.deltaY > 0) setWindowStart((s) => Math.min(s + 1, maxStart));
      else if (e.deltaY < 0) setWindowStart((s) => Math.max(s - 1, 0));
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [isMobile, activeStudy]);

  const scrollToHero = () => {
    const prev = sectionRef.current?.previousElementSibling;
    prev?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  return (
    <div className="work-page" style={{ minHeight: "100vh", background: colors.bg, color: colors.text, position: "relative" }}>
      <style>{`
        /* Page is intentionally non-scrollbar-driven on /work, list hover advances the thumbs */
        html { scrollbar-width: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0; height: 0; display: none; }
        .work-page, .work-page * { cursor: none !important; }
      `}</style>
      <CustomCursor enlargeOnHover />
      <PlusMenu />
      <WorkHero />

      {/* Full-width work section, fits exactly one viewport now that the
          thumbs advance from the list hover, not from page scroll. */}
      <div
        ref={sectionRef}
        className="m-work-section work-snap-section"
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Desktop editorial frame, top + bottom hairlines, with the
            ← Back to Home / ↑ on the top bar and © / ↓ on the bottom bar.
            Mobile keeps the legacy in-list back-to-home + bubble popup. */}
        {!isMobile && (
          <>
            <Link
              to="/"
              style={{
                position: "absolute",
                top: 28,
                left: space.lg,
                fontFamily: TIMES,
                fontSize: 14,
                fontWeight: 400,
                color: colors.text,
                textDecoration: "none",
                letterSpacing: 0,
                lineHeight: 1,
                zIndex: 20,
              }}
            >
              ← Back to Home
            </Link>
            <button
              onClick={scrollToHero}
              aria-label="Back to top"
              style={{
                position: "absolute",
                top: 22,
                left: "50%",
                transform: "translateX(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: colors.text,
                fontFamily: HEROS_FONT,
                fontSize: 18,
                fontWeight: 400,
                lineHeight: 1,
                padding: 8,
                zIndex: 20,
              }}
            >
              ↑
            </button>
            {/* Top hairline, split into left + right with a gap for the ↑ arrow */}
            <div aria-hidden="true" style={{ position: "absolute", top: 64, left: space.xxl, right: "calc(50% + 30px)", borderTop: `1px solid ${colors.text}`, zIndex: 15, pointerEvents: "none" }} />
            <div aria-hidden="true" style={{ position: "absolute", top: 64, left: "calc(50% + 30px)", right: space.xxl, borderTop: `1px solid ${colors.text}`, zIndex: 15, pointerEvents: "none" }} />
            {/* Bottom hairline, same split, gap aligns visually with the ↑ arrow above */}
            <div aria-hidden="true" style={{ position: "absolute", bottom: 64, left: space.xxl, right: "calc(50% + 30px)", borderTop: `1px solid ${colors.text}`, zIndex: 15, pointerEvents: "none" }} />
            <div aria-hidden="true" style={{ position: "absolute", bottom: 64, left: "calc(50% + 30px)", right: space.xxl, borderTop: `1px solid ${colors.text}`, zIndex: 15, pointerEvents: "none" }} />
          </>
        )}

        <div
          className="m-work-grid"
          style={{
            position: isMobile ? "relative" : "absolute",
            top: isMobile ? undefined : 64,
            left: isMobile ? undefined : 0,
            right: isMobile ? undefined : 0,
            bottom: isMobile ? undefined : 64,
            height: isMobile ? "auto" : undefined,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
          }}
        >
          {/* LEFT: list centred vertically; ← Back to Home sits beneath it */}
          <div
            className="m-work-list"
            style={{
              alignSelf: "center",
              paddingLeft: space.xxl,
              width: "fit-content",
            }}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div
              className="m-work-list-header"
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
              // Every project opens the popup (with View Project → link inside
              // for editorial pieces that link out). Falls back to a minimal
              // popup via activeStudy if no full productionCase exists yet.
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
            {isMobile && (
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
            )}
          </div>

          {/* RIGHT: 3 thumbs scattered at fixed positions inside the right half.
              paddingRight gutter matches the left list's paddingLeft for symmetry.
              Skipped on mobile, touch can't drive the hover-carousel.
              Fades out when a case study popup is active. */}
          {!isMobile && (
            <div
              className="m-scattered"
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                height: "100%",
                paddingLeft: space.xxl,
                paddingRight: space.xxl,
                boxSizing: "border-box",
                opacity: activeStudy ? 0 : 1,
                pointerEvents: activeStudy ? "none" : "auto",
                transition: "opacity 0.4s ease",
              }}
            >
              <ScatteredThumbs
                projects={PROJECTS}
                productionCases={productionCases}
                windowStart={windowStart}
                hoveredIdx={hoveredIdx}
                onProjectHover={(idx) => setHoveredIdx(idx)}
                onProjectClick={(p) => {
                  if (p.slug) setActive(p.slug);
                  else if (p.link) window.open(p.link, "_blank", "noopener,noreferrer");
                }}
              />
            </div>
          )}
        </div>

        {/* Case study popup, same visual identity as Menu / Contact
            (rounded card, 1px border, spring pop). Scrolls internally,
            no leading image, gallery rendered as a < > carousel at the bottom. */}
        {activeStudy && (
          <CaseStudyPopup
            key={activeStudy.slug}
            study={activeStudy}
            panelRef={rightPanelRef}
            onClose={() => setActive(null)}
            isMobile={isMobile}
          />
        )}

        {/* Soft top fade, mirror of the bottom one, anchored inside the
            section so it stays in place while the section is in view.
            Right gutter matches the list paddingLeft for symmetry. */}
        <div
          aria-hidden="true"
          className="m-work-fade-top"
          style={{
            position: "absolute",
            top: isMobile ? 0 : 64,
            left: "50%",
            right: space.xxl,
            height: "10vh",
            background: `linear-gradient(to top, transparent 0%, ${colors.bg} 55%)`,
            pointerEvents: "none",
            zIndex: 4,
          }}
        />

        {/* Soft bottom fade, anchored inside the section, scrolls with it. */}
        <div
          aria-hidden="true"
          className="m-work-fade-bottom"
          style={{
            position: "absolute",
            bottom: isMobile ? 0 : 64,
            left: "50%",
            right: space.xxl,
            height: "10vh",
            background: `linear-gradient(to bottom, transparent 0%, ${colors.bg} 55%)`,
            pointerEvents: "none",
            zIndex: 4,
          }}
        />
      </div>

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
          textAlign: "left",
        }}
      >
        © {new Date().getFullYear()} Emily Lucas
      </footer>

    </div>
  );
}

function WorkHero() {
  return (
    <section
      className="m-hero-section work-snap-section"
      style={{
        background: "#000",
        color: "#fff",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src="/work/moonlight-basin/03.jpg"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 72%",
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
          Project
        </div>
      </div>

      {/* Bottom-right: Overview */}
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
        Overview
      </div>

      {/* Bottom-left: All Work */}
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
        All Work
      </div>

      {/* Bottom-center: down arrow */}
      <button
        onClick={(e) => {
          const section = e.currentTarget.closest("section");
          const next = section?.nextElementSibling;
          if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
          else window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
        }}
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

// All projects rendered as a fluid carousel, each project slides through
// the three scattered slot positions as windowStart advances. Per-project
// transition duration varies so thumbs travel at slightly different speeds,
// crossing and bumping into each other as they transit between slots.
const SCATTER_SLOTS = [
  { leftPct: 8,  topPct: 6,  width: 220 },
  { leftPct: 52, topPct: 38, width: 200 },
  { leftPct: 18, topPct: 62, width: 240 },
];

// Inline fade-in wrapper for thumb media, opacity 0 until the file decodes,
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

function ScatteredThumbs({ projects, productionCases, windowStart, hoveredIdx, onProjectHover, onProjectClick }) {
  return (
    <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>
      {projects.map((p, i) => {
        const slot = i - windowStart; // -∞..-1 = off above, 0/1/2 = visible, 3..∞ = off below
        const visible = slot >= 0 && slot < SCATTER_SLOTS.length;

        let leftPct, topPct, width;
        if (visible) {
          ({ leftPct, topPct, width } = SCATTER_SLOTS[slot]);
        } else if (slot < 0) {
          // Slide above the viewport, overflow:hidden on the parent clips
          leftPct = SCATTER_SLOTS[0].leftPct;
          topPct = -70 + slot * 8;
          width = SCATTER_SLOTS[0].width;
        } else {
          // Slide below the viewport, overflow:hidden on the parent clips
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

        // Per-project duration variation, slow drift with a touch of weight,
        // but lighter than before so the carousel feels responsive.
        const dur = 5 + ((i * 37) % 100) / 30; // 5s..8.3s, deterministic per project
        const ease = "cubic-bezier(0.22, 1, 0.36, 1)"; // soft decel, no overshoot

        // Use the project's own thumb if defined; fall back to a matching
        // productionCase heroImage; otherwise blank.
        const study = p.slug ? productionCases.find(s => s.slug === p.slug) : null;
        const thumbSrc = p.thumb || study?.heroImage;
        const isVideo = thumbSrc && /\.(mp4|webm|mov)$/i.test(thumbSrc);

        const clickable = visible && (!!p.slug || !!p.link);
        return (
          <div
            key={p.n}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onMouseEnter={() => visible && onProjectHover?.(i)}
            onClick={() => clickable && onProjectClick?.(p)}
            onKeyDown={(e) => {
              if (clickable && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onProjectClick?.(p);
              }
            }}
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
              cursor: clickable ? "pointer" : "default",
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

function CaseStudyPopup({ study, panelRef, onClose, isMobile }) {
  const innerRef = useRef(null);
  const setRefs = (el) => {
    innerRef.current = el;
    if (typeof panelRef === "function") panelRef(el);
    else if (panelRef) panelRef.current = el;
  };

  return (
    // On desktop: centred inside the right hairline area.
    // On mobile: fixed full-screen overlay so the popup spans the whole viewport.
    <div
      style={{
        position: isMobile ? "fixed" : "absolute",
        top: isMobile ? 0 : 64,
        bottom: isMobile ? 0 : 64,
        left: isMobile ? 0 : `calc(50% + 30px)`,
        right: isMobile ? 0 : space.lg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: isMobile ? 1000 : 5,
        pointerEvents: "none",
        background: isMobile ? "rgba(255,255,255,0.92)" : "transparent",
        padding: isMobile ? 12 : 0,
      }}
    >
      <div style={{ position: "relative", width: isMobile ? "100%" : "min(560px, calc(100% - 32px))", maxWidth: isMobile ? 560 : undefined, pointerEvents: "auto" }}>
        <div
          className="case-popup m-case-popup"
          style={{
            position: "relative",
            width: "100%",
            height: isMobile ? "min(640px, calc(100vh - 80px))" : "min(540px, calc(100vh - 240px))",
            background: "#fff",
            overflow: "hidden",
            animation: "case-popup-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
            transformOrigin: "center",
          }}
        >
          <CaseStudyCard study={study} onClose={onClose} stagger bodyRef={setRefs} />
        </div>

        {/* End-of-scroll ↓, sits in the white space just below the popup card */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: -28,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: HEROS_FONT,
            fontSize: 16,
            fontWeight: 400,
            lineHeight: 1,
            color: colors.textMuted,
            pointerEvents: "none",
          }}
        >
          ↓
        </div>

        <style>{`
          @keyframes case-popup-in {
            from { opacity: 0; transform: scale(0.94); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

