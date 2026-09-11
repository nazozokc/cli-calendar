import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { useCalendarState } from "./hooks.ts";
import { Calendar } from "./index.tsx";

const TODAY = new Date(2026, 8, 15); // 2026-09-15

afterEach(cleanup);

// ─── useCalendarState hook ──────────────────────────────

function HookTestComponent() {
  const {
    state,
    goNext,
    goPrev,
    goToday,
    moveCursor,
    selectDate,
    cursorDate,
    selectedDate,
  } = useCalendarState({
    initialYear: 2026,
    initialMonth: 9,
    today: TODAY,
  });

  return createElement(
    "div",
    null,
    createElement("span", { "data-testid": "title" }, state.monthData.title),
    createElement(
      "span",
      { "data-testid": "cursor" },
      cursorDate?.toISOString() ?? "null",
    ),
    createElement(
      "span",
      { "data-testid": "selected" },
      selectedDate?.toISOString() ?? "null",
    ),
    createElement(
      "button",
      { "data-testid": "next", type: "button", onClick: goNext },
      "Next",
    ),
    createElement(
      "button",
      { "data-testid": "prev", type: "button", onClick: goPrev },
      "Prev",
    ),
    createElement(
      "button",
      { "data-testid": "today", type: "button", onClick: goToday },
      "Today",
    ),
    createElement(
      "button",
      {
        "data-testid": "right",
        type: "button",
        onClick: () => moveCursor("right"),
      },
      "Right",
    ),
    createElement(
      "button",
      { "data-testid": "select", type: "button", onClick: selectDate },
      "Select",
    ),
  );
}

describe("useCalendarState", () => {
  test("初期状態は指定月を表示", () => {
    render(createElement(HookTestComponent));
    expect(screen.getByTestId("title").textContent).toBe("September 2026");
  });

  test("カーソルは今日の日付を指す", () => {
    render(createElement(HookTestComponent));
    expect(screen.getByTestId("cursor").textContent).toBe(TODAY.toISOString());
  });

  test("翌月に移動できる", () => {
    render(createElement(HookTestComponent));
    fireEvent.click(screen.getByTestId("next"));
    expect(screen.getByTestId("title").textContent).toBe("October 2026");
  });

  test("前月に移動できる", () => {
    render(createElement(HookTestComponent));
    fireEvent.click(screen.getByTestId("prev"));
    expect(screen.getByTestId("title").textContent).toBe("August 2026");
  });

  test("今日にジャンプできる", () => {
    render(createElement(HookTestComponent));
    fireEvent.click(screen.getByTestId("next"));
    fireEvent.click(screen.getByTestId("next"));
    fireEvent.click(screen.getByTestId("today"));
    expect(screen.getByTestId("title").textContent).toBe("September 2026");
  });

  test("カーソルを右に動かせる", () => {
    render(createElement(HookTestComponent));
    const before = screen.getByTestId("cursor").textContent;
    fireEvent.click(screen.getByTestId("right"));
    const after = screen.getByTestId("cursor").textContent;
    expect(after).not.toBe(before);
  });

  test("日付を選択できる", () => {
    render(createElement(HookTestComponent));
    fireEvent.click(screen.getByTestId("select"));
    expect(screen.getByTestId("selected").textContent).toBe(
      TODAY.toISOString(),
    );
  });
});

// ─── Calendar component interaction ─────────────────────

describe("Calendar interactive", () => {
  test("interactive モードでセルに role=button がつく", () => {
    render(
      createElement(Calendar, {
        year: 2026,
        month: 9,
        interactive: true,
        today: TODAY,
      }),
    );
    const cells = screen.getAllByRole("button");
    expect(cells.length).toBeGreaterThan(0);
  });

  test("interactive でない場合は role=button がない", () => {
    const { container } = render(
      createElement(Calendar, {
        year: 2026,
        month: 9,
        today: TODAY,
      }),
    );
    const buttons = container.querySelectorAll('[role="button"]');
    expect(buttons).toHaveLength(0);
  });

  test("セルクリックで onDateClick が呼ばれる", () => {
    const onClick = vi.fn();
    render(
      createElement(Calendar, {
        year: 2026,
        month: 9,
        interactive: true,
        today: TODAY,
        onDateClick: onClick,
      }),
    );
    const cells = screen.getAllByRole("button");
    fireEvent.click(cells[0]!);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0]![0]).toBeInstanceOf(Date);
  });

  test("セルホバーで onDateHover が呼ばれる", () => {
    const onHover = vi.fn();
    render(
      createElement(Calendar, {
        year: 2026,
        month: 9,
        interactive: true,
        today: TODAY,
        onDateHover: onHover,
      }),
    );
    const cells = screen.getAllByRole("button");
    fireEvent.mouseEnter(cells[0]!);
    expect(onHover).toHaveBeenCalledTimes(1);
  });

  test("Enter キーで onDateClick が呼ばれる", () => {
    const onClick = vi.fn();
    render(
      createElement(Calendar, {
        year: 2026,
        month: 9,
        interactive: true,
        today: TODAY,
        onDateClick: onClick,
      }),
    );
    const cells = screen.getAllByRole("button");
    cells[0]!.focus();
    fireEvent.keyDown(cells[0]!, { key: "Enter" });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test("interactive モードで calendar-interactive クラスがつく", () => {
    const { container } = render(
      createElement(Calendar, {
        year: 2026,
        month: 9,
        interactive: true,
        today: TODAY,
      }),
    );
    expect(container.firstChild).toHaveClass("calendar-interactive");
  });
});
