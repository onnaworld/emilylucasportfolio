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
import puppeteer from "puppeteer-core";

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
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    await new Promise((r) => setTimeout(r, 600));
    let html = await page.content();

    // Dedup head tags. Helmet appends its per-route tags on top of the
    // static ones from index.html — keep the first (Helmet's) occurrence
    // and strip duplicates so we don't ship multiple titles / OGs.
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
