export interface NavItem {
  text: string;
  link: string;
}

export interface NavGroup {
  text: string;
  items: NavItem[];
}

export const GITHUB_URL = "https://github.com/nazozokc/typescript-calendar";

/**
 * Base path of the docs site.
 *
 * GitHub Pages serves project sites under `/<repo>/`, so every link needs the
 * `/typescript-calendar` prefix there. The dev server (Bun.serve) serves from
 * `/` and needs no prefix — detect which case we are in from the URL.
 */
export const BASE = window.location.pathname.startsWith("/typescript-calendar")
  ? "/typescript-calendar"
  : "";

/** Prefix a docs-relative path (e.g. `/guide/getting-started`) with `BASE`. */
export function withBase(path: string): string {
  return BASE + path;
}

export const SIDEBAR: NavGroup[] = [
  {
    text: "Guide",
    items: [
      { text: "Getting Started", link: "/guide/getting-started" },
      { text: "Interactive Demo", link: "/guide/interactive-demo" },
      { text: "Architecture", link: "/guide/architecture" },
    ],
  },
  {
    text: "Packages",
    items: [
      { text: "core", link: "/packages/core" },
      { text: "cli", link: "/packages/cli" },
      { text: "react", link: "/packages/react" },
      { text: "tui", link: "/packages/tui" },
    ],
  },
];

export const PACKAGES: NavItem[] = [
  { text: "core", link: "/packages/core" },
  { text: "cli", link: "/packages/cli" },
  { text: "react", link: "/packages/react" },
  { text: "tui", link: "/packages/tui" },
];

/** Page title by URL path (used for <title>). */
export const TITLES: Record<string, string> = {
  "/": "typescript-calendar",
  "/guide/getting-started": "Getting Started | typescript-calendar",
  "/guide/interactive-demo": "Interactive Demo | typescript-calendar",
  "/guide/architecture": "Architecture | typescript-calendar",
  "/packages/core": "@typescript-calendar/core | typescript-calendar",
  "/packages/cli": "@typescript-calendar/cli | typescript-calendar",
  "/packages/react": "@typescript-calendar/react | typescript-calendar",
  "/packages/tui": "@typescript-calendar/tui | typescript-calendar",
};

/** Normalize an incoming pathname (strip `.html` suffix and the base path). */
export function normalizePath(pathname: string): string {
  const path = pathname
    .replace(/\.html$/, "")
    .replace(new RegExp(`^${BASE}`), "");
  return path in TITLES ? path : "/";
}
