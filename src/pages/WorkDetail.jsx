import { useParams, Link, Navigate } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";
import { productionCases } from "../data/work";

export default function WorkDetail() {
  const { slug } = useParams();
  const study = productionCases.find(c => c.slug === slug);

  if (!study) return <Navigate to="/work" replace />;

  return (
    <article style={{ width: "100%" }}>
      {/* Hero, full-bleed video or image */}
      <div
        style={{
          width: "100%",
          background: "#000",
          position: "relative",
          aspectRatio: study.heroVideo ? "16 / 9" : "16 / 10",
          overflow: "hidden",
        }}
      >
        {study.heroVideo ? (
          <video
            src={study.heroVideo}
            poster={study.heroImage}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : study.heroImage ? (
          <img
            src={study.heroImage}
            alt={study.project}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : null}
      </div>

      {/* Body */}
      <div
        className="m-workdetail-body"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: `${space.xl}px ${space.xl}px ${space.xxl}px`,
        }}
      >
        {/* Back link */}
        <Link to="/work" style={{ ...t("label"), color: colors.textMuted, display: "inline-block", marginBottom: space.lg }}>
          ← Back to Work
        </Link>

        {/* Meta */}
        <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.sm }}>
          {study.year} · {study.client}
        </div>

        {/* Project name */}
        <h1 style={{ ...t("h2"), fontSize: 24, fontWeight: 400, color: colors.textMuted, marginBottom: space.sm, letterSpacing: 0.3 }}>
          {study.project}
        </h1>

        {/* Title (the lede) */}
        <h2 style={{ ...t("h1"), fontFamily: fonts.serif, fontSize: 40, lineHeight: 1.15, marginBottom: space.xl }}>
          {study.title}
        </h2>

        {/* Task / Outcome */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: space.xl, marginBottom: space.xxl }}>
          <Block label="The Task" body={study.task} />
          <Block label="The Outcome" body={study.outcome} />
        </div>

        {/* Image gallery */}
        {study.images && study.images.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: space.md,
              marginBottom: space.xxl,
            }}
          >
            {study.images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${study.project} – ${i + 1}`}
                loading="lazy"
                style={{ width: "100%", height: "auto", display: "block", background: colors.surface }}
              />
            ))}
          </div>
        )}

        {/* Next/back navigation */}
        <NextPrev currentSlug={study.slug} />
      </div>
    </article>
  );
}

function Block({ label, body }) {
  return (
    <div>
      <div style={{ ...t("label"), color: colors.text, marginBottom: space.md }}>{label}</div>
      <p style={{ ...t("body"), fontSize: 17, lineHeight: 1.65, color: colors.text }}>{body}</p>
    </div>
  );
}

function NextPrev({ currentSlug }) {
  const idx = productionCases.findIndex(c => c.slug === currentSlug);
  if (idx === -1) return null;
  const prev = idx > 0 ? productionCases[idx - 1] : null;
  const next = idx < productionCases.length - 1 ? productionCases[idx + 1] : null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderTop: `1px solid ${colors.border}`,
        paddingTop: space.lg,
        gap: space.lg,
      }}
    >
      <div style={{ flex: 1 }}>
        {prev && (
          <Link to={`/work/${prev.slug}`} style={{ display: "block" }}>
            <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.xs }}>← Previous</div>
            <div style={{ ...t("h3"), fontSize: 16 }}>{prev.project}</div>
          </Link>
        )}
      </div>
      <div style={{ flex: 1, textAlign: "right" }}>
        {next && (
          <Link to={`/work/${next.slug}`} style={{ display: "block" }}>
            <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.xs }}>Next →</div>
            <div style={{ ...t("h3"), fontSize: 16 }}>{next.project}</div>
          </Link>
        )}
      </div>
    </div>
  );
}
