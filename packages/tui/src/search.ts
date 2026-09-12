import { isSameDay } from "@typescript-calendar-lib/core";
import type { MonthData } from "./types.ts";

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
