import type {
  CalendarState,
  CalendarStateOptions,
  Direction,
  MonthData,
  MonthDirection,
  ResolvedOptions,
} from "./types.ts";
import { buildMonthData } from "./month-data.ts";

// ─── 内部ヘルパー ────────────────────────────────────────

/** year/month を delta ヶ月ずらす（月跨ぎ・年跨ぎを正規化） */
function shiftMonth(year: number, month: number, delta: number) {
  const total = year * 12 + (month - 1) + delta;
  const newYear = Math.floor(total / 12);
  const newMonth = ((total % 12) + 12) % 12 + 1;
  return { year: newYear, month: newMonth };
}

/** 月データから「今日」のセル位置を探す。なければ null */
function findTodayCell(monthData: MonthData): { row: number; col: number } | null {
  for (let row = 0; row < monthData.cells.length; row++) {
    const cells = monthData.cells[row]!;
    for (let col = 0; col < cells.length; col++) {
      if (cells[col]!.isToday) return { row, col };
    }
  }
  return null;
}

/** 月データから最初の日付セルを探す */
function findFirstDayCell(monthData: MonthData): { row: number; col: number } | null {
  for (let row = 0; row < monthData.cells.length; row++) {
    const cells = monthData.cells[row]!;
    for (let col = 0; col < cells.length; col++) {
      if (cells[col]!.day !== null) return { row, col };
    }
  }
  return null;
}

/** カーソルを行数・列数の範囲にクランプする */
function clampCursor(
  cursor: { row: number; col: number } | null,
  monthData: MonthData,
): { row: number; col: number } | null {
  if (cursor === null) return null;
  const maxRow = Math.max(0, monthData.visibleRows - 1);
  const maxCol = Math.max(0, (monthData.cells[0]?.length ?? 7) - 1);
  return {
    row: Math.min(cursor.row, maxRow),
    col: Math.min(cursor.col, maxCol),
  };
}

/** 状態を新しい年月で再構築する */
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

/** 解決済みオプションを生成する */
function resolveOptions(options: CalendarStateOptions): ResolvedOptions {
  const { today = new Date(), locale = "en", weekStart = "sunday" } = options;
  return {
    locale,
    weekStart,
    today,
    highlight: options.highlight,
    range: options.range,
  };
}

// ─── 公開API ─────────────────────────────────────────────

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

/** カーソルを移動する。カーソル未設定時は今日（なければ先頭の日付）にスナップする */
export function moveCursor(
  state: CalendarState,
  direction: Direction,
): CalendarState {
  const monthData = state.monthData;
  const rows = monthData.visibleRows;
  const cols = monthData.cells[0]?.length ?? 7;

  let cursor = state.cursor;
  if (cursor === null) {
    cursor = findTodayCell(monthData) ?? findFirstDayCell(monthData);
    if (cursor === null) return state;
  }

  let { row, col } = cursor;

  switch (direction) {
    case "left":
      col = col - 1 < 0 ? cols - 1 : col - 1;
      break;
    case "right":
      col = (col + 1) % cols;
      break;
    case "up":
      row = row - 1 < 0 ? rows - 1 : row - 1;
      break;
    case "down":
      row = (row + 1) % rows;
      break;
  }

  return { ...state, cursor: { row, col } };
}

/** カーソル位置の日付を取得する。空欄セルなら null */
export function getCursorDate(state: CalendarState): Date | null {
  if (state.cursor === null) return null;
  const cell = state.monthData.cells[state.cursor.row]?.[state.cursor.col];
  return cell?.date ?? null;
}

/** カーソル位置の日付を選択する。空欄セル上では選択されない */
export function selectDate(state: CalendarState): CalendarState {
  const date = getCursorDate(state);
  if (date === null) return state;
  return { ...state, selectedDate: date };
}