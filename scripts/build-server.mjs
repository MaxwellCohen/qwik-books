// Picks the Qwik City adapter for the current host (set via env var at build time).
import { spawnSync } from "node:child_process";

const env = process.env;
const adapter = env.NETLIFY
  ? "netlify-edge"
  : env.CLOUDFLARE || env.WORKERS_CI || env.CF_PAGES
    ? "cloudflare-pages"
    : env.VERCEL
      ? "vercel-edge"
      : "express";

console.log(`[build-server] adapter: ${adapter}`);
const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
run("pnpm", ["exec", "qwik", "check-client", "src", "dist"]);
run("pnpm", ["exec", "vite", "build", "-c", `adapters/${adapter}/vite.config.ts`]);
