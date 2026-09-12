import { isDateInRange, isSameDay } from "@typescript-calendar-lib/core";

// ─── セル状態クラス ───────────────────────────────────────

export interface CellStateOptions {
  today?: Date;
  highlight?: Date;
  range?: { from: Date; to: Date };
}

/** 範囲の from > to は不正入力として RangeError（isDateInRange が検証する） */

/** 日付セルの状態（週末・今日・ハイライト・範囲）に応じたCSSクラスを組み立てる */
export function getCellClasses(date: Date, options: CellStateOptions): string {
  const { today, highlight, range } = options;
  const classes: string[] = [];
  if (date.getDay() === 0 || date.getDay() === 6) classes.push("is-weekend");
  if (today !== undefined && isSameDay(date, today)) classes.push("is-today");
  if (highlight !== undefined && isSameDay(date, highlight))
    classes.push("is-highlight");
  if (range !== undefined && isDateInRange(date, range))
    classes.push("is-in-range");
  return classes.join(" ");
}
