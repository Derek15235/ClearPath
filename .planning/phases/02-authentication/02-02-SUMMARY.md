---
phase: 02-authentication
plan: 02
subsystem: auth
tags: [supabase, react, react-hook-form, zustand, vitest, route-guard]

# Dependency graph
requires:
  - phase: 02-authentication
    provides: Supabase client singleton, Zustand auth store with initAuth(), Supabase mock, test stubs
  - phase: 01-app-shell
    provides: Card, Button, Input, PageSkeleton, AppLayout, routes.tsx, main.tsx
provides:
  - AuthPage with login/signup/verify-email/reset-password card-swap state machine
  - RequireAuth route guard (PageSkeleton while loading, redirect if no session, Outlet if authenticated)
  - AuthCallbackPage for Supabase email callback URL processing
  - Protected routing with /auth outside guard, all app routes behind RequireAuth
  - Logout functionality in UserProfileMenu
  - Session persistence via initAuth() called before first render
affects: [phase-3-api-endpoints, phase-4-regulation-pipeline]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Card-swap state machine with AuthView union type", "initAuth() before createRoot for flash-free auth", "Supabase mock in layout tests via vi.mock"]

key-files:
  created:
    - frontend/src/pages/AuthPage.tsx
    - frontend/src/components/auth/RequireAuth.tsx
    - frontend/src/pages/AuthCallbackPage.tsx
  modified:
    - frontend/src/app/routes.tsx
    - frontend/src/main.tsx
    - frontend/src/components/layout/UserProfileMenu.tsx
    - frontend/src/pages/__tests__/AuthPage.test.tsx
    - frontend/src/components/auth/__tests__/RequireAuth.test.tsx
    - frontend/src/components/layout/__tests__/AppLayout.test.tsx
    - frontend/src/components/layout/__tests__/TopNavigationBar.test.tsx

key-decisions:
  - "Card padding='none' with className p-6 to avoid conflicting Tailwind padding classes"
  - "AuthPage uses named export with lazy().then() wrapper in routes.tsx since other pages use default export"
  - "initAuth() called before createRoot in main.tsx -- prevents PageSkeleton flash for authenticated users on refresh"

patterns-established:
  - "Auth view state machine: union type AuthView with useState for card-swap UI"
  - "Layout tests must vi.mock supabase since UserProfileMenu now transitively imports it"
  - "Route guard pattern: RequireAuth as parent route element wrapping AppLayout"

requirements-completed: [AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06]

# Metrics
duration: 4min
completed: 2026-03-08
---

# Phase 02 Plan 02: Frontend Auth Flows Summary

**AuthPage with login/signup/verify-email/reset-password card swap, RequireAuth guard, callback page, and protected routing**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-09T02:33:44Z
- **Completed:** 2026-03-09T02:37:55Z
- **Tasks:** 3 (automated) + 1 checkpoint (pending)
- **Files modified:** 10

## Accomplishments
- AuthPage component with four-view card-swap state machine (login, signup, verify-email, reset-password)
- RequireAuth route guard with PageSkeleton loading state, redirect to /auth, and Outlet rendering
- AuthCallbackPage for processing Supabase email verification and password recovery callbacks
- Protected routing: /auth and /auth/callback outside guard, all app routes behind RequireAuth
- Logout wired in UserProfileMenu with supabase.auth.signOut() and navigate to /auth
- Session persistence: initAuth() called before createRoot prevents auth flash on refresh
- Full test suite: 49 tests passing across 9 test files (12 new auth tests added)

## Task Commits

Each task was committed atomically:

1. **Task 1: AuthPage tests (RED)** - `9ca7195` (test)
2. **Task 1: AuthPage implementation (GREEN)** - `6fda2e9` (feat)
3. **Task 2: RequireAuth tests (RED)** - `29a6ecf` (test)
4. **Task 2: RequireAuth + AuthCallbackPage (GREEN)** - `b6d52c4` (feat)
5. **Task 3: Wire routes, initAuth, logout** - `d4eb63c` (feat)

_TDD tasks have separate RED and GREEN commits_

## Files Created/Modified
- `frontend/src/pages/AuthPage.tsx` - Single /auth route with login/signup/verify-email/reset-password card-swap
- `frontend/src/components/auth/RequireAuth.tsx` - Route guard: PageSkeleton/redirect/Outlet
- `frontend/src/pages/AuthCallbackPage.tsx` - Supabase email callback processing
- `frontend/src/app/routes.tsx` - Updated router with RequireAuth guarding app routes
- `frontend/src/main.tsx` - initAuth() before createRoot
- `frontend/src/components/layout/UserProfileMenu.tsx` - signOut handler on Sign out item
- `frontend/src/pages/__tests__/AuthPage.test.tsx` - 9 tests for AuthPage flows
- `frontend/src/components/auth/__tests__/RequireAuth.test.tsx` - 3 tests for guard behavior
- `frontend/src/components/layout/__tests__/AppLayout.test.tsx` - Added supabase mock
- `frontend/src/components/layout/__tests__/TopNavigationBar.test.tsx` - Added supabase mock

## Decisions Made
- Card uses `padding="none"` with `className="p-6 space-y-5"` to avoid conflicting Tailwind padding classes from the default md padding
- AuthPage uses named export (`export function AuthPage`) with `lazy().then(m => ({ default: m.AuthPage }))` in routes since other pages use default export pattern
- initAuth() is called before createRoot (not inside React tree) to ensure session is resolved before RequireAuth evaluates, preventing any flash

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added supabase mock to layout tests**
- **Found during:** Task 3 (Wire routes)
- **Issue:** UserProfileMenu now imports supabase, causing AppLayout and TopNavigationBar tests to fail with "supabaseUrl is required" since they transitively import the real Supabase client
- **Fix:** Added `vi.mock('../../../lib/supabase', () => ({ supabase: mockSupabase }))` to both layout test files
- **Files modified:** AppLayout.test.tsx, TopNavigationBar.test.tsx
- **Verification:** Full test suite passes (49/49 tests)
- **Committed in:** d4eb63c (Task 3 commit)

**2. [Rule 1 - Bug] Fixed PageSkeleton role query in RequireAuth test**
- **Found during:** Task 2 GREEN phase
- **Issue:** `getByRole('status', { name: /loading/i })` matched multiple elements because PageSkeleton contains nested Skeleton components each with `role="status"` and `aria-label="Loading..."`
- **Fix:** Changed query to `getByRole('status', { name: /loading page/i })` to match the outer PageSkeleton element specifically
- **Files modified:** RequireAuth.test.tsx
- **Verification:** All 3 RequireAuth tests pass
- **Committed in:** b6d52c4 (Task 2 GREEN commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for test correctness. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required

**External services require manual configuration.** Same Supabase project from Plan 02-01:
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `frontend/.env.local`
- `SUPABASE_JWT_SECRET` in `backend/.env`
- Redirect URLs configured in Supabase Auth settings

## Next Phase Readiness
- Complete auth system ready for Phase 3 API endpoints
- RequireAuth guard protects all app routes
- Backend JWT middleware ready for protected API routes
- Human verification checkpoint pending for live Supabase testing

---
*Phase: 02-authentication*
*Completed: 2026-03-08*
