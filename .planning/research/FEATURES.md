# Feature Landscape

**Domain:** AI-driven regulatory compliance SaaS for SMBs (regtech)
**Researched:** 2026-03-07
**Overall confidence:** MEDIUM -- based on project instruction documents, founder feature specs, competitive landscape knowledge (Vanta, Navex, Drata, Zenefits, Gusto), and regtech domain patterns. Web search tools were unavailable so competitor feature lists could not be live-verified; however, the regtech space is well-established and patterns are consistent across training data and the project's own market research.

---

## Table Stakes

Features users expect from any compliance management platform. Missing any of these means the product feels incomplete or untrustworthy -- SMB owners will bounce to a spreadsheet or a competitor.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Business onboarding / profiling** | Users need personalized compliance requirements immediately. A generic dashboard is useless. Every competitor asks industry + location + size on signup. | Medium | Captures industry, state(s), ZIP, employee count, entity type. This seeds the entire rule engine. Must feel fast (under 2 minutes). |
| **Personalized compliance dashboard** | The "home screen" that justifies the product's existence. Users need a single-glance answer to "am I compliant?" Vanta, Drata, and every GRC tool lead with a dashboard. | Medium | Compliance score circle, risk category cards, next-steps panel, live feed. The score must be computed from real data (docs, deadlines, audit answers) -- not faked. |
| **Compliance deadline calendar** | The #1 pain point for SMBs is forgetting deadlines. Every competitor (and even basic spreadsheet templates) track due dates. This is non-negotiable. | Medium | Month/week/list views. Color-coded urgency (overdue/upcoming/done). Filter by category. Mark complete, snooze. Must pre-populate deadlines from the rule engine based on business profile. |
| **Automated alerts and reminders** | Deadlines are worthless if the user has to remember to check. Email/SMS reminders are baseline expectation from any task management tool, let alone compliance. | Medium | Email reminders at configurable intervals (30/14/7/1 day). SMS for critical items. Escalation if overdue. Daily/weekly digest option. Requires Celery + Redis background jobs. |
| **Document vault with upload** | SMBs need a single place for licenses, permits, insurance certs, SOPs. "Where's that fire inspection report?" is the panic moment ClearPath solves. Every compliance tool has doc storage. | Medium | Drag-and-drop upload, folder organization by category, expiration tracking, search. Supabase Storage handles the heavy lifting. |
| **Document expiration tracking** | Knowing a document exists is not enough -- knowing it expires in 12 days is the real value. Competitors highlight this heavily. | Low | Expiration date field on every document. Dashboard/calendar integration to surface expiring docs. "Missing docs" filter in vault. |
| **User authentication and session management** | Obvious baseline. Users expect secure login, password reset, session persistence. No compliance tool ships without auth. | Low | Supabase Auth handles signup, login, magic links, OAuth. JWT verification on FastAPI. |
| **Risk assessment / compliance gaps** | Users need to see WHAT they are missing, not just scores. "You are missing a food handler certificate" is actionable. "Your score is 72" is not. Every mature GRC tool shows gap analysis. | High | Rule engine compares business profile requirements against uploaded docs and completed tasks. Categorized by domain (Health, Labor, Tax, Privacy, Licensing). Requires the regulation data pipeline to be functional. |
| **Plain-English explanations** | SMB owners are not lawyers. If the product speaks in legal jargon, it fails. This is what separates "compliance for SMBs" from enterprise GRC. Competitors targeting SMBs (Zenefits, Gusto) all use plain language. | Medium | Every regulation, risk flag, and recommendation must be written (or AI-generated) in simple language. Tooltips everywhere. "What is this and why does it matter?" |
| **Mobile-responsive web** | SMB owners manage their business from phones. Even if no native app, the web UI must be fully functional on mobile. | Low | Tailwind responsive classes. No mobile app needed for v1, but responsive is mandatory. |

---

## Differentiators

Features that set ClearPath apart from competitors. Not universally expected, but create significant competitive advantage. These are what make users choose ClearPath over a spreadsheet or a generic GRC tool.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **AI chatbot (ClearBot) with RAG** | This is the killer feature. No SMB compliance tool offers a conversational AI that answers "Do I need a food handler cert in NJ?" grounded in actual regulation data. Enterprise tools have compliance databases, but none offer a GPT-powered conversational interface for SMBs. Closest analog is TurboTax's guided experience, but as a chatbot. | High | RAG pipeline: user query -> vector embedding -> pgvector similarity search over regulations + user docs -> GPT-4o generates answer with citations. Streaming responses via FastAPI. Action links: "Add to Task List", "Upload Required File", "Show Template". This is the hardest feature to build well but the strongest moat. |
| **Live regulation data ingestion** | Most SMB compliance tools rely on static checklists that go stale. ClearPath pulls from real regulatory sources (GovInfo, OSHA, SEC.gov) and updates automatically. This means the live feed can show "NJ: New wage transparency rule goes into effect Oct 1" before the user even knows about it. | High | Celery workers scraping/polling GovInfo API, OSHA feeds, state regulatory RSS. Parse, chunk, embed into pgvector. Map to affected industries/states. This is the data moat -- expensive to build, hard to replicate. |
| **Industry + state rule engine** | Automatically knowing what applies to a daycare in NJ vs. a dental clinic in TX is the "magic moment." Competitors either serve one industry deeply (vertical SaaS) or require manual configuration. ClearPath aims to be industry-agnostic but personalized. | High | Business profile seeds a vector similarity search against the regulation corpus. Returns a tailored checklist of requirements. Must handle federal, state, and local layers. Industry-agnostic v1 means the rule engine must be flexible, not hardcoded. |
| **Compliance score as a single metric** | A numerical score (0-100) that represents overall compliance health. Emotionally powerful -- turns a vague anxiety ("am I compliant?") into a concrete, improvable number. Vanta has something similar for SOC2, but no SMB tool does this across general compliance. | Medium | Computed from: % of required docs uploaded and current, % of deadlines met, audit questionnaire results, risk flag resolution rate. Must be transparent (tooltip explaining what factors into the score). |
| **Contextual action links from AI** | ClearBot does not just answer questions -- it links to actions: "Add to Task List", "Upload Required File", "Show Template." This bridges the gap between knowing and doing. Most chatbots are dead-ends. | Medium | Requires ClearBot responses to include structured metadata (related task IDs, document categories, template references) that the frontend renders as actionable buttons. |
| **Live regulatory news feed** | "Daycare in your state fined $3,000 for ADA violation" -- industry-specific news that creates urgency and demonstrates the platform's awareness. No SMB compliance tool does this. | Medium | Curated from regulation ingestion pipeline. Filtered by user's industry + state. Shows new laws, enforcement actions, peer fines. This is a retention feature -- users come back to see what's new. |
| **Auto-generated compliance reports** | One-click PDF export of compliance status for regulators, investors, or insurers. "The inspector walks in, you click one button." Enterprise GRC tools have this; SMB tools generally do not. | Medium | Select report type, system assembles document status, deadline history, risk scores into branded PDF. Requires report templating (likely server-side PDF generation with WeasyPrint or reportlab). Defer to late v1 or v2. |

---

## Anti-Features

Features to explicitly NOT build in v1. Either they add premature complexity, distract from core value, or serve the wrong market segment.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Multi-user team management / RBAC** | Adds significant auth complexity (roles, permissions, invite flows, audit logs per user). Most SMB early adopters are solo operators or very small teams. Building RBAC before validating core value is premature optimization. | Single-user MVP. One account = one business. Defer team features to v2 after validating that solo users retain and pay. |
| **Third-party integrations (QuickBooks, Gusto, Google Calendar, Outlook)** | Each integration is a mini-project with OAuth flows, webhook handling, data sync, and ongoing maintenance as partner APIs change. Zero users are asking for this before the core product works. | Focus on standalone value. If a user wants calendar sync, they can manually add key dates. Integrations are a v2 upsell feature. |
| **Compliance audit wizard** | A progressive questionnaire with branching logic, save/resume, scoring, and PDF generation is a significant feature surface area. It duplicates some Risk Center functionality and requires extensive question bank curation per industry/state. | The Risk Center already surfaces gaps. ClearBot can answer audit-readiness questions conversationally. Defer the formal wizard to v2 when you have user data showing what questions matter most. |
| **Expert marketplace / advisor access** | Marketplace features (vetting advisors, booking, payments, reviews) are an entire product. Supply-side marketplace problems are notoriously hard. | Add a simple "Talk to an Expert" CTA that links to a partner or Calendly page. Validate demand with a waitlist before building marketplace infrastructure. |
| **Compliance insurance partnerships** | Insurance is a heavily regulated industry itself. Partnership deals take months. Technical integration with carriers is complex. | Collect risk score data now. When you have enough users, approach insurers with aggregated (anonymized) data to pitch partnerships. This is a v3+ revenue stream. |
| **White-label / enterprise version** | Completely different product with multi-tenant architecture, custom branding, admin consoles, SSO, and enterprise sales cycles. Building this before PMF is a death trap. | Stay focused on direct-to-SMB. If a franchise operator wants to buy for 100 locations, that is a custom deal, not a product feature. |
| **Native mobile app** | React Native or Flutter adds a second codebase, app store review cycles, push notification infrastructure, and doubled QA surface. The responsive web handles mobile use cases. | Build a mobile-responsive web app. If analytics show >60% mobile usage post-launch, consider a PWA before a native app. |
| **Stripe billing / payments** | Payments add PCI compliance concerns, subscription management UI, invoicing, failed payment handling, plan upgrade/downgrade flows. Premature before you have users to charge. | Launch with manual onboarding or a simple Stripe Checkout link (no in-app billing management). Build proper billing when you have 50+ paying users. |
| **Email ingestion for documents** | Automatically parsing emailed documents (forwarded from agencies) sounds clever but is an NLP/parsing nightmare -- different formats, attachments, spam filtering. | Manual upload via drag-and-drop. Users are willing to upload 5-10 documents. Automatic ingestion is a v2 convenience feature. |
| **State portal direct submission** | Filing forms directly with state agencies via their portals requires scraping or API access to government systems that are notoriously unreliable and vary by jurisdiction. | Generate pre-filled PDFs that users submit themselves. Show links to the correct state portal. Do not try to automate the last mile of government submission. |

---

## Feature Dependencies

Understanding the dependency chain is critical for phase ordering. Features at the top must be built first.

```
Business Onboarding (profile capture)
  |
  +--> Rule Engine (needs industry + state to query regulations)
  |      |
  |      +--> Risk Center (needs rule engine output to show gaps)
  |      |      |
  |      |      +--> Compliance Score (computed from risk assessment + docs + deadlines)
  |      |      |      |
  |      |      |      +--> Dashboard (displays score, risks, next steps)
  |      |      |
  |      |      +--> Auto-generated Reports (needs risk data + doc data)
  |      |
  |      +--> Calendar pre-population (rule engine seeds deadlines per business profile)
  |
  +--> ClearBot RAG (needs business profile for context + regulation corpus for retrieval)

Supabase Auth (independent -- can be built in parallel)
  |
  +--> All authenticated features

Regulation Data Ingestion Pipeline (independent -- can be built in parallel)
  |
  +--> Rule Engine (needs regulation corpus)
  +--> ClearBot RAG (needs regulation embeddings)
  +--> Live News Feed (needs parsed regulation updates)

Document Vault (independent of rule engine, but enhanced by it)
  |
  +--> Document expiration tracking
  +--> Risk Center gap analysis (compares required docs vs uploaded)
  +--> ClearBot document-aware answers (embeds user docs for RAG)

Alerts / Reminders (depends on Calendar having deadlines)
  |
  +--> Escalation logic (depends on alerts + team roles -- defer escalation to v2)
```

---

## MVP Recommendation

The v1 MVP defined in PROJECT.md is well-scoped. Here is how to prioritize within it:

### Build First (foundation layer -- everything else depends on these)

1. **Supabase Auth + business onboarding flow** -- Without auth and a business profile, nothing else is personalized. This is the entry point for every user.
2. **Regulation data ingestion pipeline** -- This is the data moat. Without real regulation data embedded in pgvector, the rule engine and ClearBot are hollow. Start with federal sources (GovInfo, OSHA) and 2-3 target states.
3. **Document Vault** -- Low complexity, high immediate value. Users can start uploading documents on day one. This also feeds the risk engine and ClearBot RAG later.

### Build Second (core value layer -- what makes users come back)

4. **Rule engine + Risk Center** -- The personalized compliance gap analysis is what turns ClearPath from a file cabinet into a compliance advisor. Requires onboarding data + regulation corpus.
5. **Calendar with pre-populated deadlines** -- Once the rule engine knows what applies, auto-populate deadlines. This is the "aha moment" -- the user did not know about half these deadlines.
6. **Automated email alerts** -- Deadlines without reminders are useless. Wire up Celery workers to send email notifications for upcoming/overdue items.

### Build Third (differentiation layer -- what makes users love it)

7. **Personalized Dashboard** -- Aggregates score, risks, next steps, and feed. Requires Risk Center and Calendar to be functional to display meaningful data.
8. **ClearBot AI chatbot** -- The crown jewel. Requires regulation embeddings (from pipeline) and ideally user document embeddings (from vault). RAG pipeline is the most technically complex feature. Ship a basic version that answers from the regulation corpus, then iterate.

### Defer (v2+)

- Compliance Audit Tool wizard
- Team Management / RBAC
- Settings & third-party integrations
- Auto-generated compliance reports (PDF export)
- Pre-filled forms and templates
- Expert access / advisor marketplace
- Compliance insurance partnerships
- White-label enterprise version
- Stripe billing

---

## Competitive Landscape Context

| Competitor | Market | Key Features ClearPath Should Learn From | Key Features ClearPath Should NOT Copy |
|------------|--------|------------------------------------------|----------------------------------------|
| **Vanta** ($1.6B) | SOC2/ISO compliance for tech companies | Automated evidence collection, continuous monitoring, trust reports | Enterprise pricing ($10k+/yr), narrow framework focus (SOC2/ISO/HIPAA only), heavy integration dependency |
| **Drata** | SOC2/ISO compliance automation | Clean dashboard UX, automated control monitoring, auditor-facing workflows | Same enterprise focus, requires dozens of integrations to function |
| **Navex** (acquired >$1.5B) | Enterprise GRC, ethics, risk | Comprehensive policy management, incident reporting, training modules | Massive feature bloat, enterprise-only, complex implementation |
| **Zenefits** (peak $4.5B) | HR compliance for SMBs | Simple onboarding, payroll integration, compliance alerts within HR context | Tried to be everything (payroll + benefits + compliance), burned through cash |
| **Gusto** | Payroll + HR for SMBs | Beautiful UX, plain-English guidance, built-in tax compliance for payroll | Compliance is a side feature, not core product; limited to employment/tax domains |

**Key insight:** The $1B+ compliance companies (Vanta, Drata, Navex) all target enterprise and focus on specific frameworks (SOC2, ISO). The SMB-focused platforms (Zenefits, Gusto) treat compliance as a secondary feature within HR/payroll. **Nobody owns general regulatory compliance for SMBs.** ClearPath's positioning -- "TurboTax + Monday.com + Dropbox for compliance" -- is a genuine whitespace.

**Risk:** The whitespace might exist because the problem is genuinely hard (50 states x hundreds of industries x federal/state/local layers = combinatorial explosion of regulations). The regulation data pipeline and rule engine must be good enough to be useful for at least 2-3 industries in 3-5 states at launch, not try to boil the ocean.

---

## Sources

- ClearPath PROJECT.md (project context and key decisions)
- ClearPath FrontEnd_Plan.md (technical component architecture)
- ClearPath Backend_Plan.md (API endpoints, database schemas, RAG architecture)
- Competitor knowledge: Vanta, Drata, Navex, Zenefits, Gusto feature sets (MEDIUM confidence -- based on training data, not live-verified)
- Regtech market patterns (MEDIUM confidence -- well-established domain, consistent across multiple sources in training data)
