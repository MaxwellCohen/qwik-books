# Qwik Books

Goodreads catalog demo (search, filters, pagination, book detail) built with Qwik City v1 (`@builder.io/qwik` + `@builder.io/qwik-city`), SSR on the Express/Node adapter, Tailwind CSS v4, and Drizzle on Neon (`neon-http`). Port of the "Books" app used across the other `*-books` demos. State lives in URL query params: `search, page, year, rating, pages, language, list, delay`.

## Environment

Copy `.env.example` to `.env`:

- `POSTGRES_URL` – Neon/Postgres connection string. When empty, a small built-in preview catalog is served.
- `API_DELAY_MS` – optional artificial server latency in ms.

## Commands

- `pnpm install`
- `pnpm dev` – dev server on port 3000
- `pnpm build` – client + server build (`dist/`, `server/`)
- `pnpm start` – production server (`PORT`, default 3000; loads `.env` via `node --env-file-if-exists`)
- `pnpm typecheck`

## Deployment

| Host | URL | Build flag |
| --- | --- | --- |
| Vercel | https://qwik-books.vercel.app | `VERCEL=1` (set by Vercel) |
| Netlify | https://qwik-books.netlify.app | `NETLIFY=1` |
| Cloudflare Workers | https://qwik-books.to-email-max.workers.dev | `CLOUDFLARE=1` (or `WORKERS_CI`, set by Workers Builds) |

- Vercel and Netlify are connected to this repo: a push to `main` builds and deploys to both. Cloudflare is deployed with `pnpm deploy:cloudflare`.
- The build picks the host adapter from the flag above; with no flag it targets Node (Express).
- `POSTGRES_URL` is set on every host (Vercel and Netlify environment variable, Cloudflare secret). Without it the app serves the preview catalog.
- Manual deploys: `pnpm deploy:vercel`, `pnpm deploy:netlify`, `pnpm deploy:cloudflare`.
