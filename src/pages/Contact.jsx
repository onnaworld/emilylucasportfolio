import { colors, fonts, space, t } from "../theme";

const LINES = [
  { label: "Email", value: "emilyelucas@gmail.com", href: "mailto:emilyelucas@gmail.com" },
  { label: "Phone", value: "+1 (917) 735-8545", href: "tel:+19177358545" },
  { label: "LinkedIn", value: "linkedin.com/in/emilylucas", href: "https://linkedin.com/in/emilylucas" },
  { label: "Production Studio", value: "onnaproduction.com", href: "https://onnaproduction.com" },
];

export default function Contact() {
  return (
    <section
      style={{
        padding: `${space.xl}px ${space.xl}px ${space.xxl}px`,
        maxWidth: 900,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div style={{ marginBottom: space.xl }}>
        <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.sm }}>Contact</div>
        <h2 style={{ ...t("h1"), fontFamily: fonts.serif }}>Get in Touch</h2>
      </div>

      <p style={{ ...t("body"), fontSize: 17, color: colors.textMuted, marginBottom: space.xl, maxWidth: 600 }}>
        Currently relocating to Brooklyn, NY (July 2026). Available for editorial production, branded content, and consulting engagements.
      </p>

      <div style={{ borderTop: `1px solid ${colors.border}` }}>
        {LINES.map(line => (
          <a
            key={line.label}
            href={line.href}
            target={line.href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              padding: `${space.lg}px 0`,
              borderBottom: `1px solid ${colors.border}`,
              transition: "padding-left 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.paddingLeft = `${space.md}px`)}
            onMouseLeave={e => (e.currentTarget.style.paddingLeft = "0")}
          >
            <span style={{ ...t("label"), color: colors.textMuted }}>{line.label}</span>
            <span style={{ ...t("body"), fontSize: 17, color: colors.text }}>{line.value}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
