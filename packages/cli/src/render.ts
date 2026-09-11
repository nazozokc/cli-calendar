import { getMonthName, getWeekdayHeaders, buildMonthGrid, isDateInRange, isSameDay } from "@typescript-calendar/core";
import type { RenderMonthOptions } from "./types.ts";
import { resolveTheme, resolveColorScheme } from "./theme.ts";
import type { CliPalette, FrameChars } from "./theme.ts";

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
      weekdays.length * theme.cellWidth +
      (weekdays.length - 1) * sep.length;

    lines.push(centerText(title, totalWidth));

    lines.push(
      weekdays
        .map((d) => colorize(d.padStart(theme.cellWidth), palette.weekday, color))
        .join(sep),
    );

    for (const row of grid) {
      if (row.every((d) => d === null)) continue;

      const cells = row.map((day) =>
        renderCell(year, month, day, highlight, highlightStyle, range, today, color, palette),
      );

      lines.push(cells.join(sep));
    }
  } else {
    // ── 枠あり（modern） ──
    const frame = theme.frame;

    lines.push(
      colorize(topBorder(frame, theme.cellWidth, weekdays.length), palette.frame, color),
    );
    lines.push(
      colorize(
        `${frame.v}${centerTextFull(title, innerWidth(theme.cellWidth, weekdays.length))}${frame.v}`,
        palette.title,
        color,
      ),
    );
    lines.push(
      colorize(separatorRow(frame, theme.cellWidth, weekdays.length), palette.frame, color),
    );
    lines.push(
      colorize(
        `${frame.v}${weekdays.map((d) => d.padStart(theme.cellWidth)).join(frame.v)}${frame.v}`,
        palette.weekday,
        color,
      ),
    );
    lines.push(
      colorize(separatorRow(frame, theme.cellWidth, weekdays.length), palette.frame, color),
    );

    for (const row of grid) {
      if (row.every((d) => d === null)) continue;

      const cells = row.map((day) =>
        renderCell(year, month, day, highlight, highlightStyle, range, today, color, palette),
      );

      lines.push(`${frame.v}${cells.join(frame.v)}${frame.v}`);
    }

    lines.push(
      colorize(bottomBorder(frame, theme.cellWidth, weekdays.length), palette.frame, color),
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

/** ANSI コードを付与する（code が undefined ならそのまま） */
function colorize(text: string, code: number | undefined, enabled: boolean): string {
  if (!enabled || code === undefined) return text;
  return `\u001b[${code}m${text}\u001b[0m`;
}

// ─── 枠線 ─────────────────────────────────────────────────

/** 枠内のコンテンツ幅（例: 7列×3幅+区切り6 = 27） */
function innerWidth(cellWidth: number, cols: number): number {
  return cols * cellWidth + (cols - 1);
}

/** 上枠: ┌────┬────...────┐ */
function topBorder(frame: FrameChars, cellWidth: number, cols: number): string {
  return `${frame.topLeft}${frame.h.repeat(innerWidth(cellWidth, cols))}${frame.topRight}`;
}

/** 下枠: └────┴────...────┘ */
function bottomBorder(frame: FrameChars, cellWidth: number, cols: number): string {
  const segments = Array<string>(cols).fill(frame.h.repeat(cellWidth));
  return `${frame.bottomLeft}${segments.join(frame.footJ)}${frame.bottomRight}`;
}

/** 区切り行: ├────┬────...┬────┤ */
function separatorRow(frame: FrameChars, cellWidth: number, cols: number): string {
  const segments = Array<string>(cols).fill(frame.h.repeat(cellWidth));
  return `├${segments.join(frame.j)}┤`;
}

// ─── その他 ───────────────────────────────────────────────

/** タイトルを幅の中央に揃える */
function centerText(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(padding) + text;
}

/** タイトルを中央に揃え、幅一杯まで埋める（枠内用） */
function centerTextFull(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(padding) + text.padEnd(width - padding);
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