# Events Tickets — Agent Guide

## Stack
- **Backend:** AdonisJS v7 (ESM, TypeScript 6.0) — all source is `.ts`
- **Frontend:** Inertia.js 3 + React 19 + shadcn/ui (SSR disabled)
- **Public pages:** Edge.js templates in `resources/views/`
- **Validation:** VineJS
- **ORM:** Lucid ORM (SQLite via `better-sqlite3` in dev; PostgreSQL planned)
- **Auth:** Session-based (`@adonisjs/auth`), `withAuthFinder` mixin on User model
- **Type-safe client:** `@tuyau/core` with generated registry
- **Node:** >=24.0.0

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR (`node ace serve --hmr`) |
| `npm run test` | Run all Japa test suites |
| `npm run lint` | ESLint whole project |
| `npm run format` | Prettier write |
| `npm run typecheck` | `tsc --noEmit` + `tsc --noEmit --project inertia/tsconfig.json` |
| `npm run build` | Production build (`node ace build`) |
| `node ace` | Ace CLI (migrations, make commands, etc.) |
| `node ace migration:run` | Run pending migrations (re-generates `database/schema.ts`) |

## Test suites (Japa)
- `unit` — `tests/unit/**/*.spec.ts`, timeout 2s
- `functional` — `tests/functional/**/*.spec.ts`, timeout 30s (HTTP server auto-started)
- `browser` — `tests/browser/**/*.spec.ts`, timeout 300s (HTTP server + browser client)

Run a single suite: `node ace test --suite=functional`

**Test env** uses `SESSION_DRIVER=memory` (from `.env.test`). Browser client only runs in `browser` suite.

## Architecture

### Entrypoints
- `start/routes.ts` — all routes (uses codegen `#generated/controllers`)
- `start/kernel.ts` — middleware stack (server + router + named)
- `app/controllers/` — request handlers
- `app/models/` — Lucid models (User extends auto-generated UserSchema)
- `app/validators/` — VineJS schemas
- `app/middleware/` — Auth, guest, silent-auth, inertia shared data
- `app/transformers/` — API response transformers (serialize with `ctx.serialize()`)

### Schema pattern
- `database/schema.ts` is **auto-generated** by `node ace migration:run`. Models extend schema classes from `#database/schema`. Do not edit it manually.
- Define actual DB schema in `database/migrations/` files (Lucid BaseSchema).
- `database/schema_rules.ts` can customize codegen.

### Codegen
- On `adonisrc.ts` `hooks.init`: runs `indexEntities`, `indexPages`, `generateRegistry`
- Generated output in `.adonisjs/` — accessible via `#generated/*`, `@generated/*` aliases
- After adding new controllers/pages, restart dev server to regenerate
- Inertia page props typed via `@adonisjs/inertia/types` `SharedProps` module augmentation

### Frontend conventions
- React pages in `inertia/pages/`, layout in `inertia/layouts/`
- `~/` alias → `inertia/`, `@generated` → `.adonisjs/client/`
- Forms use `<Form route="...">` from `@adonisjs/inertia/react` (not plain `<form>`)
- Toasts via `sonner` (configured in `inertia/layouts/default.tsx` with flash messages)
- Page-specific props typed as `InertiaProps<T>` from `~/types`

### API responses
- Custom `ApiSerializer` in `providers/api_provider.ts` wraps all data in `{ data: ... }`
- Used via `ctx.serialize()` in controllers
- Pagination metadata standardized via `definePaginationMetaData`

### VineJS quirks
- `start/validator.ts` globally transforms VineJS Date output → Luxon `DateTime`
- Password validation requires a `.confirmed({ confirmationField: 'passwordConfirmation' })` field

## Current state (as of build)
- **Very early:** Only `users` table migration, User model, signup/login/logout, home page
- No events, tickets, orders, fees, payments, WhatsApp, or admin dashboards yet
- No CI/CD, no Docker setup, no README (only `TICKETING_EVENTS.md` spec doc)

## Style
- `prettier` config: `@adonisjs/prettier-config`
- `eslint` config: `@adonisjs/eslint-config` with React plugin
- 2-space indent, LF line endings
- No semicolons in Prettier output (AdonisJS default)

## Available agent skills
- `shadcn` — add/search/shim shadcn/ui components
- `ui-ux-pro-max` — UI/UX design patterns and color/font systems
- `architect`, `imprint`, `recover`, `remember`, `review` — workflow skills in `.agents/skills/`
