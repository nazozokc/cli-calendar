import { describe, expect, test } from "vitest";
import { getCursorDate, selectDate } from "./cursor.ts";
import {
  goToDate,
  goToMonth,
  goToToday,
  navigateMonth,
  navigateYear,
} from "./navigation.ts";
import { createCalendarState } from "./state.ts";

const TODAY = new Date(2026, 8, 15); // 2026-09-15

describe("navigateMonth", () => {
  test("翌月へ移動する", () => {
    const state = createCalendarState({ today: TODAY });
    const next = navigateMonth(state, "next");
    expect(next.year).toBe(2026);
    expect(next.month).toBe(10);
    expect(next.monthData.title).toBe("October 2026");
  });

  test("前月へ移動する", () => {
    const state = createCalendarState({ today: TODAY });
    const prev = navigateMonth(state, "prev");
    expect(prev.year).toBe(2026);
    expect(prev.month).toBe(8);
    expect(prev.monthData.title).toBe("August 2026");
  });

  test("年末を跨ぐと年が進む", () => {
    const state = createCalendarState({ today: new Date(2026, 11, 15) });
    const next = navigateMonth(state, "next");
    expect(next.year).toBe(2027);
    expect(next.month).toBe(1);
  });

  test("年始を跨ぐと年が戻る", () => {
    const state = createCalendarState({ today: new Date(2026, 0, 15) });
    const prev = navigateMonth(state, "prev");
    expect(prev.year).toBe(2025);
    expect(prev.month).toBe(12);
  });

  test("移動後もロケールと選択状態が保持される", () => {
    const state = createCalendarState({ today: TODAY, locale: "ja" });
    const selected = selectDate(state);
    const next = navigateMonth(selected, "next");
    expect(next.monthData.title).toBe("10月 2026");
    expect(next.selectedDate).toEqual(TODAY);
  });

  test("移動後もカーソルは新月の範囲にクランプされる", () => {
    // 2026-03 は5行 → 2026-02 は4行。5行目のカーソルが月移動で4行にクランプされる
    const state = createCalendarState({
      today: TODAY,
      initialYear: 2026,
      initialMonth: 3,
      initialCursor: { row: 4, col: 6 },
    });
    const prev = navigateMonth(state, "prev");
    expect(prev.monthData.title).toBe("February 2026");
    expect(prev.cursor).toEqual({ row: 3, col: 6 });
  });
});

describe("navigateYear", () => {
  test("翌年へ移動する", () => {
    const state = createCalendarState({ today: TODAY });
    const next = navigateYear(state, "next");
    expect(next.year).toBe(2027);
    expect(next.month).toBe(9);
  });

  test("前年へ移動する", () => {
    const state = createCalendarState({ today: TODAY });
    const prev = navigateYear(state, "prev");
    expect(prev.year).toBe(2025);
    expect(prev.month).toBe(9);
  });
});

describe("goToMonth / goToToday", () => {
  test("指定した年月へジャンプする", () => {
    const state = createCalendarState({ today: TODAY });
    const jumped = goToMonth(state, 2024, 2);
    expect(jumped.year).toBe(2024);
    expect(jumped.month).toBe(2);
    expect(jumped.monthData.title).toBe("February 2024");
  });

  test("month が範囲外でも正規化される (13 → 翌年1月)", () => {
    const state = createCalendarState({ today: TODAY });
    const jumped = goToMonth(state, 2026, 13);
    expect(jumped.year).toBe(2027);
    expect(jumped.month).toBe(1);
  });

  test("今日の月へジャンプしカーソルを今日に置く", () => {
    const state = createCalendarState({
      today: TODAY,
      initialYear: 2020,
      initialMonth: 1,
    });
    const now = goToToday(state);
    expect(now.year).toBe(2026);
    expect(now.month).toBe(9);
    expect(getCursorDate(now)).toEqual(TODAY);
  });

  test("指定日付の月へジャンプしカーソルをその日付に置く", () => {
    const state = createCalendarState({ today: TODAY });
    const target = new Date(2024, 1, 14);
    const jumped = goToDate(state, target);
    expect(jumped.year).toBe(2024);
    expect(jumped.month).toBe(2);
    expect(jumped.monthData.title).toBe("February 2024");
    expect(getCursorDate(jumped)).toEqual(target);
  });

  test("年跨ぎの日付にもジャンプできる", () => {
    const state = createCalendarState({ today: TODAY });
    const jumped = goToDate(state, new Date(2027, 0, 5));
    expect(jumped.year).toBe(2027);
    expect(jumped.month).toBe(1);
    expect(getCursorDate(jumped)).toEqual(new Date(2027, 0, 5));
  });

  test("ジャンプ後もロケールと選択状態が保持される", () => {
    const state = createCalendarState({ today: TODAY, locale: "ja" });
    const selected = selectDate(state);
    const jumped = goToDate(selected, new Date(2026, 8, 20));
    expect(jumped.monthData.title).toBe("9月 2026");
    expect(jumped.selectedDate).toEqual(TODAY);
  });
});
