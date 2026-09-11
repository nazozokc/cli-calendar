import { defineConfig } from "vitepress";

export default defineConfig({
  title: "typescript-calendar",
  description:
    "A type-safe calendar library for TypeScript. Render month, year, or date-range calendars as plain text, React components, or headless TUI data.",
  base: "/",

  themeConfig: {
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      {
        text: "Packages",
        items: [
          { text: "core", link: "/packages/core" },
          { text: "cli", link: "/packages/cli" },
          { text: "react", link: "/packages/react" },
          { text: "tui", link: "/packages/tui" },
        ],
      },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Getting Started", link: "/guide/getting-started" }],
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
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/nazozokc/typescript-calendar",
      },
    ],

    editLink: {
      pattern:
        "https://github.com/nazozokc/typescript-calendar/edit/main/docs/:path",
    },

    search: {
      provider: "local",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 nazozokc",
    },
  },
});
