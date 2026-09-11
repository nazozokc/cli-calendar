import { test, expect, describe } from "vitest";
import { createCalendarState } from "./state.ts";
import { moveCursor, selectDate, getCursorDate } from "./cursor.ts";

const TODAY = new Date(2026, 8, 15); // 2026-09-15

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