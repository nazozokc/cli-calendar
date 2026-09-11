import { test, expect, describe } from "bun:test";
import { calendar, calendarRange, calendarYear } from "./calendar.ts";

describe("calendar", () => {
  test("月タイトルを含む", () => {
    const out = calendar({ year: 2026, month: 9 });
    expect(out).toContain("September 2026");
  });

  test("日付グリッドを含む", () => {
    const out = calendar({ year: 2026, month: 9 });
    expect(out).toContain(" 1");
    expect(out).toContain("30");
  });

  test("指定月以外の日付を含まない", () => {
    const out = calendar({ year: 2026, month: 2 });
    expect(out).not.toContain("March 2026");
  });

  test("ハイライトを反映する", () => {
    const out = calendar({
      year: 2026,
      month: 9,
      highlight: new Date(2026, 8, 8),
    });
    expect(out).toContain("[8]");
  });

  test("パラメータを渡し忘れた場合でもデフォルト動作する", () => {
    const out = calendar({ year: 2026, month: 9 });
    expect(out).toContain("Sun Mon Tue Wed Thu Fri Sat");
  });
});

describe("calendarYear", () => {
  test("12ヶ月全てのタイトルを含む", () => {
    const out = calendarYear({ year: 2026 });
    for (const m of [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December",
    ]) {
      expect(out).toContain(`${m} 2026`);
    }
  });

  test("4列×3行構成である", () => {
    const out = calendarYear({ year: 2026 });
    const firstLine = out.split("\n")[0]!;
    expect(firstLine).toContain("January 2026");
    expect(firstLine).toContain("February 2026");
    expect(firstLine).toContain("March 2026");
    expect(firstLine).toContain("April 2026");
  });

  test("日本語ロケールを反映する", () => {
    const out = calendarYear({ year: 2026, locale: "ja" });
    expect(out).toContain("1月 2026");
    expect(out).toContain("12月 2026");
  });
});

describe("calendarRange", () => {
  test("範囲の年月のみを含む", () => {
    const out = calendarRange({
      from: new Date(2026, 5, 1),
      to: new Date(2026, 8, 30),
    });
    expect(out).toContain("June 2026");
    expect(out).toContain("September 2026");
    expect(out).not.toContain("May 2026");
    expect(out).not.toContain("October 2026");
  });

  test("同月範囲は1ヶ月分", () => {
    const out = calendarRange({
      from: new Date(2026, 8, 1),
      to: new Date(2026, 8, 30),
    });
    const count = out.split("\n").filter((l) => l.includes("September 2026")).length;
    expect(count).toBe(1);
  });

  test("ハイライトを反映する", () => {
    const out = calendarRange({
      from: new Date(2026, 8, 1),
      to: new Date(2026, 8, 30),
      highlight: new Date(2026, 8, 8),
    });
    expect(out).toContain("[8]");
  });
});
