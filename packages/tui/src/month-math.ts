import { MAX_YEAR, MIN_YEAR } from "@typescript-calendar-lib/core";

// ─── 年月の算術 ──────────────────────────────────────────

/**
 * year/month を delta ヶ月ずらす（月跨ぎ・年跨ぎを正規化）。
 *
 * - year/month は整数である必要がある（それ以外は RangeError）
 * - month は 1-12 に限らない（13 → 翌年1月、0 → 前年12月 として正規化される）
 * - 結果の年は MIN_YEAR..MAX_YEAR にクランプされる（範囲の端では移動しない）
 */
export function shiftMonth(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  if (!Number.isInteger(year)) {
    throw new RangeError(`Invalid year: ${year} (expected an integer)`);
  }
  if (!Number.isInteger(month)) {
    throw new RangeError(`Invalid month: ${month} (expected an integer)`);
  }
  if (!Number.isInteger(delta)) {
    throw new RangeError(`Invalid delta: ${delta} (expected an integer)`);
  }

  const total = year * 12 + (month - 1) + delta;
  const rawYear = Math.floor(total / 12);
  const rawMonth = (((total % 12) + 12) % 12) + 1;

  if (rawYear < MIN_YEAR) return { year: MIN_YEAR, month: 1 };
  if (rawYear > MAX_YEAR) return { year: MAX_YEAR, month: 12 };
  return { year: rawYear, month: rawMonth };
}
