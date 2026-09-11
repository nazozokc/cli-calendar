import { clampCursor, findDateCell, findTodayCell } from "./cursor.ts";
import { buildMonthData } from "./month-data.ts";
import type {
  CalendarState,
  MonthDirection,
  ResolvedOptions,
} from "./types.ts";

// ─── 日付計算 ────────────────────────────────────────────

/** year/month を delta ヶ月ずらす（月跨ぎ・年跨ぎを正規化） */
export function shiftMonth(year: number, month: number, delta: number) {
  const total = year * 12 + (month - 1) + delta;
  const newYear = Math.floor(total / 12);
  const newMonth = (((total % 12) + 12) % 12) + 1;
  return { year: newYear, month: newMonth };
}

/** カーソル/選択状態を保ったまま、新しい年月で状態を再構築する */
function rebuild(
  year: number,
  month: number,
  cursor: { row: number; col: number } | null,
  selectedDate: Date | null,
  options: ResolvedOptions,
): CalendarState {
  const monthData = buildMonthData(year, month, options);
  return {
    year,
    month,
    cursor: clampCursor(cursor, monthData),
    selectedDate,
    options,
    monthData,
  };
}

// ─── 公開API ─────────────────────────────────────────────

/** 前月/翌月へ移動する（カーソルは新しい月の範囲にクランプされる） */
export function navigateMonth(
  state: CalendarState,
  direction: MonthDirection,
): CalendarState {
  const delta = direction === "next" ? 1 : -1;
  const { year, month } = shiftMonth(state.year, state.month, delta);
  return rebuild(year, month, state.cursor, state.selectedDate, state.options);
}

/** 前年/翌年へ移動する */
export function navigateYear(
  state: CalendarState,
  direction: MonthDirection,
): CalendarState {
  return rebuild(
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
  return rebuild(
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
  return {
    year,
    month,
    cursor: findDateCell(monthData, date),
    selectedDate: state.selectedDate,
    options: state.options,
    monthData,
  };
}

/** 今日の月へジャンプし、カーソルを今日のセルに置く */
export function goToToday(state: CalendarState): CalendarState {
  const { today } = state.options;
  const monthData = buildMonthData(
    today.getFullYear(),
    today.getMonth() + 1,
    state.options,
  );
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    cursor: findTodayCell(monthData),
    selectedDate: state.selectedDate,
    options: state.options,
    monthData,
  };
}
