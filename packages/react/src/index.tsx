import type { CalendarOptions } from "@typescript-calendar/core";
import { buildMonthGrid, getMonthName, getWeekdayHeaders, isDateInRange, isSameDay } from "@typescript-calendar/core";
import type { CSSProperties } from "react";
import type { ColorSchemeName, ReactColorScheme, ThemeName, ReactTheme } from "./themes.ts";
import { resolveTheme, resolveColorScheme } from "./themes.ts";
import "./calendar.css";

interface CalendarProps {
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
    if (highlight !== undefined && isSameDay(date, highlight)) classes.push("is-highlight");
    if (range !== undefined && isDateInRange(date, range)) classes.push("is-in-range");
    return classes.join(" ");
  };

  return (
    <div className={`calendar ${resolvedTheme.className}`} style={cssVars}>
      <div className="calendar-header">
        <h2>{monthName} {year}</h2>
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
              <tr key={i}>
                {row.map((day, j) => {
                  if (day === null) return <td key={j} />;
                  return (
                    <td
                      key={j}
                      className={className(day) || undefined}
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
  ThemeName,
  ReactTheme,
  ColorSchemeName,
  ReactColorScheme,
} from "./themes.ts";

export {
  THEMES,
  COLOR_SCHEMES,
  resolveTheme,
  resolveColorScheme,
} from "./themes.ts";