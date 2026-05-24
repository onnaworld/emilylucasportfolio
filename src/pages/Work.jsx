import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";
import { productionCases } from "../data/work";

export default function Work() {
  const [activeSlug, setActiveSlug] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const rightPanelRef = useRef(null);

  // Restore selection from URL hash (so /work#aman deep-links)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && productionCases.find(c => c.slug === hash)) {
      setActiveSlug(hash);
    }
  }, []);

  // Parallax glide on scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      <TopBar activeStudy={activeStudy} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr 1.4fr",
          gap: 0,
          position: "relative",
          minHeight: "100vh",
          padding: `${space.xl}px ${space.xl}px ${space.xxl}px`,
        }}
      >
        {/* ─── LEFT: huge "Works," + scattered numbered thumbs ─── */}
        <div style={{ position: "relative", minHeight: "240vh" }}>
          <h1
            style={{
              fontFamily: fonts.sans,
              fontWeight: 900,
              fontSize: "clamp(80px, 13vw, 200px)",
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              margin: 0,
              marginBottom: space.xxl,
            }}
          >
            Works,
          </h1>
          {productionCases.map((study, i) => (
            <ScatterThumb
              key={study.slug}
              study={study}
              index={i + 1}
              scrollY={scrollY}
              active={activeSlug === study.slug}
              onClick={() => setActive(study.slug)}
            />
          ))}
        </div>

        {/* ─── CENTER: project list (sticky) ─── */}
        <div
          style={{
            position: "sticky",
            top: 80,
            alignSelf: "start",
            height: "fit-content",
            paddingTop: space.xxl,
            paddingLeft: space.xl,
          }}
        >
          {productionCases.map(study => {
            const isActive = activeSlug === study.slug;
            return (
              <div key={study.slug} style={{ padding: "3px 0" }}>
                <button
                  onClick={() => setActive(isActive ? null : study.slug)}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.color = colors.text;
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.color = colors.textMuted;
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: fonts.sans,
                    fontSize: 13,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                    color: isActive ? colors.text : colors.textMuted,
                    fontWeight: isActive ? 700 : 500,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: space.md,
                    transition: "color 0.15s",
                    textAlign: "left",
                  }}
                >
                  <span>{study.project}</span>
                  <span style={{ opacity: isActive ? 1 : 0, fontSize: 10 }}>◀</span>
                </button>
              </div>
            );
          })}

          <div style={{ marginTop: space.xxl, ...t("body"), fontWeight: 700, fontSize: 14 }}>
            Emily Lucas
          </div>
        </div>

        {/* ─── RIGHT: case study panel ─── */}
        <div
          ref={rightPanelRef}
          style={{
            paddingLeft: space.xl,
            paddingTop: space.xxl,
          }}
        >
          {activeStudy ? (
            <CaseStudyView study={activeStudy} />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}

function TopBar({ activeStudy }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: colors.bg,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        alignItems: "center",
        padding: `${space.lg}px ${space.xl}px`,
        fontFamily: fonts.sans,
        fontSize: 13,
        letterSpacing: 0.3,
      }}
    >
      <div>
        <Link to="/" style={{ color: colors.text, fontWeight: 600 }}>← Index</Link>
      </div>
      <div style={{ textAlign: "center" }}>
        <span style={{ color: colors.text, fontWeight: 600 }}>Works,</span>
        <Link to="/about" style={{ color: colors.textMuted, marginLeft: 6 }}>About,</Link>
        <Link to="/contact" style={{ color: colors.textMuted, marginLeft: 4 }}>Contact</Link>
      </div>
      <div style={{ textAlign: "right", color: colors.textMuted, minHeight: 18 }}>
        {activeStudy ? `${activeStudy.year}, ${activeStudy.client}` : ""}
      </div>
    </header>
  );
}

function ScatterThumb({ study, index, scrollY, active, onClick }) {
  const positions = [
    { left: "8%",  top: 380,  width: 200, speed: 0.10 },
    { left: "62%", top: 180,  width: 170, speed: 0.18 },
    { left: "20%", top: 760,  width: 180, speed: 0.06 },
    { left: "55%", top: 980,  width: 210, speed: 0.14 },
    { left: "5%",  top: 1240, width: 160, speed: 0.20 },
    { left: "50%", top: 1480, width: 190, speed: 0.08 },
    { left: "15%", top: 1740, width: 220, speed: 0.16 },
    { left: "60%", top: 1960, width: 170, speed: 0.10 },
    { left: "10%", top: 2240, width: 190, speed: 0.18 },
    { left: "55%", top: 2480, width: 200, speed: 0.07 },
    { left: "25%", top: 2760, width: 175, speed: 0.13 },
  ];
  const p = positions[index - 1] || { left: "20%", top: index * 280, width: 180, speed: 0.1 };
  const glide = -scrollY * p.speed;

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left: p.left,
        top: p.top,
        width: p.width,
        cursor: "pointer",
        transform: `translateY(${glide}px)`,
        transition: "opacity 0.25s",
        opacity: active ? 1 : 0.92,
        willChange: "transform",
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontWeight: 900,
          fontSize: 36,
          letterSpacing: "-0.04em",
          marginBottom: space.sm,
          color: colors.text,
        }}
      >
        {String(index).padStart(2, "0")}
      </div>
      {study.heroImage && (
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
      )}
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
