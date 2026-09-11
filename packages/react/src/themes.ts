// ─── テーマ ───────────────────────────────────────────────

/** 組み込みテーマ名。カスタムテーマは ReactTheme オブジェクトを直接渡せる */
export type ThemeName = "default" | "modern";

/** React の見た目定義。テーマは主に CSS クラスで切り替える */
export interface ReactTheme {
  /** root 要素に追加するクラス */
  className: string;
}

export const THEMES: Record<ThemeName, ReactTheme> = {
  default: { className: "calendar-theme-default" },
  modern: { className: "calendar-theme-modern" },
};

export function resolveTheme(theme?: ThemeName | ReactTheme): ReactTheme {
  if (theme === undefined) return THEMES.default;
  if (typeof theme === "string") return THEMES[theme] ?? THEMES.default;
  return theme;
}

// ─── カラースキーム ───────────────────────────────────────

/** 組み込みカラースキーム名。カスタムは CSS 変数マップを直接渡せる */
export type ColorSchemeName = "default" | "ocean" | "forest" | "sunset" | "mono";

/** CSS カスタムプロパティ（--cal-*）の値マップ */
export type ReactColorScheme = Record<`--cal-${string}`, string>;

export const COLOR_SCHEMES: Record<ColorSchemeName, ReactColorScheme> = {
  default: {
    "--cal-bg": "#ffffff",
    "--cal-fg": "#1e293b",
    "--cal-accent": "#dc2626",
    "--cal-weekend-fg": "#94a3b8",
    "--cal-border": "#e2e8f0",
    "--cal-header-bg": "#f8fafc",
    "--cal-highlight-bg": "#dc2626",
    "--cal-highlight-fg": "#ffffff",
    "--cal-range-bg": "#fef3c7",
    "--cal-today-bg": "#fff7ed",
    "--cal-today-fg": "#c2410c",
  },
  ocean: {
    "--cal-bg": "#f0f9ff",
    "--cal-fg": "#0f172a",
    "--cal-accent": "#0e7490",
    "--cal-weekend-fg": "#7dd3fc",
    "--cal-border": "#bae6fd",
    "--cal-header-bg": "#e0f2fe",
    "--cal-highlight-bg": "#0e7490",
    "--cal-highlight-fg": "#ffffff",
    "--cal-range-bg": "#dff3fe",
    "--cal-today-bg": "#cffafe",
    "--cal-today-fg": "#155e75",
  },
  forest: {
    "--cal-bg": "#f0fdf4",
    "--cal-fg": "#052e16",
    "--cal-accent": "#15803d",
    "--cal-weekend-fg": "#86efac",
    "--cal-border": "#bbf7d0",
    "--cal-header-bg": "#dcfce7",
    "--cal-highlight-bg": "#15803d",
    "--cal-highlight-fg": "#ffffff",
    "--cal-range-bg": "#dcfce7",
    "--cal-today-bg": "#f0fdf4",
    "--cal-today-fg": "#166534",
  },
  sunset: {
    "--cal-bg": "#fffaf5",
    "--cal-fg": "#431407",
    "--cal-accent": "#ea580c",
    "--cal-weekend-fg": "#fdba74",
    "--cal-border": "#fed7aa",
    "--cal-header-bg": "#ffedd5",
    "--cal-highlight-bg": "#ea580c",
    "--cal-highlight-fg": "#ffffff",
    "--cal-range-bg": "#ffedd5",
    "--cal-today-bg": "#fff7ed",
    "--cal-today-fg": "#9a3412",
  },
  mono: {
    "--cal-bg": "#ffffff",
    "--cal-fg": "#111827",
    "--cal-accent": "#374151",
    "--cal-weekend-fg": "#d1d5db",
    "--cal-border": "#e5e7eb",
    "--cal-header-bg": "#f3f4f6",
    "--cal-highlight-bg": "#111827",
    "--cal-highlight-fg": "#ffffff",
    "--cal-range-bg": "#f3f4f6",
    "--cal-today-bg": "#e5e7eb",
    "--cal-today-fg": "#111827",
  },
};

export function resolveColorScheme(
  scheme?: ColorSchemeName | ReactColorScheme,
): ReactColorScheme {
  if (scheme === undefined) return COLOR_SCHEMES.default;
  if (typeof scheme === "string") {
    return COLOR_SCHEMES[scheme] ?? COLOR_SCHEMES.default;
  }
  return scheme;
}