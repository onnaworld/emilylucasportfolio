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
            <Route path="/cultural-strategy" element={<CategoryPage label="Cultural Strategy" heroImage="/work/trippin-ethical-photography/06.avif" />} />
            <Route path="/visual-research" element={<CategoryPage label="Visual Research" heroImage="/Visual%20Research/w1500_q80%20(2).jpg" />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
