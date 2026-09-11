// ─── テキスト整列 ────────────────────────────────────────

/** タイトルを幅の中央に揃える */
export function centerText(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(padding) + text;
}

/** タイトルを中央に揃え、幅一杯まで埋める（枠内用） */
export function centerTextFull(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return " ".repeat(padding) + text.padEnd(width - padding);
}
