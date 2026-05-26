// Post-build prerender: spin up `serve` on dist/, navigate Chromium
// to each public route, dump fully-hydrated HTML (with React-mounted
// content + react-helmet-async meta tags) into dist/<route>/index.html.
//
// Vercel will then serve those static HTML files per URL — so LinkedIn /
// iMessage / GPTBot / ClaudeBot / PerplexityBot (which DON'T execute JS)
// see real per-route meta and content, not just index.html's defaults.
//
// Runs automatically via `postbuild` in package.json after `vite build`.

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import puppeteer from "puppeteer";

const ROUTES = [
  "/",
  "/work",
  "/production",
  "/cultural-strategy",
  "/visual-research",
  "/about",
];
const PORT = 5174;
const DIST = resolve(process.cwd(), "dist");

if (!existsSync(DIST)) {
  console.error("[prerender] dist/ doesn't exist — run `vite build` first.");
  process.exit(1);
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

// Wait up to 8s for the server to be ready.
for (let i = 0; i < 80 && !serverReady; i++) {
  await new Promise((r) => setTimeout(r, 100));
}
if (!serverReady) {
  // serve doesn't always announce — best-effort assume it's up after 1.5s.
  console.log("[prerender] server didn't announce ready; continuing anyway");
}
await new Promise((r) => setTimeout(r, 500));

let exitCode = 0;
try {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  // Identify ourselves so we could opt-out of analytics if we ever add any.
  await page.setUserAgent(
    "EmilyLucasPrerenderer/1.0 (+https://emilyelucas.com)"
  );

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    console.log(`[prerender] ${route}`);
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    // Give Helmet a tick to flush meta into <head>.
    await new Promise((r) => setTimeout(r, 600));
    let html = await page.content();

    // Dedup head tags. The page captures BOTH the static tags from
    // index.html and Helmet's per-route tags, so we end up with
    // multiple <title>, og:*, twitter:*, canonical entries. Helmet's
    // injected tags appear FIRST in the head for each route, so keep
    // the first occurrence and remove the rest.
    html = dedupHeadTags(html, [
      /<title>[^<]*<\/title>/g,
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
  console.log("[prerender] done");
} catch (err) {
  console.error("[prerender] error:", err);
  exitCode = 1;
} finally {
  server.kill();
}

process.exit(exitCode);

// Keep the first match of each regex, remove subsequent matches.
function dedupHeadTags(html, patterns) {
  for (const re of patterns) {
    let first = true;
    html = html.replace(re, (m) => {
      if (first) { first = false; return m; }
      return "";
    });
  }
  return html;
}
