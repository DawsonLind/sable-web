# Sable web agent guide

## Runtime

- Use pnpm.
- Run the Next.js frontend on port `3000`.
- The sibling API lives at `../sable-api` and runs on port `8000`.
- Set `NEXT_PUBLIC_API_URL` only when the API is not at `http://localhost:8000`.

## Domain contract

`DealStage` has exactly these values:

- `prospecting`
- `qualified`
- `proposal`
- `negotiation`
- `closed_won`
- `closed_lost`

Keep API response schemas aligned with `../sable-api/.audit/api-contract.md`.

## Change discipline

Prefer the smallest change that satisfies the locked contract. Keep data fetching in server components unless browser state is required. Do not add a Kanban board, real OAuth, deployment configuration, or intentional demo bugs.

## Verification

Verify changes with the real API and rendered application:

```bash
pnpm test
pnpm lint
pnpm build
pnpm dev
curl http://localhost:8000/health
curl http://localhost:3000/accounts
curl http://localhost:3000/deals
```
