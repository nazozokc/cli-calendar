import type {
  CalendarState,
  CalendarStateOptions,
  Direction,
  MonthDirection,
} from "@typescript-calendar-lib/tui";
import {
  createCalendarState,
  getCursorDate,
  getSelectedDate,
  navigateMonth,
  clearSelection as tuiClearSelection,
  goToToday as tuiGoToToday,
  moveCursor as tuiMoveCursor,
  selectDate as tuiSelectDate,
} from "@typescript-calendar-lib/tui";
import { useCallback, useMemo, useState } from "react";

export interface UseCalendarStateOptions
  extends Pick<
    CalendarStateOptions,
    "locale" | "weekStart" | "today" | "highlight" | "range"
  > {
  initialYear?: number;
  initialMonth?: number;
}

export interface UseCalendarStateReturn {
  /** 現在のカレンダー状態 */
  state: CalendarState;
  /** カーソルを指定方向に移動 (wrap around) */
  moveCursor: (direction: Direction) => void;
  /** 前月/翌月へ移動 */
  goNext: () => void;
  goPrev: () => void;
  /** 今日の月へジャンプ */
  goToday: () => void;
  /** カーソル位置の日付を選択 */
  selectDate: () => void;
  /** 選択を解除 */
  clearSelection: () => void;
  /** カーソル位置の日付（null の場合あり） */
  cursorDate: Date | null;
  /** 選択済み日付（null の場合あり） */
  selectedDate: Date | null;
}

/**
 * tui の不変状態マシンを包む React hook。
 * カレンダーのインタラクティブ操作をシンプルに利用できる。
 */
export function useCalendarState(
  options: UseCalendarStateOptions = {},
): UseCalendarStateReturn {
  const [state, setState] = useState<CalendarState>(() =>
    createCalendarState({
      initialYear: options.initialYear,
      initialMonth: options.initialMonth,
      today: options.today,
      locale: options.locale,
      weekStart: options.weekStart,
      highlight: options.highlight,
      range: options.range,
    }),
  );

  const move = useCallback((direction: Direction) => {
    setState((prev) => tuiMoveCursor(prev, direction));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => navigateMonth(prev, "next"));
  }, []);

  const goPrev = useCallback(() => {
    setState((prev) => navigateMonth(prev, "prev"));
  }, []);

  const goToday = useCallback(() => {
    setState((prev) => tuiGoToToday(prev));
  }, []);

  const select = useCallback(() => {
    setState((prev) => tuiSelectDate(prev));
  }, []);

  const clear = useCallback(() => {
    setState((prev) => tuiClearSelection(prev));
  }, []);

  const cursorDate = useMemo(() => getCursorDate(state), [state]);
  const selectedDate = useMemo(() => getSelectedDate(state), [state]);

  return {
    state,
    moveCursor: move,
    goNext,
    goPrev,
    goToday,
    selectDate: select,
    clearSelection: clear,
    cursorDate,
    selectedDate,
  };
}

export type { Direction, MonthDirection };
