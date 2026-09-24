import { lazy, Suspense, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import CustomCursor from "./components/CustomCursor";
import CaseStudyModal from "./components/CaseStudyModal";
import RouteMeta from "./components/RouteMeta";
import { productionCases, nextCaseStudy } from "./data/work";

// Word-boundary truncate to a target length. Used to derive case-study
// meta descriptions from the existing "task" copy without mid-word
// cuts that look bad in social previews.
function truncate(text, max) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

// Build the SEO/social meta payload for a case-study slug. Pulled out
// so the modal route stays declarative.
function buildCaseStudyMeta(study, slug) {
  const titleCore = `${study.client} — ${study.project || study.title}`;
  const title = `${titleCore} | Emily Lucas`;
  const description = truncate(study.task || study.outcome || "", 155);
  // Image fallback chain: explicit heroImage → first still in images
  // (videos can't render as og:image previews) → site default hero.
  const firstStill = study.images?.find(
    (src) => typeof src === "string" && !/\.(mp4|webm|mov)$/i.test(src)
  );
  const image = study.heroImage || firstStill || "/hero.jpg";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: titleCore,
    headline: study.title,
    url: `https://emilyelucas.com/work/${slug}`,
    creator: {
      "@type": "Person",
      name: "Emily Lucas",
      url: "https://emilyelucas.com/",
      jobTitle: "Creative Producer & Strategist",
    },
    publisher: study.client
      ? { "@type": "Organization", name: study.client }
      : undefined,
    about: study.tags?.length ? study.tags.join(", ") : undefined,
    datePublished: study.year ? String(study.year) : undefined,
    associatedMedia: image
      ? { "@type": "ImageObject", contentUrl: `https://emilyelucas.com${image}` }
      : undefined,
  };
  return { title, description, image, jsonLd };
}

// Code-split the Work routes, defers their bundle (and the productionCases
// payload) until the user actually navigates there.
const Work = lazy(() => import("./pages/Work"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname, hash, state } = useLocation();
  // Tracks the pathname from the previous render so a modal CLOSING
  // (navigating away from /work/:slug back to its background page) can
  // be told apart from a genuine page-to-page navigation. Without this,
  // closing a case-study modal forced the background page's scroll back
  // to the top instead of leaving it where the visitor had it.
  const prevPathnameRef = useRef(pathname);
  // Disable the browser's built-in scroll restoration so a hard
  // refresh on any route lands at the top instead of wherever the
  // previous session left off. Runs once on first render.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Force the very first paint to the top — covers reload / direct
    // URL entry / external link landings, which otherwise can render
    // mid-page before React mounts.
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    prevPathnameRef.current = pathname;
    if (hash) return; // honour anchor links like /work#aman
    // Modal-over-background navigations should leave the background
    // page where it was. Cases:
    //   1. Opened from a background page — state.backgroundLocation is set.
    //   2. Direct deep link to /work/:slug — pathname matches the case
    //      study pattern; the background is the parent page which
    //      itself shouldn't auto-scroll to top either way.
    //   3. Closing that modal — the PREVIOUS pathname was /work/:slug,
    //      meaning this navigation is just the modal handing control
    //      back to the background page it was already sitting on top of.
    if (state?.backgroundLocation) return;
    if (/^\/work\/[^/]+\/?$/.test(pathname)) return;
    if (/^\/work\/[^/]+\/?$/.test(prevPathname)) return;
    // Instant top — Landing's Lenis instance has been destroyed by the
    // time a different route mounts, so a plain window.scrollTo is safe.
    // Explicit "instant" so a stray CSS scroll-behavior:smooth somewhere
    // can't turn this into a visible animation.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, state]);
  return null;
}

// page-fade-in keyframes live in src/index.css. Each page applies the
// class to its own root div — the page component mounts/unmounts on
// route change so the animation runs naturally without forcing a
// wrapper remount (the old keyed PageFade made navigation feel slow
// because Lenis + heavy media on Landing all reset).

// Modal-route renderer. Reads /work/:slug from the current location,
// resolves to a case study, and shows the shared CaseStudyModal. On
// close, navigates back to either the prior location (if the user got
// here by clicking from a category page) or the parent category route
// (if this was a direct deep link).
function CaseStudyRoute({ slug }) {
  const navigate = useNavigate();
  const location = useLocation();
  const study = productionCases.find((c) => c.slug === slug);
  const nextStudy = nextCaseStudy(slug);

  const onClose = () => {
    if (location.state?.backgroundLocation) {
      // navigate(-1) pops the modal state cleanly so back-button parity holds.
      navigate(-1);
    } else {
      // Deep-link entry — there's no history to pop. Replace so the modal
      // close doesn't leave a useless /work/:slug entry on the back stack.
      navigate("/work", { replace: true });
    }
  };

  // Swaps the modal to the next project in place — replace (not push)
  // so repeated "next" clicks don't pile up /work/:slug history entries,
  // and carries the same backgroundLocation state so the underlying
  // page stays put.
  const onNext = nextStudy
    ? () => navigate(`/work/${nextStudy.slug}`, { state: location.state, replace: true })
    : undefined;
  const nextLabel = nextStudy
    ? [nextStudy.client, nextStudy.project].filter(Boolean).join(" — ")
    : null;

  if (!study) return null;
  const meta = buildCaseStudyMeta(study, slug);
  return (
    <>
      <RouteMeta
        path={`/work/${slug}`}
        title={meta.title}
        description={meta.description}
        image={meta.image}
        type="article"
        jsonLd={meta.jsonLd}
      />
      <CaseStudyModal study={study} onClose={onClose} onNext={onNext} nextLabel={nextLabel} />
    </>
  );
}

function AppRoutes() {
  const location = useLocation();
  const state = location.state || {};

  // /work/:slug — either modal-over-background (state.backgroundLocation
  // set by the opener) or a direct deep link (synthesise the parent
  // category as the background).
  const slugMatch = location.pathname.match(/^\/work\/([^/]+)\/?$/);
  const slug = slugMatch?.[1];

  let backgroundLocation = state.backgroundLocation;
  if (!backgroundLocation && slug) {
    backgroundLocation = { pathname: "/work" };
  }

  return (
    <>
      <ScrollToTop />
      {/* Render once at the app root so the cursor div sits OUTSIDE
          any page's .page-fade-in wrapper. position: fixed inside a
          transformed ancestor becomes positioned relative to that
          ancestor — which made the cursor scroll off-screen with the
          page. Globally mounted, the cursor stays viewport-anchored. */}
      <CustomCursor enlargeOnHover />
      <Layout>
        <Suspense fallback={null}>
          <Routes location={backgroundLocation || location}>
            <Route path="/" element={<Landing />} />
            <Route path="/work" element={<Work />} />
            {/* Old category pages are retired in favour of the single
                /work index — redirect so existing bookmarks/backlinks
                don't dead-end on a 404. */}
            <Route path="/production" element={<Navigate to="/work" replace />} />
            <Route path="/cultural-strategy" element={<Navigate to="/work" replace />} />
            <Route path="/visual-research" element={<Navigate to="/work" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
      {slug && <CaseStudyRoute slug={slug} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
