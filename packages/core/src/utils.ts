import type { WeekStart } from "./types.ts";

/** 月初日（1日）を返す */
export function firstDayOfMonth(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

/** 月末日を返す */
export function lastDayOfMonth(year: number, month: number): Date {
  return new Date(year, month, 0);
}

/**
 * 月の日付グリッドを生成する（6行×7列）
 * 各セルは日数（1-31）または null（空欄）
 */
export function buildMonthGrid(
  year: number,
  month: number,
  weekStart: WeekStart,
): (number | null)[][] {
  const first = firstDayOfMonth(year, month);
  const last = lastDayOfMonth(year, month);
  const daysInMonth = last.getDate();

  let startDayOfWeek = first.getDay();
  if (weekStart === "monday") {
    startDayOfWeek = (startDayOfWeek + 6) % 7;
  }

  const grid: (number | null)[][] = [];
  let currentDay = 1;

  for (let week = 0; week < 6; week++) {
    const row: (number | null)[] = [];
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      if (
        (week === 0 && dayOfWeek < startDayOfWeek) ||
        currentDay > daysInMonth
      ) {
        row.push(null);
      } else {
        row.push(currentDay);
        currentDay++;
      }
    }
    grid.push(row);
  }

  return grid;
}

/** 日付が範囲内に含まれるか */
export function isDateInRange(
  date: Date,
  range?: { from: Date; to: Date },
): boolean {
  if (!range) return false;
  const time = date.getTime();
  return time >= range.from.getTime() && time <= range.to.getTime();
}

/** 日付が今日と一致するか（日付のみ比較） */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** 日付が範囲の年开始から範囲の年结束までの月リストを返す */
export function getMonthRange(
  from: Date,
  to: Date,
): { year: number; month: number }[] {
  const months: { year: number; month: number }[] = [];
  let year = from.getFullYear();
  let month = from.getMonth() + 1;

  while (
    year < to.getFullYear() ||
    (year === to.getFullYear() && month <= to.getMonth() + 1)
  ) {
    months.push({ year, month });
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return months;
}
