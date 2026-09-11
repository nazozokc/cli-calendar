#!/usr/bin/env bun
import { calendar, calendarYear, calendarRange } from "./calendar.ts";

const args = process.argv.slice(2);

function printUsage() {
  console.log(`Usage: typescript-calendar [command] [options]

Commands:
  month [YYYY] [MM]     Render a single month (default: current)
  year [YYYY]           Render a full year (default: current)
  range [YYYY-MM-DD] [YYYY-MM-DD]  Render a date range

Options:
  --locale <en|ja>      Language (default: en)
  --week-start <sunday|monday>  First day of week (default: sunday)
  --highlight <YYYY-MM-DD>     Date to highlight
  --color               Enable ANSI color output
  -h, --help            Show this help
`);
}

const command = args[0] ?? "month";

switch (command) {
  case "month": {
    const now = new Date();
    const year = args[1] ? Number(args[1]) : now.getFullYear();
    const month = args[2] ? Number(args[2]) : now.getMonth() + 1;
    console.log(calendar({ year, month }));
    break;
  }
  case "year": {
    const now = new Date();
    const year = args[1] ? Number(args[1]) : now.getFullYear();
    console.log(calendarYear({ year }));
    break;
  }
  case "range": {
    if (!args[1] || !args[2]) {
      console.error("Error: range requires two dates (YYYY-MM-DD)");
      process.exit(1);
    }
    const [fromStr, toStr] = args.slice(1);
    const from = new Date(fromStr!);
    const to = new Date(toStr!);
    console.log(calendarRange({ from, to }));
    break;
  }
  case "help":
  case "--help":
  case "-h":
    printUsage();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    printUsage();
    process.exit(1);
}
