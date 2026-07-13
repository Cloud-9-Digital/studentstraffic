import { spawn } from "node:child_process";

const heapFlag = "--max-old-space-size=5120";
const currentOptions = process.env.NODE_OPTIONS ?? "";
const nodeOptions = currentOptions.includes("--max-old-space-size")
  ? currentOptions
  : `${currentOptions} ${heapFlag}`.trim();

const nextBinary = process.platform === "win32" ? "node_modules/.bin/next.cmd" : "node_modules/.bin/next";
const child = spawn(nextBinary, ["build"], {
  env: { ...process.env, NODE_OPTIONS: nodeOptions },
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  }
  process.exit(code ?? 1);
});
