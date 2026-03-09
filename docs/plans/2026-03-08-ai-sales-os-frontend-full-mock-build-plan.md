# AI Sales OS Frontend Full Mock Build Plan

## 1. Purpose

This plan is written for an AI coding agent to implement the full frontend page system described in the product documents.

This plan supersedes the earlier `round1` MVP-only implementation idea for the current build cycle.

Primary references:

- `AGENTS.md`
- `APIkey.md`
- `ai_sales_os_frontend_product_plan.md`
- `ai_sales_os_frontend_agent_build_prd.md`
- `ai_sales_os_frontend_agent_first_ia_wireframes.md`

---

## 2. Current Build Goal

The goal is to build all planned frontend pages, using:

- realistic mock business data
- a shared object model
- an Agent-first interaction model
- a real model API only for the final Agent conversation experience

This cycle does **not** include:

- real backend business data
- real CRM data integration
- real email/calendar/chat ingestion
- real persistence for operational state

The app should feel complete from a frontend product perspective, even though all business data is mocked.

---

## 3. Scope

## 3.1 Pages To Build

The coding agent must build the full frontend page surface implied by the product plan:

1. role-based home pages
2. revenue center
3. pipeline dashboard
4. deals list
5. deal detail
6. customers list
7. customer detail
8. meetings list
9. meeting detail
10. sales team overview
11. sales rep detail
12. recap and training list
13. recap and training detail
14. Agent workspace
15. Agent workflow page
16. data sources page
17. settings page

## 3.2 Cross-Cutting Capabilities

These must exist across the app:

- global Agent side panel
- explainable AI cards
- evidence drawers
- data freshness and missing-state badges
- proposal/confirmation/apply/sync semantics
- role-aware summaries

---

## 4. Hard Constraints

## 4.1 Mock-Only Business Data

All business-facing data must come from mocks.

That includes:

- dashboards
- tables
- charts
- details pages
- Agent evidence references
- sync state
- alerts
- coaching summaries
- revenue drivers

Do not create a fake backend service with persistence.
Do not block the app on API readiness.

## 4.2 Real Model Calls Only For Agent Conversation

Agent interaction in final pages must use the model API referenced by `APIkey.md`.

Implementation rule:

- business data remains mock
- conversational Agent responses can call the live model
- model calls should go through a thin server-side proxy or route handler
- the key must not be embedded in client code

## 4.3 Mock First, Pages Second

The work order must be:

1. define domain types and enums
2. build complete mock datasets
3. build shared components and shell
4. build pages against mock data
5. wire live Agent conversation API
6. validate flows

Do not start building pages before the mock system is rich enough.

---

## 5. Technical Assumptions

Unless the user changes direction, use:

- `Next.js` App Router
- `TypeScript`
- `Tailwind CSS`
- `Zustand`
- `TanStack Query`
- `Vitest` + `Testing Library`
- `Playwright`
- `dnd-kit`

Allowed lightweight server-side feature:

- model proxy endpoint only

---

## 6. Target Application Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
  home/page.tsx
  revenue/page.tsx
  pipeline/page.tsx
  deals/page.tsx
  deals/[dealId]/page.tsx
  customers/page.tsx
  customers/[customerId]/page.tsx
  meetings/page.tsx
  meetings/[meetingId]/page.tsx
  sales-team/page.tsx
  sales-team/[repId]/page.tsx
  recaps/page.tsx
  recaps/[recapId]/page.tsx
  agent/page.tsx
  agent-workflows/page.tsx
  data-sources/page.tsx
  settings/page.tsx
  api/agent/chat/route.ts

src/
  components/
    app-shell/
    agent/
    intelligence/
    charts/
    data-state/
    shared/
  features/
    home/
    revenue/
    pipeline/
    deals/
    customers/
    meetings/
    sales-team/
    recaps/
    agent/
    data-sources/
    settings/
  lib/
    domain/
    semantics/
    mocks/
    model/
    routes/
    utils/
  state/
    agent-panel-store.ts
    filters-store.ts
    proposal-store.ts
    role-store.ts
    ui-store.ts

tests/
  unit/
  integration/

playwright/
  smoke/
  journeys/
```

---

## 7. Mock Data Requirements

The mock layer must be realistic enough to support every page.

## 7.1 Required Entity Groups

- accounts
- contacts
- deals
- meetings
- conversations
- agent outputs
- evidence refs
- forecast snapshots
- rep scorecards
- recap records
- workflow events
- data source records
- alerts and notifications

## 7.2 Required Scenario Coverage

The mock dataset must cover all of these:

- high-value healthy deal
- high-value late-stage risky deal
- stalled deal
- recently advanced deal
- meeting with excellent summary
- meeting with low-confidence summary
- deal with missing email data
- deal with stale CRM sync
- forecast improvement week
- forecast deterioration week
- strong rep
- coach-needed rep
- successful sync
- failed sync
- pending review
- missing transcript
- incomplete decision map
- data source disconnected

## 7.3 Role Views

Mock data must support:

- CEO summary
- manager summary
- rep summary

The same underlying objects should power all three role views.

## 7.4 Mock Before UI Definition Of Done

The mock system is only complete when:

1. every planned page can render from mock data
2. every chart has realistic numbers
3. every table has enough rows to feel real
4. every trust state has at least one visible example
5. every important Agent rationale path has evidence samples

---

## 8. Work Phases

## Phase 1: App Foundation

### Objective

Create the runnable app, test stack, shell, and centralized domain model.

### Outputs

- frontend app bootstrap
- testing setup
- app shell
- domain types
- enums
- semantics helpers

### Must Validate

- app runs
- tests run
- shell renders

---

## Phase 2: Full Mock System

### Objective

Build the complete mock data graph before full page composition.

### Outputs

- mock entities for every domain object
- derived selectors for page views
- role-based projections
- chart-ready mock aggregates
- evidence references

### Must Validate

- mock coverage includes all major states
- all pages can be wired without backend dependencies

---

## Phase 3: Shared UI Language

### Objective

Build reusable components for intelligence, trust, and Agent collaboration.

### Required Components

- `KpiCard`
- `AgentBriefCard`
- `ExplainableCard`
- `HealthScoreRing`
- `RiskTag`
- `StageTag`
- `ConfidenceBadge`
- `DataFreshnessBadge`
- `EvidenceDrawer`
- `Timeline`
- `AgentChatPanel`
- `SuggestionActionCard`
- `ForecastCard`
- `RepScoreCard`
- `WorkflowEventCard`

### Must Validate

- evidence is reachable from explainable cards
- stale and missing states are visually distinct
- apply and sync wording is distinct

---

## Phase 4: Full Page Implementation

### Objective

Build every planned frontend page against mocks.

### Build Order

1. `/home`
2. `/deals`
3. `/deals/[dealId]`
4. `/meetings`
5. `/meetings/[meetingId]`
6. `/pipeline`
7. `/revenue`
8. `/customers`
9. `/customers/[customerId]`
10. `/sales-team`
11. `/sales-team/[repId]`
12. `/recaps`
13. `/recaps/[recapId]`
14. `/agent`
15. `/agent-workflows`
16. `/data-sources`
17. `/settings`

### Page-Level Minimum Standard

Each page must have:

- realistic mock content
- clear primary purpose
- Agent collaboration entry
- trust/data state visibility where relevant
- loading, empty, and error states

---

## Phase 5: Live Agent Model Wiring

### Objective

Connect conversational Agent UI to the live model provider while keeping business state mocked.

### Files To Create

- `app/api/agent/chat/route.ts`
- `src/lib/model/provider.ts`
- `src/lib/model/glm-client.ts`
- `src/lib/model/prompts.ts`
- `src/lib/model/types.ts`

### Requirements

- read API key from environment
- treat `APIkey.md` as the local source-of-truth for provider selection
- never embed raw key in client source
- support page context injection into prompts
- support role-aware prompting
- keep business summaries deterministic where needed by using mock context

### Must Validate

- Agent panel can send and receive live model responses
- context from current page is included
- failures are handled gracefully

---

## Phase 6: End-To-End Validation

### Objective

Prove the major product journeys work with full mock data and live Agent chat.

### Required Journey Tests

1. manager home -> risky deal -> evidence -> next step -> apply
2. pipeline drag -> proposal pending -> confirm apply -> sync still separate
3. meeting detail -> inspect summary evidence -> edit -> confirm deal update
4. revenue page -> drill into risky driver -> open deal -> ask Agent why
5. data sources page -> disconnected source -> affected page shows degraded confidence

### Required Commands

```bash
npm run test
npm run build
npm run test:e2e
```

---

## 9. Detailed Task Breakdown

## Task 1: Bootstrap App

Create the Next.js project, add TypeScript, Tailwind, tests, and route scaffolding.

## Task 2: Define Domain Types

Create centralized types and enums for all entities and states.

## Task 3: Implement Semantics

Add helpers and tests for:

- suggestion
- confirm
- apply
- sync
- proposal
- confirm proposal
- cancel proposal

## Task 4: Build Full Mock Graph

Create all entity mocks plus derived role views and chart aggregates.

## Task 5: Build Shell

Implement left nav, top bar, page container, global Agent panel mount point.

## Task 6: Build Shared Components

Implement all trust, intelligence, evidence, and Agent UI building blocks.

## Task 7: Build Role Home Pages

Implement manager first, then CEO and rep variants.

## Task 8: Build Deal And Meeting Surfaces

Implement list/detail pages for deals and meetings.

## Task 9: Build Pipeline And Revenue

Implement charts, board, matrix, drilldowns, and revenue summaries.

## Task 10: Build Customers, Sales Team, Recaps

Implement the supporting analytical and coaching surfaces.

## Task 11: Build Agent Workspace And Workflow Pages

Implement conversation-first page and workflow event timeline page.

## Task 12: Build Data Sources And Settings

Implement data transparency page and placeholder settings page.

## Task 13: Wire Live Agent API

Implement model proxy and live conversation integration.

## Task 14: Validate End-To-End

Add smoke and journey tests, then run full verification.

---

## 10. Acceptance Criteria

The implementation is acceptable only if:

1. every planned frontend page exists and renders
2. every page uses shared domain objects
3. business data is mock-driven
4. Agent conversations use the configured model API
5. no business backend is required for the UI to work
6. evidence is reachable from every important AI conclusion
7. stale and missing data visibly degrade trust
8. pipeline drag remains proposal-first
9. `confirm`, `apply`, and `sync` remain distinct

---

## 11. Stop Conditions

Stop and ask the user if any of these become necessary:

- changing the frontend stack
- introducing real backend business APIs
- adding auth as a hard requirement
- persisting business state outside mocks
- changing model provider away from the one referenced in `APIkey.md`

---

## 12. Immediate Next Move For A Coding Agent

If starting fresh from this file:

1. bootstrap the app
2. define shared types and semantics tests
3. build the full mock graph
4. only then start page composition

Do not start with charts.
Do not start with final polish.
Do not start with a single isolated detail page.
Start with the shared model and the mock system.
