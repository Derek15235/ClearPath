# Roadmap: ClearPath

## Overview

ClearPath delivers an AI-driven compliance navigator for SMBs in 9 phases. The journey starts with app infrastructure and authentication, builds the business context and regulation data foundations, layers on AI-powered compliance intelligence (ClearBot, Risk Center), then delivers the user-facing surfaces (Calendar, Dashboard) and document management. Each phase delivers a coherent, verifiable capability that unblocks the next.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: App Shell and Infrastructure** - React + Vite + TypeScript project with routing, layout, design system, and dev environment
- [ ] **Phase 2: Authentication** - Supabase Auth integration with signup, login, session persistence, and route protection
- [ ] **Phase 3: Business Onboarding** - Multi-step wizard capturing business profile that seeds all downstream personalization
- [ ] **Phase 4: Regulation Data Pipeline** - Celery workers ingesting, chunking, embedding, and storing federal/state regulations in pgvector
- [ ] **Phase 5: ClearBot AI Assistant** - RAG-powered conversational AI answering compliance questions with citations and guardrails
- [ ] **Phase 6: Risk Center and Rule Engine** - Personalized compliance gap analysis with scoring, categories, and actionable next steps
- [ ] **Phase 7: Calendar and Deadline Engine** - Compliance task management with auto-populated deadlines, calendar views, and email alerts
- [ ] **Phase 8: Dashboard** - Aggregated compliance overview combining score, risks, deadlines, news feed, and onboarding guidance
- [ ] **Phase 9: Document Vault** - Secure document storage with expiration tracking, categorization, and AI-indexing for ClearBot RAG

## Phase Details

### Phase 1: App Shell and Infrastructure
**Goal**: A working React application with navigation, routing, responsive layout, and a consistent design system that all future features plug into
**Depends on**: Nothing (first phase)
**Requirements**: UI-01, UI-02, UI-03, UI-04, UI-05, UI-06
**Success Criteria** (what must be TRUE):
  1. User sees a top navigation bar with brand logo, nav links, and a profile menu placeholder
  2. User can navigate between all feature page routes (dashboard, calendar, vault, risk center) via client-side routing with no full-page reloads
  3. Layout renders correctly on mobile, tablet, and desktop viewports
  4. All pages show loading skeletons while data is pending and meaningful error states when requests fail
  5. Page transitions animate smoothly between routes
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md — Project scaffolding (Vite + React + TypeScript + Tailwind + test infrastructure)
- [ ] 01-02-PLAN.md — App layout shell (TopNavigationBar, routing, responsive layout, page transitions)
- [ ] 01-03-PLAN.md — Design system UI components (Button, Card, Input, Modal, Skeleton, ErrorState, EmptyState, Badge, PageHeader)

### Phase 2: Authentication
**Goal**: Users can securely create accounts, log in, and maintain sessions -- with unauthenticated users blocked from protected pages
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06
**Success Criteria** (what must be TRUE):
  1. User can sign up with email and password, and receives a verification email
  2. User can log in and receives a valid session that persists across browser refresh
  3. User can reset a forgotten password via email link
  4. Unauthenticated users are redirected to the login page when accessing any protected route
  5. FastAPI middleware validates Supabase JWTs and extracts user identity for all API requests
**Plans**: TBD

Plans:
- [ ] 02-01: Supabase Auth setup and FastAPI JWT middleware
- [ ] 02-02: Frontend auth flows (signup, login, password reset, session persistence, route guards)

### Phase 3: Business Onboarding
**Goal**: New users provide their business context (industry, state, size, entity type) which persists as a profile and seeds all downstream personalization
**Depends on**: Phase 2
**Requirements**: ONBD-01, ONBD-02, ONBD-03, ONBD-04, ONBD-05
**Success Criteria** (what must be TRUE):
  1. New user completes a multi-step onboarding wizard (max 5 steps, under 2 minutes) capturing industry, state(s), employee count, and entity type
  2. Business profile is saved to Supabase and retrievable via GET API endpoint
  3. User can edit their business profile from a settings page after initial onboarding
  4. Completing onboarding triggers the rule engine to generate an initial set of compliance requirements for the business
**Plans**: TBD

Plans:
- [ ] 03-01: Business profile API and database schema (FastAPI CRUD + Supabase table + Alembic migration)
- [ ] 03-02: Onboarding wizard UI (multi-step form with react-hook-form + zod validation)
- [ ] 03-03: Post-onboarding trigger and profile editing (rule engine kick-off + settings page)

### Phase 4: Regulation Data Pipeline
**Goal**: Real federal and state regulation data is ingested, chunked, embedded, and searchable in pgvector -- forming the data foundation for ClearBot and Risk Center
**Depends on**: Phase 2 (needs Supabase database; independent of Phase 3 but ordered after it for dependency clarity)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06, DATA-07
**Research flag**: NEEDS DEEPER RESEARCH -- Government API rate limits, data formats, state source availability, and GovInfo bulk data vs. API trade-offs must be verified during planning.
**Success Criteria** (what must be TRUE):
  1. Celery worker successfully ingests federal regulations from GovInfo API and stores them in Supabase
  2. Celery worker successfully ingests OSHA regulations from public feeds
  3. Each ingested regulation is chunked, embedded via OpenAI text-embedding model, and stored in pgvector with metadata (jurisdiction, industry tags, effective date, source URL)
  4. The regulation corpus covers at minimum federal regulations plus 2-3 target states
  5. Pipeline runs on a schedule and uses change detection (source hash comparison) to avoid re-embedding unchanged content
**Plans**: TBD

Plans:
- [ ] 04-01: Celery + Redis infrastructure and worker skeleton
- [ ] 04-02: GovInfo federal regulation ingestion worker
- [ ] 04-03: OSHA and state regulation ingestion workers
- [ ] 04-04: Text chunking, embedding generation, and pgvector storage with metadata
- [ ] 04-05: Scheduled execution, change detection, and ingestion logging

### Phase 5: ClearBot AI Assistant
**Goal**: Users can ask compliance questions in natural language and receive streaming, citation-backed answers grounded in real regulation data -- with guardrails against hallucination
**Depends on**: Phase 4 (needs regulation embeddings in pgvector), Phase 3 (needs business profile for context filtering)
**Requirements**: BOT-01, BOT-02, BOT-03, BOT-04, BOT-05, BOT-06, BOT-07, BOT-08
**Research flag**: NEEDS DEEPER RESEARCH -- LangChain 0.3+ API surface, optimal prompt engineering for compliance domain, streaming implementation patterns, and confidence threshold tuning should be researched during planning.
**Success Criteria** (what must be TRUE):
  1. A floating chat button is visible and accessible from every page in the app
  2. User can type a compliance question and receive a streaming response that renders incrementally
  3. ClearBot retrieves relevant regulation chunks from pgvector filtered by the user's jurisdiction and industry before generating answers
  4. Every response includes source citations with regulation name, section, and source URL
  5. Low-confidence answers (below similarity threshold) display a warning and suggest consulting a professional
  6. A prominent "not legal advice" disclaimer is visible on the chat interface
  7. Responses include contextual action links (e.g., "Add to Tasks", "Upload Document", "View in Risk Center")
**Plans**: TBD

Plans:
- [ ] 05-01: RAG retrieval pipeline (embedding generation, pgvector similarity search with metadata filtering, confidence gating)
- [ ] 05-02: Chat API endpoint with streaming (FastAPI StreamingResponse, prompt construction, GPT-4o integration)
- [ ] 05-03: Chat UI (floating button, ChatWindow, MessageBubble, streaming render, citations, action links, disclaimer)

### Phase 6: Risk Center and Rule Engine
**Goal**: Users see a personalized breakdown of their compliance gaps organized by category, with a transparent compliance score and actionable next steps
**Depends on**: Phase 4 (needs regulation data), Phase 3 (needs business profile)
**Requirements**: RISK-01, RISK-02, RISK-03, RISK-04, RISK-05, RISK-06
**Success Criteria** (what must be TRUE):
  1. Rule engine queries pgvector filtered by user's state and industry to produce a tailored list of compliance requirements
  2. Risk Center displays compliance gaps grouped by category (Health, Labor, Tax, Licensing, Privacy)
  3. Each risk item shows a plain-English explanation, severity level, and actionable next step
  4. An aggregate compliance score (0-100) is computed from documents uploaded, deadlines met, and risk flags resolved -- with a transparent breakdown showing contributing factors
  5. Risk report updates dynamically when user uploads documents or completes tasks
**Plans**: TBD

Plans:
- [ ] 06-01: Rule engine service (pgvector query by business profile, tailored requirements generation)
- [ ] 06-02: Risk scoring engine (compliance score computation, category breakdown, factor transparency)
- [ ] 06-03: Risk Center UI (category tabs, flagged issues list, score display, action CTAs)

### Phase 7: Calendar and Deadline Engine
**Goal**: Users can view, manage, and receive alerts for compliance deadlines -- with tasks auto-populated from the rule engine and manual task creation supported
**Depends on**: Phase 6 (rule engine generates deadlines from compliance requirements)
**Requirements**: CAL-01, CAL-02, CAL-03, CAL-04, CAL-05, CAL-06, CAL-07
**Success Criteria** (what must be TRUE):
  1. Calendar displays compliance deadlines in month, week, and list views
  2. Deadlines are auto-populated from the rule engine based on the user's business profile
  3. User can manually create, edit, delete, complete, and snooze tasks
  4. Tasks are color-coded by urgency (overdue in red, upcoming in yellow, done in green)
  5. Celery worker sends email reminders at 7-day and 1-day intervals before due dates, and follow-up alerts for overdue tasks
**Plans**: TBD

Plans:
- [ ] 07-01: Tasks API (CRUD endpoints, auto-population from rule engine, status management)
- [ ] 07-02: Calendar UI (month/week/list views, CalendarGrid, TaskSidebar, color-coded urgency)
- [ ] 07-03: Email alert system (Celery beat scheduling, 7-day/1-day reminders, overdue follow-ups)

### Phase 8: Dashboard
**Goal**: Users land on a single page that aggregates their compliance health -- score, risk overview, upcoming deadlines, regulatory news, and onboarding guidance
**Depends on**: Phase 6 (compliance score + risk data), Phase 7 (upcoming deadlines), Phase 4 (regulatory news feed)
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06
**Success Criteria** (what must be TRUE):
  1. Dashboard displays the compliance score in a radial chart widget
  2. Dashboard shows risk overview cards grouped by category with alert counts
  3. Dashboard shows the next 7 days of upcoming compliance deadlines
  4. Dashboard shows a live regulatory news feed filtered by the user's industry and state
  5. New users see an onboarding progress / next-steps panel guiding them through setup
  6. Dashboard data loads via concurrent API calls with loading skeletons for each widget
**Plans**: TBD

Plans:
- [ ] 08-01: Dashboard aggregation API (concurrent data assembly endpoint, news feed filtering)
- [ ] 08-02: Dashboard UI (ComplianceScoreWidget, RiskOverviewGrid, DeadlinesList, LiveFeedList, OnboardingPanel, loading states)

### Phase 9: Document Vault
**Goal**: Users can upload, organize, track, and search compliance documents -- with uploaded files automatically parsed and embedded for ClearBot RAG context
**Depends on**: Phase 2 (needs auth + Supabase Storage), Phase 5 (document embeddings enhance ClearBot)
**Requirements**: VAULT-01, VAULT-02, VAULT-03, VAULT-04, VAULT-05, VAULT-06, VAULT-07
**Research flag**: Minor research needed on PDF parsing libraries (pdfplumber vs PyMuPDF) during planning.
**Success Criteria** (what must be TRUE):
  1. User can upload documents via drag-and-drop or file picker, stored in Supabase Storage with metadata in Postgres
  2. Documents are organized by category folders (Licenses, Permits, Insurance, SOPs, Training)
  3. Each document tracks an expiration date with visual indicators for expiring and expired documents
  4. User can search documents by name and category, and download via signed URL
  5. Uploaded documents are automatically parsed and embedded into pgvector, making them available as ClearBot RAG context
**Plans**: TBD

Plans:
- [ ] 09-01: Document API and storage (upload to Supabase Storage, metadata CRUD, signed URL download)
- [ ] 09-02: Document Vault UI (VaultLayout, FolderNav, DocTable, UploadDropzone, search, expiration indicators)
- [ ] 09-03: Document parsing and embedding pipeline (Celery worker for PDF text extraction + embedding into pgvector)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. App Shell and Infrastructure | 1/3 | In progress | - |
| 2. Authentication | 0/2 | Not started | - |
| 3. Business Onboarding | 0/3 | Not started | - |
| 4. Regulation Data Pipeline | 0/5 | Not started | - |
| 5. ClearBot AI Assistant | 0/3 | Not started | - |
| 6. Risk Center and Rule Engine | 0/3 | Not started | - |
| 7. Calendar and Deadline Engine | 0/3 | Not started | - |
| 8. Dashboard | 0/2 | Not started | - |
| 9. Document Vault | 0/3 | Not started | - |
