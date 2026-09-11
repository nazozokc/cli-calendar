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
 * タイトルを曜日ヘッダー幅の中央に揃える
 */
function centerTitle(title: string, weekdays: readonly string[]): string {
  const totalWidth =
    weekdays.length * CELL_WIDTH + (weekdays.length - 1);
  const padding = Math.max(0, Math.floor((totalWidth - title.length) / 2));
  return " ".repeat(padding) + title;
}
