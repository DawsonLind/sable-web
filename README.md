# sable-web

Next.js frontend for **Sable**, a lightweight B2B sales CRM used for Capsule cloud-agent demos.

## Stack

- Next.js (App Router)
- TypeScript
- Talks to [`sable-api`](https://github.com/DawsonLind/sable-api) on `:8000`

## Local setup

```bash
# From a sibling checkout next to sable-api
pnpm install   # or npm / yarn once the app is scaffolded
pnpm dev       # http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` when the API is running.

## Multi-repo cloud agents

Clone as siblings:

```text
dv/
  sable-web/   # this repo
  sable-api/
```

This README exists so the repository is non-empty and safe to attach to a Cursor cloud agent environment.
