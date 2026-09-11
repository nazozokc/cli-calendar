// ─── ANSI 色付け ─────────────────────────────────────────

/** ANSI コードを付与する（code が undefined ならそのまま） */
export function colorize(
  text: string,
  code: number | undefined,
  enabled: boolean,
): string {
  if (!enabled || code === undefined) return text;
  return `\u001b[${code}m${text}\u001b[0m`;
}
