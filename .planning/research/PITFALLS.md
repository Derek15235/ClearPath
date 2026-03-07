# Domain Pitfalls

**Domain:** AI-driven compliance navigator SaaS for SMBs (regtech)
**Project:** ClearPath
**Researched:** 2026-03-07
**Overall confidence:** MEDIUM (based on training data; WebSearch/WebFetch unavailable for live verification)

---

## Critical Pitfalls

Mistakes that cause rewrites, liability exposure, or product failure. These are existential risks for a compliance SaaS product.

---

### Pitfall 1: AI Hallucination in a Liability-Critical Domain

**What goes wrong:** The RAG-powered ClearBot confidently tells an SMB owner they do NOT need a specific license, or that a deadline is X when it is actually Y. The business owner relies on this, skips the requirement, and gets fined or shut down. Unlike a hallucination in a creative writing app, a hallucination in compliance guidance can cause direct, measurable financial and legal harm to users.

**Why it happens:**
- GPT-4o generates fluent, confident text even when the retrieved context is incomplete, outdated, or irrelevant
- Vector similarity search returns "closest" documents, not necessarily "correct" ones -- a regulation about food safety in California may be retrieved for a question about food safety in New Jersey because the embeddings are semantically close
- LLMs have no concept of "I don't know" by default; they fill gaps with plausible-sounding fabrications
- The system cannot distinguish between "no regulation exists" and "regulation exists but was not in our database"

**Consequences:**
- Direct legal liability -- even with disclaimers, if users act on AI advice that turns out wrong, ClearPath faces lawsuits and reputational destruction
- Loss of the one thing a compliance product must have: trust. One viral story of "compliance app told me I was fine and I got a $50K fine" kills the product
- Regulatory scrutiny of the platform itself

**Detection:**
- ClearBot answers questions about jurisdictions or industries where you have no regulation data ingested
- Bot gives specific dates, dollar amounts, or form numbers without citing a source document
- Retrieval returns documents with low similarity scores (< 0.7) but the bot still generates a confident answer
- No "I don't know" or "I'm not sure" responses in conversation logs -- the bot always has an answer

**Prevention:**
1. **Hard guardrails on response generation:** If the top retrieved document has a similarity score below a threshold (start with 0.75, tune empirically), the bot MUST respond with "I don't have enough information to answer this confidently. Please consult a compliance professional." Never let the LLM override this.
2. **Mandatory source citation:** Every ClearBot response must include the specific regulation title, section number, and jurisdiction. If it cannot cite a source, it must say so.
3. **Jurisdiction-awareness in retrieval:** Filter vector search results by the user's state/locality BEFORE semantic ranking. Do not rely on the embedding to distinguish NJ from CA regulations.
4. **Confidence scoring layer:** Post-retrieval check validating retrieved docs actually match the user's profile (industry, state, business type) before passing to the LLM.
5. **Prominent disclaimer UX:** Every AI response includes a visible, non-dismissible notice: "This is AI-generated guidance, not legal advice. Verify with your local regulatory agency."
6. **Human-in-the-loop escape hatch:** Clear path to flag uncertain answers and escalate to human review.

---

### Pitfall 2: The Regulation Data Completeness Illusion

**What goes wrong:** The team builds a beautiful ingestion pipeline for GovInfo and OSHA feeds, gets federal regulations working, and assumes they have "compliance coverage." In reality, the regulations that matter most to SMBs -- local business licenses, state-specific permits, county health department rules, city zoning requirements -- are not available through any centralized API. The product launches with gaping coverage holes that users immediately notice.

**Why it happens:**
- Federal regulation data (CFR, Federal Register) IS available via GovInfo's USLM API. This is the easy part.
- State regulations are fragmented across 50 different state legislative websites with different formats
- Local/county/city regulations are even worse -- many are only available as PDFs on municipal websites that change URLs without notice
- The project plan calls for "live regulation data from day one" which creates a false expectation of comprehensive coverage
- Industry-agnostic approach multiplies the coverage problem

**Consequences:**
- Users onboard, enter their business profile, and get an empty or near-empty compliance checklist -- immediate churn
- Compliance score shows "95% compliant" because the system only knows about 3 of the 15 regulations that actually apply -- false sense of security, which is worse than no product at all

**Detection:**
- You can only demonstrate the product with specific state/industry combinations where you happen to have data
- Users in the same industry but different states get wildly different numbers of compliance items

**Prevention:**
1. **Scope v1 coverage explicitly:** Pick 2-3 states and 1-2 industries. Be transparent about coverage boundaries.
2. **Separate federal from state from local in your data model.** Tag every regulation with jurisdiction level and completeness status.
3. **Build a "coverage map" feature:** Show users exactly which jurisdictions and industries you cover.
4. **Prioritize curated data over automated ingestion for state/local.** For the first few states, manually curate and verify regulation datasets.
5. **Implement a "report missing regulation" feature:** Let users flag gaps.

---

### Pitfall 3: Treating Compliance as Static When Regulations Change Constantly

**What goes wrong:** The team ingests regulations once, builds a great v1 experience, and does not build robust change detection and propagation. Three months later, regulations update and users see stale information. The compliance calendar shows the wrong deadline.

**Why it happens:**
- Initial engineering effort focused on ingestion (getting data in), not monitoring (detecting changes)
- Government websites do not have webhooks
- Updating a regulation cascades: deadlines change, checklists change, risk scores change, notifications need to fire
- Vector embeddings for updated regulations need re-generation; old embeddings need invalidation

**Consequences:**
- A compliance product giving outdated information is actively dangerous -- worse than no product
- Users lose trust permanently after one instance of outdated advice

**Detection:**
- No automated process to check for regulation updates
- The "last updated" date on ingested regulations gets stale
- Support tickets asking about regulation changes you have not detected

**Prevention:**
1. **Build change detection into the ingestion pipeline from day one.** Every regulation record needs a `last_verified_at` timestamp and a `source_hash`. Scheduled jobs re-fetch and compare.
2. **Version regulation records.** Never update-in-place. Create new versions with history.
3. **Cascade change propagation.** When a regulation changes, trigger re-computation of affected compliance checklists, risk scores, and deadlines.
4. **Surface freshness to users.** Show "Last verified: [date]" on every regulation reference. Flag visually if not verified in 30+ days.

---

### Pitfall 4: pgvector Scaling and Retrieval Quality Problems

**What goes wrong:** pgvector works great in development with 10,000 chunks. With 500K+ chunks across multiple jurisdictions and industries, queries become slow, retrieval quality degrades (returning cross-jurisdiction results), and the database struggles to serve both transactional and vector queries.

**Why it happens:**
- Without metadata pre-filtering, vector search across all regulations returns semantically similar but jurisdictionally wrong results
- Supabase's managed PostgreSQL has connection limits and shared resources
- Embedding dimensions (1536 vs 3072) significantly impact storage and search performance

**Consequences:**
- Slow ClearBot responses
- Wrong regulations retrieved, leading to hallucination (amplifies Pitfall 1)
- Database performance degradation affects entire application

**Detection:**
- Vector search queries taking > 50ms in development
- ClearBot returning regulations from the wrong state/industry
- Supabase dashboard showing high CPU usage

**Prevention:**
1. **Use metadata pre-filtering BEFORE vector search.** Filter by jurisdiction + industry with WHERE clauses, THEN run similarity.
2. **Choose HNSW over IVFFlat.** Better recall without periodic re-indexing.
3. **Use text-embedding-3-small (1536 dims).** Sufficient quality at lower cost and faster search.
4. **Chunk by regulatory section/subsection**, preserving hierarchy as metadata.
5. **Benchmark early with realistic data volumes** (100K+ chunks).

---

### Pitfall 5: The "Boil the Ocean" Industry-Agnostic Trap

**What goes wrong:** The project attempts to be industry-agnostic from day one, covering healthcare, finance, construction, food services, education, and eCommerce simultaneously. Each industry has fundamentally different regulatory frameworks. The result is a product mediocre for everyone rather than excellent for someone.

**Why it happens:**
- Natural desire to maximize addressable market
- The platform architecture is industry-agnostic, creating the illusion that content can be too
- Underestimation of domain-specific complexity

**Consequences:**
- v1 takes 3x longer to ship
- No industry's users feel like the product truly understands their needs
- Marketing message is diluted
- Regulation data collection effort spread too thin

**Detection:**
- Team spending equal time on 6 different industry regulation sets
- No single industry has > 50 regulations fully ingested and verified

**Prevention:**
1. **Pick ONE industry for v1.** Construction is compelling: 3M+ firms, high fines, low existing tech support, regulations are primarily OSHA + state licensing.
2. **Go deep, not wide.** For the chosen industry, cover federal + 3 states completely.
3. **Design the data model to be industry-extensible** but populate only one industry initially.
4. **Validate with real users in ONE industry** before expanding.

---

## Moderate Pitfalls

### Pitfall 6: Compliance Score Becomes a Vanity Metric

**What goes wrong:** The dashboard shows a "compliance score" that is meaningless because it is not grounded in actual regulatory requirements the system fully understands. Users see "85% compliant" but the system only knows about 40% of their obligations.

**Prevention:**
1. Show "X of Y known requirements met" instead of a percentage until coverage is validated
2. Weight by consequence severity (critical / high / medium / low)
3. Show "coverage confidence" alongside the score
4. Never display 100%

### Pitfall 7: Government Data Source Fragility

**What goes wrong:** The ingestion pipeline is built against specific government website structures. Government websites redesign without warning, APIs have undocumented rate limits, and sources go offline during shutdowns.

**Prevention:**
1. Build an abstraction layer (adapter pattern) between data sources and processing pipeline
2. Implement daily health checks for every data source
3. Cache raw source data in Supabase Storage before processing
4. Use GovInfo's bulk data repository for initial loads, API for incremental updates
5. Register for API keys where available to increase rate limits

### Pitfall 8: LangChain Abstraction Lock-in and Debugging Opacity

**What goes wrong:** The team builds the entire RAG pipeline using LangChain's high-level abstractions. When something goes wrong, it is extremely difficult to debug because the actual prompts, retrieval queries, and LLM calls are hidden behind multiple abstraction layers.

**Prevention:**
1. **Use LangChain selectively.** Use it for document loading and text splitting. For the core RAG pipeline, write direct code using the OpenAI SDK and pgvector SQL queries.
2. **If using LangChain for RAG, use LCEL** and low-level components, not legacy high-level chains.
3. **Log every LLM call.** Capture the full prompt, response, token counts, and latency.
4. **Pin LangChain versions strictly.** No `>=` ranges.
5. **Build an evaluation framework.** 50+ question/expected-answer pairs for your target industry. Run after any change to prompts, retrieval, or LangChain versions.

### Pitfall 9: Onboarding That Fails to Capture Enough Business Context

**What goes wrong:** The onboarding asks for industry and location but misses the nuanced details that determine which regulations apply. Two "restaurants" in the same ZIP might have different compliance profiles based on alcohol service, employee count, etc.

**Prevention:**
1. **Progressive profiling:** Basic info at signup, then follow-up questions over first week based on rule engine needs
2. **Map regulatory triggers, not just industries.** Capture conditions: employee count > 10, serves food, handles hazardous materials, etc.
3. **Use NAICS codes as starting point** but supplement with regulatory-specific attributes
4. **Let AI help:** ClearBot can ask clarifying questions after basic onboarding

### Pitfall 10: OpenAI API Cost Explosion

**What goes wrong:** GPT-4o costs escalate rapidly. Each ClearBot conversation involves embedding + retrieval + completion with 3,000-5,000 tokens of context. At 1,000 DAU averaging 3 queries each, monthly costs reach $2,700-$9,000.

**Prevention:**
1. **Semantic caching:** Serve cached responses for semantically similar questions in same jurisdiction/industry
2. **Limit conversation context window:** Last 3-4 turns + summary, not full history
3. **Route simple queries to GPT-4o-mini** (order of magnitude cheaper)
4. **Set per-user rate limits:** Free tier: 10 AI queries/day. Paid: 50.
5. **Pre-compute common responses** during off-peak hours
6. **Monitor cost per user per month** as a first-class metric

---

## Minor Pitfalls

### Pitfall 11: Supabase Row-Level Security Misconfiguration

**What goes wrong:** RLS policies are too permissive or too restrictive, and mixing frontend direct queries with backend access creates authorization confusion.

**Prevention:** Route ALL data access through FastAPI. Use Supabase Auth for JWT issuance only. Use `service_role` key only on backend. Never expose it to client.

### Pitfall 12: PDF Parsing Quality for Uploaded Documents

**What goes wrong:** Many compliance documents are scanned images, contain tables, or use non-standard layouts. Basic PDF parsing produces garbled text.

**Prevention:** Multi-strategy parser (pdfplumber first, OCR fallback). Validate extracted text quality before embedding. Let users verify extracted content. Do not embed garbage.

### Pitfall 13: Celery + Redis Operational Complexity

**What goes wrong:** Celery + Redis adds two more services to deploy and monitor. Tasks can silently fail. Debugging requires separate logging.

**Prevention:** Evaluate if FastAPI `BackgroundTasks` suffices for Phase 1. If using Celery, enable Redis AOF persistence. Use Flower for monitoring from day one.

### Pitfall 14: Streaming Response Complexity with RAG

**What goes wrong:** Streaming a RAG response is more complex than streaming a simple LLM completion: retrieval must complete first, citations need separate handling, and mid-stream error handling requires buffering.

**Prevention:**
1. Show "Searching regulations..." loading state during retrieval phase
2. Send citations as structured payload after streamed text completes
3. Use SSE (Server-Sent Events), not WebSockets
4. Get RAG working with synchronous responses first, add streaming as optimization

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Severity | Mitigation |
|-------------|---------------|----------|------------|
| Data Pipeline / Ingestion | Regulation coverage gaps (P2); source fragility (P7) | CRITICAL | Scope to 1 industry + 3 states; adapter pattern |
| RAG / AI Pipeline | Hallucination liability (P1); pgvector scaling (P4); LangChain lock-in (P8) | CRITICAL | Confidence gating, metadata filtering, selective LangChain use |
| Onboarding | Insufficient business context (P9) | MODERATE | Progressive profiling, regulatory trigger mapping |
| Dashboard / Scoring | Vanity compliance score (P6) | MODERATE | "X of Y" format, coverage confidence display |
| ClearBot Chat | Streaming complexity (P14); cost explosion (P10) | MODERATE | Sync-first, semantic caching, model routing |
| Document Vault | PDF parsing quality (P12) | MODERATE | Multi-strategy parser, quality validation |
| Infrastructure | Supabase RLS confusion (P11); Celery overhead (P13) | LOW-MODERATE | FastAPI-only data access, evaluate simpler alternatives |
| Scoping / Strategy | Industry-agnostic trap (P5) | CRITICAL | Pick ONE industry before writing code |
| Regulation Updates | Stale data (P3) | CRITICAL | Versioned records, change detection from day one |

---

## Domain-Specific Legal and Ethical Considerations

### Unauthorized Practice of Law (UPL) Risk

Providing specific compliance guidance ("You need to file Form X by Date Y") can be construed as legal advice. ClearPath must be designed as an **information tool**, not an **advisory tool**:
- **Information (OK):** "NJ requires food establishments to maintain a valid food handler certificate. Here is the relevant regulation: [citation]."
- **Advice (UPL risk):** "You should file your food handler certificate renewal by March 15th to avoid a $2,000 fine."

**Technical implication:** ClearBot's system prompt must present information and citations, not directives.

### Data Handling for Sensitive Business Information

SMBs will upload sensitive documents: tax filings, employee records, insurance policies. Consider:
- Are uploaded documents sent to OpenAI for embedding? (OpenAI's data retention policies apply)
- Build an explicit data flow diagram showing where business data goes
- Consider using OpenAI's data retention opt-out for API calls

---

## Sources

| Topic | Source | Confidence |
|-------|--------|------------|
| RAG hallucination patterns | Training data (well-documented) | HIGH |
| pgvector performance | Training data (pgvector docs) | MEDIUM |
| GovInfo API specifics | Training data (govinfo.gov docs) | MEDIUM |
| LangChain versioning issues | Training data (widely reported) | MEDIUM |
| OpenAI pricing | Training data (early 2025 pricing) | LOW -- verify current rates |
| State regulation fragmentation | Training data (well-known regtech challenge) | HIGH |
| UPL risk for compliance software | Training data (legal tech consensus) | HIGH |
| Celery operational patterns | Training data (well-documented) | HIGH |

**Note:** WebSearch and WebFetch were unavailable. Recommendations marked MEDIUM or LOW confidence should be verified against current documentation before making architectural commitments.
