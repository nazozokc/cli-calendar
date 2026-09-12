import { getMonthRange } from "@typescript-calendar-lib/core";
import { renderMonth, renderYear } from "./render.ts";
import type {
  CalendarOptions,
  CalendarRangeOptions,
  CalendarYearOptions,
  RenderMonthOptions,
} from "./types.ts";

// ─── Options 解決 ─────────────────────────────────────────

/**
 * 各 API に共通のオプションをデフォルト値込みの描画オプションに正規化する。
 * core 由来のオプションと CLI 固有のオプション（theme 等）をまとめる。
 */
function toRenderOptions(
  options: CalendarOptions | CalendarYearOptions | CalendarRangeOptions,
): RenderMonthOptions {
  const {
    locale = "en",
    weekStart = "sunday",
    highlight,
    highlightStyle = "bracket",
    range,
    color = false,
    theme,
    colorScheme,
    today,
  } = options;

  return {
    locale,
    weekStart,
    highlight,
    highlightStyle,
    range,
    color,
    theme,
    colorScheme,
    today,
  };
}

// ─── 公開API ─────────────────────────────────────────────

/**
 * 月カレンダーをテキストで返す
 */
export function calendar(options: CalendarOptions): string {
  return renderMonth(options.year, options.month, toRenderOptions(options));
}

/**
 * 年間カレンダーを4列×3行でテキストで返す
 */
export function calendarYear(options: CalendarYearOptions): string {
  return renderYear(options.year, toRenderOptions(options));
}

/**
 * 任意の日付範囲のカレンダーをテキストで返す
 */
export function calendarRange(options: CalendarRangeOptions): string {
  const renderOptions = toRenderOptions(options);
  const months = getMonthRange(options.from, options.to);

  return months
    .map(({ year, month }) => renderMonth(year, month, renderOptions))
    .join("\n\n");
}
