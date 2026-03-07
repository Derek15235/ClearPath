# ClearPath

## What This Is

An AI-driven compliance navigator for small and mid-sized businesses. ClearPath automatically monitors, explains, and surfaces regulatory compliance requirements tailored to a business's industry, location, and company type. It combines a real-time compliance dashboard, AI chatbot, risk analysis, deadline tracking, and document management into a single SaaS platform.

## Core Value

SMB owners can instantly understand what compliance obligations apply to them and what they need to do next — no legal expertise required.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Authentication via Supabase Auth (signup, login, session management)
- [ ] Personalized compliance dashboard with score, risk overview, and activity feed
- [ ] ClearBot AI assistant using RAG (pgvector + GPT-4o) to answer compliance questions
- [ ] Risk Center showing compliance gaps and risk scores by category
- [ ] Calendar and deadline engine with automated alert scheduling
- [ ] Smart Document Vault with Supabase Storage for licenses, permits, SOPs
- [ ] Live regulation data ingestion pipeline (GovInfo, OSHA feeds, public regulatory APIs)
- [ ] Business onboarding flow to capture industry, location, and company profile

### Out of Scope

- Compliance Audit Tool (progressive questionnaire wizard) — defer to v2
- Team Management / RBAC — defer to v2, single-user for MVP
- Settings & third-party integrations (QuickBooks, payroll, HR) — defer to v2
- Expert Access / premium advisor marketplace — defer to v2
- Compliance Insurance partnerships — defer to v2
- White-labeled enterprise version — defer to v2+
- Mobile app — web-first
- Payments / Stripe billing — defer until post-prototype

## Context

- **Market:** Global regtech market $22B+. Competitors like Vanta ($1.6B) and Navex (>$1.5B acquisition) validate the space, but they target enterprise. SMBs (5-500 employees) are underserved.
- **Target users:** General SMBs across healthcare, finance, construction, food services, education, eCommerce — anyone with regulatory burden. Industry-agnostic at first, specialize later.
- **Go-to-market:** Freemium tier (free deadline tracking) converting to paid dashboards/alerts/AI. Inbound via SEO compliance content.
- **Prior work:** Laravel backend was prototyped but scrapped. Starting fresh with the stack below.
- **Instruction docs:** Detailed frontend and backend implementation plans exist in `/Instructions/` covering component hierarchy, API endpoints, and database schemas.

## Constraints

- **Tech stack (frontend):** React 18 + Vite + TypeScript + Tailwind CSS v3 + Radix UI + Zustand + recharts + framer-motion — per FrontEnd_Plan.md
- **Tech stack (backend):** FastAPI (Python 3.11+) + Supabase (PostgreSQL + pgvector + Auth + Storage) + OpenAI GPT-4o + LangChain — per Backend_Plan.md
- **Background jobs:** Celery + Redis for scheduled alerts and PDF parsing
- **V1 quality bar:** Working prototype — functional UI, real Supabase auth, live regulation data, AI chat working. Demo-able, not yet production-deployed.
- **Regulation data:** Must pull from real sources (GovInfo, OSHA, SEC.gov feeds) from day one, not mock data.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| FastAPI + Supabase over Laravel | Python ecosystem better for AI/ML pipeline; Supabase provides auth + storage + pgvector in one platform | — Pending |
| pgvector over Pinecone | Keep vector search in same database as relational data; simpler architecture, lower cost | — Pending |
| Industry-agnostic v1 | Validate the platform broadly before specializing for specific verticals | — Pending |
| Live regulation data from day one | Core differentiator — AI answers must be grounded in real regulations, not mock data | — Pending |
| Single-user MVP (no team/RBAC) | Reduce v1 complexity; team features deferred to v2 | — Pending |

---
*Last updated: 2026-03-07 after initialization*
