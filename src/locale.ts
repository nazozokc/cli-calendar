import type { Locale, WeekStart } from "./types.ts";

export interface LocaleData {
  months: readonly string[];
  weekdays: readonly string[];
  weekdaysShort: readonly string[];
  weekdaysMonday: readonly string[];
  weekdaysMondayShort: readonly string[];
}

export const LOCALES: Record<Locale, LocaleData> = {
  en: {
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekdaysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    weekdaysMonday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekdaysMondayShort: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  },
  ja: {
    months: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    weekdaysShort: ["日", "月", "火", "水", "木", "金", "土"],
    weekdaysMonday: ["月", "火", "水", "木", "金", "土", "日"],
    weekdaysMondayShort: ["月", "火", "水", "木", "金", "土", "日"],
  },
};

export function getWeekdayHeaders(
  locale: Locale,
  weekStart: WeekStart,
): readonly string[] {
  const data = LOCALES[locale];
  return weekStart === "monday" ? data.weekdaysMonday : data.weekdays;
}

export function getMonthName(locale: Locale, month: number): string {
  return LOCALES[locale].months[month - 1]!;
}
