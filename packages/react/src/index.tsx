import type { CalendarOptions } from "@typescript-calendar-lib/core";
import {
  buildMonthGrid,
  createDate,
  getMonthName,
  getWeekdayHeaders,
} from "@typescript-calendar-lib/core";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { getCellClasses } from "./cell-classes.ts";
import type { CalendarSize } from "./size.ts";
import { buildSizeStyle, isSizeName } from "./size.ts";
import type {
  ColorSchemeName,
  ReactColorScheme,
  ReactTheme,
  ThemeName,
} from "./themes.ts";
import { resolveColorScheme, resolveTheme } from "./themes.ts";
import "./calendar.css";

export type {
  CalendarCustomSize,
  CalendarSize,
  CalendarSizeName,
} from "./size.ts";

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
  // 年月・ロケール・テーマは変更時のみ再計算する
  const monthName = useMemo(() => getMonthName(locale, month), [locale, month]);
  const weekdays = useMemo(
    () => getWeekdayHeaders(locale, weekStart),
    [locale, weekStart],
  );
  const grid = useMemo(
    () => buildMonthGrid(year, month, weekStart),
    [year, month, weekStart],
  );
  const resolvedTheme = useMemo(() => resolveTheme(theme), [theme]);
  const cssVars = useMemo(
    () => resolveColorScheme(colorScheme) as CSSProperties,
    [colorScheme],
  );

  const className = (day: number): string =>
    getCellClasses(createDate(year, month - 1, day), {
      today,
      highlight,
      range,
    });

  const sizeClass = isSizeName(size) ? ` calendar-size-${size}` : "";

  const handleCellClick = (day: number) => {
    if (!interactive || !onDateClick) return;
    onDateClick(createDate(year, month - 1, day));
  };

  const handleCellHover = (day: number) => {
    if (!interactive || !onDateHover) return;
    onDateHover(createDate(year, month - 1, day));
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
                  const cellClass = className(day) || undefined;
                  if (!interactive) {
                    return (
                      <td key={day} className={cellClass}>
                        {day}
                      </td>
                    );
                  }
                  return (
                    <td key={day} className={cellClass}>
                      <button
                        type="button"
                        className="calendar-day-btn"
                        onClick={() => handleCellClick(day)}
                        onMouseEnter={() => handleCellHover(day)}
                        tabIndex={0}
                        aria-label={`${monthName} ${day}, ${year}`}
                      >
                        {day}
                      </button>
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
