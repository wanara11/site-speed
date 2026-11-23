// Entry driver for site-generator-speed-01 (make.fun, program/v1, node22).
//
// The harness runs `node /bot/main.ts`. This reads the cases from /input/cases.json (a JSON
// array of { id, input }), answers each one alone with run() from solve.js, and writes the
// answers to /output/answers.json in the cases' order. Outside a container, the environment
// variables MAKEFUN_INPUT_DIR and MAKEFUN_OUTPUT_DIR stand in for /input and /output.

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setFlagsFromString } from 'node:v8';

// The house baseline runs with V8's incremental marking off, set before solve.js is imported
// so all of its work runs under it; the rules let an entry tune V8's flags the same way.
setFlagsFromString('--no-incremental-marking');

const { run } = (await import(new URL('./solve.js', import.meta.url).href)) as { run: (input: unknown) => unknown };

const inputDir = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const cases = JSON.parse(readFileSync(join(inputDir, 'cases.json'), 'utf8')) as { id: string; input: unknown }[];
const answers: unknown[] = [];
for (const c of cases) answers.push(run(c.input));
writeFileSync(join(outputDir, 'answers.json'), JSON.stringify(answers));
