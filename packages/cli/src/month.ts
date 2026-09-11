import {
  buildMonthGrid,
  getMonthName,
  getWeekdayHeaders,
  isDateInRange,
  isSameDay,
} from "@typescript-calendar/core";
import { centerText, centerTextFull } from "./align.ts";
import { colorize } from "./ansi.ts";
import { bottomBorder, innerWidth, separatorRow, topBorder } from "./border.ts";
import type { CliPalette } from "./theme.ts";
import { resolveColorScheme, resolveTheme } from "./theme.ts";
import type { RenderMonthOptions } from "./types.ts";

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
    theme: themeOption = "default",
    colorScheme: schemeOption = "default",
    today = new Date(),
  } = options;

  const theme = resolveTheme(themeOption);
  const palette = resolveColorScheme(schemeOption);

  const title = `${getMonthName(locale, month)} ${year}`;
  const weekdays = getWeekdayHeaders(locale, weekStart);
  const grid = buildMonthGrid(year, month, weekStart);

  const lines: string[] = [];

  if (theme.frame === null) {
    // ── 枠なし（default） ──
    const sep = theme.separator;
    const totalWidth =
      weekdays.length * theme.cellWidth + (weekdays.length - 1) * sep.length;

    lines.push(centerText(title, totalWidth));

    lines.push(
      weekdays
        .map((d) =>
          colorize(d.padStart(theme.cellWidth), palette.weekday, color),
        )
        .join(sep),
    );

    for (const row of grid) {
      if (row.every((d) => d === null)) continue;

      const cells = row.map((day) =>
        renderCell(
          year,
          month,
          day,
          highlight,
          highlightStyle,
          range,
          today,
          color,
          palette,
        ),
      );

      lines.push(cells.join(sep));
    }
  } else {
    // ── 枠あり（modern） ──
    const frame = theme.frame;

    lines.push(
      colorize(
        topBorder(frame, theme.cellWidth, weekdays.length),
        palette.frame,
        color,
      ),
    );
    lines.push(
      colorize(
        `${frame.v}${centerTextFull(title, innerWidth(theme.cellWidth, weekdays.length))}${frame.v}`,
        palette.title,
        color,
      ),
    );
    lines.push(
      colorize(
        separatorRow(frame, theme.cellWidth, weekdays.length),
        palette.frame,
        color,
      ),
    );
    lines.push(
      colorize(
        `${frame.v}${weekdays.map((d) => d.padStart(theme.cellWidth)).join(frame.v)}${frame.v}`,
        palette.weekday,
        color,
      ),
    );
    lines.push(
      colorize(
        separatorRow(frame, theme.cellWidth, weekdays.length),
        palette.frame,
        color,
      ),
    );

    for (const row of grid) {
      if (row.every((d) => d === null)) continue;

      const cells = row.map((day) =>
        renderCell(
          year,
          month,
          day,
          highlight,
          highlightStyle,
          range,
          today,
          color,
          palette,
        ),
      );

      lines.push(`${frame.v}${cells.join(frame.v)}${frame.v}`);
    }

    lines.push(
      colorize(
        bottomBorder(frame, theme.cellWidth, weekdays.length),
        palette.frame,
        color,
      ),
    );
  }

  return lines.join("\n");
}

// ─── セル ─────────────────────────────────────────────────

function renderCell(
  year: number,
  month: number,
  day: number | null,
  highlight: Date | undefined,
  highlightStyle: "bracket" | "reverse",
  range: { from: Date; to: Date } | undefined,
  today: Date,
  color: boolean,
  palette: CliPalette,
): string {
  if (day === null) {
    return " ".repeat(CELL_WIDTH);
  }

  const date = new Date(year, month - 1, day);
  const isHighlight = highlight !== undefined && isSameDay(date, highlight);
  const isInRange = isDateInRange(date, range);
  const isToday = isSameDay(date, today);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  let text: string;
  if (isHighlight && highlightStyle === "bracket") {
    text = `[${day}]`.padStart(CELL_WIDTH);
  } else {
    text = String(day).padStart(CELL_WIDTH);
  }

  let code: number | undefined;
  if (isHighlight && highlightStyle === "reverse") {
    code = palette.highlight ?? 7;
  } else if (isInRange && !isHighlight) {
    code = palette.range ?? 33;
  } else if (isToday && palette.today !== undefined) {
    code = palette.today;
  } else if (isWeekend && palette.weekend !== undefined) {
    code = palette.weekend;
  } else if (palette.day !== undefined) {
    code = palette.day;
  }

  return colorize(text, code, color);
}
