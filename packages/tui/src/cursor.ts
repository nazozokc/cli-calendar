import { isSameDay } from "@typescript-calendar/core";
import type { CalendarState, Direction, MonthData } from "./types.ts";

// ─── セル検索 ────────────────────────────────────────────

/** 月データから「今日」のセル位置を探す。なければ null */
export function findTodayCell(
  monthData: MonthData,
): { row: number; col: number } | null {
  for (let row = 0; row < monthData.cells.length; row++) {
    const cells = monthData.cells[row]!;
    for (let col = 0; col < cells.length; col++) {
      if (cells[col]!.isToday) return { row, col };
    }
  }
  return null;
}

/** 月データから指定日付のセル位置を探す。なければ null */
export function findDateCell(
  monthData: MonthData,
  date: Date,
): { row: number; col: number } | null {
  for (let row = 0; row < monthData.cells.length; row++) {
    const cells = monthData.cells[row]!;
    for (let col = 0; col < cells.length; col++) {
      const cell = cells[col]!;
      if (cell.date !== null && isSameDay(cell.date, date)) {
        return { row, col };
      }
    }
  }
  return null;
}

/** 月データから最初の日付セルを探す */
export function findFirstDayCell(
  monthData: MonthData,
): { row: number; col: number } | null {
  for (let row = 0; row < monthData.cells.length; row++) {
    const cells = monthData.cells[row]!;
    for (let col = 0; col < cells.length; col++) {
      if (cells[col]!.day !== null) return { row, col };
    }
  }
  return null;
}

/** カーソルを行数・列数の範囲にクランプする */
export function clampCursor(
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

// ─── カーソル移動 ────────────────────────────────────────

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
      col = (col - 1 + cols) % cols;
      break;
    case "right":
      col = (col + 1) % cols;
      break;
    case "up":
      row = (row - 1 + rows) % rows;
      break;
    case "down":
      row = (row + 1) % rows;
      break;
  }

  return { ...state, cursor: { row, col } };
}

// ─── 日付取得・選択 ──────────────────────────────────────

/** 指定日付のセルへカーソルを移動する。当月に無ければ状態を変えず返す */
export function setCursorToDate(
  state: CalendarState,
  date: Date,
): CalendarState {
  const pos = findDateCell(state.monthData, date);
  if (pos === null) return state;
  return { ...state, cursor: pos };
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

/** 選択中の日付を取得する。未選択なら null */
export function getSelectedDate(state: CalendarState): Date | null {
  return state.selectedDate;
}

/** 選択を解除する */
export function clearSelection(state: CalendarState): CalendarState {
  return { ...state, selectedDate: null };
}