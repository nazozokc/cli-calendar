import { sveltePlugin } from "@lostgradient/bun-plugin-svelte";

// Production bundle: server + bundled client assets from the HTML import.
// Run with: bun ./docs/build.ts
const result = await Bun.build({
  entrypoints: ["./docs/server.ts"],
  outdir: "./docs/dist",
  target: "bun",
  plugins: [sveltePlugin({ generate: "client" })],
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

// GitHub Pages serves project sites under `/<repo>/`:
// https://nazozokc.github.io/typescript-calendar-lib/
const PUBLISH_BASE = "/typescript-calendar-lib";

// The HTML-import manifest references client assets with relative paths
// (e.g. `./chunk-xyz.js`), which break on nested routes like `/packages/core`
// and on the project-site base path. Rewrite them to root-absolute,
// base-prefixed paths in the emitted HTML.
const htmlPath = "./docs/dist/index.html";
const html = await Bun.file(htmlPath).text();
const rewritten = html.replace(
  /((?:src|href)=")\.\/([^"]+\.(?:js|css))"/g,
  `$1${PUBLISH_BASE}/$2"`,
);
await Bun.write(htmlPath, rewritten);

// GitHub Pages has no SPA fallback: a direct hit on `/packages/react` (or a
// nav click, since links are plain <a href>) 404s. Serve the same shell as
// 404.html, which GitHub Pages returns for any unknown path — the client then
// renders the page from `location.pathname`. This is the standard trick for
// static GitHub Pages SPAs.
await Bun.write("./docs/dist/404.html", rewritten);

console.log(`docs build: ${result.outputs.length} outputs -> docs/dist/`);
