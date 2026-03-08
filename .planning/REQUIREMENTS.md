# Requirements: ClearPath

**Defined:** 2026-03-07
**Core Value:** SMB owners can instantly understand what compliance obligations apply to them and what they need to do next — no legal expertise required.

## v1 Requirements

### Authentication & Session

- [ ] **AUTH-01**: User can sign up with email and password via Supabase Auth
- [ ] **AUTH-02**: User receives email verification after signup
- [ ] **AUTH-03**: User can log in and receive a valid JWT session
- [ ] **AUTH-04**: User session persists across browser refresh
- [ ] **AUTH-05**: User can reset password via email link
- [ ] **AUTH-06**: Protected routes redirect unauthenticated users to login

### Business Onboarding

- [ ] **ONBD-01**: New user completes onboarding wizard capturing industry, state(s), employee count, and entity type
- [ ] **ONBD-02**: Onboarding wizard completes in under 2 minutes (max 5 steps)
- [ ] **ONBD-03**: Business profile is persisted to Supabase and accessible via API
- [ ] **ONBD-04**: User can edit business profile from settings after onboarding
- [ ] **ONBD-05**: Completing onboarding triggers rule engine to generate initial compliance requirements

### Regulation Data Pipeline

- [ ] **DATA-01**: Celery worker ingests federal regulations from GovInfo API
- [ ] **DATA-02**: Celery worker ingests OSHA regulations from public feeds
- [ ] **DATA-03**: Ingested regulations are chunked, embedded (OpenAI text-embedding), and stored in pgvector
- [ ] **DATA-04**: Each regulation chunk has metadata: jurisdiction, industry tags, effective date, source URL
- [ ] **DATA-05**: Pipeline runs on a scheduled basis to pick up new/updated regulations
- [ ] **DATA-06**: Regulation corpus covers at minimum federal + 2-3 target states
- [ ] **DATA-07**: Ingestion includes change detection to avoid re-embedding unchanged content

### Risk Center & Rule Engine

- [ ] **RISK-01**: Rule engine queries pgvector filtered by user's state and industry to produce a tailored requirements list
- [ ] **RISK-02**: Risk Center displays compliance gaps grouped by category (Health, Labor, Tax, Licensing, Privacy)
- [ ] **RISK-03**: Each risk item shows plain-English explanation, severity level, and actionable next step
- [ ] **RISK-04**: Aggregate compliance score (0-100) computed from docs uploaded, deadlines met, and risk flags resolved
- [ ] **RISK-05**: Score breakdown is transparent — user can see what factors contribute
- [ ] **RISK-06**: Risk report updates when user uploads documents or completes tasks

### Dashboard

- [ ] **DASH-01**: Dashboard shows compliance score widget with radial chart
- [ ] **DASH-02**: Dashboard shows risk overview cards grouped by category with alert counts
- [ ] **DASH-03**: Dashboard shows upcoming deadlines (next 7 days)
- [ ] **DASH-04**: Dashboard shows live regulatory news feed filtered by user's industry and state
- [ ] **DASH-05**: Dashboard shows onboarding progress / next-steps panel for new users
- [ ] **DASH-06**: Dashboard data loads via concurrent API calls with loading states

### Calendar & Alerts

- [ ] **CAL-01**: Calendar displays compliance deadlines in month, week, and list views
- [ ] **CAL-02**: Deadlines are auto-populated from rule engine based on business profile
- [ ] **CAL-03**: User can manually create, edit, and delete tasks
- [ ] **CAL-04**: User can mark tasks as complete or snooze them
- [ ] **CAL-05**: Tasks are color-coded by urgency (overdue, upcoming, done)
- [ ] **CAL-06**: Celery worker sends email reminders at 7-day and 1-day intervals before due date
- [ ] **CAL-07**: Overdue tasks trigger follow-up email alerts

### Document Vault

- [ ] **VAULT-01**: User can upload documents via drag-and-drop or file picker
- [ ] **VAULT-02**: Documents stored in Supabase Storage with metadata in Postgres
- [ ] **VAULT-03**: Documents organized by category folders (Licenses, Permits, Insurance, SOPs, Training)
- [ ] **VAULT-04**: Each document tracks expiration date with visual indicators for expiring/expired
- [ ] **VAULT-05**: User can search documents by name and category
- [ ] **VAULT-06**: User can download documents via signed URL
- [ ] **VAULT-07**: Uploaded documents are parsed and embedded into pgvector for ClearBot RAG context

### ClearBot AI Assistant

- [ ] **BOT-01**: Floating chat button accessible from every page
- [ ] **BOT-02**: User can ask compliance questions in natural language
- [ ] **BOT-03**: ClearBot uses RAG: embeds query, searches pgvector (filtered by user's jurisdiction/industry), passes context to GPT-4o
- [ ] **BOT-04**: Responses stream in real-time via FastAPI StreamingResponse
- [ ] **BOT-05**: Every response includes source citations (regulation name, section, source URL)
- [ ] **BOT-06**: Responses include contextual action links ("Add to Tasks", "Upload Document", "View in Risk Center")
- [ ] **BOT-07**: Prominent "not legal advice" disclaimer on chat interface
- [ ] **BOT-08**: Confidence gating — low-confidence answers display a warning and suggest consulting a professional

### UI & Infrastructure

- [ ] **UI-01**: App shell with top navigation bar, brand logo, and user profile menu
- [ ] **UI-02**: Client-side routing between all feature pages
- [ ] **UI-03**: Fully responsive layout (mobile, tablet, desktop)
- [ ] **UI-04**: Consistent design system using Tailwind theme tokens (colors, spacing, typography)
- [ ] **UI-05**: Page transitions and micro-interactions via framer-motion
- [ ] **UI-06**: Loading skeletons and error states for all async data

## v2 Requirements

### Team Management

- **TEAM-01**: Business owner can invite team members by email
- **TEAM-02**: Role-based access control (owner, manager, viewer)
- **TEAM-03**: Task assignment to team members
- **TEAM-04**: Activity log per user

### Compliance Audit Tool

- **AUDIT-01**: Progressive questionnaire wizard by compliance category
- **AUDIT-02**: Save and resume audit progress
- **AUDIT-03**: Audit results feed into compliance score

### Integrations & Settings

- **INTG-01**: OAuth connections to QuickBooks, Google Calendar
- **INTG-02**: Notification preference management
- **INTG-03**: Billing management via Stripe

### Reports & Templates

- **RPT-01**: One-click compliance status PDF export
- **RPT-02**: Auto-customized checklist templates by business type and state
- **RPT-03**: Pre-filled regulatory forms

## Out of Scope

| Feature | Reason |
|---------|--------|
| Native mobile app | Web-first; responsive design covers mobile use cases |
| Expert marketplace | Supply-side marketplace is a separate product; use Calendly link as placeholder |
| Compliance insurance | Requires insurer partnerships and months of BD; collect risk data now, monetize later |
| White-label enterprise | Different product with multi-tenant architecture; premature before PMF |
| State portal submission | Government portals are unreliable and vary by jurisdiction; generate pre-filled PDFs instead |
| Email document ingestion | NLP parsing nightmare across formats; manual upload is sufficient for v1 |
| Real-time collaborative editing | No multi-user in v1; defer with team management |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | — | Pending |
| AUTH-02 | — | Pending |
| AUTH-03 | — | Pending |
| AUTH-04 | — | Pending |
| AUTH-05 | — | Pending |
| AUTH-06 | — | Pending |
| ONBD-01 | — | Pending |
| ONBD-02 | — | Pending |
| ONBD-03 | — | Pending |
| ONBD-04 | — | Pending |
| ONBD-05 | — | Pending |
| DATA-01 | — | Pending |
| DATA-02 | — | Pending |
| DATA-03 | — | Pending |
| DATA-04 | — | Pending |
| DATA-05 | — | Pending |
| DATA-06 | — | Pending |
| DATA-07 | — | Pending |
| RISK-01 | — | Pending |
| RISK-02 | — | Pending |
| RISK-03 | — | Pending |
| RISK-04 | — | Pending |
| RISK-05 | — | Pending |
| RISK-06 | — | Pending |
| DASH-01 | — | Pending |
| DASH-02 | — | Pending |
| DASH-03 | — | Pending |
| DASH-04 | — | Pending |
| DASH-05 | — | Pending |
| DASH-06 | — | Pending |
| CAL-01 | — | Pending |
| CAL-02 | — | Pending |
| CAL-03 | — | Pending |
| CAL-04 | — | Pending |
| CAL-05 | — | Pending |
| CAL-06 | — | Pending |
| CAL-07 | — | Pending |
| VAULT-01 | — | Pending |
| VAULT-02 | — | Pending |
| VAULT-03 | — | Pending |
| VAULT-04 | — | Pending |
| VAULT-05 | — | Pending |
| VAULT-06 | — | Pending |
| VAULT-07 | — | Pending |
| BOT-01 | — | Pending |
| BOT-02 | — | Pending |
| BOT-03 | — | Pending |
| BOT-04 | — | Pending |
| BOT-05 | — | Pending |
| BOT-06 | — | Pending |
| BOT-07 | — | Pending |
| BOT-08 | — | Pending |
| UI-01 | — | Pending |
| UI-02 | — | Pending |
| UI-03 | — | Pending |
| UI-04 | — | Pending |
| UI-05 | — | Pending |
| UI-06 | — | Pending |

**Coverage:**
- v1 requirements: 52 total
- Mapped to phases: 0
- Unmapped: 52 (will be mapped during roadmap creation)

---
*Requirements defined: 2026-03-07*
*Last updated: 2026-03-07 after initial definition*
