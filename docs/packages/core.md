# @typescript-calendar/core

Shared, framework-agnostic calendar utilities: date math, locale data, and grid building. Zero runtime dependencies.

::: tip
You normally don't need `core` directly — the `cli`, `react`, and `tui` packages re-export the types and utilities you'll need. Reach for `core` when building your own renderer.
:::

## Installation

```sh
npm install @typescript-calendar/core
# or
bun add @typescript-calendar/core
```

## Types

### `Locale`

```ts
type Locale = "en" | "ja" | "es" | "de" | "fr" | "ko" | "zh";
```

English, Japanese, Spanish, German, French, Korean, and Chinese (Simplified).

### `WeekStart`

```ts
type WeekStart = "sunday" | "monday";
```

### `HighlightStyle`

```ts
type HighlightStyle = "bracket" | "reverse";
```

`"bracket"` wraps the day in brackets (`[8]`), `"reverse"` uses reverse-video styling.

### `CalendarOptions`

```ts
interface CalendarOptions {
  year: number;
  month: number; // 1-indexed (1–12)
  locale?: Locale;          // default: "en"
  weekStart?: WeekStart;    // default: "sunday"
  highlight?: Date;         // date to highlight (e.g. today)
  highlightStyle?: HighlightStyle; // default: "bracket"
  range?: { from: Date; to: Date };
  color?: boolean;          // default: false
}
```

### `CalendarYearOptions`

Same as `CalendarOptions` minus `month` — renders a full year:

```ts
interface CalendarYearOptions {
  year: number;
  locale?: Locale;
  weekStart?: WeekStart;
  highlight?: Date;
  highlightStyle?: HighlightStyle;
  range?: { from: Date; to: Date };
  color?: boolean;
}
```

### `CalendarRangeOptions`

Same as `CalendarOptions` minus `year`/`month`, rendered for every month between `from` and `to` (inclusive):

```ts
interface CalendarRangeOptions {
  from: Date;
  to: Date;
  locale?: Locale;
  weekStart?: WeekStart;
  highlight?: Date;
  highlightStyle?: HighlightStyle;
  range?: { from: Date; to: Date };
  color?: boolean;
}
```

### `RenderMonthOptions`

Same as `CalendarOptions` minus `year`/`month`. Used by the low-level `renderMonth` helper.

## Constants

### `LOCALES`

```ts
const LOCALES: Record<Locale, LocaleData>;
```

Contains month names, weekday headers, and short weekday headers for each locale.

## Functions

### `getMonthName(locale, month): string`

Returns the localized month name for a 1-indexed month:

```ts
getMonthName("en", 9); // "September"
getMonthName("ja", 9); // "9月"
```

### `getWeekdayHeaders(locale, weekStart): readonly string[]`

Returns the weekday header array respecting `weekStart`:

```ts
getWeekdayHeaders("en", "sunday"); // ["Sun", "Mon", ..., "Sat"]
getWeekdayHeaders("en", "monday"); // ["Mon", "Tue", ..., "Sun"]
```

### `buildMonthGrid(year, month, weekStart): (number | null)[][]`

Builds a 6×7 grid of day numbers (`1`–`31`) with `null` for empty cells. The grid is always 6 rows tall for stable layouts:

```ts
buildMonthGrid(2026, 9, "sunday");
// [
//   [null, null, 1, 2, 3, 4, 5],
//   [6, 7, 8, 9, 10, 11, 12],
//   ...
// ]
```

### `firstDayOfMonth(year, month): Date`

Returns a `Date` for the 1st of the month:

```ts
firstDayOfMonth(2026, 9); // Tue Sep 01 2026
```

### `lastDayOfMonth(year, month): Date`

Returns a `Date` for the last day of the month:

```ts
lastDayOfMonth(2026, 2); // Sat Feb 28 2026 (no leap year)
lastDayOfMonth(2028, 2); // Tue Feb 29 2028 (leap year)
```

### `isDateInRange(date, range?): boolean`

Returns `true` if `date` falls within `range` (inclusive). Returns `false` when `range` is `undefined`.

### `isSameDay(a, b): boolean`

Compares dates by year, month, and day only (ignores time component).

### `getMonthRange(from, to): { year: number; month: number }[]`

Returns the list of all months from `from` to `to` (inclusive):

```ts
getMonthRange(new Date(2026, 5, 1), new Date(2026, 8, 30));
// [{ year: 2026, month: 6 }, { year: 2026, month: 7 },
//  { year: 2026, month: 8 }, { year: 2026, month: 9 }]
```

## Exports

```ts
// Types
import type {
  CalendarOptions,
  CalendarRangeOptions,
  CalendarYearOptions,
  HighlightStyle,
  Locale,
  RenderMonthOptions,
  WeekStart,
} from "@typescript-calendar/core";

// Values
import {
  LOCALES,
  buildMonthGrid,
  firstDayOfMonth,
  getMonthName,
  getMonthRange,
  getWeekdayHeaders,
  isDateInRange,
  isSameDay,
  lastDayOfMonth,
} from "@typescript-calendar/core";
```