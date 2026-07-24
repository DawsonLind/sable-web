# Sable Web

Next.js frontend for **Sable**, a lightweight B2B sales CRM used for Capsule cloud-agent demos.

## Stack

- Next.js App Router
- TypeScript and Tailwind CSS
- Vitest
- [`sable-api`](https://github.com/DawsonLind/sable-api) on port `8000`

## Local setup

Run the API first from the sibling `sable-api` checkout:

```bash
cd ../sable-api
source .venv/bin/activate
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

Then start the frontend:

```bash
cd ../sable-web
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The frontend defaults to `NEXT_PUBLIC_API_URL=http://localhost:8000`.

## Quality checks

```bash
pnpm test
pnpm lint
pnpm build
```

See `DEMO_RUNBOOK.md` for the full setup and demo path.

## Multi-repo cloud agents

Clone as siblings:

```text
dv/
  sable-web/   # this repo
  sable-api/
```

Open `sable.code-workspace` to work in both repositories. The cloud environment also declares `sable-api` as a repository dependency.
