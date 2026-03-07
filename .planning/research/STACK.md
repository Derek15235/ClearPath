# Technology Stack

**Project:** ClearPath -- AI-Driven Compliance Navigator for SMBs
**Researched:** 2026-03-07
**Overall confidence:** MEDIUM (versions based on training data up to May 2025; live verification of exact latest versions was unavailable -- verify with `pip index versions` / `npm view` before installing)

---

## Recommended Stack

The team's pre-selected stack is fundamentally sound. FastAPI + Supabase + LangChain + React/Vite/TypeScript is the dominant pattern for AI-powered SaaS in 2025-2026. Below I validate each choice, pin recommended versions, flag concerns, and add critical missing pieces.

---

### Backend Core

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Python** | 3.12+ | Runtime | 3.12 is the sweet spot: stable, fast (10-15% speedup over 3.11 from PEP 709 inlining), full async support. 3.11 is acceptable floor but 3.12 is preferred. | HIGH |
| **FastAPI** | ~0.115+ | HTTP framework | Best Python framework for this use case: native async, automatic OpenAPI docs, Pydantic v2 validation, streaming response support (critical for ClearBot). No real competitor for AI SaaS backends. | HIGH |
| **Pydantic** | v2 (2.x) | Data validation | Pydantic v2 is 5-50x faster than v1 (Rust core). FastAPI 0.100+ requires Pydantic v2. Use `model_validator` not deprecated `validator`. | HIGH |
| **Uvicorn** | 0.30+ | ASGI server | Standard production server for FastAPI. Use `--workers N` for multi-process in production behind a reverse proxy. | HIGH |

### Database & Storage

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Supabase** | Latest cloud | BaaS platform | Provides PostgreSQL, Auth, Storage, Edge Functions in one platform. Dramatically reduces infrastructure complexity for an MVP. Correct choice for speed-to-market. | HIGH |
| **PostgreSQL** | 15+ (Supabase-managed) | Primary database | Supabase runs PG 15. Relational data + pgvector in same DB eliminates data sync issues. Row Level Security (RLS) adds defense-in-depth. | HIGH |
| **pgvector** | 0.7+ | Vector similarity search | Correct choice over Pinecone. Keeps vectors co-located with relational data. Supports HNSW indexing (0.5+) for sub-10ms queries at scale. For MVP volume (<100K vectors), performance is excellent. | HIGH |
| **Supabase Auth** | Built-in | Authentication | JWT-based auth with social providers, magic links, email/password. FastAPI validates JWTs server-side. Eliminates building auth from scratch. | HIGH |
| **Supabase Storage** | Built-in | File storage | S3-compatible object storage with signed URLs and RLS policies. Perfect for Document Vault. | HIGH |
| **Redis** | 7.x | Cache + message broker | Celery broker, session cache, rate limiting. Use managed Redis (Upstash serverless Redis or Railway) to avoid ops burden. | HIGH |

### AI / ML Pipeline

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **OpenAI Python SDK** | 1.x (>=1.30) | GPT-4o API client | The v1.x SDK is a complete rewrite (async-native, Pydantic models, streaming). Do NOT use openai<1.0 -- it is fundamentally different. Pin `openai>=1.30`. | HIGH |
| **LangChain** | 0.3.x | RAG orchestration | **CAUTION: LangChain has undergone major restructuring.** As of late 2024/early 2025, the project split into `langchain-core`, `langchain-community`, and provider-specific packages like `langchain-openai`. Use `langchain>=0.3` and `langchain-openai` for the OpenAI integration. Do NOT use `langchain<0.2` -- the API surface changed significantly. | MEDIUM |
| **langchain-openai** | Latest | OpenAI LangChain integration | Separated from main langchain package. Required for `ChatOpenAI`, `OpenAIEmbeddings`. | MEDIUM |
| **tiktoken** | 0.7+ | Token counting | Essential for managing context windows. Count tokens before sending to GPT-4o to avoid truncation/billing surprises. | HIGH |

**LangChain architecture note:** The Backend_Plan.md mentions using LangChain for the RAG pipeline. This is reasonable for MVP but adds complexity. An alternative is to build a lightweight RAG pipeline directly using the OpenAI SDK + pgvector queries (essentially: embed query -> vector search -> format prompt -> call GPT-4o). LangChain adds value if you need: conversation memory management, tool/function calling chains, or complex multi-step reasoning. For v1, consider starting with a thin custom RAG layer and introducing LangChain only when chain complexity demands it.

### Background Jobs

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Celery** | 5.4+ | Task queue | Standard Python task queue. Handles: deadline alert scheduling, PDF text extraction, regulation data ingestion, embedding generation. Works well with Redis broker. | HIGH |
| **celery-beat** | (bundled with Celery) | Periodic tasks | Cron-like scheduling for regulation feed polling, deadline reminders. Use `django-celery-beat` alternative: `redbeat` for Redis-based schedule storage (no Django dependency). | MEDIUM |

### ORM & Database Access

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **SQLAlchemy** | 2.0+ | Async ORM | Use SQLAlchemy 2.0 style (not legacy 1.x patterns). The 2.0 API is cleaner with proper type hints and async session support. Use `asyncpg` as the async PostgreSQL driver. | HIGH |
| **Alembic** | 1.13+ | Database migrations | Standard migration tool for SQLAlchemy. Essential -- do NOT rely on Supabase dashboard for schema changes in a team setting. | HIGH |
| **asyncpg** | 0.29+ | Async PG driver | Fastest Python PostgreSQL driver. Required for SQLAlchemy async operations. | HIGH |
| **supabase-py** | 2.x | Supabase client | Use for Auth token verification, Storage operations, and simple CRUD where SQLAlchemy is overkill. Do NOT use for complex joins -- use SQLAlchemy for those. | MEDIUM |

### Infrastructure & DevOps

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Docker** | Latest | Containerization | Standardize dev environment: FastAPI + Celery worker + Redis in docker-compose. | HIGH |
| **docker-compose** | v2 | Local orchestration | Single `docker compose up` for the entire backend stack locally. | HIGH |
| **Ruff** | 0.5+ | Linting + formatting | Replaces flake8, isort, black in one tool. 10-100x faster (Rust-based). Use as pre-commit hook. | HIGH |
| **pytest** | 8.x | Testing | Use `pytest-asyncio` for async test support, `httpx` for FastAPI test client (not `requests`). | HIGH |
| **httpx** | 0.27+ | HTTP client + testing | Async HTTP client. Use as FastAPI test client (`AsyncClient`) instead of the sync `TestClient`. Also useful for calling external regulation APIs. | HIGH |

---

### Frontend Core

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **React** | 18.3.x | UI framework | React 18 is the correct choice for this project. React 19 was released in late 2024 but the ecosystem (React Router, Radix UI, Framer Motion, etc.) may still have compatibility edges. Stick with React 18 for stability. Migrate to 19 in v2 when the ecosystem has fully caught up. | HIGH |
| **Vite** | 6.x | Build tool | Vite 6 is the latest stable. Fastest DX for React+TS projects. Use `@vitejs/plugin-react` (SWC variant: `@vitejs/plugin-react-swc` for even faster builds). | MEDIUM |
| **TypeScript** | 5.5+ | Type safety | Use strict mode (`"strict": true` in tsconfig). TypeScript 5.5+ has inferred type predicates which improve DX. | HIGH |

### Frontend Styling & Components

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Tailwind CSS** | v3.4.x | Utility CSS | **Stick with v3, not v4.** Tailwind v4 (released early 2025) is a major rewrite with a new CSS-first configuration approach and breaking changes. The ecosystem of plugins, component libraries, and Radix UI integration patterns are mature on v3. Migrating to v4 mid-project is disruptive. Pin v3.4.x. | HIGH |
| **Radix UI** | Latest primitives | Accessible components | Correct choice. Unstyled, accessible primitives (Dialog, Dropdown, Tabs, Tooltip, etc.) that pair perfectly with Tailwind. Use individual packages like `@radix-ui/react-dialog`, not a monolith. | HIGH |
| **lucide-react** | Latest | Icons | Lightweight, tree-shakeable SVG icons. Better than heroicons for this stack (more icons, consistent style). | HIGH |

### Frontend State & Data

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Zustand** | 5.x | Client state | Correct choice over Redux. Minimal boilerplate, TypeScript-native, works great for local UI state (calendar, wizard, chat). | HIGH |
| **TanStack Query (React Query)** | v5 | Server state | **CRITICAL ADDITION.** The plans mention Zustand for state but do not mention a server state library. You MUST add TanStack Query for: API response caching, background refetching, optimistic updates, loading/error states. Without it, you will reinvent 80% of its features poorly using useEffect+useState. This is the single most impactful addition to the frontend stack. | HIGH |
| **@supabase/supabase-js** | 2.x | Supabase client | Auth session management, realtime subscriptions, direct storage operations from frontend. | HIGH |
| **react-router-dom** | v6 (6.20+) | Routing | Standard React SPA routing. Use data loaders pattern from v6.4+ for route-level data fetching. React Router 7 exists but is a Remix merge -- overkill for this SPA. | HIGH |

### Frontend Visualization & Animation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **recharts** | 2.x | Charts | Good choice for the compliance score gauges and risk visualization. Built on D3, React-native API. Sufficient for dashboard charts. | HIGH |
| **framer-motion** | 11.x | Animations | Correct choice. Page transitions, chat window slide-up, card hover effects, list animations. Note: Framer Motion rebranded to just "Motion" in some contexts -- the npm package is still `framer-motion`. | HIGH |

### Frontend Utilities

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **react-dropzone** | 14.x | File upload | Drag-and-drop file upload for Document Vault. Pairs with Supabase Storage upload. | HIGH |
| **date-fns** | 3.x | Date manipulation | For calendar, deadline formatting, relative time display. Lighter than moment.js or dayjs for tree-shaking. | HIGH |
| **react-hot-toast** or **sonner** | Latest | Toast notifications | Needed for upload confirmations, alert dismissals, error feedback. Sonner is the more modern choice with better animations. | MEDIUM |
| **react-markdown** | 9.x | Markdown rendering | ClearBot responses will include formatted text, lists, links. Render AI output as markdown. | HIGH |
| **zod** | 3.x | Schema validation | Frontend form validation. Pairs with TypeScript for type-safe forms. Use with a form library. | HIGH |
| **react-hook-form** | 7.x | Form management | For onboarding flow, settings forms, audit wizard. Lightweight, performant, great with Zod via `@hookform/resolvers`. | HIGH |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Backend Framework | FastAPI | Django REST Framework | Django adds ORM overhead (we use SQLAlchemy), no native async streaming, heavier for AI-first workloads. FastAPI's async-native design is essential for streaming ClearBot responses. |
| Backend Framework | FastAPI | Node.js/Express or Hono | Python ecosystem is dramatically better for AI/ML (OpenAI SDK, LangChain, sentence-transformers, etc.). Would need to call Python services separately, adding complexity. |
| Vector DB | pgvector | Pinecone | Extra service, extra cost, extra auth. pgvector keeps vectors co-located with relational data. For MVP volume (<500K vectors), pgvector with HNSW indexes matches Pinecone performance. Pinecone only makes sense at millions of vectors with complex filtering. |
| Vector DB | pgvector | ChromaDB | ChromaDB is an in-process/single-server vector DB. Not suitable for production SaaS -- no managed hosting, no concurrent access, no backup story. |
| RAG Orchestration | LangChain (or custom thin layer) | LlamaIndex | LlamaIndex is more focused on document indexing/RAG. LangChain is more general-purpose for agent chains. Either works, but LangChain has broader community and more patterns for conversational AI. However, see note above about considering a custom thin layer for v1. |
| Frontend Framework | React 18 | Next.js | ClearPath is a dashboard SPA behind auth -- SEO is irrelevant for the app itself. Next.js adds SSR complexity with no benefit. Marketing/landing page can be a separate static site. |
| Frontend State | Zustand + TanStack Query | Redux Toolkit + RTK Query | Works fine but significantly more boilerplate. Zustand + TanStack Query achieves the same with less code and better DX. |
| CSS | Tailwind v3 | Tailwind v4 | v4 is a major rewrite with breaking config changes. Ecosystem (Radix patterns, component examples) is mature on v3. No benefit to early-adopting v4 for this project. |
| Task Queue | Celery | Dramatiq | Dramatiq is simpler but less battle-tested at scale. Celery has far more documentation, monitoring tools (Flower), and community patterns for scheduled tasks. |
| Task Queue | Celery | ARQ (async Redis queue) | ARQ is lighter but lacks Celery Beat equivalent for periodic scheduling, which is critical for deadline alerts and regulation polling. |
| Auth | Supabase Auth | Auth0 / Clerk | Extra vendor, extra cost. Supabase Auth is already included in the platform and handles email/password, OAuth, magic links. Clerk has better UI components but adds a dependency when Supabase already provides what we need. |

---

## Critical Missing Pieces (Not in Original Plans)

These are technologies/libraries absent from the Backend_Plan.md and FrontEnd_Plan.md that are essential or highly recommended.

### Must-Have Additions

| Library | Purpose | Why Critical |
|---------|---------|-------------|
| **TanStack Query v5** (frontend) | Server state management | Without it, every API call requires manual loading/error/caching logic. This is the #1 gap in the current frontend plan. |
| **Alembic** (backend) | Database migrations | The backend plan mentions SQLAlchemy but not Alembic. Schema changes without migration tooling will cause deployment pain. |
| **httpx** (backend) | Async HTTP client | Needed for calling external regulation APIs (GovInfo, OSHA) asynchronously from FastAPI endpoints and Celery tasks. |
| **tiktoken** (backend) | Token counting | Essential for managing GPT-4o context windows in the RAG pipeline. Prevents silent truncation and billing surprises. |
| **python-multipart** (backend) | File upload parsing | Required by FastAPI for handling file uploads (Document Vault). FastAPI will throw a runtime error without it. |
| **zod + react-hook-form** (frontend) | Form validation | Onboarding wizard, settings forms, and audit tool all need structured form handling. |

### Should-Have Additions

| Library | Purpose | Why Valuable |
|---------|---------|-------------|
| **Sentry** (both) | Error monitoring | Production error tracking. `sentry-sdk[fastapi]` for backend, `@sentry/react` for frontend. Essential before any real users. |
| **structlog** (backend) | Structured logging | JSON-formatted logs for production debugging. Replaces print-statement debugging. |
| **python-jose[cryptography]** or **PyJWT** (backend) | JWT decoding | For verifying Supabase Auth JWTs server-side in FastAPI middleware. |
| **tenacity** (backend) | Retry logic | Exponential backoff for OpenAI API calls and external regulation API fetches. APIs fail; retries are essential. |
| **slowapi** (backend) | Rate limiting | Protect AI chat endpoint from abuse. Based on `limits` library, integrates natively with FastAPI. |
| **react-markdown + remark-gfm** (frontend) | Markdown rendering | ClearBot AI responses need rich text rendering (code blocks, tables, links). |
| **sonner** (frontend) | Toast notifications | Missing from frontend plan. Every action (upload, save, error) needs user feedback. |

---

## Version Pinning Strategy

**IMPORTANT:** All version numbers below are based on training data (knowledge cutoff May 2025). Before creating `requirements.txt` and `package.json`, verify exact latest versions with:

```bash
# Backend
pip index versions fastapi
pip index versions langchain
pip index versions openai

# Frontend
npm view react version
npm view vite version
npm view @tanstack/react-query version
```

### Backend requirements.txt (recommended starting point)

```txt
# Core
fastapi>=0.115.0
uvicorn[standard]>=0.30.0
pydantic>=2.7.0
python-multipart>=0.0.9

# Database
sqlalchemy[asyncio]>=2.0.30
asyncpg>=0.29.0
alembic>=1.13.0
supabase>=2.0.0

# AI Pipeline
openai>=1.30.0
langchain>=0.3.0
langchain-openai>=0.2.0
langchain-community>=0.3.0
tiktoken>=0.7.0

# Background Jobs
celery[redis]>=5.4.0
redis>=5.0.0

# HTTP & External APIs
httpx>=0.27.0

# Auth & Security
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4

# Utilities
tenacity>=8.3.0
structlog>=24.1.0
slowapi>=0.1.9

# Monitoring
sentry-sdk[fastapi]>=2.0.0

# Dev
pytest>=8.0.0
pytest-asyncio>=0.23.0
ruff>=0.5.0
```

### Frontend package.json dependencies (recommended)

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.26.0",
    "@supabase/supabase-js": "^2.45.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.50.0",
    "recharts": "^2.12.0",
    "framer-motion": "^11.3.0",
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.23.0",
    "react-dropzone": "^14.2.0",
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",
    "date-fns": "^3.6.0",
    "sonner": "^1.5.0",
    "lucide-react": "^0.400.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-progress": "^1.1.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^6.0.0",
    "@vitejs/plugin-react-swc": "^4.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "eslint": "^9.0.0",
    "@sentry/react": "^8.0.0",
    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0"
  }
}
```

---

## Architecture Decisions Validated

| Decision from Plans | Verdict | Notes |
|---------------------|---------|-------|
| FastAPI over Laravel | **Correct.** | Python AI ecosystem (OpenAI, LangChain, tiktoken, sentence-transformers) is unmatched. Laravel would require calling Python microservices for all AI features. |
| pgvector over Pinecone | **Correct for MVP.** | Eliminates a separate service. Revisit only if vector count exceeds ~1M and query latency degrades. |
| Supabase as BaaS | **Correct.** | Auth + Storage + PostgreSQL + pgvector in one platform. Massive time savings. Be aware of Supabase connection pooling limits on free/pro tiers. |
| SQLAlchemy 2.0 + supabase-py dual access | **Correct but clarify boundaries.** | Use SQLAlchemy for all complex queries, joins, and business logic. Use supabase-py only for Auth JWT verification and Storage operations. Do NOT mix both for the same table operations. |
| React 18 (not 19) | **Correct.** | Ecosystem compatibility with Radix UI, Framer Motion, React Router v6 is proven on React 18. |
| Tailwind v3 (not v4) | **Correct.** | v4 migration is disruptive and ecosystem patterns are v3-oriented. |
| Celery + Redis | **Correct.** | Battle-tested for: deadline reminders, regulation feed polling, PDF text extraction, embedding generation. |

---

## Key Warnings

1. **LangChain version churn:** LangChain's API has changed dramatically across 0.1 -> 0.2 -> 0.3. Any tutorial or example older than 6 months may use deprecated patterns. Always check imports against current docs. The split into `langchain-core`, `langchain-openai`, `langchain-community` is the new reality.

2. **Supabase connection pooling:** Supabase free tier has a 60-connection limit. With FastAPI async + Celery workers, you can hit this. Use Supabase's transaction pooler (port 6543) and configure SQLAlchemy's `pool_size` carefully.

3. **OpenAI SDK v1 vs v0:** The openai v1.x SDK is a complete rewrite. `openai.ChatCompletion.create()` is GONE. New pattern is `client.chat.completions.create()`. Any code using the old API will not work.

4. **Streaming responses:** ClearBot requires streaming (SSE). FastAPI supports this via `StreamingResponse`, and the OpenAI v1 SDK supports streaming natively. But TanStack Query does not handle streaming -- use a custom hook with `fetch` + `ReadableStream` for the chat endpoint.

5. **React Context vs Zustand:** The Frontend_Plan.md mentions React Context for "global state (Supabase Session, User Profile, Theme)." This is fine for auth context but use Zustand or TanStack Query for everything else. React Context causes unnecessary re-renders when context values change.

---

## Sources & Confidence Notes

| Source Type | What It Informed | Confidence Impact |
|-------------|-----------------|-------------------|
| Training data (May 2025) | Version numbers, API patterns, ecosystem status | MEDIUM -- versions are approximate; verify before pinning |
| Project documents (read directly) | Architecture decisions, feature requirements | HIGH -- authoritative for project context |
| General ecosystem knowledge | Library comparisons, anti-patterns, missing pieces | HIGH -- core architectural patterns are stable |

**Recommendation:** Before writing the first line of code, run `pip index versions <pkg>` and `npm view <pkg> version` for every dependency to confirm exact latest stable versions. The version ranges above are minimum floors that should be safe.
