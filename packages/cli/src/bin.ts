#!/usr/bin/env bun
import { calendar } from "./calendar.ts";

const args = process.argv.slice(2);

function printUsage() {
  console.log(`Usage: typescript-calendar [YYYY] [MM]

  typescript-calendar         Render the current month
  typescript-calendar 2026    Render the current month of 2026
  typescript-calendar 2026 9  Render September 2026

Options:
  -h, --help  Show this help
`);
}

const first = args[0];

if (first === "-h" || first === "--help") {
  printUsage();
  process.exit(0);
}

if (first !== undefined && Number.isNaN(Number(first))) {
  console.error(`Invalid argument: ${first}`);
  printUsage();
  process.exit(1);
}

const now = new Date();
const year = first ? Number(first) : now.getFullYear();
const month = args[1] ? Number(args[1]) : now.getMonth() + 1;

console.log(calendar({ year, month }));