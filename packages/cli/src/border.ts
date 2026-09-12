import type { FrameChars } from "./theme.ts";

// ─── 枠線 ─────────────────────────────────────────────────

/** 枠内のコンテンツ幅（例: 7列×3幅+区切り6 = 27） */
export function innerWidth(cellWidth: number, cols: number): number {
  return cols * cellWidth + (cols - 1);
}

/** 上枠: ┌────┬────...────┐ */
export function topBorder(
  frame: FrameChars,
  cellWidth: number,
  cols: number,
): string {
  return `${frame.topLeft}${frame.h.repeat(innerWidth(cellWidth, cols))}${frame.topRight}`;
}

/** 下枠: └────┴────...────┘ */
export function bottomBorder(
  frame: FrameChars,
  cellWidth: number,
  cols: number,
): string {
  const segments = Array<string>(cols).fill(frame.h.repeat(cellWidth));
  return `${frame.bottomLeft}${segments.join(frame.footJ)}${frame.bottomRight}`;
}

/** 区切り行: ├────┬────...┬────┤ */
export function separatorRow(
  frame: FrameChars,
  cellWidth: number,
  cols: number,
): string {
  const segments = Array<string>(cols).fill(frame.h.repeat(cellWidth));
  return `├${segments.join(frame.j)}┤`;
}
