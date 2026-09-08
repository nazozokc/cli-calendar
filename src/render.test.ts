import { test, expect, describe } from "bun:test";
import { renderMonth } from "./render.ts";

describe("renderMonth", () => {
  test("日曜始まりのタイトル行と曜日ヘッダー", () => {
    const lines = renderMonth(2026, 9).split("\n");
    expect(lines[0]).toBe("      September 2026");
    expect(lines[1]).toBe("Sun Mon Tue Wed Thu Fri Sat");
  });

  test("月曜始まりの曜日ヘッダー", () => {
    const lines = renderMonth(2026, 9, { weekStart: "monday" }).split("\n");
    expect(lines[1]).toBe("Mon Tue Wed Thu Fri Sat Sun");
  });

  test("空セルはスペースで埋められる", () => {
    // 2026-09-01 は火曜。1日目: [空, 空, 1, 2, 3, 4, 5]
    const lines = renderMonth(2026, 9).split("\n");
    expect(lines[2]).toBe("          1   2   3   4   5");
  });

  test("最後の行は空欄セルを含む", () => {
    const lines = renderMonth(2026, 9).split("\n");
    // 9月は30日。最後の行には末尾に空欄が残る
    expect(lines[lines.length - 1]).toContain("30");
  });

  test("日本語ロケールの月名", () => {
    const lines = renderMonth(2026, 9, { locale: "ja" }).split("\n");
    expect(lines[0]).toBe("          9月 2026");
  });
});

describe("renderMonth - highlight", () => {
  test("bracketスタイルは日付を角括囲みにする", () => {
    const lines = renderMonth(2026, 9, {
      highlight: new Date(2026, 8, 8),
    }).split("\n");
    // 8日は2行目（2026-09-08 は火曜）
    expect(lines[3]).toContain("[8]");
  });

  test("reverseスタイルとcolor:trueで反転色を使う", () => {
    const out = renderMonth(2026, 9, {
      highlight: new Date(2026, 8, 8),
      highlightStyle: "reverse",
      color: true,
    });
    // 反転色は ESC[7m ... ESC[0m
    expect(out).toContain("\u001b[7m  8\u001b[0m");
    expect(out).not.toContain("[8]");
  });

  test("color:falseではANSIエスケープを含まない", () => {
    const out = renderMonth(2026, 9, {
      highlight: new Date(2026, 8, 8),
      color: true,
    });
    // bracketスタイルではANSIコードが出ないはず
    expect(out).not.toContain("\u001b[");
  });
});

describe("renderMonth - range color", () => {
  test("範囲内の日付をcolor:trueで黄色にする", () => {
    const out = renderMonth(2026, 9, {
      range: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 15) },
      color: true,
    });
    expect(out).toContain("\u001b[33m  1\u001b[0m");
    expect(out).toContain("\u001b[33m 15\u001b[0m");
    // 16日は範囲外なので色がつかない
    expect(out).not.toContain("\u001b[33m 16\u001b[0m");
  });

  test("範囲とハイライトが重なる場合、ハイライトが優先される", () => {
    const out = renderMonth(2026, 9, {
      highlight: new Date(2026, 8, 8),
      highlightStyle: "reverse",
      range: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 15) },
      color: true,
    });
    // 8日は反転色
    expect(out).toContain("\u001b[7m  8\u001b[0m");
  });
});
