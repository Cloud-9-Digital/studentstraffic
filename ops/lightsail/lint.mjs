import { ESLint } from "eslint";
import { readFileSync, writeFileSync } from "node:fs";
import { relative } from "node:path";

const eslint = new ESLint();
const results = await eslint.lintFiles(["app", "components", "lib", "proxy.ts", "next.config.ts", "tests"]);
const actual = {};
for (const file of results) {
  const path = relative(process.cwd(), file.filePath);
  for (const issue of file.messages.filter(({ severity }) => severity === 2)) {
    const key = JSON.stringify([path, issue.ruleId ?? "parser", issue.message.split("\n")[0]]);
    actual[key] = (actual[key] ?? 0) + 1;
  }
}
const file = new URL("lint-baseline.json", import.meta.url);
if (process.argv.includes("--record-existing")) {
  if (process.env.CI) throw new Error("Do not update baseline in CI");
  writeFileSync(file, JSON.stringify(Object.fromEntries(Object.entries(actual).sort()), null, 2) + "\n");
} else {
  const baseline = JSON.parse(readFileSync(file, "utf8"));
  const regressions = Object.entries(actual).filter(([key, count]) => count > (baseline[key] ?? 0));
  for (const [key, count] of regressions) console.error(key, "(count: " + count + ")");
  if (regressions.length) process.exitCode = 1;
}
console.log("Lint errors counted:",Object.values(actual).reduce((a,b)=>a+b,0));
