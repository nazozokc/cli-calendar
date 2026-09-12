<script lang="ts">
import { GITHUB_URL, withBase } from "../nav";

interface Feature {
  title: string;
  details: string;
}

const FEATURES: Feature[] = [
  {
    title: "Month / Year / Range",
    details:
      "Render a single month, a full year (4×3 grid), or any arbitrary date range.",
  },
  {
    title: "Bilingual",
    details: "English and Japanese locales out of the box.",
  },
  {
    title: "Zero Dependencies",
    details:
      "The core package has no runtime dependencies. ANSI colors only when enabled.",
  },
  {
    title: "Multiple Targets",
    details:
      "Plain text (CLI), React component, or headless data for any TUI framework.",
  },
  {
    title: "Themes & Colors",
    details:
      "Built-in themes and color schemes, or bring your own custom definitions.",
  },
  {
    title: "Fully Typed",
    details:
      "Every option, return type, and export is fully typed for excellent IDE support.",
  },
];
</script>

<section class="hero">
  <h1 class="hero-name">typescript-calendar</h1>
  <p class="hero-text">Type-safe calendar library</p>
  <p class="hero-tagline">
    Render month, year, or date-range calendars as plain text, React components,
    or headless TUI data. Zero runtime dependencies.
  </p>
  <div class="hero-actions">
    <a class="btn btn-brand" href={withBase("/guide/getting-started")}>Get Started</a>
    <a class="btn btn-alt" href={GITHUB_URL} target="_blank" rel="noreferrer"
      >View on GitHub</a
    >
  </div>
</section>

<section class="features">
  {#each FEATURES as feature}
    <article class="feature">
      <h2>{feature.title}</h2>
      <p>{feature.details}</p>
    </article>
  {/each}
</section>