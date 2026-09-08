import { test, expect, describe } from "bun:test";
import { getMonthName, getWeekdayHeaders, LOCALES } from "./locale.ts";

describe("LOCALES", () => {
  test("12ヶ月分の月名を持つ", () => {
    expect(LOCALES.en.months).toHaveLength(12);
    expect(LOCALES.ja.months).toHaveLength(12);
  });

  test("7曜日のヘッダを持つ", () => {
    expect(LOCALES.en.weekdays).toHaveLength(7);
    expect(LOCALES.ja.weekdays).toHaveLength(7);
  });
});

describe("getWeekdayHeaders", () => {
  test("英語・日曜始まりはSunから", () => {
    expect(getWeekdayHeaders("en", "sunday")).toEqual([
      "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
    ]);
  });

  test("英語・月曜始まりはMonから", () => {
    expect(getWeekdayHeaders("en", "monday")).toEqual([
      "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
    ]);
  });

  test("日本語・日曜始まりは日から", () => {
    expect(getWeekdayHeaders("ja", "sunday")).toEqual([
      "日", "月", "火", "水", "木", "金", "土",
    ]);
  });

  test("日本語・月曜始まりは月から", () => {
    expect(getWeekdayHeaders("ja", "monday")).toEqual([
      "月", "火", "水", "木", "金", "土", "日",
    ]);
  });
});

describe("getMonthName", () => {
  test("英語の月名", () => {
    expect(getMonthName("en", 1)).toBe("January");
    expect(getMonthName("en", 9)).toBe("September");
    expect(getMonthName("en", 12)).toBe("December");
  });

  test("日本語の月名", () => {
    expect(getMonthName("ja", 1)).toBe("1月");
    expect(getMonthName("ja", 12)).toBe("12月");
  });
});
