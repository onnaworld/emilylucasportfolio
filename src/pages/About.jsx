import { useState } from "react";
import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";
import CustomCursor from "../components/CustomCursor";
import ContactModal from "../components/ContactModal";

const HEROS = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";
const HINOMARU = "#BC002D";

function SectionHeading({ children }) {
  return (
    <div
      style={{
        fontFamily: HEROS,
        fontSize: "clamp(13px, 1vw, 15px)",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: colors.text,
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
}

function DotItem({ children }) {
  return (
    <li
      style={{
        display: "flex",
        gap: 12,
        alignItems: "baseline",
        marginBottom: 14,
        fontFamily: HEROS,
        fontSize: "clamp(13px, 1vw, 15px)",
        fontWeight: 400,
        lineHeight: 1.45,
        color: colors.text,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          color: HINOMARU,
          fontSize: "1.1em",
          lineHeight: 1,
          alignSelf: "center",
          transform: "translateY(-1px)",
        }}
      >
        •
      </span>
      <span>{children}</span>
    </li>
  );
}

export default function About() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div
      className="about-page"
      style={{
        background: colors.bg,
        color: colors.text,
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        .about-page, .about-page * { cursor: none !important; }
      `}</style>
      <CustomCursor enlargeOnHover />
      <PlusMenu />

      {/* Top hairline border across the page */}
      <div style={{ borderTop: `1px solid ${colors.text}`, width: "100%" }} />

      {/* ← home, sits just under the top hairline */}
      <div
        style={{
          padding: `${space.lg}px ${space.xl}px 0`,
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
          }}
        >
          ← Home
        </Link>
      </div>

      {/* Main content body */}
      <div
        className="m-about-body"
        style={{
          flex: 1,
          padding: `${space.lg}px ${space.xl}px ${space.xxl}px`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Big About title */}
        <h1
          style={{
            fontFamily: HEROS,
            fontWeight: 700,
            fontSize: "clamp(72px, 11vw, 168px)",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            margin: 0,
            color: colors.text,
          }}
        >
          About
        </h1>

        {/* Bio paragraph */}
        <p
          className="m-about-bio"
          style={{
            fontFamily: TIMES,
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(20px, 1.9vw, 28px)",
            lineHeight: 1.35,
            color: colors.text,
            margin: `${space.xl}px 0 0`,
            maxWidth: "min(880px, 70%)",
          }}
        >
          My work sits at the intersection of four cultures, shaped by
          growing up in Tokyo and working across London, Dubai, New York
          and Japan. I&rsquo;m most interested in production that emerges
          from inside the communities it represents, and in advisory work
          that helps brands build editorial systems that match their
          cultural ambitions.
        </p>

        {/* Two-column section: SELECTED EXPERIENCE | SERVICES */}
        <div
          className="m-about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(40px, 6vw, 96px)",
            marginTop: "clamp(56px, 7vw, 96px)",
            maxWidth: "min(1280px, 92%)",
          }}
        >
          <div>
            <SectionHeading>Selected Experience</SectionHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <DotItem>
                Executive Producer &amp; Cultural Strategy Consultant —{" "}
                <em style={{ fontFamily: TIMES, fontStyle: "italic" }}>Independent</em>
                <span style={{ color: colors.textMuted }}> (2024–present)</span>
              </DotItem>
              <DotItem>
                Senior Editorial Producer —{" "}
                <em style={{ fontFamily: TIMES, fontStyle: "italic" }}>Harvey Nichols</em>
                <span style={{ color: colors.textMuted }}> (2024)</span>
              </DotItem>
              <DotItem>
                Producer —{" "}
                <em style={{ fontFamily: TIMES, fontStyle: "italic" }}>MR PORTER, Net-a-Porter Group</em>
                <span style={{ color: colors.textMuted }}> (2019–2024)</span>
              </DotItem>
            </ul>
          </div>

          <div>
            <SectionHeading>Available For</SectionHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <DotItem>Executive production across stills, video, brand films and editorial shoots</DotItem>
              <DotItem>Regional production &amp; consultancy across GCC, Japan, London and New York</DotItem>
              <DotItem>Advisory across content operations, AI integration and brand-side strategy</DotItem>
              <DotItem>Editorial commissions across writing, visual research and image licensing</DotItem>
            </ul>
          </div>
        </div>

        {/* Contact link */}
        <div style={{ marginTop: "clamp(56px, 7vw, 96px)" }}>
          <button
            onClick={() => setContactOpen(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: TIMES,
              fontStyle: "italic",
              fontSize: "clamp(18px, 1.4vw, 22px)",
              fontWeight: 400,
              color: colors.text,
              cursor: "pointer",
              letterSpacing: 0,
              lineHeight: 1,
            }}
          >
            Contact →
          </button>
        </div>
      </div>

      {/* Bottom hairline + © footer */}
      <div style={{ borderTop: `1px solid ${colors.text}`, width: "100%" }} />
      <footer
        style={{
          padding: `${space.md}px ${space.xl}px`,
          fontFamily: TIMES,
          fontSize: 13,
          color: colors.text,
        }}
      >
        © {new Date().getFullYear()} Emily Lucas
      </footer>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}
