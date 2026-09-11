import { describe, expect, test } from "vitest";
import { getCursorDate } from "./cursor.ts";
import { createCalendarState } from "./state.ts";

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
