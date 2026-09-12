import {
  assertValidDate,
  MAX_YEAR,
  MIN_YEAR,
} from "@typescript-calendar-lib/core";
import { buildMonthData } from "./month-data.ts";
import { shiftMonth } from "./month-math.ts";
import { findDateCell, findTodayCell } from "./search.ts";
import { rebuildState } from "./state.ts";
import type { CalendarState, MonthDirection } from "./types.ts";

// ─── 年月の算術 ───────────────────────────────────────────

/**
 * year/month を delta ヶ月ずらす（月跨ぎ・年跨ぎを正規化）。
 *
 * 詳細な挙動は month-math.ts を参照。年は MIN_YEAR..MAX_YEAR にクランプされる。
 */
export { shiftMonth };

// ─── 公開API ─────────────────────────────────────────────

/** 前月/翌月へ移動する（カーソルは新しい月の範囲にクランプされる） */
export function navigateMonth(
  state: CalendarState,
  direction: MonthDirection,
): CalendarState {
  const delta = direction === "next" ? 1 : -1;
  const { year, month } = shiftMonth(state.year, state.month, delta);
  return rebuildState(
    year,
    month,
    state.cursor,
    state.selectedDate,
    state.options,
  );
}

/** 前年/翌年へ移動する（サポート範囲の端では移動しない） */
export function navigateYear(
  state: CalendarState,
  direction: MonthDirection,
): CalendarState {
  const year = state.year + (direction === "next" ? 1 : -1);
  if (year < MIN_YEAR || year > MAX_YEAR) return state;
  return rebuildState(
    year,
    state.month,
    state.cursor,
    state.selectedDate,
    state.options,
  );
}

/** 指定した年月へジャンプする。month は正規化される（例: 13 → 翌年1月） */
export function goToMonth(
  state: CalendarState,
  year: number,
  month: number,
): CalendarState {
  const normalized = shiftMonth(year, month, 0);
  return rebuildState(
    normalized.year,
    normalized.month,
    state.cursor,
    state.selectedDate,
    state.options,
  );
}

/** 指定した日付の月へジャンプし、カーソルをその日付のセルに置く */
export function goToDate(state: CalendarState, date: Date): CalendarState {
  assertValidDate(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const monthData = buildMonthData(year, month, state.options);
  return rebuildState(
    year,
    month,
    findDateCell(monthData, date),
    state.selectedDate,
    state.options,
    monthData,
  );
}

/** 今日の月へジャンプし、カーソルを今日のセルに置く */
export function goToToday(state: CalendarState): CalendarState {
  const { today } = state.options;
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const monthData = buildMonthData(year, month, state.options);
  return rebuildState(
    year,
    month,
    findTodayCell(monthData),
    state.selectedDate,
    state.options,
    monthData,
  );
}
