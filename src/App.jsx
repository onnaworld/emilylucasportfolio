import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import CustomCursor from "./components/CustomCursor";

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
  { slug: "mr-porter-social-media",             client: "MR PORTER", title: "Social Media Strategy",            media: "/Cultural%20Strategy/:cultural%20strategy/02.mp4" },
  { slug: "trippin-ethical-photography",        client: "Trippin",   title: "Ethical Photography",              media: "/Cultural%20Strategy/:cultural%20strategy/03.avif" },
  { slug: "trippin-graciela-iturbide",          client: "Trippin",   title: "Mexico through Graciela Iturbide", media: "/Cultural%20Strategy/:cultural%20strategy/04.avif" },
  { slug: "trippin-tattooing-japan",            client: "Trippin",   title: "A History of Tattooing",           media: "/Cultural%20Strategy/:cultural%20strategy/05.avif" },
  { slug: "mr-porter-menswear-trends-2022",     client: "MR PORTER", title: "2022 Menswear Trends",             media: "/Cultural%20Strategy/:cultural%20strategy/06.jpg" },
  { slug: "mr-porter-japanese-style",           client: "MR PORTER", title: "Improve Your Life",                media: "/Cultural%20Strategy/:cultural%20strategy/07.jpg" },
  { slug: "mr-porter-women-shopping-menswear",  client: "MR PORTER", title: "Shop For Yourself",                media: "/Cultural%20Strategy/:cultural%20strategy/08.jpg" },
];

const VISUAL_RESEARCH_SHOWCASES = [
  { slug: "mr-porter-new-york-street",        client: "MR PORTER", title: "New York through the Decades", media: "/Visual%20Research/:visual%20research/01.jpg" },
  { slug: "mr-porter-summertime-movies",      client: "MR PORTER", title: "Summertime Movies",            media: "/Visual%20Research/:visual%20research/2.jpg" },
  { slug: "mr-porter-work-wardrobe-2020",     client: "MR PORTER", title: "Freshen up your Wardrobe",     media: "/Visual%20Research/:visual%20research/03.jpg" },
  { slug: "mr-porter-black-history-month-uk", client: "MR PORTER", title: "Black History Month",          media: "/Visual%20Research/:visual%20research/04.jpg" },
];

const PRODUCTION_SHOWCASES = [
  { slug: "aman",              client: "Aman",       title: "Saudi Arabia",                    media: "/Production/:production/1.mp4" },
  { slug: "vogue-relaunch",    client: "Condé Nast", title: "Vogue Arabia Relaunch",           media: ["/Production/:production/2a.jpg", "/Production/:production/2b.JPG"], position: "center top" },
  { slug: "nike-vomero",       client: "Nike",       title: "Global Vomero 18 Activation",     media: "/Production/:production/3.mp4" },
  { slug: "moonlight-basin",   client: "One&Only",   title: "Moonlight Basin",                 media: "/Production/:production/4.mp4" },
  { slug: "mr-porter-finneas", client: "MR PORTER",  title: "Finneas",                         media: "/Production/:production/5.jpg" },
  { slug: "abraham-moon",      client: "J.Crew",     title: "Abraham Moon",                    media: "/Production/:production/6.mp4" },
  { slug: "mr-c-residences",   client: "Cipriani",   title: "Mr C Residence Dubai",            media: "/Production/:production/7.mp4" },
  { slug: "mastercard-sailgp", client: "Mastercard", title: "Sail Grand Prix x Luís Figo",     media: "/Production/:production/8.mp4" },
];

const PRODUCTION_BODY = (
  <>
    End-to-end executive production for luxury and lifestyle brands across
    photography and video, working across complex post-production formats
    with CGI rendering, live editing, bespoke sound design. In-house
    production capabilities as well as external production partner to
    global agencies and direct to client. Experience across{" "}
    <B>Hospitality</B>, <B>Fashion</B>, <B>Beauty</B>, <B>Editorial</B>,
    delivering campaigns across a multitude of locations in the{" "}
    <B>US</B>, <B>UK</B>, <B>GCC</B>, and <B>Europe</B>. Specialist in
    integrating AI workflow systems underpinning estimating, SOWs, casting,
    and vendor management.
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
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return; // honour anchor links like /work#aman
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// page-fade-in keyframes live in src/index.css. Each page applies the
// class to its own root div — the page component mounts/unmounts on
// route change so the animation runs naturally without forcing a
// wrapper remount (the old keyed PageFade made navigation feel slow
// because Lenis + heavy media on Landing all reset).

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Render once at the app root so the cursor div sits OUTSIDE
          any page's .page-fade-in wrapper. position: fixed inside a
          transformed ancestor becomes positioned relative to that
          ancestor — which made the cursor scroll off-screen with the
          page. Globally mounted, the cursor stays viewport-anchored. */}
      <CustomCursor enlargeOnHover />
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/work" element={<Work />} />
            <Route path="/production" element={
              <CategoryPage
                label="Production"
                body={PRODUCTION_BODY}
                showcases={PRODUCTION_SHOWCASES}
                metaPath="/production"
                metaTitle="Production | Emily Lucas | Executive Producer"
                metaDescription="End-to-end executive production for luxury brands across photography, video and complex post-production. Campaigns delivered across the US, UK, GCC and Europe — Aman, Vogue Arabia, Nike, One&Only, MR PORTER, Cipriani, Mastercard, J.Crew."
                metaImage="/work/aman/01.jpg"
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
              />
            } />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
