import { Helmet } from "react-helmet-async";

const BASE = "https://emilyelucas.com";

// Per-route metadata. title/description/canonical/og/twitter all set
// here so each route has its own social preview + crawler signal,
// instead of every URL inheriting index.html's homepage defaults.
//
// For non-JS-executing crawlers (LinkedIn/iMessage scrapers, GPTBot,
// ClaudeBot), these Helmet-injected tags only matter once the route
// is prerendered into static HTML — that lives in vite.config build
// pipeline. For Googlebot (which executes JS), the runtime injection
// is enough.
export default function RouteMeta({
  title,
  description,
  path,
  image,
  type = "website",
  jsonLd,
}) {
  const url = `${BASE}${path === "/" ? "/" : path}`;
  const fullImage = image?.startsWith("http") ? image : `${BASE}${image || "/hero.jpg"}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Emily Lucas" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
