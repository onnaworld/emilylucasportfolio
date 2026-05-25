import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";

// Code-split the Work routes, defers their bundle (and the productionCases
// payload) until the user actually navigates there.
const Work = lazy(() => import("./pages/Work"));
const WorkDetail = lazy(() => import("./pages/WorkDetail"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));

// Brand-name italic Times treatment for inline mentions in the
// category body paragraphs.
function B({ children }) {
  return (
    <em style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic", fontWeight: 400, fontSize: "1.05em" }}>
      {children}
    </em>
  );
}

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
    inside of culture. Authored features for <B>Trippin</B> on visual
    ethics, Mexican Indigenous photography, and the cultural history of
    tattooing in Japan, alongside editorial commentary for{" "}
    <B>MR PORTER</B> in the menswear space. Production work champions a
    broad range of subcultures across <B>MR PORTER</B>: from Black British
    literary culture, the London queer community, and the roller skating
    scene, each cast and crewed from within. Gen Z consumer research and
    social media production strategy underpinned <B>MR PORTER</B>'s
    positioning to attract a younger audience, showcased through the
    growth of the TikTok channel to 50K followers in its inaugural year.
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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<WorkDetail />} />
            <Route path="/production" element={<CategoryPage label="Production" body={PRODUCTION_BODY} />} />
            <Route path="/cultural-strategy" element={<CategoryPage label="Cultural Strategy" heroImage="/Cultural%20Strategy/4ba827b33bdd00f5f3f83428a7e1ae3310f31833-4000x3200.avif" body={CULTURAL_STRATEGY_BODY} />} />
            <Route path="/visual-research" element={<CategoryPage label="Visual Research" heroImage="/Visual%20Research/w1500_q80%20(2).jpg" body={VISUAL_RESEARCH_BODY} />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
