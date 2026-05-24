import { Link } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";

export default function Landing() {
  return (
    <section
      style={{
        minHeight: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: `${space.xxl}px ${space.xl}px`,
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div style={{ ...t("label"), color: colors.textMuted, marginBottom: space.lg }}>
        Senior Producer · NYC from July 2026
      </div>
      <h1 style={{ ...t("display"), fontFamily: fonts.serif, marginBottom: space.lg, fontSize: "clamp(48px, 9vw, 96px)" }}>
        Emily Lucas
      </h1>
      <p
        style={{
          ...t("body"),
          fontSize: 20,
          maxWidth: 720,
          color: colors.textMuted,
          marginBottom: space.xl,
          lineHeight: 1.5,
        }}
      >
        Senior Producer with 7+ years across editorial publishing and luxury production. Founder of ONNA Production. Clients include Aman, Nike, Vogue Arabia (Condé Nast), Tiffany & Co., and Bvlgari.
      </p>
      <div style={{ display: "flex", gap: space.lg, flexWrap: "wrap" }}>
        <Link
          to="/work"
          style={{
            ...t("small"),
            textTransform: "uppercase",
            padding: `${space.md}px ${space.lg}px`,
            background: colors.text,
            color: colors.bg,
            display: "inline-block",
          }}
        >
          View Work →
        </Link>
        <Link
          to="/contact"
          style={{
            ...t("small"),
            textTransform: "uppercase",
            padding: `${space.md}px ${space.lg}px`,
            border: `1px solid ${colors.text}`,
            display: "inline-block",
          }}
        >
          Get in Touch
        </Link>
      </div>
    </section>
  );
}
