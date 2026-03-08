# Phase 1: App Shell and Infrastructure - Context

**Gathered:** 2026-03-07
**Status:** Ready for planning

<domain>
## Phase Boundary

A working React 18 + Vite + TypeScript application with navigation, routing between all feature pages, responsive layout, and a consistent design system. This is the skeleton that all future features plug into. No feature logic — just the shell, shared components, and dev environment.

</domain>

<decisions>
## Implementation Decisions

### Brand & Color Palette
- Mood: Trust & authority — professional, clean, serious
- Primary color: Emerald green (#059669 range) — conveys "all clear" / compliant, pairs with dark backgrounds
- Theme: Dark mode only — no light mode toggle needed for v1
- Accent colors: Claude to derive from emerald green (success/warning/error semantics)

### Page Density & Layout
- Density: Balanced — moderate whitespace, not too spacious, not cramped
- Layout: Constrained container (max-w-7xl mx-auto) centered on page
- Cards: Rounded with subtle shadows (rounded-xl + shadow) — floating card aesthetic
- Visual reference: Linear — clean, fast, opinionated, dark theme done right

### Navigation
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

</decisions>

<specifics>
## Specific Ideas

- "Feel like Linear" — clean, fast, opinionated dark UI with minimal decoration
- Emerald green as primary maps naturally to compliance status: green = compliant, amber = warning, red = violation
- Dark mode should feel premium and modern, not just "inverted light mode"

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, starting from scratch

### Established Patterns
- None yet — this phase establishes all patterns

### Integration Points
- FrontEnd_Plan.md defines component hierarchy (TopNavigationBar, BrandLogo, DesktopNav, UserProfileMenu)
- Routing structure: /login, /dashboard, /calendar, /vault, /risk-center (from FrontEnd_Plan.md)
- Tailwind custom theme to be defined in tailwind.config.js (from FrontEnd_Plan.md)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-app-shell-and-infrastructure*
*Context gathered: 2026-03-07*
