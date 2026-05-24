import { colors, fonts, space, t } from "../theme";

// Placeholder case studies — content to be filled in during iteration.
// Each card eventually becomes a clickable case study page.
const CASE_STUDIES = [
  { id: "vogue-arabia", title: "Vogue Arabia", subtitle: "Editorial Authority — Condé Nast relaunch", year: "2024–2025" },
  { id: "aman", title: "Aman", subtitle: "Crafting visual identity in the absence of physical structures", year: "2024–2025" },
  { id: "nike", title: "Nike", subtitle: "Vomero 18 — global-to-local launch", year: "2025" },
  { id: "mr-porter", title: "MR PORTER", subtitle: "5-year US production lead", year: "2019–2024" },
  { id: "jcrew", title: "J.Crew", subtitle: "Roots & Craft — Abraham Moon mill", year: "2023" },
  { id: "charlotte-tilbury", title: "Charlotte Tilbury × Disney 100", subtitle: "$1M+ global activation", year: "2023" },
];

export default function Work() {
  return (
    <section style={{ padding: `${space.xl}px ${space.xl}px ${space.xxl}px`, maxWidth: 1400, margin: "0 auto", width: "100%" }}>
      <div style={{ marginBottom: space.xl }}>
        <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.sm }}>Work</div>
        <h2 style={{ ...t("h1"), fontFamily: fonts.serif }}>Selected Projects</h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: space.lg,
        }}
      >
        {CASE_STUDIES.map(study => (
          <CaseStudyCard key={study.id} study={study} />
        ))}
      </div>
    </section>
  );
}

function CaseStudyCard({ study }) {
  return (
    <article
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        aspectRatio: "4 / 5",
        padding: space.lg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = colors.text)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = colors.border)}
    >
      {/* Image placeholder area */}
      <div
        style={{
          flex: 1,
          background: "#eaeaea",
          marginBottom: space.lg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.textSubtle,
          ...t("label"),
        }}
      >
        Image
      </div>

      {/* Card text */}
      <div>
        <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.xs }}>{study.year}</div>
        <h3 style={{ ...t("h2"), marginBottom: space.xs }}>{study.title}</h3>
        <p style={{ ...t("body"), color: colors.textMuted }}>{study.subtitle}</p>
      </div>
    </article>
  );
}
