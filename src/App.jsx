import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import CustomCursor from "./components/CustomCursor";
import CaseStudyModal from "./components/CaseStudyModal";
import RouteMeta from "./components/RouteMeta";
import { productionCases, CATEGORY_BY_SLUG } from "./data/work";

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
  const title = `${titleCore} | Emily Lucas | Executive Producer`;
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
      jobTitle: "Executive Producer & Cultural Strategy Consultant",
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
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Brand-name italic Times treatment for inline mentions in the
// category body paragraphs.
function B({ children }) {
  return (
    <em style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic", fontWeight: 400, fontSize: "1.05em" }}>
      {children}
    </em>
  );
}

// Hero showcases shown below the Production about block. Vogue uses a pair
// (1a + 1b covers side by side); the rest are single hero clips/stills.
// Asset folder is /public/Production/:production/ — the colon is part of
// the directory name (Emily's own filing convention) and works fine as a
// URL path segment.
const CULTURAL_STRATEGY_SHOWCASES = [
  { slug: "mr-porter-championing-subcultures", client: "MR PORTER", title: "Championing Subcultures",          media: "/Cultural%20Strategy/:cultural%20strategy/01.mp4" },
  { slug: "mr-porter-social-media-strategy",             client: "MR PORTER", title: "Social Media Strategy",            media: "/Cultural%20Strategy/:cultural%20strategy/02.mp4" },
  { slug: "trippin-ethical-photography",        client: "Trippin",   title: "Ethical Photography",              media: "/Cultural%20Strategy/:cultural%20strategy/03.avif" },
  { slug: "trippin-mexico-iturbide",          client: "Trippin",   title: "Mexico through Graciela Iturbide", media: "/Cultural%20Strategy/:cultural%20strategy/04.avif" },
  { slug: "trippin-tattooing-japan",            client: "Trippin",   title: "A History of Tattooing",           media: "/Cultural%20Strategy/:cultural%20strategy/05.avif" },
  { slug: "mr-porter-menswear-trends-2022",     client: "MR PORTER", title: "2022 Menswear Trends",             media: "/Cultural%20Strategy/:cultural%20strategy/06.jpg" },
  { slug: "mr-porter-15-ways-japanese-style",           client: "MR PORTER", title: "Improve Your Life",                media: "/Cultural%20Strategy/:cultural%20strategy/07.jpg" },
  { slug: "mr-porter-women-buy-menswear",  client: "MR PORTER", title: "Shop For Yourself",                media: "/Cultural%20Strategy/:cultural%20strategy/08.jpg" },
];

const VISUAL_RESEARCH_SHOWCASES = [
  { slug: "mr-porter-nyc-street-photography",        client: "MR PORTER", title: "New York through the Decades", media: "/Visual%20Research/:visual%20research/01.jpg" },
  { slug: "mr-porter-five-stylish-summertime-movies",      client: "MR PORTER", title: "Summertime Movies",            media: "/Visual%20Research/:visual%20research/2.jpg" },
  { slug: "mr-porter-five-ways-freshen-work-wardrobe",     client: "MR PORTER", title: "Freshen up your Wardrobe",     media: "/Visual%20Research/:visual%20research/03.jpg" },
  { slug: "mr-porter-black-history-month-uk", client: "MR PORTER", title: "Black History Month",          media: "/Visual%20Research/:visual%20research/04.jpg" },
];

const PRODUCTION_SHOWCASES = [
  { slug: "aman-saudi-arabia",              client: "Aman",       title: "Saudi Arabia",                    media: "/Production/:production/1.mp4" },
  { slug: "vogue-arabia-relaunch",    client: "Condé Nast", title: "Vogue Arabia Relaunch",           media: ["/Production/:production/2a.jpg", "/Production/:production/2b.JPG"], position: "center top" },
  { slug: "nike-vomero-18",       client: "Nike",       title: "Global Vomero 18 Activation",     media: "/Production/:production/3.mp4" },
  { slug: "one-only-moonlight-basin",   client: "One&Only",   title: "Moonlight Basin",                 media: "/Production/:production/4.mp4" },
  { slug: "mr-porter-finneas", client: "MR PORTER",  title: "Finneas",                         media: "/Production/:production/5.jpg" },
  { slug: "jcrew-abraham-moon",      client: "J.Crew",     title: "Abraham Moon",                    media: "/Production/:production/6.mp4" },
  { slug: "cipriani-mr-c-residence-dubai",   client: "Cipriani",   title: "Mr C Residence Dubai",            media: "/Production/:production/7.mp4" },
  { slug: "mastercard-sail-grand-prix", client: "Mastercard", title: "Sail Grand Prix x Luís Figo",     media: "/Production/:production/8.mp4" },
];

const PRODUCTION_BODY = (
  <>
    End-to-end executive production for luxury and lifestyle brands across
    photography and video. In-house production capabilities as well as
    external production partner to global agencies and direct-to-client.
    Experience across <B>Hospitality</B>, <B>Fashion</B>, <B>Beauty</B>,{" "}
    <B>Editorial</B>, delivering campaigns across the <B>US</B>,{" "}
    <B>UK</B>, <B>GCC</B>, and <B>Europe</B>. Specialist in integrating
    AI workflow systems underpinning estimating, SOWs, casting, and
    vendor management.
  </>
);

const VISUAL_RESEARCH_BODY = (
  <>
    Image sourcing, photography curation, and rights licensing for editorial
    features at <B>MR PORTER Journal</B>, <B>Trippin</B>, and <B>Vogue</B>
    {" "}(<B>Condé Nast</B>). Work spans fine art photography (estates,
    foundations, galleries), entertainment IP (film stills, studio rights),
    runway and fashion calendar imagery (IMAXtree and beyond), and
    multi-discipline publishing rights from broadcast, publisher, gallery,
    theatre, and archive.
  </>
);

const CULTURAL_STRATEGY_BODY = (
  <>
    Cultural work across writing, production, and strategy, bound by a
    defining editorial position that champions representation from the
    inside of culture. Authored features for <B>Trippin</B> and{" "}
    <B>MR PORTER</B>. Production work rooted in subcultures from Black
    British literary culture, Saudi Arabian poetry, the London queer
    community, and London's roller skating scene, each cast and crewed
    from within. Gen Z consumer research and social media production
    strategy driving organic growth for <B>MR PORTER</B>'s TikTok channel
    to 50K followers in its inaugural year.
  </>
);

function ScrollToTop() {
  const { pathname, hash, state } = useLocation();
  useEffect(() => {
    if (hash) return; // honour anchor links like /work#aman
    // Modal-over-background navigations should leave the background
    // page where it was. Two cases:
    //   1. Opened from a category page — state.backgroundLocation is set.
    //   2. Direct deep link to /work/:slug — pathname matches the case
    //      study pattern; the background is the parent category which
    //      itself shouldn't auto-scroll to top either way.
    if (state?.backgroundLocation) return;
    if (/^\/work\/[^/]+\/?$/.test(pathname)) return;
    window.scrollTo(0, 0);
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

  const onClose = () => {
    if (location.state?.backgroundLocation) {
      // navigate(-1) pops the modal state cleanly so back-button parity holds.
      navigate(-1);
    } else {
      // Deep-link entry — there's no history to pop. Replace so the modal
      // close doesn't leave a useless /work/:slug entry on the back stack.
      navigate(CATEGORY_BY_SLUG[slug] || "/work", { replace: true });
    }
  };

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
      <CaseStudyModal study={study} onClose={onClose} />
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
    backgroundLocation = { pathname: CATEGORY_BY_SLUG[slug] || "/work" };
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
            <Route path="/production" element={
              <CategoryPage
                label="Production"
                heroImage="/production-hero.jpg"
                body={PRODUCTION_BODY}
                showcases={PRODUCTION_SHOWCASES}
                metaPath="/production"
                metaTitle="Production | Emily Lucas | Executive Producer"
                metaDescription="End-to-end executive production for luxury brands across photography, video and complex post-production. Campaigns delivered across the US, UK, GCC and Europe — Aman, Vogue Arabia, Nike, One&Only, MR PORTER, Cipriani, Mastercard, J.Crew."
                metaImage="/production-hero.jpg"
                suppressMeta={!!slug}
              />
            } />
            <Route path="/cultural-strategy" element={
              <CategoryPage
                label="Strategy & Editorial"
                heroImage="/Cultural%20Strategy/4ba827b33bdd00f5f3f83428a7e1ae3310f31833-4000x3200.avif"
                body={CULTURAL_STRATEGY_BODY}
                showcases={CULTURAL_STRATEGY_SHOWCASES}
                metaPath="/cultural-strategy"
                metaTitle="Strategy & Editorial | Emily Lucas | Executive Producer"
                metaDescription="Cultural work across writing, production and strategy — features for Trippin and MR PORTER, production rooted in subcultures, and Gen Z consumer research for MR PORTER's TikTok channel."
                metaImage="/Cultural%20Strategy/4ba827b33bdd00f5f3f83428a7e1ae3310f31833-4000x3200.avif"
                suppressMeta={!!slug}
              />
            } />
            <Route path="/visual-research" element={
              <CategoryPage
                label="Visual Research"
                heroImage="/Visual%20Research/w1500_q80%20(2).jpg"
                body={VISUAL_RESEARCH_BODY}
                showcases={VISUAL_RESEARCH_SHOWCASES}
                metaPath="/visual-research"
                metaTitle="Visual Research | Emily Lucas | Executive Producer"
                metaDescription="Image sourcing, photography curation and rights licensing for editorial features at MR PORTER Journal, Trippin and Vogue (Condé Nast). Fine art, entertainment IP, runway and archive."
                metaImage="/Visual%20Research/w1500_q80%20(2).jpg"
                suppressMeta={!!slug}
              />
            } />
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
