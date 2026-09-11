import type { CalendarOptions } from "@typescript-calendar/core";
import {
  buildMonthGrid,
  getMonthName,
  getWeekdayHeaders,
  isDateInRange,
  isSameDay,
} from "@typescript-calendar/core";
import type { CSSProperties } from "react";
import type {
  ColorSchemeName,
  ReactColorScheme,
  ReactTheme,
  ThemeName,
} from "./themes.ts";
import { resolveColorScheme, resolveTheme } from "./themes.ts";
import "./calendar.css";

/** 組み込みサイズ名 */
export type CalendarSizeName = "sm" | "md" | "lg";

/** カスタムセルサイズ。数値は px、文字列は CSS 長さのまま渡す */
export interface CalendarCustomSize {
  width?: number | string;
  height?: number | string;
}

/** セルサイズ指定 */
export type CalendarSize = CalendarSizeName | CalendarCustomSize;

export interface CalendarProps {
  year: number;
  month: number;
  locale?: CalendarOptions["locale"];
  weekStart?: CalendarOptions["weekStart"];
  highlight?: Date;
  /** 範囲強調 */
  range?: { from: Date; to: Date };
  /** 今日の基準日。カラースキームの today 着色に使用 */
  today?: Date;
  /** 見た目テーマ。既定は "default" */
  theme?: ThemeName | ReactTheme;
  /** カラースキーム。既定は "default" */
  colorScheme?: ColorSchemeName | ReactColorScheme;
  /** セルサイズ。既定は "md"。{ width, height } で自由に指定できる */
  size?: CalendarSize;
  /** root 要素に追加するスタイル。CSS変数（--cal-*）で自由に上書きできる */
  style?: CSSProperties;

  // ── インタラクション ──

  /** インタラクティブモードを有効にする。セルクリック・ホバー・キーボード選択が可能になる */
  interactive?: boolean;
  /** セルクリック時のコールバック */
  onDateClick?: (date: Date) => void;
  /** セルホバー時のコールバック */
  onDateHover?: (date: Date) => void;
}

function isSizeName(size: CalendarSize): size is CalendarSizeName {
  return typeof size === "string";
}

function toCssLength(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function buildSizeStyle(size: CalendarSize): CSSProperties {
  if (isSizeName(size)) return {};
  const style: Record<string, string> = {};
  if (size.width !== undefined) style["--cal-cell-w"] = toCssLength(size.width);
  if (size.height !== undefined)
    style["--cal-cell-h"] = toCssLength(size.height);
  return style;
}

/**
 * Reactカレンダーコンポーネント
 */
export function Calendar({
  year,
  month,
  locale = "en",
  weekStart = "sunday",
  highlight,
  range,
  today,
  theme = "default",
  colorScheme = "default",
  size = "md",
  style,
  interactive = false,
  onDateClick,
  onDateHover,
}: CalendarProps) {
  const monthName = getMonthName(locale, month);
  const weekdays = getWeekdayHeaders(locale, weekStart);
  const grid = buildMonthGrid(year, month, weekStart);

  const resolvedTheme = resolveTheme(theme);
  const cssVars = resolveColorScheme(colorScheme) as CSSProperties;

  const className = (day: number): string => {
    const date = new Date(year, month - 1, day);
    const classes: string[] = [];
    if (date.getDay() === 0 || date.getDay() === 6) classes.push("is-weekend");
    if (today !== undefined && isSameDay(date, today)) classes.push("is-today");
    if (highlight !== undefined && isSameDay(date, highlight))
      classes.push("is-highlight");
    if (range !== undefined && isDateInRange(date, range))
      classes.push("is-in-range");
    return classes.join(" ");
  };

  const sizeClass = isSizeName(size) ? ` calendar-size-${size}` : "";

  const handleCellClick = (day: number) => {
    if (!interactive || !onDateClick) return;
    onDateClick(new Date(year, month - 1, day));
  };

  const handleCellHover = (day: number) => {
    if (!interactive || !onDateHover) return;
    onDateHover(new Date(year, month - 1, day));
  };

  return (
    <div
      className={`calendar ${resolvedTheme.className}${sizeClass}${interactive ? " calendar-interactive" : ""}`}
      style={{ ...cssVars, ...buildSizeStyle(size), ...style }}
    >
      <div className="calendar-header">
        <h2>
          {monthName} {year}
        </h2>
      </div>
      <table>
        <thead>
          <tr>
            {weekdays.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, i) => {
            if (row.every((d) => d === null)) return null;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: 月グリッドは静的で並び順が変わらない
              <tr key={i}>
                {row.map((day, j) => {
                  if (day === null)
                    // biome-ignore lint/suspicious/noArrayIndexKey: パディングセルは位置が唯一の識別子
                    return <td key={j} />;
                  return (
                    <td
                      key={day}
                      className={className(day) || undefined}
                      onClick={() => handleCellClick(day)}
                      onKeyDown={
                        interactive
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleCellClick(day);
                              }
                            }
                          : undefined
                      }
                      onMouseEnter={() => handleCellHover(day)}
                      role={interactive ? "button" : undefined}
                      tabIndex={interactive ? 0 : undefined}
                      aria-label={
                        interactive
                          ? `${getMonthName(locale, month)} ${day}, ${year}`
                          : undefined
                      }
                    >
                      {day}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;

export type {
  UseCalendarStateOptions,
  UseCalendarStateReturn,
} from "./hooks.ts";
export { useCalendarState } from "./hooks.ts";
export type {
  ColorSchemeName,
  ReactColorScheme,
  ReactTheme,
  ThemeName,
} from "./themes.ts";
export {
  COLOR_SCHEMES,
  resolveColorScheme,
  resolveTheme,
  THEMES,
} from "./themes.ts";
