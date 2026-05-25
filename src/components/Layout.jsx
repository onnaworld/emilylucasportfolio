import { Link, NavLink, useLocation } from "react-router-dom";
import { colors, fonts, space, t } from "../theme";

const NAV_ITEMS = [
  { to: "/", label: "Index" },
  { to: "/work", label: "Work" },
];

export default function Layout({ children }) {
  const location = useLocation();
  const noChromePaths = ["/", "/work", "/production", "/cultural-strategy", "/visual-research"];
  const noChrome = noChromePaths.includes(location.pathname);
  const noHeader = noChrome;
  const noFooter = noChrome;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: colors.bg, color: colors.text }}>
      {!noHeader && <Header isLanding={false} />}
      <main style={{ flex: 1, width: "100%" }}>{children}</main>
      {!noFooter && <Footer />}
    </div>
  );
}

function Header({ isLanding }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: isLanding ? "transparent" : colors.bg,
        borderBottom: isLanding ? "none" : `1px solid ${colors.border}`,
        padding: `${space.lg}px ${space.xl}px`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backdropFilter: isLanding ? "none" : "blur(8px)",
      }}
    >
      <Link to="/" style={{ ...t("h3"), fontFamily: fonts.sans, textTransform: "uppercase", letterSpacing: 2 }}>
        Emily Lucas
      </Link>
      <nav style={{ display: "flex", gap: space.xl }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            style={({ isActive }) => ({
              ...t("small"),
              textTransform: "uppercase",
              color: isActive ? colors.text : colors.textMuted,
              borderBottom: isActive ? `1px solid ${colors.text}` : "1px solid transparent",
              paddingBottom: 2,
              transition: "color 0.15s, border-color 0.15s",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer
      className="m-footer"
      style={{
        padding: `${space.xl}px ${space.xl}px ${space.lg}px ${space.xl}px`,
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <div
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          fontSize: 14,
          fontWeight: 400,
          color: colors.textMuted,
        }}
      >
        © {new Date().getFullYear()} Emily Lucas
      </div>
    </footer>
  );
}
