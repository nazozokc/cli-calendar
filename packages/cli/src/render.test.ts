import { describe, expect, test } from "vitest";
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
    const lines = renderMonth(2026, 9).split("\n");
    expect(lines[2]).toBe("          1   2   3   4   5");
  });

  test("最後の行は空欄セルを含む", () => {
    const lines = renderMonth(2026, 9).split("\n");
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
    expect(lines[3]).toContain("[8]");
  });

  test("reverseスタイルとcolor:trueで反転色を使う", () => {
    const out = renderMonth(2026, 9, {
      highlight: new Date(2026, 8, 8),
      highlightStyle: "reverse",
      color: true,
    });
    expect(out).toContain("\u001b[7m  8\u001b[0m");
    expect(out).not.toContain("[8]");
  });

  test("color:falseではANSIエスケープを含まない", () => {
    const out = renderMonth(2026, 9, {
      highlight: new Date(2026, 8, 8),
      color: true,
    });
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
    expect(out).not.toContain("\u001b[33m 16\u001b[0m");
  });

  test("範囲とハイライトが重なる場合、ハイライトが優先される", () => {
    const out = renderMonth(2026, 9, {
      highlight: new Date(2026, 8, 8),
      highlightStyle: "reverse",
      range: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 15) },
      color: true,
    });
    expect(out).toContain("\u001b[7m  8\u001b[0m");
  });
});

describe("renderMonth - themes", () => {
  const base = { today: new Date(2026, 8, 1) };

  test("modernテーマは枠線と縦区切りを使う", () => {
    const out = renderMonth(2026, 9, { theme: "modern", ...base });
    const lines = out.split("\n");
    expect(lines[0]).toBe("┌───────────────────────────┐");
    expect(lines[1]).toBe("│      September 2026       │");
    expect(lines[2]).toBe("├───┬───┬───┬───┬───┬───┬───┤");
    expect(lines[3]).toBe("│Sun│Mon│Tue│Wed│Thu│Fri│Sat│");
    expect(lines[lines.length - 1]).toBe("└───┴───┴───┴───┴───┴───┴───┘");
  });

  test("modernテーマでも日付とハイライトは描画される", () => {
    const out = renderMonth(2026, 9, {
      theme: "modern",
      highlight: new Date(2026, 8, 8),
      ...base,
    });
    expect(out).toContain("│[8]│");
    expect(out).toContain("│ 30│");
  });

  test("modernテーマとカラースキームで枠と曜日が着色される", () => {
    const out = renderMonth(2026, 9, {
      theme: "modern",
      colorScheme: "ocean",
      color: true,
      ...base,
    });
    expect(out).toContain("\u001b[36m┌───────────────────────────┐\u001b[0m");
    expect(out).toContain("\u001b[36m│Sun│Mon│Tue│Wed│Thu│Fri│Sat│\u001b[0m");
  });

  test("カスタムテーマオブジェクトを受け付ける", () => {
    const out = renderMonth(2026, 9, {
      theme: {
        cellWidth: 3,
        separator: "|",
        frame: null,
      },
      ...base,
    });
    expect(out).toContain("Sun|Mon|Tue|Wed|Thu|Fri|Sat");
  });

  test("不明なテーマ名はdefaultにフォールバックする", () => {
    // @ts-expect-error 不明なテーマ名
    const out = renderMonth(2026, 9, { theme: "unknown", ...base });
    expect(out.split("\n")[0]).toBe("      September 2026");
  });
});

describe("renderMonth - color schemes", () => {
  const base = { today: new Date(2026, 8, 1), color: true };

  test("defaultスキームは従来どおりの着色のみ", () => {
    const out = renderMonth(2026, 9, {
      range: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 5) },
      ...base,
    });
    expect(out).toContain("\u001b[33m  1\u001b[0m");
    // 曜日ヘッダーや通常の日付には着色しない
    expect(out).not.toContain("\u001b[36m");
  });

  test("oceanスキームは曜日・今日・土日を着色する", () => {
    const out = renderMonth(2026, 9, {
      colorScheme: "ocean",
      ...base,
      today: new Date(2026, 8, 11),
    });
    // 曜日ヘッダー
    expect(out).toContain("\u001b[36mSun\u001b[0m");
    // 今日
    expect(out).toContain("\u001b[36m 11\u001b[0m");
    // 土日（9/5 は土曜、9/6 は日曜）
    expect(out).toContain("\u001b[34m  5\u001b[0m");
    expect(out).toContain("\u001b[34m  6\u001b[0m");
  });

  test("カスタムパレットを受け付ける", () => {
    const out = renderMonth(2026, 9, {
      colorScheme: { range: 95 },
      range: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 5) },
      ...base,
    });
    expect(out).toContain("\u001b[95m  1\u001b[0m");
  });

  test("不明なカラースキーム名はdefaultにフォールバックする", () => {
    // @ts-expect-error 不明なカラースキーム名
    const out = renderMonth(2026, 9, { colorScheme: "unknown", ...base });
    expect(out.split("\n")[1]).toBe("Sun Mon Tue Wed Thu Fri Sat");
  });
});
