import { buildMonthData } from "./month-data.ts";
import { findDateCell, findTodayCell } from "./search.ts";
import { rebuildState } from "./state.ts";
import type { CalendarState, MonthDirection } from "./types.ts";

// ─── 日付計算 ────────────────────────────────────────────

/** year/month を delta ヶ月ずらす（月跨ぎ・年跨ぎを正規化） */
export function shiftMonth(year: number, month: number, delta: number) {
  const total = year * 12 + (month - 1) + delta;
  const newYear = Math.floor(total / 12);
  const newMonth = (((total % 12) + 12) % 12) + 1;
  return { year: newYear, month: newMonth };
}

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

/** 前年/翌年へ移動する */
export function navigateYear(
  state: CalendarState,
  direction: MonthDirection,
): CalendarState {
  return rebuildState(
    state.year + (direction === "next" ? 1 : -1),
    state.month,
    state.cursor,
    state.selectedDate,
    state.options,
  );
}

/** 指定した年月へジャンプする */
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
