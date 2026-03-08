# Phase 1: App Shell and Infrastructure - Research

**Researched:** 2026-03-08
**Domain:** React SPA scaffolding, routing, responsive layout, design system, animation
**Confidence:** HIGH

## Summary

Phase 1 is a greenfield React frontend build. The project directory currently contains only planning docs and remnant Laravel configuration from a scrapped backend — no frontend code exists yet. The entire frontend must be scaffolded from scratch using Vite + React 18 + TypeScript + Tailwind CSS v3, with routing via react-router-dom v6, animations via the `motion` package (formerly Framer Motion), accessible primitives from Radix UI, and icons from Lucide React.

The user has locked a dark-mode-only aesthetic inspired by Linear, with emerald green (#059669 range) as the primary color. Typography, background shades, accent color derivation, animation intensity, and loading skeleton design are at Claude's discretion.

All version numbers in this document were verified against live npm registry on 2026-03-08 and carry HIGH confidence.

**Primary recommendation:** Scaffold with `npm create vite@latest` using the `react-ts` template, then layer Tailwind v3 (pinned as `tailwindcss@3`, darkMode set to `'selector'`), react-router-dom v6 with `createBrowserRouter`, the `motion` npm package for page transitions, and build a focused set of shared UI components (Button, Card, Input, Modal, Skeleton, ErrorState) using Tailwind utility classes + Radix UI primitives.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Brand & Color Palette:**
  - Mood: Trust & authority — professional, clean, serious
  - Primary color: Emerald green (#059669 range) — conveys "all clear" / compliant, pairs with dark backgrounds
  - Theme: Dark mode only — no light mode toggle needed for v1
  - Accent colors: Claude to derive from emerald green (success/warning/error semantics)
- **Page Density & Layout:**
  - Density: Balanced — moderate whitespace, not too spacious, not cramped
  - Layout: Constrained container (max-w-7xl mx-auto) centered on page
  - Cards: Rounded with subtle shadows (rounded-xl + shadow) — floating card aesthetic
  - Visual reference: Linear — clean, fast, opinionated, dark theme done right
- **Navigation:**
  - Sticky top navigation bar per FrontEnd_Plan.md (locked from instruction docs)
  - Backdrop blur effect on scroll (backdrop-blur-md)
  - Brand logo left, nav links center/left, user profile menu right
  - Nav links: Dashboard, Calendar, Vault, Risk Center (map to routes)

### Claude's Discretion

- Exact typography scale (font family, sizes, weights)
- Accent/semantic color palette derivation from emerald
- Dark theme background shades (slate vs zinc vs neutral)
- Animation intensity for framer-motion transitions
- Loading skeleton design and error state styling
- Empty page placeholder content and layout
- Icon style consistency with lucide-react

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UI-01 | App shell with top navigation bar, brand logo, and user profile menu | TopNavigationBar with Radix DropdownMenu for profile menu; sticky positioning with backdrop-blur; BrandLogo text component |
| UI-02 | Client-side routing between all feature pages | react-router-dom v6 `createBrowserRouter` with `React.lazy()` + `Suspense` for code-split page components |
| UI-03 | Fully responsive layout (mobile, tablet, desktop) | Tailwind responsive prefixes (sm/md/lg); mobile hamburger menu via `Menu` icon from lucide-react; `max-w-7xl` container in AppLayout |
| UI-04 | Consistent design system using Tailwind theme tokens | Custom `tailwind.config.ts` with emerald primary palette, slate surface scale, semantic color tokens, Inter font; `cn()` utility for class merging |
| UI-05 | Page transitions and micro-interactions via framer-motion | `motion` package (import from `motion/react`); `AnimatePresence` + `motion.div` wrapping router Outlet; subtle 0.15s opacity+y transitions |
| UI-06 | Loading skeletons and error states for all async data | `Skeleton` component using Tailwind `animate-pulse`; `react-error-boundary` for error states; `EmptyState` placeholders per page |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^18.3.1 | UI framework | Stable ecosystem; React 19 ecosystem compatibility still maturing with Radix UI and Motion |
| Vite | ^7.3.1 | Build tool + dev server | Fastest DX for React+TS; native ESM dev server; Rollup-based production builds |
| TypeScript | ^5.5.0 | Type safety | Strict mode catches errors early; 5.5+ inferred type predicates improve component typing |
| Tailwind CSS | ^3.4.19 | Utility-first CSS | v3.4 is stable and ecosystem-mature; v4 has breaking CSS-first config; pin with `tailwindcss@3` |
| react-router-dom | ^6.30.3 | Client-side routing | v6 with `createBrowserRouter`; v7 merges Remix complexity unnecessary for this SPA |
| motion | ^12.35.1 | Animations and transitions | Successor to framer-motion; same API; import from `motion/react`; `AnimatePresence` for route transitions |
| lucide-react | ^0.577.0 | Icon library | 1000+ tree-shakeable SVG icons; consistent stroke style; TypeScript typed |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-dropdown-menu | ^2.1.16 | Accessible dropdown primitive | UserProfileMenu — handles keyboard nav, focus management, ARIA, portal rendering |
| @radix-ui/react-dialog | ^1.1.15 | Accessible modal primitive | Modal component in design system — focus trapping, escape-to-close, scroll lock |
| react-error-boundary | ^6.1.1 | Declarative error boundaries | Wraps every page; provides `<ErrorBoundary>` and `useErrorBoundary` hook without class components |
| clsx | ^2.1.1 | Conditional className strings | Used inside the `cn()` utility for conditional class logic |
| tailwind-merge | ^3.5.0 | Tailwind class conflict resolution | Used inside the `cn()` utility to deduplicate conflicting Tailwind classes |
| @vitejs/plugin-react-swc | ^4.2.3 | Vite SWC plugin | SWC-based Fast Refresh; faster than Babel variant; used in `vite.config.ts` |
| postcss | ^8.4.0 | CSS processing pipeline | Required by Tailwind CSS v3 |
| autoprefixer | ^10.4.0 | CSS vendor prefixes | Required by Tailwind CSS v3 for cross-browser compatibility |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `motion` package | `framer-motion` | Identical code — `framer-motion` is now a re-export of `motion`; use `motion` for all new projects |
| react-router-dom v6 | react-router v7 | v7 merges Remix data patterns; no benefit for a pure SPA with no SSR needs |
| Custom Skeleton component | `react-loading-skeleton` | Extra dependency for functionality Tailwind `animate-pulse` covers adequately |
| Individual `@radix-ui/*` packages | Unified `radix-ui` package | Unified package (v1.4+) available but individual packages provide better tree-shaking |
| Tailwind CSS v3 | Tailwind CSS v4 | v4 has CSS-first config and breaking changes from v3; ecosystem patterns all target v3; no benefit here |

**Installation (complete set):**
```bash
# Scaffold frontend app
npm create vite@latest frontend -- --template react-ts
cd frontend

# Production dependencies
npm install react-router-dom motion lucide-react react-error-boundary clsx tailwind-merge
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog

# Dev dependencies
npm install -D tailwindcss@3 postcss autoprefixer @vitejs/plugin-react-swc
npm install -D @types/react @types/react-dom typescript

# Initialize Tailwind (creates tailwind.config.js and postcss.config.js)
npx tailwindcss init -p

# Rename config to TypeScript for consistency
mv tailwind.config.js tailwind.config.ts

# Test tooling
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom
```

## Architecture Patterns

### Recommended Project Structure

```
frontend/
  src/
    app/
      App.tsx                  # Root: RouterProvider + any future global providers
      routes.tsx               # Route tree: createBrowserRouter + lazy-loaded pages
    components/
      layout/
        AppLayout.tsx          # Authenticated shell: TopNav + AnimatePresence Outlet
        TopNavigationBar.tsx   # Sticky nav: logo, links, profile menu
        MobileNav.tsx          # Hamburger sheet for small viewports
        UserProfileMenu.tsx    # Radix DropdownMenu (placeholder in Phase 1)
        BrandLogo.tsx          # Text-based logo component
      ui/
        Button.tsx             # Design system button with variant + size props
        Card.tsx               # Rounded elevated card container
        Input.tsx              # Styled text input with label and error state
        Modal.tsx              # Radix Dialog wrapped with design tokens
        Skeleton.tsx           # Loading placeholder (animate-pulse) + PageSkeleton
        ErrorState.tsx         # Error display with optional retry action
        EmptyState.tsx         # "Coming soon" placeholder for Phase 1 pages
        Badge.tsx              # Status badge (success/warning/error variants)
        PageHeader.tsx         # Consistent page heading + description block
    pages/
      DashboardPage.tsx        # Placeholder with EmptyState
      CalendarPage.tsx         # Placeholder with EmptyState
      VaultPage.tsx            # Placeholder with EmptyState
      RiskCenterPage.tsx       # Placeholder with EmptyState
      NotFoundPage.tsx         # 404 page
    lib/
      cn.ts                    # className merge utility (clsx + tailwind-merge)
    types/
      index.ts                 # Shared TypeScript interfaces and type aliases
    styles/
      globals.css              # Tailwind directives + @layer base scrollbar styles
    test/
      setup.ts                 # Testing Library setup (cleanup + jest-dom matchers)
  index.html                   # Root HTML — Inter font link, no dark class needed (default palette is dark)
  tailwind.config.ts           # Theme tokens: colors, fontFamily, fontSize, shadows
  tsconfig.json                # Strict mode TypeScript
  tsconfig.node.json           # Vite config TypeScript
  vite.config.ts               # Vite + SWC plugin + test config
```

### Pattern 1: Dark-Mode-Only Theme via Tailwind

**What:** Since there is no light mode, define dark colors as the DEFAULT theme colors. Avoid `dark:` prefixes entirely — every utility class just uses the named token directly. The `darkMode: 'selector'` config is only needed if you ever want Radix UI dark variants; for this project you can omit it entirely.

**When to use:** Always — this is the only theme.

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand — Emerald green (#059669 range)
        primary: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',  // Brand primary action color
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Semantic colors — derived from compliance context
        success: {
          DEFAULT: '#10b981',  // emerald-500
          light:   '#34d399',  // emerald-400
          dark:    '#047857',  // emerald-700
        },
        warning: {
          DEFAULT: '#f59e0b',  // amber-500
          light:   '#fbbf24',  // amber-400
          dark:    '#d97706',  // amber-600
        },
        error: {
          DEFAULT: '#ef4444',  // red-500
          light:   '#f87171',  // red-400
          dark:    '#dc2626',  // red-600
        },
        // Surfaces — Slate palette (cool-toned dark pairs well with emerald)
        surface: {
          DEFAULT: '#0f172a',  // slate-900 — page background
          raised:  '#1e293b',  // slate-800 — cards, panels
          overlay: '#334155',  // slate-700 — modals, dropdowns, hover states
        },
        // Text hierarchy
        content: {
          DEFAULT:   '#f8fafc',  // slate-50  — primary text
          secondary: '#94a3b8',  // slate-400 — secondary/label text
          muted:     '#64748b',  // slate-500 — disabled/placeholder text
        },
        // Borders
        border: {
          DEFAULT: '#1e293b',  // slate-800 — default subtle border
          strong:  '#334155',  // slate-700 — emphasized border
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem',     { lineHeight: '1.5rem' }],
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':  ['2.25rem',  { lineHeight: '2.5rem' }],
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgb(0 0 0 / 0.3), 0 1px 2px -1px rgb(0 0 0 / 0.3)',
        'card-lg': '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
        'nav':     '0 1px 0 0 rgb(30 41 59 / 1)',  // matches border-DEFAULT
      },
    },
  },
  plugins: [],
}

export default config
```

**Font loading — add to `index.html` `<head>`:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Pattern 2: globals.css Base Styles

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply antialiased;
  }

  body {
    @apply bg-surface text-content font-sans;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';  /* Inter stylistic alternates */
  }

  /* Dark scrollbar to match theme */
  ::-webkit-scrollbar       { @apply w-1.5; }
  ::-webkit-scrollbar-track { @apply bg-surface; }
  ::-webkit-scrollbar-thumb { @apply bg-surface-overlay rounded-full hover:bg-border-strong; }

  /* Focus ring using brand primary */
  *:focus-visible {
    @apply outline-none ring-2 ring-primary-500 ring-offset-2 ring-offset-surface;
  }
}
```

### Pattern 3: createBrowserRouter with Lazy-Loaded Routes

**What:** Use React Router v6's `createBrowserRouter` with `React.lazy()` for per-page code splitting. Each page chunk loads only when navigated to.

**When to use:** All route definitions — never use `<BrowserRouter>` with `createBrowserRouter`.

```typescript
// src/app/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { PageSkeleton } from '../components/ui/Skeleton'

// Each lazy() call produces a separate JS chunk
const DashboardPage   = lazy(() => import('../pages/DashboardPage'))
const CalendarPage    = lazy(() => import('../pages/CalendarPage'))
const VaultPage       = lazy(() => import('../pages/VaultPage'))
const RiskCenterPage  = lazy(() => import('../pages/RiskCenterPage'))
const NotFoundPage    = lazy(() => import('../pages/NotFoundPage'))

const withSuspense = (Page: React.ComponentType) => (
  <Suspense fallback={<PageSkeleton />}>
    <Page />
  </Suspense>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard',   element: withSuspense(DashboardPage) },
      { path: 'calendar',    element: withSuspense(CalendarPage) },
      { path: 'vault',       element: withSuspense(VaultPage) },
      { path: 'risk-center', element: withSuspense(RiskCenterPage) },
      { path: '*',           element: withSuspense(NotFoundPage) },
    ],
  },
])
```

```typescript
// src/app/App.tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'

export function App() {
  return <RouterProvider router={router} />
}
```

### Pattern 4: Page Transitions with Motion + React Router

**What:** `AnimatePresence` in AppLayout holds the exiting page in the DOM long enough to play its exit animation before the entering page mounts. The `key={location.pathname}` change tells React to unmount/remount the `motion.div`, triggering the transition.

**When to use:** AppLayout only — wraps the `<Outlet />`.

```typescript
// src/components/layout/AppLayout.tsx
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { TopNavigationBar } from './TopNavigationBar'

// Transition config: subtle Linear-inspired fade+slide
const pageVariants = {
  initial:  { opacity: 0, y: 8 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -8 },
}

const pageTransition = {
  duration: 0.15,
  ease: 'easeInOut',
}

export function AppLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface text-content">
      <TopNavigationBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
```

**Animation intensity guidance:** Keep transitions at 0.15s, y-offset of 8px maximum. Linear's feel is instant and snappy — transitions communicate state change, not draw attention to themselves. Do not use spring physics or large displacements for page transitions.

### Pattern 5: Sticky TopNavigationBar with Backdrop Blur

**What:** Fixed top bar using `sticky top-0 z-50` with a semi-transparent background and `backdrop-blur-md` for the glass effect the user locked in.

```typescript
// src/components/layout/TopNavigationBar.tsx
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Calendar, FolderLock, ShieldAlert, Menu, X } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { UserProfileMenu } from './UserProfileMenu'
import { MobileNav } from './MobileNav'

export const NAV_LINKS = [
  { to: '/dashboard',   label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/calendar',    label: 'Calendar',   icon: Calendar },
  { to: '/vault',       label: 'Vault',      icon: FolderLock },
  { to: '/risk-center', label: 'Risk Center',icon: ShieldAlert },
] as const

export function TopNavigationBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Left: Logo */}
            <BrandLogo />

            {/* Center-left: Desktop nav (hidden below md) */}
            <nav className="hidden md:flex items-center gap-1 ml-8">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-600/10 text-primary-400'
                        : 'text-content-secondary hover:text-content hover:bg-surface-raised',
                    ].join(' ')
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* Right: Profile menu + mobile hamburger */}
            <div className="flex items-center gap-2">
              <UserProfileMenu />
              <button
                className="md:hidden p-2 rounded-lg text-content-secondary
                  hover:text-content hover:bg-surface-raised transition-colors"
                onClick={() => setMobileOpen(v => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile nav panel */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
```

### Pattern 6: Mobile Nav Panel

**What:** A simple slide-down panel that appears below the header on mobile. No drawer library needed.

```typescript
// src/components/layout/MobileNav.tsx
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { NAV_LINKS } from './TopNavigationBar'

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.12 }}
          className="md:hidden bg-surface border-b border-border px-4 py-3 space-y-1 z-40"
        >
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-600/10 text-primary-400'
                    : 'text-content-secondary hover:text-content hover:bg-surface-raised',
                ].join(' ')
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Pattern 7: className Merge Utility

**What:** Every component that accepts a `className` prop uses this utility. It combines `clsx` (conditional class logic) with `tailwind-merge` (resolves conflicting Tailwind utilities like `px-2` and `px-4`).

```typescript
// src/lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Anti-Patterns to Avoid

- **Using `dark:` prefixes on every class:** Since this is dark-only, define dark colors as the default palette. Avoid `bg-slate-900 dark:bg-slate-900` duplication.
- **Using `<BrowserRouter>` alongside `createBrowserRouter`:** Mutually exclusive APIs. Use `<RouterProvider router={router} />` only.
- **Installing both `framer-motion` and `motion`:** They are the same package. `framer-motion` re-exports `motion`. Install only `motion`, import from `motion/react`.
- **Skipping the mobile nav:** The `hidden md:flex` pattern on desktop nav leaves mobile users with no navigation. Always implement `MobileNav` in the same plan as the desktop nav.
- **Defining container width in individual pages:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` lives in `AppLayout`'s `<main>`, not inside each page component. Pages should not manage their own width.
- **Copying page placeholders without a shared PageHeader:** Each placeholder page must use the same `<PageHeader>` component. Inconsistent spacing between placeholder pages creates visual noise.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible dropdown menus | Custom div + onBlur/onKeyDown | `@radix-ui/react-dropdown-menu` | Keyboard navigation, roving focus, ARIA roles, portal rendering, outside-click handling all need to work together — extremely difficult to get right |
| Accessible modal/dialog | Custom z-index overlay | `@radix-ui/react-dialog` | Focus trapping, scroll locking, escape-to-close, ARIA `dialog` role, portal rendering |
| Error boundaries | try/catch in render | `react-error-boundary` | Error boundaries require the `getDerivedStateFromError` class lifecycle — not possible with hooks; the library provides a clean declarative API |
| Conflicting class resolution | String concatenation | `clsx` + `tailwind-merge` (via `cn`) | Two `px-*` classes applied = last one wins in CSS, not in DOM order — `twMerge` resolves this correctly |
| Page exit animations | CSS `@keyframes` + unmount timing | `AnimatePresence` from `motion/react` | React removes unmounted components from DOM immediately; AnimatePresence delays removal until exit animation completes |
| SVG icons | Inline SVG per file | `lucide-react` | 1000+ consistent icons, TypeScript typed, tree-shakeable, color/size via className/props |
| Loading skeleton animation | Custom CSS keyframes | Tailwind `animate-pulse` | Built in, consistent timing, no custom CSS, accessible via `aria-busy` |

**Key insight:** Phase 1 establishes the foundation every future phase builds on. Accessibility and structural correctness here prevent debt accumulation across all 9 phases. Primitives are cheap; retrofitting accessible dropdowns into a shipped codebase is expensive.

## Common Pitfalls

### Pitfall 1: Tailwind Content Paths Miss Files
**What goes wrong:** Custom theme colors and utility classes silently have no effect.
**Why it happens:** Vite scaffold puts components in `src/` but Tailwind content glob doesn't match, or `index.html` is not included.
**How to avoid:** `content` array must include both `'./index.html'` and `'./src/**/*.{js,ts,jsx,tsx}'`. Verify by adding `className="bg-red-500"` to `body` and confirming the page turns red.
**Warning signs:** All colors transparent; no Tailwind classes apply at all.

### Pitfall 2: AnimatePresence + Lazy Routes Cause Sluggish Transitions
**What goes wrong:** Navigation feels slow — there is a visible pause between pages.
**Why it happens:** `mode="wait"` forces exit animation to complete before the entering page starts. If the entering lazy chunk hasn't loaded yet, the sequence is: exit animation → chunk download → enter animation. Three serial steps.
**How to avoid:** Keep exit duration at 100–150ms maximum. For Phase 1's tiny placeholder pages this is not an issue, but establish the 0.15s convention now so it remains fast as real pages are added.
**Warning signs:** Visible blank pause between route changes during development.

### Pitfall 3: Inter Font Fallback to System-UI
**What goes wrong:** Typography falls back to system-ui; the Linear aesthetic is lost.
**Why it happens:** Defining `fontFamily: { sans: ['Inter', ...] }` in Tailwind config does NOT load the font. The config only tells Tailwind what class to generate; the font file must be loaded separately.
**How to avoid:** Add the Google Fonts `<link>` to `index.html` before any stylesheet. Verify in DevTools Computed → `font-family` shows `Inter`.
**Warning signs:** Font looks thicker/different than expected; DevTools shows system-ui is the active font.

### Pitfall 4: nav/content Overlap on Scroll with Sticky Header
**What goes wrong:** Page content slides underneath the sticky header because page top padding is zero.
**Why it happens:** `sticky top-0` removes the header from document flow for scroll purposes but it still visually overlaps content if the main container starts at `top: 0`.
**How to avoid:** `AppLayout`'s `<main>` does not need top padding because the header has fixed height (h-16 = 4rem). The stacking context is correct. But if any page uses `fixed` or `absolute` positioned elements near the top, account for the 64px header height.
**Warning signs:** Page headings appear clipped or obscured by the navigation bar.

### Pitfall 5: TypeScript Strict Mode Disabled Under Pressure
**What goes wrong:** `any` types proliferate; type errors surface at runtime rather than compile time.
**Why it happens:** Vite's default tsconfig has `"strict": true`, but developers sometimes disable individual checks (or all of `strict`) when struggling with a complex type.
**How to avoid:** Keep `"strict": true`. When a type is hard to express, use `unknown` and narrow it — never cast to `any` without a comment explaining why.
**Warning signs:** No TypeScript errors in a file that has clearly wrong prop types. Frequent use of `// @ts-ignore`.

### Pitfall 6: Placeholder Pages Without a Shared PageHeader
**What goes wrong:** Each placeholder page has its own heading style, spacing, and layout — looks inconsistent during navigation.
**Why it happens:** Developers copy-paste and adjust each page independently.
**How to avoid:** Build a `<PageHeader title="..." description="..." />` component and use it identically in every placeholder page. The constrained container lives in `AppLayout`, not pages.
**Warning signs:** Pages have different heading font sizes, different distances from the top nav, different max-widths.

### Pitfall 7: Vite 7 Config Breaking Change
**What goes wrong:** `vite.config.ts` patterns from older tutorials fail with Vite 7.
**Why it happens:** Vite 7 dropped Node 18 support (requires Node 20.19+ or 22.12+), changed some defaults.
**How to avoid:** Ensure Node 20.19+ is installed before scaffolding. Check `node --version` first. Vite 7 is what `npm create vite@latest` will install as of March 2026.
**Warning signs:** `npm create vite@latest` errors on Node version, or dev server refuses to start.

## Code Examples

### cn Utility
```typescript
// src/lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Skeleton Component
```typescript
// src/components/ui/Skeleton.tsx
import { cn } from '../../lib/cn'

interface SkeletonProps {
  className?: string
  'aria-label'?: string
}

export function Skeleton({ className, 'aria-label': ariaLabel }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-label={ariaLabel ?? 'Loading...'}
      className={cn('animate-pulse rounded-lg bg-surface-raised', className)}
    />
  )
}

// Full-page loading placeholder used as Suspense fallback
export function PageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading page...">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
      <Skeleton className="h-64 rounded-xl" />
    </div>
  )
}
```

### ErrorState Component
```typescript
// src/components/ui/ErrorState.tsx
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { cn } from '../../lib/cn'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn('flex flex-col items-center justify-center py-16 text-center', className)}
    >
      <div className="rounded-full bg-error/10 p-4 mb-4">
        <AlertTriangle className="w-8 h-8 text-error" />
      </div>
      <h3 className="text-lg font-semibold text-content mb-2">{title}</h3>
      <p className="text-sm text-content-secondary mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
            bg-surface-raised border border-border text-sm font-medium
            text-content-secondary hover:text-content hover:bg-surface-overlay transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  )
}
```

### Button Component with Variants
```typescript
// src/components/ui/Button.tsx
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?:    ButtonSize
  loading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
  secondary: 'bg-surface-raised text-content border border-border hover:bg-surface-overlay',
  ghost:     'text-content-secondary hover:text-content hover:bg-surface-raised',
  danger:    'bg-error text-white hover:bg-error-dark active:bg-error-dark',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors focus-visible:ring-2 focus-visible:ring-primary-500',
        'focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : children}
    </button>
  )
)
Button.displayName = 'Button'
```

### Card Component
```typescript
// src/components/ui/Card.tsx
import { cn } from '../../lib/cn'
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

const paddingMap = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

export function Card({ className, hover = false, padding = 'md', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-surface-raised border border-border shadow-card',
        paddingMap[padding],
        hover && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-card-lg transition-all duration-150',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

### EmptyState Placeholder
```typescript
// src/components/ui/EmptyState.tsx
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

interface EmptyStateProps {
  icon:        LucideIcon
  title:       string
  description: string
  action?:     React.ReactNode
  className?:  string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-24 text-center', className)}>
      <div className="rounded-2xl bg-surface-raised border border-border p-6 mb-6">
        <Icon className="w-10 h-10 text-content-muted" />
      </div>
      <h2 className="text-xl font-semibold text-content mb-2">{title}</h2>
      <p className="text-sm text-content-secondary max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
```

### PageHeader Component
```typescript
// src/components/ui/PageHeader.tsx
import { cn } from '../../lib/cn'

interface PageHeaderProps {
  title:       string
  description?: string
  actions?:    React.ReactNode
  className?:  string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between mb-8', className)}>
      <div>
        <h1 className="text-2xl font-semibold text-content">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-content-secondary">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
```

### Vitest Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` npm package | `motion` npm package; import from `motion/react` | Nov 2024 | Same API; `framer-motion` still works as a re-export; use `motion` for new projects |
| `<BrowserRouter>` component | `createBrowserRouter` + `<RouterProvider>` | React Router v6.4 (Sep 2022) | Data router pattern with lazy() support; legacy BrowserRouter still works but is not recommended |
| `darkMode: 'class'` config | `darkMode: 'selector'` config | Tailwind v3.4.1 (Jan 2024) | `'selector'` is more flexible; `'class'` still works as alias |
| Create React App (CRA) | Vite | 2022–2023 | CRA is unmaintained; Vite is the universal standard for React scaffolding |
| Vite 5/6 | Vite 7 | 2025–2026 | Vite 7.3.1 is current; Node 20.19+ required; `npm create vite@latest` installs v7 |
| `react-error-boundary` v3/v4 | `react-error-boundary` v6 | 2024–2025 | v6 has improved TypeScript types and `useErrorBoundary` hook |
| `vitest` v1/v2 | `vitest` v4 | 2025 | v4.0.18 is current stable; co-located test config in `vite.config.ts` still works |

**Deprecated/outdated:**
- Create React App: unmaintained, do not use
- `framer-motion` package name: still published but is a re-export; use `motion` for new projects
- `BrowserRouter` component: still works but `createBrowserRouter` is the current recommended API
- `darkMode: 'class'`: still works in Tailwind v3 but `'selector'` is the preferred strategy

## Open Questions

1. **Font loading strategy**
   - What we know: Inter is the correct font for the Linear aesthetic. Can load via Google Fonts CDN or `@fontsource/inter` npm package.
   - What's unclear: Whether to use Google Fonts (simpler, CDN-cached, external request) or `@fontsource/inter` (self-hosted, no external requests, GDPR-compliant).
   - Recommendation: Use Google Fonts link in `index.html` for Phase 1 simplicity. Switch to `@fontsource/inter` if privacy requirements emerge in later phases.

2. **BrandLogo implementation**
   - What we know: No logo asset exists in the project. TopNavigationBar requires a `<BrandLogo>` component.
   - What's unclear: Whether to use styled text only, a simple SVG shield/checkmark icon, or a combined wordmark.
   - Recommendation: Use a text-based wordmark for Phase 1 — `"Clear"` in white + `"Path"` in `text-primary-500`, wrapped in a `<Link to="/">`. A proper logo can replace it in a future phase.

3. **Login route placeholder**
   - What we know: `FrontEnd_Plan.md` lists `/login` as a route. Phase 2 implements auth fully.
   - What's unclear: Whether Phase 1 should stub a `/login` route as a placeholder.
   - Recommendation: Do NOT include `/login` in Phase 1. All routes are accessible without auth in Phase 1 (no guards yet). Phase 2 adds the login page, auth context, and route guards as a complete unit.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.x + @testing-library/react 16.x |
| Config file | `vite.config.ts` — `test` block with jsdom environment |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UI-01 | TopNavigationBar renders logo, 4 nav links, profile menu placeholder | unit | `npx vitest run src/components/layout/__tests__/TopNavigationBar.test.tsx` | Wave 0 |
| UI-02 | Navigating to each route renders the correct page component | integration | `npx vitest run src/app/__tests__/router.test.tsx` | Wave 0 |
| UI-03 | Responsive layout renders correctly at mobile/tablet/desktop | manual-only | DevTools responsive mode — not automatable without Playwright/Cypress | N/A |
| UI-04 | Design system components render with correct Tailwind tokens | unit | `npx vitest run src/components/ui/__tests__/components.test.tsx` | Wave 0 |
| UI-05 | AnimatePresence wraps Outlet; motion.div has correct key prop | unit | `npx vitest run src/components/layout/__tests__/AppLayout.test.tsx` | Wave 0 |
| UI-06 | Skeleton renders animate-pulse; ErrorState renders with retry | unit | `npx vitest run src/components/ui/__tests__/Skeleton.test.tsx` | Wave 0 |

**Note on UI-03:** Responsive layout correctness requires visual inspection at actual viewport sizes. This is a manual verification step at phase gate, not an automated test.

### Sampling Rate

- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

Every item below must be created before implementation begins:

- [ ] `vite.config.ts` — add `test` block (jsdom environment, setupFiles, globals: true)
- [ ] `src/test/setup.ts` — `@testing-library/jest-dom` import + afterEach cleanup
- [ ] Dev dependencies installed: `vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom`
- [ ] `src/components/layout/__tests__/TopNavigationBar.test.tsx` — covers UI-01
- [ ] `src/app/__tests__/router.test.tsx` — covers UI-02
- [ ] `src/components/layout/__tests__/AppLayout.test.tsx` — covers UI-05
- [ ] `src/components/ui/__tests__/components.test.tsx` — covers UI-04, Button, Card, PageHeader
- [ ] `src/components/ui/__tests__/Skeleton.test.tsx` — covers UI-06

## Sources

### Primary (HIGH confidence — live npm verified 2026-03-08)

| Source | Topics Verified |
|--------|----------------|
| `npm view vite version` | v7.3.1 confirmed current |
| `npm view react@18 version` | v18.3.1 is latest v18.x |
| `npm view react-router-dom@6 version` | v6.30.3 is latest v6.x |
| `npm view motion version` | v12.35.1 confirmed current |
| `npm view lucide-react version` | v0.577.0 confirmed current |
| `npm view tailwindcss@3 version` | v3.4.19 is latest v3.x |
| `npm view @radix-ui/react-dialog version` | v1.1.15 confirmed |
| `npm view @radix-ui/react-dropdown-menu version` | v2.1.16 confirmed |
| `npm view react-error-boundary version` | v6.1.1 confirmed current |
| `npm view @vitejs/plugin-react-swc version` | v4.2.3 confirmed |
| `npm view vitest version` | v4.0.18 confirmed current |
| `npm view clsx version` | v2.1.1 confirmed |
| `npm view tailwind-merge version` | v3.5.0 confirmed current |
| [Tailwind CSS v3 Docs — Dark Mode](https://v3.tailwindcss.com/docs/dark-mode) | `darkMode: 'selector'` config |
| [Motion Official Docs](https://motion.dev/docs/react) | `motion/react` import, AnimatePresence, motion components |

### Secondary (MEDIUM confidence)

| Source | Topics |
|--------|--------|
| [Motion Upgrade Guide](https://motion.dev/docs/react-upgrade-guide) | framer-motion to motion migration — confirmed via search results; page content partial |
| [React Router Lazy Loading Blog](https://remix.run/blog/lazy-loading-routes) | `lazy()` route method patterns for v6.9+ |
| [GitHub bvaughn/react-error-boundary](https://github.com/bvaughn/react-error-boundary) | v6 API surface, `useErrorBoundary` hook |

### Tertiary (LOW confidence)

None — all findings either live-verified on npm or confirmed against official documentation.

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|------|-------|--------|
| Standard stack | HIGH | All versions live-verified against npm registry on 2026-03-08 |
| Architecture patterns | HIGH | Patterns follow official React Router, Tailwind CSS v3, and Motion documentation |
| Code examples | HIGH | All examples use verified APIs; no deprecated patterns |
| Common pitfalls | HIGH | Well-documented patterns across official guides and community documentation |
| Version numbers | HIGH | Live npm verification; not based on training data estimates |

**Research date:** 2026-03-08
**Valid until:** 2026-04-08 (30 days — stable ecosystem; no major breaking releases expected in this window)
