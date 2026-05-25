import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";
import { productionCases } from "../data/work";

const HEROS_FONT = "'TeX Gyre Heros', 'Helvetica Neue', 'Arial', sans-serif";
const TIMES = "'Times New Roman', Times, serif";

// Inline brand-name treatment matching Landing's About paragraph.
function Brand({ children }) {
  return (
    <em
      style={{
        fontFamily: TIMES,
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "1.05em",
      }}
    >
      {children}
    </em>
  );
}

// Hero landing page for a single discipline (Production, Cultural Strategy,
// Visual Research). Same hero as /work, optionally followed by an About-style
// paragraph block when `body` is provided.
export default function CategoryPage({ label, heroImage = "/hero.jpg", body, projects = [] }) {
  const projectCases = projects
    .map(slug => productionCases.find(c => c.slug === slug))
    .filter(Boolean);
  return (
    <div style={{ background: colors.bg, color: colors.text, minHeight: "100vh" }}>
      <PlusMenu />
      <section
        className="m-hero-section"
        style={{
          background: "#000",
          color: "#fff",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src={heroImage}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Top-left: ← Home + Selected */}
        <div
          className="m-hero-tl"
          style={{
            position: "absolute",
            top: space.xl,
            left: space.xl,
            color: "#fff",
            zIndex: 5,
          }}
        >
          <Link
            to="/"
            className="m-portfolio-label"
            style={{
              display: "inline-block",
              fontFamily: TIMES,
              fontSize: 14,
              fontWeight: 400,
              color: "#fff",
              marginBottom: space.sm,
              marginLeft: 2,
              opacity: 0.95,
              textDecoration: "none",
            }}
          >
            ← Home
          </Link>
          <div
            className="m-hero-title"
            style={{
              fontFamily: HEROS_FONT,
              fontSize: "clamp(44px, 7vw, 100px)",
              fontWeight: 700,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            Selected
          </div>
        </div>

        {/* Bottom-right: Projects */}
        <div
          className="m-hero-br m-hero-title"
          style={{
            position: "absolute",
            bottom: space.xl,
            right: space.xl,
            color: "#fff",
            fontFamily: TIMES,
            fontSize: "clamp(44px, 7vw, 100px)",
            fontStyle: "italic",
            fontWeight: 400,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            zIndex: 5,
          }}
        >
          Projects
        </div>

        {/* Bottom-left: category label */}
        <div
          className="m-hero-bl m-hero-roles"
          style={{
            position: "absolute",
            bottom: space.xl,
            left: space.xl,
            color: "#fff",
            fontFamily: TIMES,
            fontStyle: "italic",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.5,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          {label}
        </div>

        {/* Bottom-center: down arrow (decorative — no section below) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: space.lg,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            fontFamily: HEROS_FONT,
            fontSize: 18,
            fontWeight: 400,
            lineHeight: 1,
            zIndex: 4,
          }}
        >
          ↓
        </div>
      </section>

      {body && (
        <section
          className="m-section"
          style={{
            padding: `${space.xxl}px ${space.xl}px ${space.xxl}px`,
            display: "grid",
            gridTemplateColumns: "1fr 6fr",
            gap: space.xl,
            alignItems: "start",
          }}
        >
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
            {label}
          </div>
          <p
            className="m-section-body"
            style={{
              fontFamily: HEROS_FONT,
              fontSize: "clamp(20px, 2.6vw, 42px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.015em",
              margin: 0,
              color: colors.text,
            }}
          >
            {body}
          </p>
        </section>
      )}

      {projectCases.map((p, i) => (
        <ProjectShowcase key={p.slug} project={p} isLast={i === projectCases.length - 1} />
      ))}
    </div>
  );
}

function isVideoSrc(src) {
  return src && /\.(mp4|webm|mov)$/i.test(src);
}

// One project block: full-bleed hero, title + meta, task/outcome columns,
// supporting images, credits, divider.
function ProjectShowcase({ project, isLast }) {
  const heroSrc = project.heroVideo || project.heroImage || project.images?.[0];
  const heroIsVideo = isVideoSrc(heroSrc);
  // Skip the hero from the supporting gallery so we don't repeat it
  const supporting = (project.images || []).filter(src => src !== heroSrc).slice(0, 3);

  return (
    <article style={{ width: "100%", background: colors.bg }}>
      {/* Full-bleed hero, ~80vh */}
      <div
        style={{
          width: "100%",
          height: "80vh",
          background: "#000",
          overflow: "hidden",
        }}
      >
        {heroSrc && (
          heroIsVideo ? (
            <video
              src={heroSrc}
              autoPlay muted loop playsInline
              preload="metadata"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <img
              src={heroSrc}
              alt={project.project}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )
        )}
      </div>

      {/* Title + meta */}
      <div
        className="m-section"
        style={{
          padding: `${space.xxl}px ${space.xl}px ${space.lg}px`,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: HEROS_FONT,
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            color: colors.textMuted,
            marginBottom: space.sm,
          }}
        >
          {project.client}
        </div>
        <h2
          style={{
            fontFamily: HEROS_FONT,
            fontSize: "clamp(28px, 4vw, 56px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            margin: 0,
            color: colors.text,
          }}
        >
          {project.project}
        </h2>
        <div
          style={{
            marginTop: space.sm,
            fontFamily: TIMES,
            fontStyle: "italic",
            fontSize: 14,
            color: colors.textMuted,
          }}
        >
          {[project.year, ...(project.tags || [])].filter(Boolean).join(" · ")}
        </div>
      </div>

      {/* Task / Outcome two-column */}
      {(project.task || project.outcome) && (
        <div
          className="m-project-cols"
          style={{
            padding: `${space.md}px ${space.xl}px ${space.xxl}px`,
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: space.xl,
          }}
        >
          {project.task && (
            <Block label="The Task" body={project.task} />
          )}
          {project.outcome && (
            <Block label="The Outcome" body={project.outcome} />
          )}
        </div>
      )}

      {/* Supporting images, 2-3 in a row */}
      {supporting.length > 0 && (
        <div
          className="m-project-grid"
          style={{
            padding: `0 ${space.xl}px ${space.xxl}px`,
            maxWidth: 1400,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: `repeat(${supporting.length}, 1fr)`,
            gap: space.md,
          }}
        >
          {supporting.map((src, i) => (
            isVideoSrc(src) ? (
              <video
                key={i}
                src={src}
                autoPlay muted loop playsInline
                preload="metadata"
                style={{ width: "100%", height: "auto", display: "block", background: colors.surface }}
              />
            ) : (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                style={{ width: "100%", height: "auto", display: "block", background: colors.surface }}
              />
            )
          ))}
        </div>
      )}

      {/* Divider between projects */}
      {!isLast && (
        <div
          aria-hidden="true"
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: `0 ${space.xl}px`,
          }}
        >
          <div style={{ borderTop: `1px solid ${colors.border || colors.text}`, opacity: 0.15 }} />
        </div>
      )}
    </article>
  );
}

function Block({ label, body }) {
  return (
    <div>
      <div
        style={{
          fontFamily: HEROS_FONT,
          fontSize: 9,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <p
        style={{
          fontFamily: HEROS_FONT,
          fontSize: "clamp(14px, 1.1vw, 17px)",
          fontWeight: 400,
          lineHeight: 1.55,
          margin: 0,
          color: colors.text,
        }}
      >
        {body}
      </p>
    </div>
  );
}

export { Brand };
