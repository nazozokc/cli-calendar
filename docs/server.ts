import page from "./index.html";

/**
 * Docs site server — Bun.serve + HTML imports + Svelte (via bunfig.toml plugin).
 *
 * Dev:  bun --hot ./docs/server.ts
 * Prod: bun ./docs/build.ts && bun ./docs/dist/server.js
 */
const ROUTES = [
  "/",
  "/guide/getting-started",
  "/guide/getting-started.html",
  "/guide/interactive-demo",
  "/guide/interactive-demo.html",
  "/guide/architecture",
  "/guide/architecture.html",
  "/packages/core",
  "/packages/core.html",
  "/packages/cli",
  "/packages/cli.html",
  "/packages/react",
  "/packages/react.html",
  "/packages/tui",
  "/packages/tui.html",
] as const;

// Every route serves the same shell; the client picks the page from the URL.
const routes = Object.fromEntries(ROUTES.map((path) => [path, page]));

const server = Bun.serve({
  port: Number(Bun.env.PORT ?? 3000),
  routes,
  development:
    Bun.env.NODE_ENV === "production"
      ? undefined
      : { hmr: true, console: true },
});

console.log(`docs: ${server.url}`);
