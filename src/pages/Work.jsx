import { Link } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";
import { productionCases, editorialPieces } from "../data/work";

export default function Work() {
  return (
    <section style={{ padding: `${space.xl}px ${space.xl}px ${space.xxl}px`, maxWidth: 1400, margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: space.xl }}>
        <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.sm }}>Work</div>
        <h2 style={{ ...t("h1"), fontFamily: fonts.serif }}>Selected Work</h2>
      </div>

      {/* ── Section: Production ── */}
      <SectionHeader label="Production" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: space.lg,
          marginBottom: space.xxl,
        }}
      >
        {productionCases.map(study => (
          <ProductionCard key={study.slug} study={study} />
        ))}
      </div>

      {/* ── Section: Writing & Research ── */}
      <SectionHeader label="Writing & Research" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: 0,
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        {editorialPieces.map(piece => (
          <EditorialCard key={piece.id} piece={piece} />
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ label }) {
  return (
    <div style={{ marginBottom: space.lg, marginTop: space.xl }}>
      <div style={{ ...t("label"), color: colors.text, borderBottom: `1px solid ${colors.text}`, paddingBottom: space.sm, marginBottom: space.lg }}>
        {label}
      </div>
    </div>
  );
}

function ProductionCard({ study }) {
  return (
    <Link
      to={`/work/${study.slug}`}
      style={{
        display: "block",
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        aspectRatio: "4 / 5",
        padding: space.lg,
        cursor: "pointer",
        transition: "border-color 0.15s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = colors.text)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = colors.border)}
    >
      <article style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        {/* Image area */}
        <div
          style={{
            flex: 1,
            background: colors.surface,
            marginBottom: space.lg,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {study.heroImage ? (
            <img
              src={study.heroImage}
              alt={study.project}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ ...t("label"), color: colors.textSubtle }}>Image</span>
          )}
        </div>

        {/* Card text */}
        <div>
          <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.xs }}>
            {study.year} · {study.client}
          </div>
          <h3 style={{ ...t("h3"), marginBottom: space.xs, fontSize: 18 }}>{study.project}</h3>
          <p style={{ ...t("small"), color: colors.textMuted, fontSize: 13, lineHeight: 1.5 }}>
            {study.title}
          </p>
        </div>
      </article>
    </Link>
  );
}

function EditorialCard({ piece }) {
  const content = (
    <article
      style={{
        padding: `${space.lg}px ${space.md}px`,
        borderBottom: `1px solid ${colors.border}`,
        cursor: piece.externalLink ? "pointer" : "default",
        transition: "padding-left 0.15s, background 0.15s",
      }}
      onMouseEnter={e => {
        if (!piece.externalLink) return;
        e.currentTarget.style.paddingLeft = `${space.lg}px`;
        e.currentTarget.style.background = colors.surface;
      }}
      onMouseLeave={e => {
        if (!piece.externalLink) return;
        e.currentTarget.style.paddingLeft = `${space.md}px`;
        e.currentTarget.style.background = "transparent";
      }}
    >
      <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.xs }}>
        {piece.publication} · {piece.year}
      </div>
      <h3 style={{ ...t("h3"), marginBottom: space.sm, fontSize: 17, lineHeight: 1.3 }}>{piece.title}</h3>
      <p style={{ ...t("body"), color: colors.textMuted, fontSize: 14, marginBottom: space.sm }}>{piece.excerpt}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: space.sm }}>
        <span style={{ ...t("small"), color: colors.textSubtle, fontSize: 11 }}>{piece.role}</span>
        {piece.externalLink && (
          <span style={{ ...t("small"), color: colors.text, fontWeight: 600, fontSize: 12 }}>Read article →</span>
        )}
      </div>
    </article>
  );

  if (piece.externalLink) {
    return (
      <a href={piece.externalLink} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
        {content}
      </a>
    );
  }
  return content;
}
