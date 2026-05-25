import { Link } from "react-router-dom";
import { colors, space } from "../theme";
import PlusMenu from "../components/PlusMenu";

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
export default function CategoryPage({ label, heroImage = "/hero.jpg", body, showcases = [] }) {
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

      {showcases.map((s, i) => (
        <Showcase key={i} {...s} />
      ))}
    </div>
  );
}

function isVideoSrc(src) {
  return src && /\.(mp4|webm|mov)$/i.test(src);
}

function Media({ src, style }) {
  return isVideoSrc(src) ? (
    <video
      src={src}
      autoPlay muted loop playsInline
      preload="metadata"
      style={style}
    />
  ) : (
    <img src={src} alt="" loading="lazy" style={style} />
  );
}

// One project block in the Club10/Charlie-Surbey vein: a media container
// (single image/video, or a side-by-side pair when `media` is an array),
// with the client name in HEROS bold + italic Times project title overlaid
// in the middle of the frame.
function Showcase({ client, title, media }) {
  const items = Array.isArray(media) ? media : [media];
  return (
    <section
      style={{
        width: "100%",
        padding: `${space.xxl}px ${space.xl}px`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: colors.bg,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1400,
          display: "grid",
          gridTemplateColumns: items.length > 1 ? `repeat(${items.length}, 1fr)` : "1fr",
          gap: items.length > 1 ? 12 : 0,
        }}
      >
        {items.map((src, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: items.length > 1 ? "3 / 4" : "16 / 9",
              overflow: "hidden",
              background: "#000",
            }}
          >
            <Media
              src={src}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
        {/* Overlay name + title, centered across the whole container */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            textAlign: "center",
            mixBlendMode: "difference",
            color: "#fff",
          }}
        >
          <div
            style={{
              fontFamily: HEROS_FONT,
              fontWeight: 700,
              fontSize: "clamp(28px, 5vw, 80px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
              textTransform: "uppercase",
            }}
          >
            {client}
          </div>
          {title && (
            <div
              style={{
                marginTop: 6,
                fontFamily: TIMES,
                fontStyle: "italic",
                fontSize: "clamp(16px, 2vw, 28px)",
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export { Brand };
