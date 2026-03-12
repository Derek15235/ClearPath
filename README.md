# ClearPath

> **Status: Work in Progress / Experimental**
> This is an active learning project -- things are evolving, breaking, and being rebuilt as I explore new tools. Expect rough edges.

An AI-enhanced compliance navigator that helps small and mid-sized businesses understand their regulatory obligations. Built as a hands-on learning project to get experience with **FastAPI**, **LangChain**, **RAG pipelines**, and modern full-stack architecture.

## What It Does

Small business owners face a maze of federal, state, and industry-specific regulations. ClearPath personalizes that complexity:

1. **Onboarding** -- A multi-step wizard captures the business profile (industry, operating states, size, entity type)
2. **Rule Engine** -- Matches the profile against a regulation database to surface relevant compliance requirements
3. **AI Assistant** *(upcoming)* -- A RAG-powered chatbot that answers compliance questions with cited sources
4. **Risk Center** *(upcoming)* -- Scores compliance gaps and prioritizes what to fix first
5. **Calendar** *(upcoming)* -- Tracks filing deadlines, renewal dates, and regulatory milestones

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Zustand, React Router |
| Backend | FastAPI, SQLAlchemy 2.0 (async), Alembic, Pydantic v2 |
| Auth | Supabase Auth (frontend client + backend JWT/JWKS verification) |
| Database | PostgreSQL (prod), SQLite (dev/test) |
| AI *(planned)* | LangChain, OpenAI embeddings, pgvector for semantic search |
| Testing | Vitest + Testing Library (frontend), pytest-asyncio (backend) |

## Project Structure

```
ClearPath/
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── app/               # Router config with lazy-loaded routes
│   │   ├── components/        # UI primitives, layout shell, auth guards, onboarding steps
│   │   ├── pages/             # Page-level components
│   │   ├── stores/            # Zustand stores (auth, onboarding)
│   │   ├── lib/               # API client, Supabase client, utilities
│   │   └── types/             # Shared TypeScript types + Zod schemas
│   └── vite.config.ts
│
├── backend/                    # FastAPI API server
│   ├── app/
│   │   ├── routers/           # REST endpoints (business profile CRUD, compliance stub)
│   │   ├── models/            # SQLAlchemy models with cross-DB type decorators
│   │   ├── schemas/           # Pydantic request/response schemas
│   │   ├── middleware/        # JWT auth via Supabase JWKS endpoint
│   │   ├── config.py          # Pydantic Settings (reads from root .env)
│   │   └── database.py        # Async engine + session factory
│   ├── alembic/               # Database migrations
│   └── tests/                 # Async test suite with in-memory SQLite fixtures
│
└── .env                        # Shared env vars for frontend + backend (git-ignored)
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- A [Supabase](https://supabase.com) project (free tier works)

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/ClearPath.git
cd ClearPath

# Create .env from the template values below
cp .env.example .env
# Then fill in your Supabase credentials (see Environment Variables below)

# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload    # runs on :8000

# Frontend (in a separate terminal)
cd frontend
npm install
npm run dev                      # runs on :5173
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Frontend (Vite reads VITE_ prefixed vars)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://127.0.0.1:8000

# Backend
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
DATABASE_URL=sqlite+aiosqlite:///./clearpath.db
```

Find these in your Supabase dashboard under **Project Settings > API Keys** and **JWT Keys**.

### Running Tests

```bash
# Backend
cd backend && source .venv/bin/activate
pytest -v                        # 7 tests

# Frontend
cd frontend
npm test                         # Vitest watch mode
```

## What I Built (So Far)

### Backend API (FastAPI + SQLAlchemy)

- **Async CRUD endpoints** for business profiles with proper HTTP semantics (201 on create, 409 on duplicate, 404 on missing)
- **JWT authentication middleware** using Supabase's JWKS endpoint -- supports both ES256 and HS256 key types
- **Cross-database models** with a custom `JSONEncodedList` TypeDecorator that serializes Python lists to JSON text, letting the same model run on PostgreSQL (prod) and SQLite (tests)
- **Alembic migrations** for schema versioning
- **Async test fixtures** with dependency injection overrides for both database sessions and auth

### Frontend (React + TypeScript)

- **5-step onboarding wizard** with animated transitions (Motion/Framer Motion), form state managed in a Zustand store
- **Route protection** via `RequireAuth` that gates on both authentication *and* profile completion
- **Lazy-loaded routes** with code splitting and skeleton loading states
- **Dark-mode design system** built on Tailwind CSS custom theme tokens with Radix UI primitives
- **Settings page** with inline profile editing and optimistic save feedback

### Auth Flow

- Supabase handles signup, login, password reset, and session persistence
- Frontend sends the Supabase JWT to the backend on every API call
- Backend validates tokens by fetching public keys from Supabase's JWKS endpoint (no shared secret needed)
- `RequireAuth` component checks both session validity and profile existence before rendering protected routes

## Architecture Decisions

| Decision | Why |
|----------|-----|
| FastAPI over Django/Flask | Wanted to learn async Python with automatic OpenAPI docs and Pydantic validation |
| SQLAlchemy async + raw SQL migrations | Practice with the ORM layer and manual migration control vs. Django's auto-migrations |
| Supabase for auth + DB | Managed PostgreSQL with pgvector support (needed for Phase 4 RAG), plus built-in auth |
| Zustand over Redux | Minimal boilerplate for the scope of this project |
| JWKS verification over shared secret | Works regardless of Supabase key rotation; no secret syncing needed |
| SQLite for dev | Zero-config local development; models use cross-DB compatible types |

## Roadmap

The project is planned in 9 phases. Phases 1-3 are complete:

- [x] **Phase 1** -- App shell, routing, layout, design system
- [x] **Phase 2** -- Supabase authentication (signup, login, session persistence, route guards)
- [x] **Phase 3** -- Business onboarding wizard, profile API, settings page
- [ ] **Phase 4** -- Regulation data pipeline (Celery workers, text chunking, OpenAI embeddings, pgvector)
- [ ] **Phase 5** -- ClearBot AI assistant (LangChain RAG with cited sources)
- [ ] **Phase 6** -- Risk Center and rule engine (compliance gap scoring)
- [ ] **Phase 7** -- Calendar and deadline engine
- [ ] **Phase 8** -- Dashboard (aggregated compliance overview)
- [ ] **Phase 9** -- Document vault with AI-indexed storage

## What I'm Learning

This project is primarily a vehicle for learning. I'm figuring things out as I go -- the architecture will change as I understand these tools better.

- **FastAPI** -- async request handling, dependency injection, Pydantic v2 schemas, middleware patterns
- **SQLAlchemy 2.0** -- async sessions, declarative models, custom type decorators, Alembic migrations
- **LangChain + RAG** *(next)* -- document loading, text splitting, embedding pipelines, retrieval-augmented generation
- **pgvector** *(next)* -- vector similarity search for matching regulations to business profiles
- **React patterns** -- Zustand for state, lazy routes with Suspense, Radix for accessible UI, Motion for animations

## Disclaimer

This is an experimental/educational project, not production software. I'm using it to learn modern full-stack development patterns and AI tooling. Feedback and suggestions are welcome.
