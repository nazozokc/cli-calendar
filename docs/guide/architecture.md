# Architecture

typescript-calendar は 4 つのパッケージからなる monorepo です。すべてのパッケージが共有ロジックを持つ `core` に依存し、下位レイヤーほど汎用的、上位レイヤーほど具体的な出力を持ちます。

## Dependency Graph

```
core (zero runtime dependencies)
 ├── cli   (+ cli-table3)
 ├── react (+ react peer)
 └── tui   (zero extra deps)
```

| Package | Layer | Role |
| :--- | :--- | :--- |
| [`core`](/packages/core) | ドメイン | 日付計算・ロケールデータ・グリッド生成 |
| [`tui`](/packages/tui) | 状態 | ヘッドレスなカーソル/選択/ナビゲーション状態マシン |
| [`cli`](/packages/cli) | 出力 | プレーンテキスト + ANSI 色での描画、CLI バイナリ |
| [`react`](/packages/react) | 出力 | `<Calendar />` コンポーネント + `useCalendarState` hook |

## Layer 1: core — ドメインロジック

`core` はフレームワーク非依存のロジックだけを提供します。

- **日付計算**: `firstDayOfMonth`, `lastDayOfMonth`, `isSameDay`, `isDateInRange`, `getMonthRange`
- **グリッド生成**: `buildMonthGrid` — 6×7 のグリッドを組み立てる
- **ロケール**: `LOCALES`, `getMonthName`, `getWeekdayHeaders` — 英日 + 追加ロケール

`core` は **状態を持ちません**。渡された値から純粋に計算し、文字列や配列を返すだけです。

```ts
import { buildMonthGrid } from "@typescript-calendar/core";

const grid = buildMonthGrid(2026, 9, "sunday");
// [ [null, null, 1, 2, 3, 4, 5], [6, 7, 8, ...], ... ]
```

## Layer 2: tui — 状態マシン

`tui` は `core` の上に**不変状態**を追加します。レンダリングは一切行わず、データ（`MonthData`）と状態（`CalendarState`）を提供します。

- **データ層**: `buildMonthData()` — 各セルにメタデータ（今日/ハイライト/範囲/週末）を付けた完全な月データ
- **状態層**: `createCalendarState()` — カーソル・選択・表示月を保持し、ナビゲーション関数が新しい状態を返す

すべての操作は**イミュータブル**です。`moveCursor(state, "right")` は元の `state` を変えず、新しい state を返します。これは React/TUI のレンダーループと相性が良い設計です。

```ts
import { createCalendarState, moveCursor, navigateMonth } from "@typescript-calendar/tui";

let state = createCalendarState({ weekStart: "monday" });
state = moveCursor(state, "right");       // → 新しい状態
state = navigateMonth(state, "next");     // → また新しい状態
```

## Layer 3: cli — テキスト出力

`cli` は `core` + `tui` のロジックを**プレーンテキスト**として出力します。

- `calendar()` — 単月
- `calendarYear()` — 年間（4列×3行）
- `calendarRange()` — 任意の日付範囲

テーマ（枠線の有無）とカラースキーム（ANSI 色）は `theme.ts` に分離されており、`color: false`（既定）ならエスケープコードを含まない安全なプレーンテキストを返します。

```ts
import { calendar } from "@typescript-calendar/cli";

console.log(calendar({ year: 2026, month: 9, theme: "modern", color: true }));
```

`bin.ts` はこれを CLI バイナリとして公開します。

## Layer 4: react — コンポーネント

`react` は `core` + `tui` を React コンポーネントとして提供します。

- `<Calendar />` — 制御コンポーネント。`year`/`month` を受け取ってグリッドを描画
- `useCalendarState` — `tui` の状態マシンを包む hook。カーソル・選択・月移動を React 状態として管理

```tsx
import { Calendar, useCalendarState } from "@typescript-calendar/react";

function App() {
  const { state, goNext, goPrev, cursorDate } = useCalendarState({
    initialYear: 2026,
    initialMonth: 9,
  });

  return (
    <>
      <button onClick={goPrev}>‹</button>
      <Calendar
        year={state.year}
        month={state.month}
        interactive
        onDateClick={(d) => console.log(d)}
      />
      <button onClick={goNext}>›</button>
    </>
  );
}
```

## パッケージの選び方

| やりたいこと | 使うパッケージ |
| :--- | :--- |
| ターミナルにテキストで表示 | `cli` |
| CLI ツールとして使う | `cli`（`typescript-calendar` バイナリ） |
| Web アプリの部品にする | `react` |
| Ink / blessed 等の TUI を自作する | `tui` |
| 独自レンダラーを作る | `core` |

## 状態管理の思想

`tui` と `react` は同じ「不変状態」の思想を共有しています。

- 状態は生成時に解釈され、以後は関数適用で遷移する
- 各関数は必ず新しい状態を返す（破壊的変更なし）
- 表示対象の月データは状態内にキャッシュされる
- 表示ロジック（色・枠線・CSS）は状態から完全に分離されている

この分離により、同じ状態マシンを **CLI・React・任意の TUI フレームワーク** で再利用できます。