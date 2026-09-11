import { clampCursor, findFirstDayCell, findTodayCell } from "./cursor.ts";
import { buildMonthData } from "./month-data.ts";
import { resolveOptions } from "./options.ts";
import type { CalendarState, CalendarStateOptions } from "./types.ts";

// ─── 状態生成 ────────────────────────────────────────────

/**
 * カレンダー状態を初期化する。
 *
 * カーソルはデフォルトで「今日」のセル、今日が当月に無ければ最初の日付セルに置かれる。
 */
export function createCalendarState(
  options: CalendarStateOptions = {},
): CalendarState {
  const resolved = resolveOptions(options);
  const year = options.initialYear ?? resolved.today.getFullYear();
  const month = options.initialMonth ?? resolved.today.getMonth() + 1;

  const monthData = buildMonthData(year, month, resolved);
  const cursor = clampCursor(
    options.initialCursor ??
      findTodayCell(monthData) ??
      findFirstDayCell(monthData),
    monthData,
  );

  return {
    year,
    month,
    cursor,
    selectedDate: null,
    options: resolved,
    monthData,
  };
}
