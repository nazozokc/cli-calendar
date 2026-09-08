import type {
  CalendarOptions,
  CalendarRangeOptions,
  CalendarYearOptions,
} from "./types.ts";
import { renderMonth } from "./render.ts";
import { getMonthRange } from "./utils.ts";

/**
 * 月カレンダーをテキストで返す
 */
export function calendar(options: CalendarOptions): string {
  const {
    year,
    month,
    locale = "en",
    weekStart = "sunday",
    highlight,
    highlightStyle = "bracket",
    range,
    color = false,
  } = options;

  return renderMonth(year, month, {
    locale,
    weekStart,
    highlight,
    highlightStyle,
    range,
    color,
  });
}

/**
 * 年間カレンダーを4列×3行でテキストで返す
 */
export function calendarYear(options: CalendarYearOptions): string {
  const {
    year,
    locale = "en",
    weekStart = "sunday",
    highlight,
    highlightStyle = "bracket",
    range,
    color = false,
  } = options;

  const renderOpts = {
    locale,
    weekStart,
    highlight,
    highlightStyle,
    range,
    color,
  };

  // 各月をレンダリング
  const months: string[] = [];
  for (let m = 1; m <= 12; m++) {
    months.push(renderMonth(year, m, renderOpts));
  }

  // 各月の行に分割
  const monthLines = months.map((m) => m.split("\n"));
  const maxLines = Math.max(...monthLines.map((l) => l.length));

  // 最大幅を計算（各月の最大行幅）
  const colWidths = monthLines.map((lines) =>
    Math.max(...lines.map((l) => l.length)),
  );

  // 4列×3行に配置
  const result: string[] = [];
  for (let row = 0; row < 3; row++) {
    const rowLines: string[] = [];
    for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
      const parts: string[] = [];
      for (let col = 0; col < 4; col++) {
        const monthIdx = row * 4 + col;
        if (monthIdx >= 12) {
          parts.push("");
          continue;
        }
        const lines = monthLines[monthIdx]!;
        const line = lines[lineIdx] ?? "";
        parts.push(line.padEnd(colWidths[monthIdx]!));
      }
      rowLines.push(parts.join("    "));
    }
    result.push(rowLines.join("\n"));

    // 月の行間は空行を入れる
    if (row < 2) {
      result.push("");
    }
  }

  return result.join("\n");
}

/**
 * 任意の日付範囲のカレンダーをテキストで返す
 */
export function calendarRange(options: CalendarRangeOptions): string {
  const {
    from,
    to,
    locale = "en",
    weekStart = "sunday",
    highlight,
    highlightStyle = "bracket",
    range,
    color = false,
  } = options;

  const months = getMonthRange(from, to);

  const renderOpts = {
    locale,
    weekStart,
    highlight,
    highlightStyle,
    range,
    color,
  };

  return months
    .map(({ year, month }) => renderMonth(year, month, renderOpts))
    .join("\n\n");
}
