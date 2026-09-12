/// <reference types="svelte" />

/** Markdown imports (Bun's built-in markdown loader returns rendered HTML). */
declare module "*.md" {
  const html: string;
  export default html;
}
