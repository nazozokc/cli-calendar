# cli-calendar

A CLI calendar library written in TypeScript. Render month, year, or arbitrary date-range calendars as plain text (with optional ANSI color) right in your terminal.

## Features

- **Month / Year / Range** — render a single month, a full year (4 columns × 3 rows), or any date range
- **Bilingual** — English and Japanese locales
- **Week start** — Sunday or Monday
- **Highlight today** — bracket (`[8]`) or reverse-video styles
- **Color ranges** — highlight specific dates with range coloring (opt-in)
- **Zero runtime dependencies** — plain text by default; ANSI colors only when enabled

## Install

```sh
bun add cli-calendar
# or
npm install cli-calendar
```

## Usage

```ts
import { calendar, calendarYear, calendarRange } from "cli-calendar";

// Month calendar
console.log(calendar({ year: 2026, month: 9 }));

// Year calendar (4 columns × 3 rows)
console.log(calendarYear({ year: 2026 }));

// Arbitrary date range
console.log(calendarRange({
  from: new Date(2026, 5, 1),
  to: new Date(2026, 8, 30),
}));
```

### Output

```
      September 2026
Sun Mon Tue Wed Thu Fri Sat
          1   2   3   4   5
  6   7   8   9  10  11  12
 13  14  15  16  17  18  19
 20  21  22  23  24  25  26
 27  28  29  30
```

## API

### `calendar(options: CalendarOptions): string`

Render a single month.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `year` | `number` | — | Calendar year (e.g. `2026`) |
| `month` | `number` | — | Month, 1-indexed (`1`–`12`) |
| `locale` | `"en" \| "ja"` | `"en"` | Language |
| `weekStart` | `"sunday" \| "monday"` | `"sunday"` | First day of the week |
| `highlight` | `Date` | — | Date to highlight (e.g. today) |
| `highlightStyle` | `"bracket" \| "reverse"` | `"bracket"` | Highlight appearance |
| `range` | `{ from: Date; to: Date }` | — | Dates to color |
| `color` | `boolean` | `false` | Emit ANSI color codes |

### `calendarYear(options: CalendarYearOptions): string`

Render a full year as a 4 × 3 grid of months. Same options as `calendar`, but uses `year` instead of `month`.

### `calendarRange(options: CalendarRangeOptions): string`

Render every month from `from` to `to` (inclusive), each on its own block. Same options as `calendar`, but uses `from` / `to` Date ranges.

### `renderMonth(year, month, options?): string`

Low-level API to render a single month. Useful for custom layouts.

## Options

### Locale

```ts
calendar({ year: 2026, month: 9, locale: "ja", weekStart: "monday" });
```

```
          9月 2026
  月   火   水   木   金   土   日
      1   2   3   4   5   6
  7   8   9  10  11  12  13
 ...
```

### Highlight

Bracket (default):

```ts
calendar({ year: 2026, month: 9, highlight: new Date(2026, 8, 8) });
//                       ...  8 is shown as [8]
```

Reverse video (requires `color: true`):

```ts
calendar({
  year: 2026,
  month: 9,
  highlight: new Date(2026, 8, 8),
  highlightStyle: "reverse",
  color: true,
});
```

### Range coloring

Dates within the range are colored yellow when `color: true`:

```ts
calendar({
  year: 2026,
  month: 9,
  range: { from: new Date(2026, 8, 1), to: new Date(2026, 8, 15) },
  color: true,
});
```

When a date is both highlighted and in range, the highlight takes precedence.

By default (`color: false`) the output is clean plain text with no ANSI escape codes, so it's safe to pipe into files or other tools.

## TypeScript

All options are fully typed and exported:

```ts
import type {
  CalendarOptions,
  CalendarYearOptions,
  CalendarRangeOptions,
  RenderMonthOptions,
  Locale,
  WeekStart,
  HighlightStyle,
} from "cli-calendar";
```

## Testing

```sh
bun test
```

The suite covers date utilities (leap years, month boundaries), locale headers, grid layout, highlight/range rendering, and public API integration.

## License

MIT
