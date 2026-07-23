# Sable demo runbook

Keep `sable-web` and `sable-api` in the same parent directory.

## Start the API

From `../sable-api`:

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload --port 8000
```

Confirm the seeded API:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/accounts
curl http://localhost:8000/deals
```

## Start the frontend

From this repository in a second terminal:

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The frontend uses `http://localhost:8000` by default. Set `NEXT_PUBLIC_API_URL` before `pnpm dev` to use a different API origin.

## Demo path

1. Open Dashboard to show pipeline stage counts and recent activity.
2. Open Accounts and select an account to show its contacts, deals, and timeline.
3. Open Contacts to show account-linked people.
4. Open Deals to show stage badges and formatted deal values.
5. Open Settings to show the local demo identity and API connection.

## Checks

```bash
pnpm test
pnpm lint
pnpm build
```
