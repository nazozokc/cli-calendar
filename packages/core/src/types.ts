export type Locale = "en" | "ja";
export type WeekStart = "sunday" | "monday";
export type HighlightStyle = "bracket" | "reverse";

export interface CalendarOptions {
  year: number;
  month: number;
  locale?: Locale;
  weekStart?: WeekStart;
  highlight?: Date;
  highlightStyle?: HighlightStyle;
  range?: { from: Date; to: Date };
  color?: boolean;
}

export interface CalendarYearOptions {
  year: number;
  locale?: Locale;
  weekStart?: WeekStart;
  highlight?: Date;
  highlightStyle?: HighlightStyle;
  range?: { from: Date; to: Date };
  color?: boolean;
}

export interface CalendarRangeOptions {
  from: Date;
  to: Date;
  locale?: Locale;
  weekStart?: WeekStart;
  highlight?: Date;
  highlightStyle?: HighlightStyle;
  range?: { from: Date; to: Date };
  color?: boolean;
}

export interface RenderMonthOptions {
  locale?: Locale;
  weekStart?: WeekStart;
  highlight?: Date;
  highlightStyle?: HighlightStyle;
  range?: { from: Date; to: Date };
  color?: boolean;
}
