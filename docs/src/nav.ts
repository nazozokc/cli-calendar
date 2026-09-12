export interface NavItem {
  text: string;
  link: string;
}

export interface NavGroup {
  text: string;
  items: NavItem[];
}

export const GITHUB_URL = "https://github.com/nazozokc/typescript-calendar";

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

/** Normalize an incoming pathname (strip `.html` suffix). */
export function normalizePath(pathname: string): string {
  const path = pathname.replace(/\.html$/, "");
  return path in TITLES ? path : "/";
}
