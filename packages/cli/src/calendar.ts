import type {
  CalendarOptions,
  CalendarYearOptions,
  CalendarRangeOptions,
} from "@typescript-calendar/core";
import { getMonthRange } from "@typescript-calendar/core";
import { renderMonth, renderYear } from "./render.ts";

/**
 * 月カレンダーをテキストで返す
 */
export function calendar(options: CalendarOptions): string {
  const {
    year,
    month,
    locale = "en",
    weekStart = "sunday",
    highlight,
    highlightStyle = "bracket",
    range,
    color = false,
  } = options;

  return renderMonth(year, month, {
    locale,
    weekStart,
    highlight,
    highlightStyle,
    range,
    color,
  });
}

/**
 * 年間カレンダーを4列×3行でテキストで返す
 */
export function calendarYear(options: CalendarYearOptions): string {
  const {
    year,
    locale = "en",
    weekStart = "sunday",
    highlight,
    highlightStyle = "bracket",
    range,
    color = false,
  } = options;

  return renderYear(year, {
    locale,
    weekStart,
    highlight,
    highlightStyle,
    range,
    color,
  });
}

/**
 * 任意の日付範囲のカレンダーをテキストで返す
 */
export function calendarRange(options: CalendarRangeOptions): string {
  const {
    from,
    to,
    locale = "en",
    weekStart = "sunday",
    highlight,
    highlightStyle = "bracket",
    range,
    color = false,
  } = options;

  const months = getMonthRange(from, to);

  return months
    .map(({ year, month }) => renderMonth(year, month, {
      locale,
      weekStart,
      highlight,
      highlightStyle,
      range,
      color,
    }))
    .join("\n\n");
}