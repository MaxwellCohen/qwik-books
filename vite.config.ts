/**
 * Base vite config. The production adapter config (adapters/express) extends it.
 */
import { defineConfig, type UserConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

let platform = {};

if (process.env.NODE_ENV === 'development') {
    const { getPlatformProxy } = await import('wrangler');
    platform = await getPlatformProxy();
}

export default defineConfig((): UserConfig => {
  return {
    plugins: [qwikCity({
      trailingSlash: false,
      platform
    }), qwikVite(), tailwindcss(), tsconfigPaths({ root: "." })],
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