# AGENTS.md - sable-web

Next.js (App Router) + TypeScript frontend for **Sable**, a lightweight B2B
sales CRM. Talks to the `sable-api` backend.

## Layout

- `app/page.tsx` - server component shell for the dashboard page.
- `app/dashboard.tsx` - client component: lead list, pipeline stats, create/delete.
- `app/globals.css` - all styling (plain global CSS, no Tailwind).
- `lib/api.ts` - typed fetch client for the API; reads `NEXT_PUBLIC_API_URL`.

Standard scripts (`dev`, `build`, `lint`, `typecheck`) are in `package.json`.

## Cursor Cloud specific instructions

- The frontend needs `sable-api` running on `:8000`. Start the dev server with
  the API base URL set: `NEXT_PUBLIC_API_URL=http://localhost:8000 pnpm dev`
  (defaults to `http://localhost:8000` if unset).
- `NEXT_PUBLIC_API_URL` is inlined at build/start time and fetches run in the
  browser, so the API's CORS config must allow the web origin (`:3000`).
- `pnpm install` reports an ignored build script for `unrs-resolver`; this is
  safe to ignore - lint, typecheck, and build all pass without approving it.
- Use `pnpm` (declared via `packageManager`); a `pnpm-lock.yaml` is committed.
