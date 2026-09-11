import { test, expect, describe } from "vitest";
import {
  createCalendarState,
  goToMonth,
  goToToday,
  moveCursor,
  navigateMonth,
  navigateYear,
  selectDate,
  getCursorDate,
} from "./state.ts";

const TODAY = new Date(2026, 8, 15); // 2026-09-15

describe("createCalendarState", () => {
  test("デフォルトで today の年月を表示する", () => {
    const state = createCalendarState({ today: TODAY });
    expect(state.year).toBe(2026);
    expect(state.month).toBe(9);
  });

  test("カーソルは今日のセルに置かれる", () => {
    const state = createCalendarState({ today: TODAY });
    expect(getCursorDate(state)).toEqual(TODAY);
  });

  test("initialYear / initialMonth を指定できる", () => {
    const state = createCalendarState({
      today: TODAY,
      initialYear: 2030,
      initialMonth: 3,
    });
    expect(state.year).toBe(2030);
    expect(state.month).toBe(3);
    expect(state.monthData.title).toBe("March 2030");
  });

  test("initialCursor を指定できる", () => {
    const state = createCalendarState({
      today: TODAY,
      initialCursor: { row: 2, col: 3 },
    });
    expect(state.cursor).toEqual({ row: 2, col: 3 });
  });

  test("selectedDate は初期状態で null", () => {
    const state = createCalendarState({ today: TODAY });
    expect(state.selectedDate).toBeNull();
  });

  test("ロケールを指定すると月データに反映される", () => {
    const state = createCalendarState({ today: TODAY, locale: "ja" });
    expect(state.monthData.title).toBe("9月 2026");
  });
});

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
});

describe("moveCursor", () => {
  test("右に移動する", () => {
    const state = createCalendarState({ today: TODAY });
    const moved = moveCursor(state, "right");
    expect(moved.cursor).toEqual({ row: state.cursor!.row, col: state.cursor!.col + 1 });
  });

  test("左端から左に移動すると右端に折り返す", () => {
    const state = createCalendarState({
      today: TODAY,
      initialCursor: { row: 2, col: 0 },
    });
    const moved = moveCursor(state, "left");
    expect(moved.cursor).toEqual({ row: 2, col: 6 });
  });

  test("右端から右に移動すると左端に折り返す", () => {
    const state = createCalendarState({
      today: TODAY,
      initialCursor: { row: 2, col: 6 },
    });
    const moved = moveCursor(state, "right");
    expect(moved.cursor).toEqual({ row: 2, col: 0 });
  });

  test("上端から上に移動すると最終行に折り返す", () => {
    const state = createCalendarState({
      today: TODAY,
      initialCursor: { row: 0, col: 2 },
    });
    const moved = moveCursor(state, "up");
    expect(moved.cursor).toEqual({ row: state.monthData.visibleRows - 1, col: 2 });
  });

  test("下端から下に移動すると先頭行に折り返す", () => {
    const state = createCalendarState({
      today: TODAY,
      initialCursor: { row: 4, col: 2 },
    });
    const moved = moveCursor(state, "down");
    expect(moved.cursor).toEqual({ row: 0, col: 2 });
  });

  test("カーソル未設定時は今日のセルにスナップする", () => {
    const state = createCalendarState({
      today: TODAY,
      initialCursor: null,
    });
    const moved = moveCursor(state, "down");
    expect(moved.cursor).not.toBeNull();
  });
});

describe("selectDate / getCursorDate", () => {
  test("カーソル位置の日付を選択する", () => {
    const state = createCalendarState({ today: TODAY });
    const selected = selectDate(state);
    expect(selected.selectedDate).toEqual(TODAY);
  });

  test("選択後もカーソルは動かせる", () => {
    const state = createCalendarState({
      today: TODAY,
      initialCursor: { row: 2, col: 2 },
    });
    const selected = selectDate(state);
    const moved = moveCursor(selected, "right");
    expect(moved.selectedDate).toEqual(getCursorDate(selected));
    expect(moved.cursor).not.toEqual(selected.cursor);
  });

  test("空欄セル上では選択されない", () => {
    // 2026-09: 行4 col4 は空欄（月末後）
    const state = createCalendarState({
      today: TODAY,
      initialCursor: { row: 4, col: 4 },
    });
    const selected = selectDate(state);
    expect(selected.selectedDate).toBeNull();
  });

  test("カーソルが空欄セルなら getCursorDate は null", () => {
    const state = createCalendarState({
      today: TODAY,
      initialCursor: { row: 4, col: 4 },
    });
    expect(getCursorDate(state)).toBeNull();
  });
});