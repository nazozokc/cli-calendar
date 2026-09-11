import type { RenderMonthOptions } from "@typescript-calendar/core";
import { getMonthName, getWeekdayHeaders, buildMonthGrid, isDateInRange, isSameDay } from "@typescript-calendar/core";

const CELL_WIDTH = 3;

/**
 * 1ヶ月分のカレンダーテキストを描画する
 */
export function renderMonth(
  year: number,
  month: number,
  options: RenderMonthOptions = {},
): string {
  const {
    locale = "en",
    weekStart = "sunday",
    highlight,
    highlightStyle = "bracket",
    range,
    color = false,
  } = options;

  const monthName = getMonthName(locale, month);
  const title = `${monthName} ${year}`;
  const weekdays = getWeekdayHeaders(locale, weekStart);
  const grid = buildMonthGrid(year, month, weekStart);

  const lines: string[] = [];

  lines.push(centerTitle(title, weekdays));

  lines.push(
    weekdays.map((d) => d.padStart(CELL_WIDTH)).join(" "),
  );

  for (const row of grid) {
    if (row.every((d) => d === null)) continue;

    const cells = row.map((day) => {
      if (day === null) {
        return "".padStart(CELL_WIDTH);
      }

      const date = new Date(year, month - 1, day);
      const isHighlight =
        highlight !== undefined && isSameDay(date, highlight);
      const isInRange = isDateInRange(date, range);

      let text: string;

      if (isHighlight && highlightStyle === "bracket") {
        text = `[${day}]`;
        text = text.padStart(CELL_WIDTH);
      } else {
        text = String(day).padStart(CELL_WIDTH);
      }

      if (color) {
        if (isHighlight && highlightStyle === "reverse") {
          text = `\u001b[7m${text}\u001b[0m`;
        } else if (isInRange && !isHighlight) {
          text = `\u001b[33m${text}\u001b[0m`;
        }
      }

      return text;
    });

    lines.push(cells.join(" "));
  }

  return lines.join("\n");
}

/**
 * 年間カレンダーを4列×3行でテキストで返す
 */
export function renderYear(
  year: number,
  options: RenderMonthOptions = {},
): string {
  const months: string[] = [];
  for (let m = 1; m <= 12; m++) {
    months.push(renderMonth(year, m, options));
  }

  const monthLines = months.map((m) => m.split("\n"));
  const maxLines = Math.max(...monthLines.map((l) => l.length));

  const colWidths = monthLines.map((lines) =>
    Math.max(...lines.map((l) => l.length)),
  );

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

    if (row < 2) {
      result.push("");
    }
  }

  return result.join("\n");
}

/**
 * タイトルを曜日ヘッダー幅の中央に揃える
 */
function centerTitle(title: string, weekdays: readonly string[]): string {
  const totalWidth =
    weekdays.length * CELL_WIDTH + (weekdays.length - 1);
  const padding = Math.max(0, Math.floor((totalWidth - title.length) / 2));
  return " ".repeat(padding) + title;
}
