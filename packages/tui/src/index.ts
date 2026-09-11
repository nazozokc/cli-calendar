import type { CalendarOptions } from "@cli-calendar/core";
import { buildMonthGrid, getMonthName, getWeekdayHeaders } from "@cli-calendar/core";

/**
 * TUIカレンダー - blessed/tarea で描画する予定
 * 現在は skeleton のみ
 */
export function renderMonthTUI(
  year: number,
  month: number,
  options: Omit<CalendarOptions, "year" | "month"> = {},
): string {
  // TODO: TUI固有の描画ロジックを実装
  // 今はプレーンテキストにフォールバック
  const { locale = "en", weekStart = "sunday" } = options;
  const monthName = getMonthName(locale, month);
  const weekdays = getWeekdayHeaders(locale, weekStart);
  const grid = buildMonthGrid(year, month, weekStart);

  const lines: string[] = [];
  lines.push(`${monthName} ${year}`);
  lines.push(weekdays.join(" "));

  for (const row of grid) {
    if (row.every((d) => d === null)) continue;
    lines.push(
      row.map((d) => (d === null ? "  " : String(d).padStart(2))).join(" "),
    );
  }

  return lines.join("\n");
}
