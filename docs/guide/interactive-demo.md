# Interactive Demo

ここでは各パッケージのインタラクティブな使い方を説明します。コードはそのままプロジェクトにコピーして使えます。

## React: フルインタラクション（推奨）

`useCalendarState` と `<Calendar interactive />` を組み合わせると、月移動・カーソル・選択が一つの状態で完結します。

`onDateClick` / `onDateHover` は日付を通知するだけで、`useCalendarState` の状態は更新しません。選択状態を更新するのは `selectDate()` で、引数は取らず**現在のカーソル位置**の日付を `selectedDate` に設定します。上の例では別の Select ボタンから呼んでいます。

### 完全な例

```tsx
import { Calendar, useCalendarState } from "@typescript-calendar-lib/react";

export function CalendarDemo() {
  const {
    state,
    goNext,
    goPrev,
    goToday,
    selectDate,
    clearSelection,
    cursorDate,
    selectedDate,
  } = useCalendarState({
    initialYear: 2026,
    initialMonth: 9,
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "0.75rem",
          alignItems: "center",
        }}
      >
        <button type="button" onClick={goPrev}>‹</button>
        <button type="button" onClick={goNext}>›</button>
        <button type="button" onClick={goToday}>Today</button>
        <span>{state.monthData.title}</span>
      </div>

      <Calendar
        year={state.year}
        month={state.month}
        locale={state.options.locale}
        weekStart={state.options.weekStart}
        interactive
        onDateClick={(d) => console.log("clicked", d)}
        onDateHover={(d) => console.log("hovered", d)}
      />

      <div style={{ marginTop: "0.75rem", fontSize: "0.875rem" }}>
        <p>Cursor: {cursorDate?.toDateString() ?? "—"}</p>
        <p>Selected: {selectedDate?.toDateString() ?? "—"}</p>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" onClick={selectDate}>Select</button>
          <button type="button" onClick={clearSelection}>Clear</button>
        </div>
      </div>
    </div>
  );
}
```

### シンプルな日付選択

クリックだけで日付を選びたい場合は `interactive` だけで十分です:

```tsx
import { useState } from "react";
import { Calendar } from "@typescript-calendar-lib/react";

function DatePicker() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <div>
      <Calendar
        year={2026}
        month={9}
        interactive
        onDateClick={(d) => setDate(d)}
      />
      <p>選択: {date?.toDateString() ?? "未選択"}</p>
    </div>
  );
}
```

### キーボード操作

`interactive` モードの日付セルは内部にネイティブの `<button>` を持つためフォーカス可能で、Enter / Space でクリックと同じ動作をします。また、`useCalendarState` の `moveCursor` に矢印キーを割り当てるのが一般的なパターンです。

```tsx
import { useEffect } from "react";
import { Calendar, useCalendarState } from "@typescript-calendar-lib/react";

function KeyboardCalendar() {
  const { state, moveCursor } = useCalendarState({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, () => void> = {
        ArrowLeft: () => moveCursor("left"),
        ArrowRight: () => moveCursor("right"),
        ArrowUp: () => moveCursor("up"),
        ArrowDown: () => moveCursor("down"),
      };
      map[e.key]?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveCursor]);

  return (
    <Calendar
      year={state.year}
      month={state.month}
      interactive
    />
  );
}
```

## TUI: ヘッドレス状態マシン

TUI フレームワーク（Ink 等）と組み合わせる例。矢印キーのイベントをそのまま状態遷移にマップします。

```ts
import {
  createCalendarState,
  clearSelection,
  getCursorDate,
  moveCursor,
  navigateMonth,
  navigateYear,
  selectDate,
} from "@typescript-calendar-lib/tui";

let state = createCalendarState({ weekStart: "monday" });

function onKey(key: string) {
  switch (key) {
    case "left":  state = moveCursor(state, "left");    break;
    case "right": state = moveCursor(state, "right");   break;
    case "up":    state = moveCursor(state, "up");      break;
    case "down":  state = moveCursor(state, "down");    break;
    case "p":     state = navigateMonth(state, "prev"); break;
    case "n":     state = navigateMonth(state, "next"); break;
    case "y-":    state = navigateYear(state, "prev");  break;
    case "y+":    state = navigateYear(state, "next");  break;
    case "enter": state = selectDate(state);            break;
    case "esc":   state = clearSelection(state);        break;
  }
  draw(state); // フレームワークの描画関数に state を渡す
}
```

### セル検索ヘルパー

カーソル位置の初期化や特定日付への移動には search helper が使えます。

```ts
import {
  clampCursor,
  findDateCell,
  findFirstDayCell,
  findTodayCell,
} from "@typescript-calendar-lib/tui";

const data = state.monthData;
const today = findTodayCell(data);                          // 今日のセル位置
const first = findFirstDayCell(data);                       // 先頭の日付セル
const target = findDateCell(data, new Date(2026, 8, 8));    // 指定日のセル位置
const clamped = clampCursor({ row: 9, col: 9 }, data);      // 範囲に収める
```

## CLI: ターミナルで確認

CLI バイナリで一発表示:

```sh
# 今月
typescript-calendar-lib

# 2026年9月を日本語・月曜始まりで
typescript-calendar-lib 2026 9 --locale ja --week-start monday

# 今日をハイライト（[] で囲む）
typescript-calendar-lib --highlight "$(date +%Y-%m-%d)"

# 反転表示 + 色付きで
typescript-calendar-lib 2026 9 --highlight 2026-09-08 --highlight-style reverse --color
```

ライブラリ API でも同じことができます:

```ts
import { calendar } from "@typescript-calendar-lib/cli";

const output = calendar({
  year: 2026,
  month: 9,
  locale: "ja",
  weekStart: "monday",
  highlight: new Date(2026, 8, 8),
  highlightStyle: "reverse",
  color: true,
  theme: "modern",
  colorScheme: "ocean",
});

console.log(output);
```