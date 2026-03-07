# Research Summary: ClearPath

**Domain:** AI-driven compliance/regtech SaaS for SMBs
**Researched:** 2026-03-07
**Overall confidence:** MEDIUM (training data only -- web search, web fetch, and package registry verification tools were all unavailable; version numbers and pricing are approximate)

## Executive Summary

ClearPath's pre-selected technology stack -- React 18 + Vite + TypeScript + Tailwind v3 + Radix UI on the frontend, FastAPI + Supabase + OpenAI GPT-4o + LangChain on the backend, with Celery + Redis for background processing -- is fundamentally sound and represents the dominant architecture pattern for AI-powered SaaS applications in 2025-2026. The stack choices are validated with no recommended replacements, only targeted additions and version-specific guidance.

The single most impactful gap in the current plans is the absence of **TanStack Query (React Query) v5** on the frontend. Without it, every API call requires manually managing loading states, error handling, caching, and background refetching -- functionality that the team will inevitably reinvent poorly. This is a must-add. Other critical missing pieces include **Alembic** for database migrations (SQLAlchemy without migration tooling is a deployment liability), **tiktoken** for managing GPT-4o context windows, and **react-hook-form + zod** for structured form handling across the onboarding wizard, settings, and audit flows.

The architecture is a clean three-tier system: React SPA communicating with a FastAPI backend that orchestrates business logic, RAG pipeline, and background jobs. Supabase unifies PostgreSQL + pgvector + Auth + Storage into a single platform, dramatically reducing infrastructure complexity for an MVP. The key architectural decision to keep the AI/RAG pipeline inside the FastAPI process (not a separate microservice) is correct for v1 -- it is I/O-bound work that fits async FastAPI well, and premature service extraction would add operational burden with no benefit at MVP scale.

The most significant risk to ClearPath is not technical but data-related: regulation coverage. Federal regulation data is accessible via GovInfo APIs, but state and local regulations -- which matter most to SMBs -- are fragmented across thousands of government websites with no standardized access. The team must scope v1 coverage to 1-2 industries and 2-3 states, or risk building a product that feels empty for most users. AI hallucination in a compliance context is the other existential risk: a single instance of ClearBot giving incorrect legal guidance could destroy the product's credibility and create liability exposure.

## Key Findings

**Stack:** Team's pre-selected stack is validated. Add TanStack Query v5 (frontend server state), Alembic (migrations), tiktoken (token counting), react-hook-form + zod (forms), and Sentry (error monitoring). Stick with React 18 over 19, Tailwind v3 over v4.

**Architecture:** Monolithic FastAPI + Celery workers is the correct v1 architecture. All business data flows through FastAPI -- frontend talks to Supabase directly only for auth and file uploads. RAG pipeline lives in-process, not as a separate service.

**Critical pitfall:** AI hallucination in a liability-critical domain. ClearBot MUST have similarity threshold gating, mandatory source citations, jurisdiction-aware metadata filtering, and a prominent "not legal advice" disclaimer before shipping.

## Implications for Roadmap

Based on research, suggested phase structure:

1. **Foundation & Auth** - Supabase project setup, FastAPI skeleton with dependency injection, React SPA shell with routing, auth middleware
   - Addresses: Authentication, project structure, dev environment
   - Avoids: Rushing to features without solid auth and data access patterns

2. **Business Onboarding + Profile** - Multi-step onboarding wizard, business_profiles table, profile API
   - Addresses: The prerequisite for all personalized features
   - Avoids: Building features that require business context before that context exists

3. **Regulation Data Pipeline** - Celery setup, GovInfo/OSHA ingestion workers, text chunking, embedding generation, pgvector storage
   - Addresses: The data foundation for AI chat and risk scoring
   - Avoids: Building ClearBot or risk engine on empty data (Pitfall 2: coverage illusion)

4. **ClearBot AI Assistant** - RAG retrieval pipeline, streaming chat endpoint, ChatWindow UI
   - Addresses: Primary differentiator, validates embedding quality and RAG pipeline
   - Avoids: LangChain over-abstraction (Pitfall 8) by keeping it selective

5. **Dashboard + Risk Center** - Risk engine scoring, dashboard aggregation, compliance score widget, risk category panels
   - Addresses: Visual compliance overview, gap analysis
   - Avoids: Vanity metric score (Pitfall 6) by using "X of Y known requirements" format

6. **Calendar + Deadline Engine** - Tasks CRUD, calendar grid UI, Celery alert scheduling, email notifications
   - Addresses: Actionable deadline tracking, recurring engagement
   - Avoids: Manual task creation by auto-populating from risk assessment results

7. **Document Vault** - Supabase Storage integration, upload/download, PDF parsing worker, document embeddings
   - Addresses: Document management, enhanced RAG context
   - Avoids: Scope creep by keeping it simple (upload, categorize, track expiration)

**Phase ordering rationale:**
- Auth (Phase 1) and Onboarding (Phase 2) are prerequisites for everything -- every downstream feature requires knowing WHO the user is
- Regulation Pipeline (Phase 3) before ClearBot (Phase 4) because AI chat is useless without real regulation data to retrieve
- ClearBot (Phase 4) before Dashboard (Phase 5) because it validates the hardest technical risk (RAG quality) early
- Dashboard (Phase 5) before Calendar (Phase 6) because auto-generated tasks from risk assessment are more valuable than manual task entry
- Document Vault (Phase 7) last because the core product works without it -- regulations alone power ClearBot and risk scoring

**Research flags for phases:**
- Phase 3: NEEDS DEEPER RESEARCH -- Government API rate limits, data formats, and availability for target states must be verified during implementation. Federal (GovInfo) is well-documented; state/local sources are unpredictable.
- Phase 4: NEEDS DEEPER RESEARCH -- LangChain 0.3+ API surface, optimal prompt engineering for compliance domain, and streaming implementation details should be researched when building the RAG pipeline.
- Phase 5: Standard patterns, unlikely to need research (data aggregation + score computation)
- Phase 6: Standard patterns (CRUD + calendar + Celery scheduling)
- Phase 7: Minor research needed on PDF parsing libraries (pdfplumber vs PyMuPDF vs AWS Textract)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM | Core technology choices validated (HIGH). Version numbers are approximate -- could not verify against live package registries. LangChain version guidance is MEDIUM due to rapid API churn. |
| Features | MEDIUM-HIGH | Feature landscape is well-understood from project docs and regtech domain knowledge. Competitive analysis based on training data (not live-verified). |
| Architecture | HIGH | Architecture patterns (FastAPI DI, RAG pipeline, Celery workers, Supabase integration) are well-established and stable. Unlikely to have changed materially since knowledge cutoff. |
| Pitfalls | HIGH | Hallucination risk, data coverage gaps, and government API fragility are fundamental domain challenges that are stable and well-documented across regtech literature. |

## Gaps to Address

- **Exact package versions:** Run `pip index versions <pkg>` and `npm view <pkg> version` for all dependencies before creating requirements files. Training data versions may be 6-12 months behind.
- **OpenAI pricing:** GPT-4o and embedding model pricing may have changed. Verify current rates before building cost projections.
- **LangChain 0.3 API surface:** The specific imports, class names, and patterns for LangChain 0.3+ should be verified against Context7 or official docs when building the RAG pipeline. The package split (langchain-core, langchain-openai, langchain-community) is confirmed but exact APIs may have evolved.
- **Supabase pgvector capabilities:** Verify current pgvector version on Supabase, HNSW support, and any new vector search features.
- **GovInfo API specifics:** Rate limits, available endpoints, and bulk data formats should be verified during Phase 3 implementation.
- **Target industry + state selection:** The scoping decision (which 1-2 industries and 2-3 states to cover in v1) must be made before building the regulation pipeline. This is a business decision, not a technical one, but it fundamentally affects engineering work.
- **React 19 ecosystem compatibility:** At the time of this research, React 18 was recommended. By the time development reaches the frontend, React 19 ecosystem support (Radix UI, Framer Motion, React Router) should be re-evaluated.
