import { useState } from "react";
import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";
import CustomCursor from "../components/CustomCursor";
import ContactModal from "../components/ContactModal";

const HEROS = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";
const HINOMARU = "#BC002D";

// Vertical breathing room between top/bottom hairlines and the
// content/contact rows. Used twice so the spacing reads symmetric.
const RAIL_PAD = "clamp(28px, 3.2vw, 52px)";

function SectionHeading({ children }) {
  return (
    <div
      style={{
        fontFamily: HEROS,
        fontSize: "clamp(12px, 0.9vw, 14px)",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: colors.text,
        marginBottom: 14,
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
        marginBottom: 10,
        fontFamily: TIMES,
        fontStyle: "italic",
        fontSize: "clamp(15px, 1.1vw, 18px)",
        fontWeight: 400,
        lineHeight: 1.45,
        color: colors.text,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: HINOMARU,
          alignSelf: "center",
          transform: "translateY(-1px)",
        }}
      />
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
        height: "100vh",
        overflow: "hidden",
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

      {/* Top row: ← Home (left). + lives in PlusMenu (fixed top-right).
          Heights below the two are reserved so the hairline sits beneath
          both with consistent whitespace. */}
      <div
        style={{
          padding: `${space.lg}px ${space.xl}px ${space.md}px`,
          minHeight: 76,
          display: "flex",
          alignItems: "center",
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

      {/* Top hairline — sits below ← Home and + */}
      <div style={{ borderTop: `1px solid ${colors.text}`, width: "100%" }} />

      {/* Main content body — fills the remaining viewport */}
      <div
        className="m-about-body"
        style={{
          flex: 1,
          minHeight: 0,
          padding: `${RAIL_PAD} ${space.xl}px`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* About title */}
        <h1
          className="m-about-title"
          style={{
            fontFamily: HEROS,
            fontWeight: 700,
            fontSize: "clamp(56px, 7.5vw, 112px)",
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
            fontFamily: HEROS,
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: "clamp(16px, 1.35vw, 21px)",
            lineHeight: 1.4,
            color: colors.text,
            margin: `clamp(20px, 2vw, 32px) 0 0`,
            maxWidth: "min(780px, 72%)",
          }}
        >
          My work sits at the intersection of four cultures, shaped by
          growing up in Tokyo and working across London, Dubai, New York
          and Japan. I&rsquo;m most interested in production that emerges
          from inside the communities it represents, and in advisory work
          that helps brands build editorial systems that match their
          cultural ambitions.
        </p>

        {/* Two-column section: SELECTED EXPERIENCE | AVAILABLE FOR */}
        <div
          className="m-about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px, 5vw, 80px)",
            marginTop: "clamp(28px, 3.5vw, 56px)",
            maxWidth: "min(1180px, 92%)",
          }}
        >
          <div>
            <SectionHeading>Selected Experience</SectionHeading>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              <DotItem>
                Executive Producer &amp; Cultural Strategy Consultant — Independent (2024–present)
              </DotItem>
              <DotItem>
                Senior Editorial Producer — Harvey Nichols (2024)
              </DotItem>
              <DotItem>
                Producer — MR PORTER, Net-a-Porter Group (2019–2024)
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
        <div style={{ marginTop: "clamp(28px, 3.5vw, 48px)" }}>
          <button
            onClick={() => setContactOpen(true)}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: TIMES,
              fontStyle: "italic",
              fontSize: "clamp(16px, 1.2vw, 20px)",
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
