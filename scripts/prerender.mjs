// Post-build prerender: spin up `serve` on dist/, navigate Chromium
// to each public route, dump fully-hydrated HTML (with React-mounted
// content + react-helmet-async meta tags) into dist/<route>/index.html.
//
// Vercel will then serve those static HTML files per URL — so LinkedIn /
// iMessage / GPTBot / ClaudeBot / PerplexityBot (which DON'T execute JS)
// see real per-route meta and content, not just index.html's defaults.
//
// Chromium binary:
//   - Local (macOS): system Google Chrome
//   - Linux (Vercel build): @sparticuz/chromium, a serverless-optimised
//     Chromium that bundles the shared libs Vercel's container is
//     missing (libnspr4 etc).

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

// Dynamic import of the source data file so the slug list stays in sync
// with src/data/work.js — single source of truth for both runtime routing
// (App.jsx) and build-time prerendering (this script).
const dataUrl = pathToFileURL(resolve(process.cwd(), "src/data/work.js")).href;
const { productionCases } = await import(dataUrl);

const STATIC_ROUTES = [
  "/",
  "/work",
  "/production",
  "/cultural-strategy",
  "/visual-research",
  "/about",
];
const CASE_ROUTES = productionCases.map((c) => `/work/${c.slug}`);
const ROUTES = [...STATIC_ROUTES, ...CASE_ROUTES];
const PORT = 5174;
const DIST = resolve(process.cwd(), "dist");

if (!existsSync(DIST)) {
  console.error("[prerender] dist/ doesn't exist — run `vite build` first.");
  process.exit(1);
}

// Resolve the Chromium binary for the current platform.
async function resolveBrowser() {
  if (process.platform === "linux") {
    const chromium = (await import("@sparticuz/chromium")).default;
    return {
      executablePath: await chromium.executablePath(),
      args: [
        ...chromium.args,
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
      headless: chromium.headless,
    };
  }
  // macOS local dev — assume Google Chrome is installed at the standard path.
  return {
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  };
}

console.log("[prerender] starting local server on dist/");
const server = spawn(
  "npx",
  ["serve", "-s", DIST, "-l", String(PORT), "--no-clipboard", "--no-port-switching"],
  { stdio: "pipe" }
);

let serverReady = false;
server.stdout?.on("data", (chunk) => {
  const s = chunk.toString();
  if (s.includes("Accepting connections") || s.includes("http://localhost")) {
    serverReady = true;
  }
});
server.stderr?.on("data", (chunk) => process.stderr.write(chunk));

for (let i = 0; i < 80 && !serverReady; i++) {
  await new Promise((r) => setTimeout(r, 100));
}
if (!serverReady) {
  console.log("[prerender] server didn't announce ready; continuing anyway");
}
await new Promise((r) => setTimeout(r, 500));

let exitCode = 0;
try {
  const launchOpts = await resolveBrowser();
  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();
  await page.setUserAgent(
    "EmilyLucasPrerenderer/1.0 (+https://emilyelucas.com)"
  );

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    console.log(`[prerender] ${route}`);
    // domcontentloaded (not networkidle0) — autoplaying videos in case
    // study carousels keep the network busy indefinitely, which timed
    // out at 30s. We just need React + Helmet to mount; the 1200ms
    // tail gives the route enough time to hydrate and inject head tags.
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 1200));
    // Grab the live document.title up front — Helmet has races with
    // lazy-loaded route components, but document.title reflects the
    // *current* truth no matter which Helmet ran last. We force it
    // into the prerendered HTML below.
    const liveTitle = await page.evaluate(() => document.title);
    let html = await page.content();
    if (liveTitle) {
      const titleRe = /<title>[^<]*<\/title>/g;
      const tagged = `<title>${escapeHtml(liveTitle)}</title>`;
      html = html.replace(titleRe, "").replace(
        "</head>",
        `${tagged}\n</head>`
      );
    }

    // Dedup head tags. Helmet APPENDS its per-route tags to head (after
    // the static index.html tags), so we keep the LAST occurrence —
    // that's Helmet's, which has the correct per-route values.
    html = dedupHeadTags(html, [
      // <title> is handled separately above via document.title
      /<meta\s+property="og:title"[^>]*>/g,
      /<meta\s+property="og:description"[^>]*>/g,
      /<meta\s+property="og:url"[^>]*>/g,
      /<meta\s+property="og:image"[^>]*>/g,
      /<meta\s+property="og:type"[^>]*>/g,
      /<meta\s+property="og:site_name"[^>]*>/g,
      /<meta\s+name="description"[^>]*>/g,
      /<meta\s+name="twitter:title"[^>]*>/g,
      /<meta\s+name="twitter:description"[^>]*>/g,
      /<meta\s+name="twitter:image"[^>]*>/g,
      /<meta\s+name="twitter:card"[^>]*>/g,
      /<link\s+rel="canonical"[^>]*>/g,
    ]);

    const outPath =
      route === "/"
        ? resolve(DIST, "index.html")
        : resolve(DIST, route.replace(/^\//, ""), "index.html");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
  }

  await browser.close();

  // Regenerate dist/sitemap.xml off the same data so the slug list,
  // robots.txt and sitemap can't drift. Static/category pages get
  // higher priority; case studies are leaves.
  const lastmod = new Date().toISOString().slice(0, 10);
  const SITEMAP_ENTRIES = [
    { loc: "/", changefreq: "weekly", priority: "1.0" },
    { loc: "/work", changefreq: "weekly", priority: "0.9" },
    { loc: "/production", changefreq: "monthly", priority: "0.8" },
    { loc: "/cultural-strategy", changefreq: "monthly", priority: "0.8" },
    { loc: "/visual-research", changefreq: "monthly", priority: "0.8" },
    { loc: "/about", changefreq: "monthly", priority: "0.7" },
    ...productionCases.map((c) => ({
      loc: `/work/${c.slug}`,
      changefreq: "monthly",
      priority: "0.6",
    })),
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_ENTRIES.map((e) => `  <url>
    <loc>https://emilyelucas.com${e.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
  writeFileSync(resolve(DIST, "sitemap.xml"), sitemap);
  console.log(`[prerender] sitemap.xml regenerated (${SITEMAP_ENTRIES.length} urls)`);

  console.log("[prerender] done");
} catch (err) {
  console.error("[prerender] error:", err);
  exitCode = 1;
} finally {
  server.kill();
}

process.exit(exitCode);

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function dedupHeadTags(html, patterns) {
  for (const re of patterns) {
    const matches = [...html.matchAll(re)];
    if (matches.length <= 1) continue;
    const keep = matches[matches.length - 1][0];
    // Strip every match, then re-insert the keeper at the position of
    // the last original match so head ordering stays sensible.
    const lastMatchEnd = matches[matches.length - 1].index + matches[matches.length - 1][0].length;
    let stripped = html.replace(re, "");
    // Insert keeper just before </head> so it lands inside head reliably.
    stripped = stripped.replace("</head>", `${keep}\n</head>`);
    html = stripped;
    // lastMatchEnd unused now but kept for readability; the strip+inject
    // approach is robust against position shifts from earlier patterns.
    void lastMatchEnd;
  }
  return html;
}
