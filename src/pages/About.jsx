import { colors, fonts, space, t } from "../theme";

export default function About() {
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
        <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.sm }}>About</div>
        <h2 style={{ ...t("h1"), fontFamily: fonts.serif }}>Bio</h2>
      </div>

      <div style={{ ...t("body"), fontSize: 17, lineHeight: 1.7, color: colors.text, marginBottom: space.xl }}>
        <p style={{ marginBottom: space.lg }}>
          [Placeholder bio paragraph — to be written in iteration. Cover: where you started, the career arc through MR PORTER, Harvey Nichols, Vogue Arabia and ONNA, what draws you to this work, what you're known for.]
        </p>
        <p style={{ marginBottom: space.lg }}>
          [Second paragraph — voice, point of view, the kind of work you take on, the way you collaborate.]
        </p>
        <p>
          [Closing paragraph — where you are now, where you're heading.]
        </p>
      </div>

      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: space.lg, marginBottom: space.xl }}>
        <h3 style={{ ...t("label"), color: colors.textMuted, marginBottom: space.md }}>Citizenship</h3>
        <p style={{ ...t("body"), color: colors.text }}>US · UK · Japanese</p>
      </div>

      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: space.lg, marginBottom: space.xl }}>
        <h3 style={{ ...t("label"), color: colors.textMuted, marginBottom: space.md }}>Languages</h3>
        <p style={{ ...t("body"), color: colors.text }}>English (native) · Spanish (intermediate) · Japanese (intermediate)</p>
      </div>

      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: space.lg }}>
        <h3 style={{ ...t("label"), color: colors.textMuted, marginBottom: space.md }}>Markets</h3>
        <p style={{ ...t("body"), color: colors.text }}>UK · GCC · Japan · US</p>
      </div>
    </section>
  );
}
