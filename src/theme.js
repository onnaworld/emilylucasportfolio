// Design tokens — keep all styling decisions in one file so we can iterate
// aesthetic quickly without hunting through components.

export const colors = {
  bg: "#ffffff",
  text: "#1a1a1a",
  textMuted: "#6b6b6b",
  textSubtle: "#a0a0a0",
  border: "#e8e8e8",
  borderSubtle: "#f0f0f0",
  surface: "#fafafa",
  accent: "#1a1a1a", // monochrome by default; change to a hex for an accent color
};

export const fonts = {
  sans: "'Avenir', 'Avenir Next', 'Nunito Sans', sans-serif",
  serif: "'Cormorant Garamond', 'Georgia', serif", // editorial accent option
};

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 48,
  xxl: 96,
};

export const type = {
  display: { size: 64, weight: 700, letterSpacing: 1.5, lineHeight: 1.05 },
  h1: { size: 40, weight: 700, letterSpacing: 0.8, lineHeight: 1.15 },
  h2: { size: 24, weight: 700, letterSpacing: 0.5, lineHeight: 1.25 },
  h3: { size: 16, weight: 700, letterSpacing: 0.4, lineHeight: 1.35 },
  body: { size: 15, weight: 400, letterSpacing: 0.2, lineHeight: 1.65 },
  small: { size: 12, weight: 500, letterSpacing: 0.4, lineHeight: 1.5 },
  label: { size: 10, weight: 700, letterSpacing: 1.4, lineHeight: 1.4, textTransform: "uppercase" },
};

export const breakpoints = {
  mobile: 640,
  tablet: 900,
  desktop: 1200,
};

// Helper: convert a `type` token to inline-style object
export const t = (key) => {
  const v = type[key];
  if (!v) return {};
  return {
    fontFamily: fonts.sans,
    fontSize: v.size,
    fontWeight: v.weight,
    letterSpacing: v.letterSpacing,
    lineHeight: v.lineHeight,
    ...(v.textTransform ? { textTransform: v.textTransform } : {}),
    color: colors.text,
    margin: 0,
  };
};
