import type { Locale, WeekStart } from "./types.ts";
import { assertValidMonth, assertValidWeekStart } from "./validation.ts";

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
  es: {
    months: [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ],
    weekdays: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    weekdaysShort: ["do", "lu", "ma", "mi", "ju", "vi", "sá"],
    weekdaysMonday: ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"],
    weekdaysMondayShort: ["lu", "ma", "mi", "ju", "vi", "sá", "do"],
  },
  de: {
    months: [
      "Januar",
      "Februar",
      "März",
      "April",
      "Mai",
      "Juni",
      "Juli",
      "August",
      "September",
      "Oktober",
      "November",
      "Dezember",
    ],
    weekdays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    weekdaysShort: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
    weekdaysMonday: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    weekdaysMondayShort: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  },
  fr: {
    months: [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ],
    weekdays: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
    weekdaysShort: ["di", "lu", "ma", "me", "je", "ve", "sa"],
    weekdaysMonday: ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."],
    weekdaysMondayShort: ["lu", "ma", "me", "je", "ve", "sa", "di"],
  },
  ko: {
    months: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"],
    weekdaysMonday: ["월", "화", "수", "목", "금", "토", "일"],
    weekdaysMondayShort: ["월", "화", "수", "목", "금", "토", "일"],
  },
  zh: {
    months: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    weekdaysShort: ["日", "一", "二", "三", "四", "五", "六"],
    weekdaysMonday: ["一", "二", "三", "四", "五", "六", "日"],
    weekdaysMondayShort: ["一", "二", "三", "四", "五", "六", "日"],
  },
};

/** ロケールデータを取得する（未知のロケールは RangeError） */
function getLocaleData(locale: Locale): LocaleData {
  const data = LOCALES[locale];
  if (data === undefined) {
    throw new RangeError(`Invalid locale: "${locale}"`);
  }
  return data;
}

export function getWeekdayHeaders(
  locale: Locale,
  weekStart: WeekStart,
): readonly string[] {
  assertValidWeekStart(weekStart);
  const data = getLocaleData(locale);
  return weekStart === "monday" ? data.weekdaysMonday : data.weekdays;
}

export function getMonthName(locale: Locale, month: number): string {
  assertValidMonth(month);
  const data = getLocaleData(locale);
  return data.months[month - 1]!;
}
