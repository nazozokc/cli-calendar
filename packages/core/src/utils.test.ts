import { test, expect, describe } from "vitest";
import {
  buildMonthGrid,
  firstDayOfMonth,
  getMonthRange,
  isDateInRange,
  isSameDay,
  lastDayOfMonth,
} from "./utils.ts";

describe("firstDayOfMonth", () => {
  test("1月の月初", () => {
    expect(firstDayOfMonth(2026, 1)).toEqual(new Date(2026, 0, 1));
  });

  test("12月の月初", () => {
    expect(firstDayOfMonth(2026, 12)).toEqual(new Date(2026, 11, 1));
  });
});

describe("lastDayOfMonth", () => {
  test("30日で終わる月（4月は30日）", () => {
    expect(lastDayOfMonth(2026, 4)).toEqual(new Date(2026, 3, 30));
  });

  test("31日で終わる月", () => {
    expect(lastDayOfMonth(2026, 1)).toEqual(new Date(2026, 0, 31));
  });

  test("通常年の2月は28日", () => {
    expect(lastDayOfMonth(2026, 2)).toEqual(new Date(2026, 1, 28));
  });

  test("うるう年の2月は29日", () => {
    expect(lastDayOfMonth(2024, 2)).toEqual(new Date(2024, 1, 29));
  });
});

describe("buildMonthGrid", () => {
  test("gridは常に6行×7列", () => {
    const grid = buildMonthGrid(2026, 9, "sunday");
    expect(grid).toHaveLength(6);
    for (const row of grid) {
      expect(row).toHaveLength(7);
    }
  });

  test("9月2026（日曜始まり）は1日が火曜から開始", () => {
    const grid = buildMonthGrid(2026, 9, "sunday");
    expect(grid[0]).toEqual([null, null, 1, 2, 3, 4, 5]);
  });

  test("9月2026（月曜始まり）は1日が月曜から開始", () => {
    const grid = buildMonthGrid(2026, 9, "monday");
    expect(grid[0]).toEqual([null, 1, 2, 3, 4, 5, 6]);
  });

  test("日付の日数が月末を超えない", () => {
    const grid = buildMonthGrid(2026, 2, "sunday");
    const flat = grid.flat().filter((d) => d !== null);
    expect(Math.max(...(flat as number[]))).toBe(28);
    expect(flat).toHaveLength(28);
  });
});

describe("isDateInRange", () => {
  const range = { from: new Date(2026, 8, 1), to: new Date(2026, 8, 15) };

  test("範囲なしなら常にfalse", () => {
    expect(isDateInRange(new Date(2026, 8, 1))).toBe(false);
  });

  test("範囲内の日付はtrue", () => {
    expect(isDateInRange(new Date(2026, 8, 10), range)).toBe(true);
  });

  test("開始日は境界として含む", () => {
    expect(isDateInRange(new Date(2026, 8, 1), range)).toBe(true);
  });

  test("終了日は境界として含む", () => {
    expect(isDateInRange(new Date(2026, 8, 15), range)).toBe(true);
  });

  test("範囲外の前日はfalse", () => {
    expect(isDateInRange(new Date(2026, 7, 31), range)).toBe(false);
  });

  test("範囲外の翌日はfalse", () => {
    expect(isDateInRange(new Date(2026, 8, 16), range)).toBe(false);
  });
});

describe("isSameDay", () => {
  test("同じ日付はtrue", () => {
    expect(isSameDay(new Date(2026, 8, 8, 3, 30), new Date(2026, 8, 8, 20, 0))).toBe(true);
  });

  test("異なる日はfalse", () => {
    expect(isSameDay(new Date(2026, 8, 8), new Date(2026, 8, 9))).toBe(false);
  });

  test("同じ日だが異なる月はfalse", () => {
    expect(isSameDay(new Date(2026, 8, 8), new Date(2026, 7, 8))).toBe(false);
  });
});

describe("getMonthRange", () => {
  test("同月内は1件", () => {
    expect(getMonthRange(new Date(2026, 8, 1), new Date(2026, 8, 30)))
      .toEqual([{ year: 2026, month: 9 }]);
  });

  test("複数月に跨る", () => {
    expect(getMonthRange(new Date(2026, 5, 1), new Date(2026, 8, 30)))
      .toEqual([
        { year: 2026, month: 6 },
        { year: 2026, month: 7 },
        { year: 2026, month: 8 },
        { year: 2026, month: 9 },
      ]);
  });

  test("12月から翌年1月に跨る", () => {
    expect(getMonthRange(new Date(2025, 11, 31), new Date(2026, 0, 15)))
      .toEqual([
        { year: 2025, month: 12 },
        { year: 2026, month: 1 },
      ]);
  });

  test("1年の範囲", () => {
    expect(getMonthRange(new Date(2026, 0, 1), new Date(2026, 11, 31))).toHaveLength(12);
  });
});
