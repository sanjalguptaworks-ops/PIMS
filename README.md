# PIMS — Pipeline Integrity Management System

Two Next.js apps sharing one Postgres database, for pipeline construction QA/QC
(welding, NDT, coating, materials traceability, etc.):

- **`apps/entry`** — field data entry (Master Data, Materials, Pre/Post-Welding
  activities, Welding, NDT).
- **`apps/reporting`** — read-only progress dashboard and drill-down reports.

## Monorepo layout

- `apps/entry`, `apps/reporting` — the two Next.js apps.
- `packages/db` — shared Prisma schema/client (`@pims/db`).
- `packages/auth` — shared session/RBAC helpers (`@pims/auth`).

## Local development

```bash
pnpm install
cp packages/db/.env.example packages/db/.env        # set DATABASE_URL
cp apps/entry/.env.example apps/entry/.env.local     # set DATABASE_URL + SESSION_SECRET
cp apps/reporting/.env.example apps/reporting/.env.local

pnpm db:migrate   # apply the Prisma schema
pnpm db:seed      # seed a sample project/spread/users

pnpm dev:entry       # http://localhost:3000
pnpm dev:reporting   # http://localhost:3001
```

Seeded logins (password `Pims@12345`): `client_admin`, `contractor_admin`,
`entry_user`, `report_user`.

## Deploying (e.g. Railway)

Each app is deployed as its own service from this repo, with the **root
directory left unset** (shared monorepo — see Railway's monorepo docs) and
these service-level overrides:

- Build command: `pnpm install --frozen-lockfile && pnpm --filter @pims/db exec prisma generate && pnpm --filter @pims/<app> run build`
- Start command: `pnpm --filter @pims/<app> exec next start -p $PORT`
- Pre-deploy command (entry service only needs to seed once): `pnpm --filter @pims/db exec prisma migrate deploy && pnpm --filter @pims/db exec tsx prisma/seed.ts`
- Env vars: `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV=production`
