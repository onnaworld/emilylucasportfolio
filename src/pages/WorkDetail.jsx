import { useEffect, useRef, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { colors, space } from "../theme";
import { productionCases } from "../data/work";

const HEROS_FONT = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Brand-name italic Times treatment for inline mentions in body copy.
// Same set of names treated in the Work popup so the two surfaces match.
const BRAND_TERMS = [
  "MR PORTER", "MR PORTER's", "Vogue", "Vogue Arabia", "Condé Nast", "British Vogue",
  "Aman", "One&Only", "Cipriani", "Mr C", "Charlotte Tilbury", "J.Crew",
  "Nike", "Mastercard", "Trippin", "Columbia Sportswear", "Harvey Nichols",
  "Hamilton", "Jumeirah", "Marsa Al Arab", "Louis Vuitton", "Imaan Hammam",
  "Achraf Hakimi", "Halima Aden", "Balqees Fathi", "Luc Braquet", "Txema Yeste",
  "Willson Project", "Finneas", "Abraham Moon", "GUESS", "SIRO", "Wilson Project",
  "IMA MENA", "Tyla", "Alessandro Michele", "Luís Figo",
];

function withBrands(text) {
  if (!text) return null;
  // Sort longest first so multi-word brands (Vogue Arabia) match before Vogue.
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

export default function WorkDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const study = productionCases.find((c) => c.slug === slug);

  // Esc closes
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") navigate(-1); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navigate]);

  if (!study) return <Navigate to="/work" replace />;

  return (
    <div
      className="m-case-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) navigate(-1); }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20, 20, 20, 0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 100,
        overflowY: "auto",
        animation: "case-backdrop-in 0.35s ease-out both",
      }}
    >
      <div
        className="m-case-modal-card"
        style={{
          position: "relative",
          width: "min(640px, 100%)",
          maxHeight: "calc(100vh - 48px)",
          background: "#fff",
          color: colors.text,
          borderRadius: 14,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          animation: "case-modal-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        {/* × close inside the card */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: HEROS_FONT,
            fontSize: 22,
            lineHeight: 1,
            color: colors.text,
            zIndex: 5,
          }}
        >
          ×
        </button>

      <div
        className="m-case-modal-body"
        style={{
          padding: `${space.xl + 8}px ${space.xl}px ${space.xl}px`,
          overflowY: "auto",
        }}
      >
        {/* Project name */}
        <div
          style={{
            fontFamily: HEROS_FONT,
            fontWeight: 700,
            fontSize: "clamp(28px, 3.4vw, 44px)",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: colors.text,
            marginBottom: 8,
          }}
        >
          {study.project}
        </div>

        {/* Client (italic Times) + optional View Project link */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: space.md,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontFamily: TIMES,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(18px, 1.6vw, 22px)",
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

        {/* Year */}
        <div
          style={{
            fontFamily: HEROS_FONT,
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
            color: colors.textMuted,
            marginBottom: space.xl,
          }}
        >
          {study.year}
        </div>

        {study.task && (
          <div style={{ marginBottom: space.lg }}>
            <div
              style={{
                fontFamily: HEROS_FONT,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                color: colors.text,
                marginBottom: 8,
              }}
            >
              The Task
            </div>
            <p style={{ fontFamily: HEROS_FONT, fontSize: 15, fontWeight: 400, lineHeight: 1.55, color: colors.text, margin: 0 }}>
              {withBrands(study.task)}
            </p>
          </div>
        )}

        {study.outcome && (
          <div style={{ marginBottom: space.xl }}>
            <div
              style={{
                fontFamily: HEROS_FONT,
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                color: colors.text,
                marginBottom: 8,
              }}
            >
              The Outcome
            </div>
            <p style={{ fontFamily: HEROS_FONT, fontSize: 15, fontWeight: 400, lineHeight: 1.55, color: colors.text, margin: 0 }}>
              {withBrands(study.outcome)}
            </p>
          </div>
        )}

        {study.images && study.images.length > 0 && (
          <FullBleedCarousel images={study.images} project={study.project} />
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
                  background: "#ececec",
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

        <Link
          to="/work"
          style={{
            display: "inline-block",
            marginTop: space.xxl,
            fontFamily: TIMES,
            fontStyle: "italic",
            fontSize: 15,
            color: colors.text,
            textDecoration: "none",
            borderBottom: `1px solid ${colors.text}`,
            paddingBottom: 1,
          }}
        >
          ← Back to all work
        </Link>
      </div>
      </div>

      <style>{`
        @keyframes case-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes case-modal-in {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

function isVideoSrc(src) {
  return src && /\.(mp4|webm|mov)$/i.test(src);
}

function FullBleedCarousel({ images, project }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const step = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const itemW = el.clientWidth * 0.7;
    el.scrollBy({ left: dir * itemW, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: 8,
          scrollbarWidth: "none",
        }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            style={{
              flex: "0 0 auto",
              width: "min(420px, 80%)",
              height: 240,
              background: colors.surface || "#f3f3f3",
              overflow: "hidden",
              scrollSnapAlign: "start",
            }}
          >
            {isVideoSrc(src) ? (
              <video
                src={src}
                autoPlay muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            ) : (
              <img
                src={src}
                alt={`${project} – ${i + 1}`}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            )}
          </div>
        ))}
      </div>

      {canPrev && <CarouselArrow dir="prev" onClick={() => step(-1)} />}
      {canNext && <CarouselArrow dir="next" onClick={() => step(1)} />}
    </div>
  );
}

function CarouselArrow({ dir, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      style={{
        position: "absolute",
        top: "50%",
        [dir === "prev" ? "left" : "right"]: -8,
        transform: "translateY(-50%)",
        width: 40,
        height: 40,
        borderRadius: 999,
        background: "rgba(255,255,255,0.9)",
        border: `1px solid ${colors.border || "#d8d8d8"}`,
        cursor: "pointer",
        fontFamily: HEROS_FONT,
        fontSize: 18,
        color: colors.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}
