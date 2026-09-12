import { displayWidth } from "./align.ts";
import { stripAnsi } from "./ansi.ts";
import { renderMonth } from "./month.ts";
import type { RenderMonthOptions } from "./types.ts";

/**
 * 年間カレンダーを4列×3行でテキストで返す
 *
 * 列幅・パディングは「ANSI 除去後のターミナル表示幅」で計算する。
 * 全角文字（日本語・韓国語・中国語の月名や曜日）も正しく揃う。
 */
export function renderYear(
  year: number,
  options: RenderMonthOptions = {},
): string {
  const months: string[] = [];
  for (let m = 1; m <= 12; m++) {
    months.push(renderMonth(year, m, options));
  }

  const monthLines = months.map((m) => m.split("\n"));
  const maxLines = Math.max(...monthLines.map((l) => l.length));

  const widthOf = (line: string): number => displayWidth(stripAnsi(line));
  const colWidths = monthLines.map((lines) =>
    Math.max(...lines.map((l) => widthOf(l))),
  );

  const result: string[] = [];
  for (let row = 0; row < 3; row++) {
    const rowLines: string[] = [];
    for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
      const parts: string[] = [];
      for (let col = 0; col < 4; col++) {
        const monthIdx = row * 4 + col;
        if (monthIdx >= 12) {
          parts.push("");
          continue;
        }
        const lines = monthLines[monthIdx]!;
        const line = lines[lineIdx] ?? "";
        const pad = Math.max(0, colWidths[monthIdx]! - widthOf(line));
        parts.push(line + " ".repeat(pad));
      }
      rowLines.push(parts.join("    "));
    }
    result.push(rowLines.join("\n"));

    if (row < 2) {
      result.push("");
    }
  }

  return result.join("\n");
}
