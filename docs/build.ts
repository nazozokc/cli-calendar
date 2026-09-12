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

// The HTML-import manifest references client assets with relative paths
// (e.g. `./chunk-xyz.js`), which break on nested routes like `/packages/core`.
// Rewrite them to root-absolute paths in the emitted HTML.
const htmlPath = "./docs/dist/index.html";
const html = await Bun.file(htmlPath).text();
await Bun.write(
  htmlPath,
  html.replace(/((?:src|href)=")\.\/([^"]+\.(?:js|css))"/g, '$1/$2"'),
);

console.log(`docs build: ${result.outputs.length} outputs -> docs/dist/`);
