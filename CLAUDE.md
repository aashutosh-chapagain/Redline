# Redline

Offline-first field reporting app for mining, construction and other site work. Field workers record safety incidents and inspections on their phone, with no signal if needed. On-device features check photo quality, turn speech into text and suggest the incident category. Reports sync to a thin backend when the phone is back online, and supervisors view them on a simple web page.

This is a portfolio project. Code quality, tests, clear commits and a readable repo history matter as much as features.

Full requirements: `docs/requirements.md` (user stories US-01 to US-27 with acceptance criteria). Read the relevant story before working on an issue. A local-only build plan also exists at `docs/build-plan.md` (gitignored, not in version control).

## Tech stack

- React Native with Expo (dev builds, not Expo Go), TypeScript in strict mode
- Expo Router (file-based routes in `app/`)
- TanStack Query for server state, Zustand for UI state
- expo-sqlite + Drizzle ORM for the local database
- react-native-vision-camera with native frame processor plugins
- Native modules with the Expo Modules API: Kotlin first, Swift from week 7
- Google ML Kit Image Labeling (on device)
- Incident classifier trained in `ml/` (Python, scikit-learn; later TensorFlow Lite)
- Supabase: Postgres, email one-time-code auth, storage, row-level security
- Jest, React Native Testing Library, Maestro for end-to-end tests
- GitHub Actions, EAS Build and Submit, Sentry

Targets: Android 10+ and iOS 16+. Android is the primary platform until week 7.

## Commands

```bash
npm install
npx expo run:android      # build and run a dev build on device/emulator
npx expo run:ios          # from week 7
npx expo start            # start Metro for an installed dev build
npm test                  # Jest
npm run lint              # ESLint
npm run format            # Prettier --write
npm run format:check      # Prettier --check (CI)
npm run typecheck         # tsc --noEmit
npx drizzle-kit generate  # create a migration after schema changes
maestro test e2e/         # end-to-end flows (Phase 4)
```

Update this section if scripts change.

## Project structure

```
app/                      Expo Router routes (screens only, no business logic)
  (auth)/sign-in, select-site
  (tabs)/reports, new, settings
  report/incident, inspection, [id]
  camera
  settings/privacy
src/
  features/
    auth/                 session, sign-in, site selection
    reports/              forms, validation, list, detail
    sync/                 queue, upload, retry, status
    camera/               guidance state machine, capture
    voice/                dictation hook
    classifier/           on-device category prediction
  db/                     Drizzle schema, migrations, repositories
  lib/                    supabase client, logging, utils
  components/             shared UI
modules/                  native modules (Expo Modules API), each with its own README
ml/                       dataset scripts, training, evaluation, model card (ml/README.md)
supabase/                 migrations, RLS policies, seed data
e2e/                      Maestro flows
docs/                     requirements, build plan, decisions/
```

## Core rules

**Offline first.** Every field-worker feature except sign-in and syncing must work in airplane mode, including the smart features. The local SQLite database is the source of truth on the phone; the server is a sync target.

**Never lose a report.** A report is deleted from the phone only after the server confirms it. Crashes, app kills, sign-out and failed syncs must never lose data.

**Report lifecycle (local only):** `draft → queued → syncing → synced`, with `syncing → queued` on error (retry with backoff: 10 s, 30 s, 2 min, 10 min) and `syncing → failed` after 5 attempts. `failed → queued` when the user taps Retry. Synced reports are read-only. The server has no status column.

**IDs.** Reports and photos get UUIDs on the phone. The server ignores a second upload with the same UUID.

**AI suggestions never decide.** The suggested category is shown with its confidence; the user always confirms. Store `suggested_category`, `suggestion_confidence` and `model_version` with each report.

**Privacy.** Classification runs on the device; report text never goes to an outside AI service. Never log report descriptions, emails or locations.

**Native performance.** Camera frame analysis runs in native code (Kotlin/Swift frame processor), never in JavaScript. Analyse the Y plane downscaled to about 160×120, throttled to about 10 fps. Preview must stay at 30 fps.

## Data model

| Entity | Key fields |
| --- | --- |
| User | id, email, name, role (worker / supervisor), site_ids |
| Site | id, name, latitude, longitude |
| Report | id, type (incident / inspection), site_id, user_id, category, severity, occurred_at, description, people_involved, area, inspection_result, latitude, longitude, location_accuracy_m, location_text, suggested_category, suggestion_confidence, model_version, status, sync_attempts, last_error, created_at, updated_at, synced_at |
| Photo | id, report_id, local_uri, remote_path, width, height, brightness_score, sharpness_score, low_quality, upload_status, created_at |

Row-level security: workers read and write only their own reports; supervisors read reports for their sites.

**Incident categories:** Injury, Near miss, Hazard, Equipment or property damage, Vehicle or mobile plant, Environmental, Fire, Other.
**Severity:** Low, Medium, High, Critical.

## Code conventions

- TypeScript strict; no `any` without a comment explaining why
- Keep business logic in hooks and services under `src/features`, not in route files, so it can be unit tested
- Functional components and hooks only
- Validate forms with a schema (zod) shared between form and database layer
- Touch targets at least 48 dp; every interactive control has an accessibility label
- Prefer small, focused files; colocate tests as `*.test.ts(x)`
- Record significant decisions as short notes in `docs/decisions/NNN-title.md`

## Workflow

- Work is tracked as GitHub Issues: stories `US-xx`, tasks `T-xx`, grouped into 4 phase milestones
- One branch per issue: `feat/us-04-incident-form`, `chore/t-02-ci`, `fix/...`
- Conventional commits: `feat:`, `fix:`, `test:`, `docs:`, `chore:`, `refactor:`
- Every change goes through a PR with `Closes #<issue>`, a short description and a screenshot or video for UI changes
- CI (lint, typecheck, tests) must be green before merge

## Definition of done

- Every acceptance criterion in the issue is met on a real Android device (and iOS from week 7)
- Unit tests cover the logic; CI is green
- Works in airplane mode where the story involves field workers
- Accessibility labels added for new controls
- PR description explains what changed

## Working with Claude in this repo

- Before starting an issue, read its acceptance criteria and the matching story in `docs/requirements.md`, then propose a short plan
- Background is senior Android/Kotlin: skip explanations of Kotlin, coroutines or general mobile architecture, and focus on where React Native/Expo idioms diverge from native Android
- Don't add new dependencies without saying why and naming the alternative
- Don't change the data model, report lifecycle or sync rules without flagging it first
- Write tests alongside code, not afterwards
- Keep the backend thin: if something can live on the phone, it should
