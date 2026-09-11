import type { CalendarStateOptions, ResolvedOptions } from "./types.ts";

// ─── Options 解決 ─────────────────────────────────────────

/** 解決済みオプションを生成する（today を固定し、状態に引き継がれる形にする） */
export function resolveOptions(
  options: CalendarStateOptions = {},
): ResolvedOptions {
  const { today = new Date(), locale = "en", weekStart = "sunday" } = options;
  return {
    locale,
    weekStart,
    today,
    highlight: options.highlight,
    range: options.range,
  };
}