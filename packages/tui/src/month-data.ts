import {
  buildMonthGrid,
  getMonthName,
  getWeekdayHeaders,
  isDateInRange,
  isSameDay,
} from "@typescript-calendar-lib/core";
import type { CalendarCell, MonthData, MonthDataOptions } from "./types.ts";

/**
 * 月カレンダーの完全なデータを構築する。
 *
 * core の buildMonthGrid を包み、各セルにメタデータ（今日判定、ハイライト、範囲等）を付与する。
 * プレゼンテーション情報（色、スタイル）は含まない。
 */
export function buildMonthData(
  year: number,
  month: number,
  options: MonthDataOptions = {},
): MonthData {
  const {
    locale = "en",
    weekStart = "sunday",
    today = new Date(),
    highlight,
    range,
  } = options;

  const title = `${getMonthName(locale, month)} ${year}`;
  const weekdays = getWeekdayHeaders(locale, weekStart);
  const rawGrid = buildMonthGrid(year, month, weekStart);

  const cells: CalendarCell[][] = rawGrid.map((row) =>
    row.map((day, dayOfWeek) => {
      if (day === null) {
        return {
          day: null,
          date: null,
          dayOfWeek,
          isCurrentMonth: false,
          isToday: false,
          isHighlight: false,
          isInRange: false,
        };
      }

      const date = new Date(year, month - 1, day);

      return {
        day,
        date,
        dayOfWeek,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        isHighlight: highlight !== undefined && isSameDay(date, highlight),
        isInRange: isDateInRange(date, range),
      };
    }),
  );

  // 末尾の全 null 行を除外した行数
  let visibleRows = cells.length;
  while (
    visibleRows > 0 &&
    cells[visibleRows - 1]!.every((c) => c.day === null)
  ) {
    visibleRows--;
  }

  return { year, month, title, weekdays, cells, visibleRows };
}
