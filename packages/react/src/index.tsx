import type { CalendarOptions } from "@cli-calendar/core";
import { buildMonthGrid, getMonthName, getWeekdayHeaders } from "@cli-calendar/core";

interface CalendarProps {
  year: number;
  month: number;
  locale?: CalendarOptions["locale"];
  weekStart?: CalendarOptions["weekStart"];
  highlight?: Date;
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
}: CalendarProps) {
  const monthName = getMonthName(locale, month);
  const weekdays = getWeekdayHeaders(locale, weekStart);
  const grid = buildMonthGrid(year, month, weekStart);

  return (
    <div className="calendar">
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
                  const isHighlight =
                    highlight !== undefined &&
                    highlight.getFullYear() === year &&
                    highlight.getMonth() === month - 1 &&
                    highlight.getDate() === day;
                  return (
                    <td
                      key={j}
                      className={isHighlight ? "highlight" : undefined}
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
