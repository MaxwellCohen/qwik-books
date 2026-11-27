/**
 * Base vite config. The production adapter config (adapters/express) extends it.
 */
import { defineConfig, type UserConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { partytownVite } from "@qwik.dev/partytown/utils";
import { join } from "node:path";

let platform = {};

if (process.env.NODE_ENV === 'development') {
    const { getPlatformProxy } = await import('wrangler');
    platform = await getPlatformProxy();
}

// Feature tests: bundle-analysis uses the third-party rollup-plugin-visualizer, only when ANALYZE=1.
const analyzePlugins = process.env.ANALYZE
  ? [(await import("rollup-plugin-visualizer")).visualizer({ filename: "stats.html", template: "treemap", emitFile: true })]
  : [];

export default defineConfig((): UserConfig => {
  return {
    plugins: [qwikCity({
      trailingSlash: false,
      platform
    }), qwikVite({
      // qwikVite preloads every font file in the build by default: all Geist / Geist Mono
      // subsets plus the feature-test Lora (13 files, ~210 KB) on every page. Off here;
      // router-head.tsx preloads only the Latin Geist file the pages render with.
      disableFontPreload: true,
      // Qwik inlines the global stylesheet when it is under this size (default 20 KB).
      // The Tailwind build is ~39 KB, so raise it to drop the render-blocking request.
      optimizerOptions: { inlineStylesUpToBytes: 60_000 },
    }), tailwindcss(), tsconfigPaths({ root: "." }),
    // Feature tests: copies the Partytown lib to /~partytown (what `qwik add partytown` sets up).
    partytownVite({ dest: join(import.meta.dirname, "dist", "~partytown") }),
    ...analyzePlugins],
    server: {
      headers: {
        // Don't cache the server response in dev mode
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});