import { useRef } from "react";
import { colors, space } from "../theme";

const HEROS_FONT = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Italicise these as Times brand-name mentions inside Task / Outcome body
// copy. Kept in one place so /work and /production stay in sync.
const BRAND_TERMS = [
  "MR PORTER", "MR PORTER's", "Vogue", "Vogue Arabia", "Condé Nast", "British Vogue",
  "Aman", "One&Only", "Cipriani", "Mr C", "Charlotte Tilbury", "J.Crew",
  "Nike", "Mastercard", "Trippin", "Columbia Sportswear", "Harvey Nichols",
  "Hamilton", "Jumeirah", "Marsa Al Arab", "Louis Vuitton", "Imaan Hammam",
  "Achraf Hakimi", "Halima Aden", "Balqees Fathi", "Luc Braquet", "Txema Yeste",
  "Willson Project", "Wilson Project", "Finneas", "Abraham Moon", "GUESS", "SIRO",
  "IMA MENA", "Tyla", "Alessandro Michele", "Luís Figo",
];

export function withBrands(text) {
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

// Inner card: × button + top/bottom fades + scrollable body with the
// project fields. Caller wraps in its own outer white card / backdrop /
// positioning, so /work can anchor right and /production can center.
//
// Props:
//   study     — productionCases entry
//   onClose   — close handler (the × button calls it)
//   stagger   — when true, rows animate in with a staggered delay
//               (matches the /work popup feel)
//   bodyRef   — optional ref to the inner scrollable element
//   onScroll  — optional scroll handler (e.g. for end-of-scroll detection)
export default function CaseStudyCard({ study, onClose, stagger = false, bodyRef, onScroll }) {
  const anim = (delay) =>
    stagger
      ? `cs-card-row-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`
      : undefined;

  return (
    <>
      {/* Top + bottom fade gradients (mask scroll edges) */}
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
        ref={bodyRef}
        onScroll={onScroll}
        className="cs-card-scroll"
        style={{
          width: "100%",
          height: "100%",
          overflowY: "auto",
          overscrollBehavior: "contain",
          padding: `${space.md}px ${space.lg}px ${space.lg}px`,
          position: "relative",
        }}
      >
        {/* Client (italic Times, lead line) + optional View Project link */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: space.md,
            marginTop: space.sm,
            marginBottom: 2,
            animation: anim(0.15),
          }}
        >
          <div
            style={{
              fontFamily: TIMES,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 28,
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: colors.text,
            }}
          >
            {study.client}
          </div>
          {study.viewProjectLink && (() => {
            const raw = Array.isArray(study.viewProjectLink) ? study.viewProjectLink : [study.viewProjectLink];
            const links = raw.map((l) => typeof l === "string" ? { label: "View Project →", url: l } : l);
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

        {/* Project name (smaller subheading under client) */}
        <div
          style={{
            fontFamily: HEROS_FONT,
            fontWeight: 700,
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
            color: colors.text,
            marginBottom: 10,
            animation: anim(0.22),
          }}
        >
          {study.project}
        </div>

        {/* Year */}
        <div
          style={{
            fontFamily: HEROS_FONT,
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            color: colors.textMuted,
            marginBottom: space.md,
            animation: anim(0.28),
          }}
        >
          {study.year}
        </div>

        {study.task && (
          <div style={{ marginBottom: space.md, animation: anim(0.30) }}>
            <div style={{ fontFamily: HEROS_FONT, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.01em", color: colors.text, marginBottom: 6 }}>
              The Task
            </div>
            <p style={{ fontFamily: HEROS_FONT, fontSize: 12, fontWeight: 400, lineHeight: 1.55, color: colors.text, margin: 0 }}>
              {withBrands(study.task)}
            </p>
          </div>
        )}

        {study.outcome && (
          <div style={{ marginBottom: space.md, animation: anim(0.38) }}>
            <div style={{ fontFamily: HEROS_FONT, fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.01em", color: colors.text, marginBottom: 6 }}>
              The Outcome
            </div>
            <p style={{ fontFamily: HEROS_FONT, fontSize: 12, fontWeight: 400, lineHeight: 1.55, color: colors.text, margin: 0 }}>
              {withBrands(study.outcome)}
            </p>
          </div>
        )}

        {study.images && study.images.length > 0 && (
          <div style={{ animation: anim(0.46) }}>
            <Carousel images={study.images} project={study.project} />
          </div>
        )}

        {study.tags && study.tags.length > 0 && (
          <div style={{ marginTop: space.lg, display: "flex", flexWrap: "wrap", gap: 6, animation: anim(0.54) }}>
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

      <style>{`
        @keyframes cs-card-row-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cs-card-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .cs-card-scroll::-webkit-scrollbar { display: none; width: 0; }
      `}</style>
    </>
  );
}

// Internal image carousel — fixed height, auto width (portraits stay
// portrait), explicit touch swipe + ‹ › chevrons in the side gutter.
function Carousel({ images, project }) {
  const trackRef = useRef(null);
  const touchRef = useRef({ x: 0, y: 0, t: 0 });

  const step = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    const dt = Date.now() - touchRef.current.t;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 700) {
      step(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div style={{ position: "relative", paddingLeft: 22, paddingRight: 22 }}>
      <div
        ref={trackRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="cs-card-scroll cs-card-carousel"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          touchAction: "pan-x",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 4,
        }}
      >
        {images.map((src, i) => {
          // Fixed height, width follows native aspect ratio so portrait
          // stays portrait and landscape stays landscape.
          const common = {
            flex: "0 0 auto",
            height: 220,
            width: "auto",
            maxWidth: "85%",
            minWidth: 160,
            display: "block",
            scrollSnapAlign: "start",
            borderRadius: 4,
            background: "rgba(0,0,0,0.05)",
            objectFit: "cover",
          };
          return /\.(mp4|webm|mov)$/i.test(src) ? (
            <video
              key={i}
              src={src}
              autoPlay muted loop playsInline
              preload={i < 2 ? "auto" : "metadata"}
              style={common}
            />
          ) : (
            <img
              key={i}
              src={src}
              alt={`${project} – ${i + 1}`}
              loading={i < 2 ? "eager" : "lazy"}
              fetchpriority={i === 0 ? "high" : "auto"}
              decoding="async"
              draggable={false}
              style={common}
            />
          );
        })}
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={() => step(-1)}
            aria-label="Previous"
            style={{
              position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)",
              background: "none", border: "none", padding: 4, cursor: "pointer",
              fontFamily: HEROS_FONT, fontSize: 22, fontWeight: 400, lineHeight: 1, color: colors.text,
            }}
          >‹</button>
          <button
            onClick={() => step(1)}
            aria-label="Next"
            style={{
              position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)",
              background: "none", border: "none", padding: 4, cursor: "pointer",
              fontFamily: HEROS_FONT, fontSize: 22, fontWeight: 400, lineHeight: 1, color: colors.text,
            }}
          >›</button>
        </>
      )}
    </div>
  );
}
