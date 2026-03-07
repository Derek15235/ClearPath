# Architecture Patterns

**Domain:** AI-driven compliance navigator SaaS for SMBs
**Researched:** 2026-03-07
**Overall confidence:** MEDIUM-HIGH (based on established patterns for FastAPI, Supabase, pgvector, LangChain, and regtech domain knowledge; web verification tools unavailable)

## Recommended Architecture

ClearPath is a **three-tier AI-augmented SaaS system** with five distinct subsystems that interact through a centralized API layer. The architecture separates concerns into: a React SPA frontend, a FastAPI orchestration backend, a Supabase data platform (auth + relational DB + vector store + file storage), an AI/RAG pipeline, and a background job system.

```
+--------------------------------------------------+
|               React SPA (Vite + TS)              |
|  Dashboard | Calendar | Vault | Risk | ClearBot  |
+-------------------+------------------------------+
                    |
                    | HTTPS (REST + SSE streaming)
                    |
+-------------------v------------------------------+
|            FastAPI Application Server            |
|                                                  |
|  +----------+  +-----------+  +---------------+  |
|  | Auth     |  | Domain    |  | AI Pipeline   |  |
|  | Middleware|  | Services  |  | (LangChain)   |  |
|  +----------+  +-----------+  +---------------+  |
|                                                  |
+---+----------+----------+----------+-------------+
    |          |          |          |
    v          v          v          v
+-------+ +--------+ +--------+ +--------+
|Supabase| |Supabase| |Supabase| | Celery |
| Auth   | |Postgres| |Storage | |+ Redis |
|        | |+pgvec  | |        | |        |
+-------+ +--------+ +--------+ +--------+
                ^
                |
    +-----------+-----------+
    |  Regulation Ingestion |
    |  Pipeline (Celery)    |
    +-----------------------+
         |           |
    +----v---+  +----v----+
    |GovInfo |  |OSHA/SEC |
    |API     |  |Feeds    |
    +--------+  +---------+
```

### System Boundaries: Five Subsystems

1. **Frontend Shell** -- React SPA that handles all UI rendering, client-side routing, and direct Supabase Auth calls
2. **API Orchestration Layer** -- FastAPI backend that owns all business logic, data aggregation, and serves as the single gateway between frontend and data/AI
3. **Data Platform** -- Supabase (Postgres + pgvector + Auth + Storage) as the unified data layer
4. **AI/RAG Pipeline** -- LangChain-orchestrated retrieval and generation, living inside the FastAPI process
5. **Background Job System** -- Celery + Redis for async work: regulation ingestion, deadline alerts, PDF parsing, embedding generation

---

## Component Boundaries

| Component | Responsibility | Communicates With | Protocol |
|-----------|---------------|-------------------|----------|
| **React SPA** | UI rendering, client routing, form state, Supabase Auth session | FastAPI (REST/SSE), Supabase Auth (direct) | HTTPS, Supabase JS SDK |
| **FastAPI App** | Business logic, API gateway, request auth validation, AI orchestration | Supabase Postgres, Supabase Storage, OpenAI API, Redis/Celery | SQL (asyncpg), HTTP, AMQP |
| **Supabase Auth** | User identity, JWT issuance, session management | React SPA (direct), FastAPI (JWT verification only) | Supabase JS SDK, JWT |
| **Supabase Postgres + pgvector** | Relational data, vector embeddings, full-text search | FastAPI (SQLAlchemy async or supabase-py) | SQL over connection pooler |
| **Supabase Storage** | File storage (Document Vault PDFs, licenses) | FastAPI (signed URL generation, upload orchestration) | Supabase Storage API |
| **LangChain RAG Pipeline** | Embedding generation, vector retrieval, prompt construction, LLM calls | pgvector (retrieval), OpenAI API (embeddings + completion) | In-process (Python) |
| **Celery Workers** | Regulation scraping, PDF text extraction, embedding indexing, alert dispatch | Supabase Postgres, OpenAI API, external regulation APIs | Redis (broker), SQL |
| **Redis** | Celery message broker, optional response caching | Celery workers, FastAPI (cache reads) | Redis protocol |

### Critical Boundary Decision: Where Auth Lives

Supabase Auth handles identity (signup, login, magic links, OAuth). The React frontend calls Supabase Auth directly via `@supabase/supabase-js`. FastAPI **never** issues tokens -- it only verifies JWTs from Supabase using the JWT secret. This means:

- Frontend gets the session token from Supabase Auth on login
- Frontend sends `Authorization: Bearer <token>` to every FastAPI request
- FastAPI middleware decodes and validates the JWT, extracts user ID
- FastAPI queries Postgres using that user ID for all data scoping

This is the correct pattern. Do NOT route auth through FastAPI -- it adds latency and complexity for no benefit in an MVP.

### Critical Boundary Decision: Where AI Logic Lives

The LangChain RAG pipeline runs **inside the FastAPI process**, not as a separate microservice. For an MVP/v1:

- Keeps deployment simple (single Python process + workers)
- Avoids inter-service latency for chat responses
- The pipeline is I/O-bound (waiting on OpenAI API, pgvector queries), not CPU-bound, so it works fine in async FastAPI

Only extract AI into a separate service if: (a) you need independent scaling of AI vs. API, or (b) AI inference moves to self-hosted models. Neither applies to v1.

---

## Data Flow

### Flow 1: User Authentication

```
User clicks Login
  -> React SPA calls supabase.auth.signInWithPassword()
  -> Supabase Auth returns JWT + refresh token
  -> React stores session in memory (Supabase JS SDK handles this)
  -> All subsequent API calls include Authorization: Bearer <JWT>
  -> FastAPI middleware validates JWT, extracts user_id
  -> Request proceeds to route handler
```

### Flow 2: Dashboard Load (Data Aggregation)

```
User navigates to /dashboard
  -> React calls GET /api/v1/dashboard/summary (TanStack Query)
  -> FastAPI handler uses asyncio.gather() to concurrently:
     1. Query compliance_score from risk_assessments
     2. Count pending tasks from tasks table
     3. Count risk alerts from risk_assessments
     4. Fetch recent activity from activity_log
  -> Returns aggregated JSON response
  -> React renders ComplianceScoreWidget, RiskOverviewGrid, LiveFeedList
  -> TanStack Query caches for 30s staleTime
```

### Flow 3: ClearBot AI Chat (RAG Pipeline) -- Most Complex Flow

```
User types: "Do I need a food handler certificate in New Jersey?"
  -> React sends POST /api/v1/chat/message { message, conversation_id }
  -> FastAPI:
     1. Load user's business profile (state: NJ, industry: food_services)
     2. Generate embedding of user query via OpenAI Embeddings API
     3. Query pgvector: similarity search on regulation_embeddings table
        - Filter by state = NJ AND (industry = food_services OR industry = general)
        - Return top 5-8 most relevant regulation chunks
        - CHECK similarity threshold (>= 0.75 or respond with uncertainty)
     4. Query user's document vault metadata (what they already have uploaded)
     5. Construct prompt:
        - System: "You are a compliance assistant. Cite regulations by name and section..."
        - Context: [retrieved regulation chunks with source metadata]
        - User: [original question]
     6. Call GPT-4o with streaming enabled
     7. Stream response chunks via FastAPI StreamingResponse (SSE)
  -> React receives chunks via custom useChatStream hook, renders incrementally
  -> On completion, save conversation turn to chat_history table
  -> Citations sent as structured payload after stream completes
```

### Flow 4: Regulation Data Ingestion (Background Pipeline)

```
Celery Beat schedules daily ingestion job
  -> Worker fetches from GovInfo API, OSHA feeds, SEC.gov
  -> For each new/updated regulation:
     1. Parse raw text (HTML/XML/PDF -> clean text)
     2. Chunk text into ~1000-char segments with 200-char overlap
     3. Generate embeddings via OpenAI text-embedding-3-small (batch)
     4. Upsert into regulation_embeddings table (pgvector)
     5. Update regulation_metadata table (source, date, jurisdiction, industry tags)
     6. Compare source_hash to detect changes vs new additions
     7. Log ingestion results to ingestion_log table
  -> On completion, trigger re-scoring for affected businesses
```

### Flow 5: Document Upload + Auto-Indexing

```
User drags PDF into Document Vault
  -> React uploads to Supabase Storage via signed URL
  -> React calls POST /api/v1/documents with metadata (category, expiration_date)
  -> FastAPI saves document record with embedding_status: "pending"
  -> FastAPI dispatches Celery task for background processing
  -> Celery worker:
     1. Downloads file from Supabase Storage
     2. Extracts text (pdfplumber, fallback to OCR via Tesseract)
     3. Validates extraction quality (min text length, character distribution)
     4. Chunks and embeds the text via OpenAI Embeddings API
     5. Stores embeddings in document_embeddings table
     6. Updates document record: embedding_status -> "completed"
  -> Document is now searchable by ClearBot and Risk Center
```

---

## Database Schema Architecture

### Core Tables (Supabase Postgres)

```
business_profiles
  id (uuid, PK)
  user_id (uuid, FK -> auth.users, UNIQUE)
  company_name (text)
  industry (text)
  state (text)
  city (text, nullable)
  zip_code (text, nullable)
  employee_count (int)
  entity_type (text)  -- LLC, Corp, Sole Prop, etc.
  naics_code (text, nullable)
  onboarding_completed (boolean, default false)
  created_at, updated_at

tasks
  id (uuid, PK)
  business_id (uuid, FK -> business_profiles)
  title (text)
  description (text, nullable)
  due_date (timestamptz)
  status (text)  -- pending, completed, snoozed, overdue
  category (text)  -- tax, licensing, safety, employment, etc.
  priority (text)  -- critical, high, medium, low
  source_regulation_id (uuid, FK -> regulation_metadata, nullable)
  created_at, updated_at

documents
  id (uuid, PK)
  business_id (uuid, FK -> business_profiles)
  filename (text)
  storage_path (text)
  category (text)
  expiration_date (date, nullable)
  extracted_text_preview (text, nullable)
  embedding_status (text)  -- pending, processing, completed, failed
  file_size_bytes (bigint)
  mime_type (text)
  created_at, updated_at

regulation_metadata
  id (uuid, PK)
  title (text)
  source (text)  -- govinfo, osha, sec, state-specific
  source_url (text)
  source_hash (text)  -- hash of source content for change detection
  jurisdiction (text)  -- federal, state:NJ, state:CA, county:..., city:...
  jurisdiction_level (text)  -- federal, state, county, city
  industry_tags (text[])
  effective_date (date, nullable)
  version (int, default 1)
  is_current (boolean, default true)
  last_verified_at (timestamptz)
  raw_text (text)
  created_at, updated_at

regulation_embeddings
  id (uuid, PK)
  regulation_id (uuid, FK -> regulation_metadata)
  chunk_index (int)
  chunk_text (text)
  embedding (vector(1536))  -- text-embedding-3-small
  section_header (text, nullable)
  metadata (jsonb)
  created_at

document_embeddings
  id (uuid, PK)
  document_id (uuid, FK -> documents)
  chunk_index (int)
  chunk_text (text)
  embedding (vector(1536))
  created_at

risk_assessments
  id (uuid, PK)
  business_id (uuid, FK -> business_profiles)
  overall_score (float)
  category_scores (jsonb)  -- { "tax": 85, "safety": 60, ... }
  flagged_items (jsonb)    -- array of { regulation_id, status, description }
  next_steps (jsonb)       -- array of recommended actions
  coverage_info (jsonb)    -- { total_known: 18, tracked: 12 }
  assessed_at (timestamptz)

chat_history
  id (uuid, PK)
  business_id (uuid, FK -> business_profiles)
  conversation_id (uuid)
  role (text)  -- user, assistant
  content (text)
  sources_used (jsonb, nullable)  -- regulation IDs and titles referenced
  created_at

activity_log
  id (uuid, PK)
  business_id (uuid, FK -> business_profiles)
  action (text)  -- document_uploaded, task_completed, risk_updated, regulation_changed
  details (jsonb)
  created_at

ingestion_log
  id (uuid, PK)
  source (text)
  regulations_processed (int)
  regulations_new (int)
  regulations_updated (int)
  embeddings_created (int)
  errors (jsonb)
  started_at, completed_at
```

### pgvector Indexes

```sql
-- HNSW index for fast approximate nearest neighbor search
-- HNSW over IVFFlat: better recall, no periodic retraining needed
CREATE INDEX ON regulation_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

CREATE INDEX ON document_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Metadata indexes for pre-filtering before vector search
CREATE INDEX ON regulation_metadata (jurisdiction);
CREATE INDEX ON regulation_metadata USING gin (industry_tags);
CREATE INDEX ON regulation_metadata (is_current) WHERE is_current = true;
```

---

## FastAPI Project Structure

```
backend/
  main.py                    # FastAPI app, middleware, router mounting
  core/
    config.py                # Pydantic BaseSettings (env vars)
    security.py              # JWT validation, get_current_user dependency
    database.py              # Async SQLAlchemy engine + session factory
    supabase_client.py       # Supabase Python client (Auth + Storage only)
    exceptions.py            # Structured error classes + handlers
  models/
    business.py              # SQLAlchemy: business_profiles
    task.py                  # SQLAlchemy: tasks
    document.py              # SQLAlchemy: documents
    regulation.py            # SQLAlchemy: regulation_metadata + regulation_embeddings
    risk.py                  # SQLAlchemy: risk_assessments
    chat.py                  # SQLAlchemy: chat_history
  schemas/
    business.py              # Pydantic request/response schemas
    task.py
    document.py
    risk.py
    chat.py
  services/
    dashboard_service.py     # Data aggregation (asyncio.gather)
    task_service.py          # Task CRUD + deadline logic
    document_service.py      # Upload orchestration, metadata management
    risk_engine.py           # Risk calculation + scoring
    chat_service.py          # RAG pipeline orchestration
    regulation_service.py    # Regulation query + filtering
  ai/
    embeddings.py            # OpenAI embedding generation (batch + single)
    retriever.py             # pgvector similarity search with metadata filtering
    chain.py                 # LangChain or custom chain construction
    prompts.py               # Prompt templates for ClearBot
    chunking.py              # Text chunking strategies
  workers/
    celery_app.py            # Celery configuration
    tasks/
      ingestion.py           # Regulation scraping + embedding pipeline
      pdf_parser.py          # Document text extraction + embedding
      alerts.py              # Deadline notification dispatch
      risk_recalc.py         # Background risk re-assessment
  routers/
    auth.py                  # Profile + onboarding endpoints
    dashboard.py             # Dashboard aggregation endpoints
    tasks.py                 # Task CRUD endpoints
    documents.py             # Document upload/download/list endpoints
    risk.py                  # Risk report endpoints
    chat.py                  # ClearBot streaming endpoint
  tests/
    conftest.py
    test_auth.py
    test_dashboard.py
    test_chat.py
    ...
```

## Frontend Structure

```
frontend/
  src/
    app/
      App.tsx                # Root component, providers, router
      routes.tsx             # Route definitions with lazy loading
    components/
      layout/
        AppLayout.tsx        # Authenticated shell (topbar + outlet)
        TopNavigationBar.tsx
        UserProfileMenu.tsx  # Radix DropdownMenu
      ui/                    # Reusable: Button, Card, Input, Modal, Badge, etc.
      dashboard/             # ComplianceScoreWidget, RiskOverviewGrid, LiveFeedList
      calendar/              # CalendarGrid, CalendarControls, TaskSidebar, TaskCard
      vault/                 # VaultLayout, DocTable, UploadDropzone, FolderNav
      risk/                  # RiskSummaryHeader, RiskTabs, FlaggedIssueRow
      chat/                  # ClearBotFAB, ChatWindow, MessageBubble, ChatInput
    hooks/
      useAuth.ts             # Supabase auth state
      useChatStream.ts       # Custom SSE streaming hook for ClearBot
    queries/                 # TanStack Query hooks organized by domain
      useDashboard.ts
      useTasks.ts
      useDocuments.ts
      useRisk.ts
    stores/
      calendarStore.ts       # Zustand: calendar view state
      chatStore.ts           # Zustand: active conversation UI state
    lib/
      supabase.ts            # Supabase client initialization
      api.ts                 # API client with auth token injection
      queryClient.ts         # TanStack Query client configuration
    types/
      index.ts               # Shared TypeScript interfaces
    pages/
      LoginPage.tsx
      OnboardingPage.tsx
      DashboardPage.tsx
      CalendarPage.tsx
      VaultPage.tsx
      RiskCenterPage.tsx
```

---

## Patterns to Follow

### Pattern 1: Dependency Injection for Auth

**What:** FastAPI's `Depends()` system for injecting the authenticated user into every route.

**When:** Every protected endpoint.

```python
# core/security.py
from fastapi import Depends, HTTPException, Request
from jose import jwt, JWTError
from core.config import settings

async def get_current_user(request: Request) -> dict:
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET,
                            algorithms=["HS256"], audience="authenticated")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Pattern 2: RAG with Metadata Pre-Filtering

**What:** Combine vector similarity search with hard metadata filters to scope results to the user's jurisdiction and industry.

**When:** Every ClearBot query and every risk assessment.

```python
# ai/retriever.py
async def retrieve_regulations(
    query_embedding: list[float],
    state: str,
    industry: str,
    limit: int = 8
) -> list[dict]:
    result = await db.execute(text("""
        SELECT re.chunk_text, re.section_header, rm.title, rm.source_url,
               1 - (re.embedding <=> :embedding) AS similarity
        FROM regulation_embeddings re
        JOIN regulation_metadata rm ON re.regulation_id = rm.id
        WHERE rm.is_current = true
          AND (rm.jurisdiction = 'federal' OR rm.jurisdiction = :jurisdiction)
          AND (:industry = ANY(rm.industry_tags) OR 'general' = ANY(rm.industry_tags))
        ORDER BY re.embedding <=> :embedding
        LIMIT :limit
    """), {
        "embedding": str(query_embedding),
        "jurisdiction": f"state:{state}",
        "industry": industry,
        "limit": limit,
    })
    return result.fetchall()
```

### Pattern 3: TanStack Query for All Server State

**What:** Every API call from React goes through TanStack Query. No raw `fetch` in components (except streaming chat).

**When:** All data fetching and mutations.

```typescript
// queries/useDashboard.ts
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => api.get<DashboardSummary>('/dashboard/summary'),
    staleTime: 30_000,
  });
}

// queries/useTasks.ts
export function useCompleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      api.patch(`/tasks/${taskId}/status`, { status: 'completed' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
```

### Pattern 4: Structured Error Responses

**What:** Standardized error format across all FastAPI endpoints.

**When:** Always.

```python
# core/exceptions.py
class AppException(Exception):
    def __init__(self, status_code: int, message: str, detail: str = None):
        self.status_code = status_code
        self.message = message
        self.detail = detail

@app.exception_handler(AppException)
async def app_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message, "detail": exc.detail},
    )

# Usage
raise AppException(404, "Business profile not found",
                   detail="Complete onboarding to create your profile")
```

### Pattern 5: API Client with Auth Token Injection

**What:** Centralized frontend API client that automatically attaches Supabase JWT.

```typescript
// lib/api.ts
import { supabase } from './supabase';

class ApiClient {
  private baseUrl = import.meta.env.VITE_API_URL;

  private async getHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token ?? ''}`,
    };
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: await this.getHeaders(),
    });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new ApiError(res.status, await res.json());
    return res.json();
  }
}

export const api = new ApiClient();
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Direct Frontend-to-Database Queries

**What:** Using `supabase-js` from the React frontend to directly query business data tables.

**Why bad:** Bypasses business logic, makes authorization inconsistent (RLS rules duplicate FastAPI logic), creates two "backends" that can drift. When you add risk scoring logic, it needs to live in one place.

**Instead:** Frontend calls FastAPI for ALL data operations. The only direct Supabase calls from frontend are `supabase.auth.*` for authentication and optionally Supabase Storage for direct file uploads.

### Anti-Pattern 2: Embedding Generation in the Request Path

**What:** Generating embeddings for uploaded documents synchronously during the upload API call.

**Why bad:** PDF parsing + text extraction + chunking + embedding generation can take 30-120 seconds. The HTTP request will time out.

**Instead:** Upload endpoint saves metadata + file, dispatches Celery task, returns immediately with `embedding_status: "pending"`. Frontend shows processing indicator.

### Anti-Pattern 3: One Giant Zustand Store

**What:** Putting all frontend state in a single Zustand store.

**Why bad:** Unnecessary re-renders, hard to reason about, impossible to test in isolation.

**Instead:** Multiple small stores by domain (calendarStore, chatStore). Server state lives in TanStack Query, NOT Zustand.

### Anti-Pattern 4: Embedding Entire Regulations as Single Vectors

**What:** Creating one embedding per regulation document without chunking.

**Why bad:** Long documents compress poorly into a single 1536-dim vector. Retrieval quality degrades.

**Instead:** Chunk documents (500-1000 tokens with 100-200 token overlap). Each chunk gets its own vector + section metadata.

### Anti-Pattern 5: Building Microservices for MVP

**What:** Separating AI service, API gateway, and workers into independent deployables from day one.

**Why bad:** Premature distribution adds network hops, deployment complexity, and debugging difficulty.

**Instead:** Monolithic FastAPI app + Celery workers (same codebase, different entry points). Extract into services only with concrete scaling evidence.

---

## Scalability Considerations

| Concern | At 100 users | At 10K users | At 1M users |
|---------|--------------|--------------|-------------|
| **API throughput** | Single Uvicorn instance | Multiple instances behind load balancer | Horizontal autoscaling, API gateway |
| **Database connections** | Supabase connection pooler (default) | Tune pool size, read replicas | Dedicated Postgres cluster + PgBouncer |
| **Vector search latency** | pgvector HNSW is fast at <100K vectors | Still fine at ~500K vectors | Consider dedicated vector DB or partitioning |
| **AI API costs** | Low (~$50-200/month) | Moderate (~$2-5K/month), add caching | Significant -- cache aggressively, model routing |
| **Background jobs** | Single Redis + 1 Celery worker | Multiple workers, priority queues | Dedicated job queue service |
| **File storage** | Supabase Storage free tier | Supabase Pro plan | S3-compatible with CDN |

---

## Deployment Architecture (V1)

**Recommended for MVP -- optimize for simplicity and cost:**

| Component | Deploy To | Cost Estimate |
|-----------|-----------|---------------|
| React SPA | Vercel (zero-config, global CDN) | $0 |
| FastAPI | Railway or Render | $5-20/month |
| Celery Worker + Beat | Same Railway/Render (separate service) | $5-10/month |
| Redis | Upstash (serverless) or Railway addon | $0-10/month |
| Supabase | Supabase Cloud (Pro plan) | $25/month |
| OpenAI API | Pay-as-you-go | $50-200/month |
| **Total MVP** | | **~$85-265/month** |

---

## Sources

- Project context: `.planning/PROJECT.md`, `Instructions/Backend_Plan.md`, `Instructions/FrontEnd_Plan.md`
- Architecture patterns based on established FastAPI, Supabase, LangChain, and pgvector documentation (training data -- MEDIUM confidence)
- RAG architecture patterns well-established across LangChain docs, OpenAI cookbook, Supabase AI guides
- pgvector HNSW vs IVFFlat based on pgvector repository documentation

**Confidence note:** Web search and fetch tools were unavailable. All recommendations are based on training data knowledge of well-established, production-proven patterns. Specific API signatures should be verified against current documentation during implementation.
