// ─── テキスト整列 ────────────────────────────────────────

/** 東アジアの全角文字（ターミナル表示幅2列） */
const WIDE =
  /[\u1100-\u115f\u2e80-\u303e\u3041-\u33ff\u3400-\u4dbf\u4e00-\u9fff\ua000-\ua4cf\ua960-\ua97f\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/;

/** ターミナル上の表示幅を返す（全角文字は2列として数える） */
export function displayWidth(text: string): number {
  let width = 0;
  for (const ch of text) {
    width += WIDE.test(ch) ? 2 : 1;
  }
  return width;
}

/** 表示幅 width に右詰めする（全角文字対応） */
export function padStartWidth(text: string, width: number): string {
  return " ".repeat(Math.max(0, width - displayWidth(text))) + text;
}

/** タイトルを幅の中央に揃える */
export function centerText(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - displayWidth(text)) / 2));
  return " ".repeat(padding) + text;
}

/** タイトルを中央に揃え、幅一杯まで埋める（枠内用） */
export function centerTextFull(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - displayWidth(text)) / 2));
  return (
    " ".repeat(padding) +
    text +
    " ".repeat(Math.max(0, width - padding - displayWidth(text)))
  );
}
