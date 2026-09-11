import type {
  CalendarOptions as CoreCalendarOptions,
  CalendarYearOptions as CoreCalendarYearOptions,
  CalendarRangeOptions as CoreCalendarRangeOptions,
  RenderMonthOptions as CoreRenderMonthOptions,
} from "@typescript-calendar/core";
import type {
  ColorSchemeName,
  CliPalette,
  ThemeName,
  CliTheme,
} from "./theme.ts";

/** CLI 固有のオプション（core のオプションに追加で受け付ける） */
export interface CliExtraOptions {
  /** 見た目テーマ。既定は "default" */
  theme?: ThemeName | CliTheme;
  /** カラースキーム。color: true のとき有効。既定は "default" */
  colorScheme?: ColorSchemeName | CliPalette;
  /** 今日の基準日。カラースキームの today 着色に使用 */
  today?: Date;
}

export type CalendarOptions = CoreCalendarOptions & CliExtraOptions;
export type CalendarYearOptions = CoreCalendarYearOptions & CliExtraOptions;
export type CalendarRangeOptions = CoreCalendarRangeOptions & CliExtraOptions;
export type RenderMonthOptions = CoreRenderMonthOptions & CliExtraOptions;