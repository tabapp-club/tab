# Repository Guidelines

## Project Structure & Module Organization
- `src/app` hosts App Router segments such as `dashboard`, `workflow-automation`, and `settings`; route-specific layouts live beside `page.tsx`.
- `src/components` holds shared UI (sidebar, analytics cards, dialogs), with domain folders when the component set grows.
- `src/constants`, `src/contexts`, `src/hooks`, and `src/lib` collect reusable data, providers, hooks, and utilities like `config.ts`.
- `public` contains static assets (icons, OG images, manifests); keep generated exports here.
- Tests are not yet centralized—when adding them, prefer co-locating near source under `__tests__` to match the App Router structure.

## Build, Test, and Development Commands
- `npm install` installs dependencies; rerun after dependency bumps.
- `npm run dev` starts Next.js locally on `http://localhost:3000`.
- `npm run build` creates a production bundle used by CI and preview deployments.
- `npm run start` serves the production build; run this when verifying deployment fixes.
- `npm run lint` executes `eslint-config-next` with the repo overrides.

## Coding Style & Naming Conventions
- TypeScript is strict; prefer typed props and avoid `any` unless justified (rule is relaxed but document intent in code review).
- Components and React hooks use PascalCase (`SidebarMenu.tsx`) and `use`-prefixed camelCase (`useWorkflowData.ts`); utility modules use camelCase file names.
- Tailwind CSS powers styling; keep class lists readable by grouping layout → spacing → color.
- Import shared modules with the `@/` alias instead of relative paths, mirroring the `tsconfig` path mapping.
- Format using your editor’s Prettier defaults (2-space indent) and confirm ESLint passes before pushing.

## Testing Guidelines
- No automated test runner ships yet; at minimum run `npm run lint` and smoke-test core flows (dashboard metrics, campaign creation, auth redirects) in both desktop and mobile viewports.
- When adding tests, prefer React Testing Library or Playwright and align file names with the component under test (e.g. `DashboardContent.test.tsx`).
- Capture new fixtures or mock data within component directories to keep routes portable.

## Commit & Pull Request Guidelines
- Follow Conventional Commit prefixes (`feat:`, `refactor:`, `fix:`) as seen in recent history (`e8bbf78` etc.).
- Limit commits to focused scopes; include context about affected routes or components in the subject line.
- Pull requests should describe the change, list test commands executed, link any issue, and attach before/after screenshots for UI updates.
- Verify the app with `npm run build` before requesting review, especially for routing or config changes.

## Security & Configuration Tips
- Store API settings in `.env.local`, e.g. `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_API_TIMEOUT`; never commit environment files.
- Default fallbacks in `src/lib/config.ts` target production; override them for staging to avoid accidental writes.
- Review third-party key usage (WhatsApp, SMS, email) documented in `WORKFLOW_AUTOMATION.md` before enabling new integrations.
