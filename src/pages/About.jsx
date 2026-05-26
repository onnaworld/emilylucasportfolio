import { useState } from "react";
import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";
import CustomCursor from "../components/CustomCursor";
import ContactModal from "../components/ContactModal";

const HEROS = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

function Brand({ children }) {
  return (
    <em style={{ fontFamily: TIMES, fontStyle: "italic", fontWeight: 400, fontSize: "1.05em" }}>
      {children}
    </em>
  );
}

// Section label — small uppercase Heros, tracked.
function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontFamily: HEROS,
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        color: colors.textMuted,
        marginBottom: space.md,
      }}
    >
      {children}
    </div>
  );
}

// Experience row — role in Heros, em-dash separator, company in italic Times,
// year in muted Heros.
function ExperienceRow({ role, company, years }) {
  return (
    <div style={{ marginBottom: space.sm, fontFamily: HEROS, fontSize: 17, fontWeight: 400, lineHeight: 1.4, color: colors.text }}>
      <span>{role}</span>
      <span> — </span>
      <span style={{ fontFamily: TIMES, fontStyle: "italic" }}>{company}</span>
      <span style={{ color: colors.textMuted }}> ({years})</span>
    </div>
  );
}

export default function About() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="about-page" style={{ background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <style>{`
        .about-page, .about-page * { cursor: none !important; }
      `}</style>
      <CustomCursor enlargeOnHover />
      <PlusMenu />

      <section
        className="m-section m-section-about"
        style={{
          padding: `${space.xxl}px ${space.xl}px ${space.xxl}px`,
          display: "grid",
          gridTemplateColumns: "1fr 6fr",
          gap: space.xl,
          alignItems: "start",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        {/* Sticky-style left title column */}
        <div
          className="m-section-title"
          style={{
            fontFamily: TIMES,
            fontStyle: "italic",
            fontSize: "clamp(28px, 3.4vw, 48px)",
            fontWeight: 400,
            color: colors.text,
            lineHeight: 1,
            paddingTop: 8,
          }}
        >
          About
        </div>

        {/* Right body column — sections stacked */}
        <div>
          <Link
            to="/"
            style={{
              display: "inline-block",
              fontFamily: TIMES,
              fontSize: 14,
              fontWeight: 400,
              color: colors.textMuted,
              textDecoration: "none",
              marginBottom: space.lg,
            }}
          >
            ← Home
          </Link>

          {/* Bio paragraph (matches Landing About body) */}
          <p
            className="m-section-body"
            style={{
              fontFamily: HEROS,
              fontSize: "clamp(20px, 2.6vw, 42px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              margin: 0,
              marginBottom: space.xxl,
              color: colors.text,
            }}
          >
            Executive Producer and Consultant specializing in production, strategy
            and visual research for luxury brands across fashion, beauty,
            hospitality and editorial. Tokyo-born, with Japanese-US-UK background
            and industry experience across the US, UK, GCC and Japan. Brand-side
            at <Brand>Net-a-Porter Group</Brand>, producing <Brand>MR PORTER</Brand>'s
            editorial, commercial and brand partnerships. Direct-to-client
            relationships with <Brand>Aman</Brand>, <Brand>One&amp;Only</Brand> and{" "}
            <Brand>Condé Nast</Brand>; production partner to agencies for{" "}
            <Brand>Columbia</Brand>, <Brand>Mastercard</Brand> and{" "}
            <Brand>Nike</Brand>.
          </p>

          {/* SELECTED EXPERIENCE */}
          <div style={{ marginBottom: space.xxl }}>
            <SectionLabel>Selected Experience</SectionLabel>
            <ExperienceRow
              role="Executive Producer & Cultural Strategy Consultant"
              company="Independent"
              years="2024–present"
            />
            <ExperienceRow
              role="Senior Editorial Producer"
              company="Harvey Nichols"
              years="2024"
            />
            <ExperienceRow
              role="Producer"
              company="MR PORTER, Net-a-Porter Group"
              years="2019–2024"
            />
          </div>

          {/* AVAILABLE FOR */}
          <div style={{ marginBottom: space.xxl }}>
            <SectionLabel>Available For</SectionLabel>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                fontFamily: HEROS,
                fontSize: 16,
                fontWeight: 400,
                lineHeight: 1.5,
                color: colors.text,
              }}
            >
              <li style={{ marginBottom: 4 }}>— Executive production across stills, video, brand films and editorial shoots</li>
              <li style={{ marginBottom: 4 }}>— Regional production &amp; consultancy across GCC, Japan, London and New York</li>
              <li style={{ marginBottom: 4 }}>— Advisory across content operations, AI integration and brand-side strategy</li>
              <li style={{ marginBottom: 4 }}>— Editorial commissions across writing, visual research and image licensing</li>
            </ul>
          </div>

          {/* FOR ENQUIRIES */}
          <div>
            <SectionLabel>For Enquiries</SectionLabel>
            <button
              onClick={() => setContactOpen(true)}
              style={{
                display: "inline-block",
                background: "none",
                border: "none",
                padding: 0,
                fontFamily: TIMES,
                fontStyle: "italic",
                fontSize: 22,
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
      </section>

      <footer
        className="m-category-footer"
        style={{
          padding: `${space.xl}px ${space.xl}px ${space.lg}px`,
          borderTop: `1px solid ${colors.border}`,
          background: colors.bg,
          fontFamily: TIMES,
          fontSize: 14,
          fontWeight: 400,
          color: colors.textMuted,
        }}
      >
        © {new Date().getFullYear()} Emily Lucas
      </footer>

      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </div>
  );
}
