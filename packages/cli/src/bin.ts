#!/usr/bin/env bun
import { calendar } from "./calendar.ts";
import type { ColorSchemeName, ThemeName } from "./theme.ts";

const args = process.argv.slice(2);

function printUsage() {
  console.log(`Usage: typescript-calendar [YYYY] [MM] [options]

  typescript-calendar                       Render the current month
  typescript-calendar 2026                  Render the current month of 2026
  typescript-calendar 2026 9                Render September 2026

Options:
  --theme <name>           Look: default | modern (default: default)
  --color-scheme <name>    Colors: default | ocean | forest | sunset | mono
  --color                  Enable ANSI colors
  -h, --help               Show this help
`);
}

const positional: string[] = [];
let theme: ThemeName | undefined;
let colorScheme: ColorSchemeName | undefined;
let color = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i]!;
  if (arg === "--theme") {
    theme = args[++i] as ThemeName;
  } else if (arg === "--color-scheme") {
    colorScheme = args[++i] as ColorSchemeName;
  } else if (arg === "--color") {
    color = true;
  } else if (arg === "-h" || arg === "--help") {
    printUsage();
    process.exit(0);
  } else {
    positional.push(arg);
  }
}

const first = positional[0];

if (first !== undefined && Number.isNaN(Number(first))) {
  console.error(`Invalid argument: ${first}`);
  printUsage();
  process.exit(1);
}

const now = new Date();
const year = first ? Number(first) : now.getFullYear();
const month = positional[1] ? Number(positional[1]) : now.getMonth() + 1;

console.log(calendar({ year, month, theme, colorScheme, color }));
