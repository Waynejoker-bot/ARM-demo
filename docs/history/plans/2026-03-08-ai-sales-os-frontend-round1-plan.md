> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# AI Sales OS Frontend Round 1 Implementation Plan

## 1. Purpose

This plan is written for an AI coding agent to start implementation directly.

It assumes the current repository is documentation-first and does not yet contain a frontend codebase.

This plan is the first execution plan for the `Agent-first` MVP, not the full product roadmap.

Primary source documents:

- `AGENTS.md`
- `ai_sales_os_frontend_agent_build_prd.md`
- `ai_sales_os_frontend_agent_first_ia_wireframes.md`
- `ai_sales_os_frontend_product_plan.md`

---

## 2. Round 1 Goal

Round 1 must create a working frontend skeleton that proves the core `Agent-first` interaction model.

At the end of Round 1, the app should support this end-to-end mocked flow:

```text
Manager opens home
-> sees Agent risk brief
-> opens a risky deal
-> sees explainable health/risk state
-> opens evidence
-> reviews next step suggestion
-> confirms or edits suggestion
-> applies internally
-> optionally prepares sync to CRM
```

Round 1 is successful if the product already feels like:

- a structured app
- with an embedded sales Agent
- with explainability and action semantics

and not like:

- a blank shell
- or a dashboard with decorative AI text

---

## 3. Scope

## 3.1 In Scope For Round 1

- project bootstrap
- app shell
- shared domain model
- mock data system
- reusable trust and intelligence components
- global Agent side panel
- `/home`
- `/deals`
- `/deals/[dealId]`
- `/meetings/[meetingId]`
- `/pipeline`
- action semantics for `suggestion`, `confirm`, `apply`, `sync`
- pipeline drag proposal state
- test setup and initial test coverage

## 3.2 Out Of Scope For Round 1

- real backend integration
- authentication
- full CEO mode
- revenue center
- sales team analytics
- recap/training module
- complete communications inbox
- real CRM sync

These may be represented with placeholders or fake adapters if needed.

---

## 4. Technical Assumptions

Because the repository does not yet contain a frontend app, the coding agent should start with this default stack unless the user overrides it:

- `Next.js` with App Router
- `TypeScript`
- `Tailwind CSS`
- `Zustand` for UI and proposal state
- `TanStack Query` for server-like mock query boundaries
- `Vitest` + `Testing Library` for unit and component tests
- `Playwright` for one or two MVP smoke flows
- `dnd-kit` for pipeline proposal dragging

If the user later requests another stack, adapt then.
Do not preemptively optimize for many frameworks.

---

## 5. Definition Of Done For Round 1

Round 1 is done only if all of the following are true:

1. The app boots locally.
2. Shared layout with left nav, top bar, and global Agent panel exists.
3. `/home`, `/deals`, `/deals/[dealId]`, `/meetings/[meetingId]`, and `/pipeline` render with realistic mock data.
4. Deal health and next step cards are explainable.
5. Evidence is reachable from the UI.
6. Data freshness and missing state are visible.
7. `confirm`, `apply`, and `sync` are distinct in UI wording and state handling.
8. Pipeline drag creates a proposal, not an immediate mutation.
9. Tests exist for the most important semantics and critical UI flows.
10. Verification commands have been run and inspected.

---

## 6. Target File Structure

The coding agent should aim for this file structure in Round 1:

```text
app/
  layout.tsx
  page.tsx
  globals.css
  home/page.tsx
  deals/page.tsx
  deals/[dealId]/page.tsx
  meetings/[meetingId]/page.tsx
  pipeline/page.tsx

src/
  components/
    app-shell/
    agent/
    intelligence/
    data-state/
    pipeline/
    deal/
    meeting/
    shared/
  features/
    home/
    deals/
    meetings/
    pipeline/
  lib/
    domain/
    semantics/
    mocks/
    routes/
    utils/
  state/
    agent-panel-store.ts
    filters-store.ts
    proposal-store.ts
  styles/

tests/
  unit/
  integration/

playwright/
  smoke/
```

The agent may rename folders slightly if there is a strong reason, but must keep:

- domain types centralized
- semantics centralized
- mocks centralized
- page-level feature modules separated from shared components

---

## 7. Work Order

Implement in this order:

1. Bootstrap the app and test tooling
2. Create shared types, enums, and semantics
3. Create mock data and fake query boundaries
4. Create app shell
5. Create reusable trust and intelligence components
6. Create global Agent side panel
7. Create `/home`
8. Create `/deals`
9. Create `/deals/[dealId]`
10. Create `/meetings/[meetingId]`
11. Create `/pipeline`
12. Add integration and smoke coverage

This order is mandatory because pages must be built on top of stable semantics and shell structure.

---

## 8. Detailed Execution Plan

## Task 1: Bootstrap Project

### Goal

Create a minimal frontend app that can run tests and render a shell.

### Files To Create

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `postcss.config.js`
- `tailwind.config.ts`
- `vitest.config.ts`
- `playwright.config.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `.gitignore`

### Steps

1. Initialize `Next.js` + `TypeScript` + `Tailwind`.
2. Add test and E2E dependencies.
3. Add scripts for `dev`, `build`, `test`, `test:watch`, `test:e2e`, `lint`.
4. Make `/` redirect or alias to `/home`.

### Minimum Validation

- app starts
- test runner starts
- one smoke route renders

### Commands To Verify

```bash
npm install
npm run test
npm run build
```

---

## Task 2: Create Shared Domain Model And Semantics

### Goal

Create the stable object layer and interaction semantics before page implementation.

### Files To Create

- `src/lib/domain/types.ts`
- `src/lib/domain/enums.ts`
- `src/lib/semantics/agent-actions.ts`
- `src/lib/semantics/pipeline-proposals.ts`
- `tests/unit/semantics/agent-actions.test.ts`
- `tests/unit/semantics/pipeline-proposals.test.ts`

### Must Implement

- `Account`
- `Contact`
- `Deal`
- `Meeting`
- `Conversation`
- `AgentOutput`
- `EvidenceRef`

### Required Enums

- `RoleType`
- `RiskLevel`
- `AgentType`
- `OutputStatus`
- `SyncStatus`
- `DataFreshnessStatus`

### Required Semantics

- `suggestion`
- `confirm`
- `apply`
- `sync`
- `proposal`
- `cancelProposal`
- `confirmProposal`

### TDD Sequence

1. Write failing tests for action state transitions.
2. Write failing tests for pipeline proposal semantics.
3. Implement the minimum domain helpers to pass.
4. Refactor without changing behavior.

### Acceptance Criteria

- illegal state transitions are prevented
- `apply` does not imply `sync`
- pipeline drag proposal is represented distinctly from committed stage

---

## Task 3: Build Mock Data System

### Goal

Provide realistic fake data so UX can be validated before backend work exists.

### Files To Create

- `src/lib/mocks/accounts.ts`
- `src/lib/mocks/deals.ts`
- `src/lib/mocks/meetings.ts`
- `src/lib/mocks/agent-outputs.ts`
- `src/lib/mocks/evidence.ts`
- `src/lib/mocks/index.ts`
- `src/lib/mocks/query-client.ts`
- `tests/unit/mocks/mock-shapes.test.ts`

### Required Mock Cases

- healthy deal
- high-risk deal
- stale-data deal
- low-confidence next step
- meeting with transcript
- meeting without transcript
- pipeline card with pending proposal
- failed sync state

### Acceptance Criteria

- every page can be built against mocks
- trust states are represented in the data set

---

## Task 4: Create App Shell

### Goal

Create the global structure that all pages share.

### Files To Create

- `src/components/app-shell/app-shell.tsx`
- `src/components/app-shell/left-nav.tsx`
- `src/components/app-shell/top-bar.tsx`
- `src/components/app-shell/page-container.tsx`
- `src/components/app-shell/app-shell.test.tsx`

### Required UI Regions

- left navigation
- top bar
- main content area
- Agent panel mount point

### Required Navigation Items

- Home
- Agent Workspace
- Pipeline
- Deals
- Meetings
- Sales Team
- Revenue Center
- Recap And Training
- Data Sources
- Settings

### Acceptance Criteria

- shell renders consistently on all built routes
- current route is visible in nav
- top bar has placeholders for shared filters and search

---

## Task 5: Create Reusable Trust And Intelligence Components

### Goal

Build the common component language before composing pages.

### Files To Create

- `src/components/shared/kpi-card.tsx`
- `src/components/intelligence/explainable-card.tsx`
- `src/components/intelligence/health-score-ring.tsx`
- `src/components/intelligence/confidence-badge.tsx`
- `src/components/data-state/data-freshness-badge.tsx`
- `src/components/shared/risk-tag.tsx`
- `src/components/shared/stage-tag.tsx`
- `src/components/intelligence/evidence-drawer.tsx`
- `src/components/agent/agent-brief-card.tsx`
- `tests/unit/components/explainable-card.test.tsx`
- `tests/unit/components/data-freshness-badge.test.tsx`

### Required Behaviors

- loading state
- empty state where applicable
- visible evidence entry point
- visible freshness status
- clear confidence display

### Acceptance Criteria

- explainable cards always show conclusion and evidence entry
- data freshness badge distinguishes `fresh`, `stale`, and `missing`

---

## Task 6: Create Global Agent Side Panel

### Goal

Implement the universal Agent collaboration layer.

### Files To Create

- `src/state/agent-panel-store.ts`
- `src/components/agent/agent-panel.tsx`
- `src/components/agent/agent-thread.tsx`
- `src/components/agent/agent-quick-prompts.tsx`
- `src/components/agent/agent-context-header.tsx`
- `src/components/agent/agent-action-bar.tsx`
- `tests/unit/agent/agent-panel-store.test.ts`
- `tests/integration/agent-panel-context.test.tsx`

### Must Support

- open and close state
- page context
- selected object context
- selected metric explanation context
- quick prompts
- evidence list
- action buttons

### Acceptance Criteria

- opening from a page inherits current context automatically
- panel can answer `why risky` using mock rationale and evidence refs
- panel exposes distinct actions for edit, confirm, apply, sync, regenerate

---

## Task 7: Implement `/home`

### Goal

Create a sales-manager operational landing page.

### Files To Create

- `app/home/page.tsx`
- `src/features/home/home-page.tsx`
- `src/features/home/home-kpi-row.tsx`
- `src/features/home/home-risk-list.tsx`
- `src/features/home/home-funnel-snippet.tsx`
- `src/features/home/home-coaching-panel.tsx`
- `tests/integration/home-page.test.tsx`

### Required Sections

- KPI row
- Agent risk brief
- risky deals list
- funnel summary
- team behavior insights
- coaching suggestions

### Acceptance Criteria

- a manager can identify top risks in one screen
- clicking a risky deal opens detail
- Agent brief can open the panel in manager context

---

## Task 8: Implement `/deals`

### Goal

Create the prioritization surface for all deals.

### Files To Create

- `app/deals/page.tsx`
- `src/features/deals/deal-list-page.tsx`
- `src/features/deals/deal-table.tsx`
- `src/features/deals/deal-row-actions.tsx`
- `src/state/filters-store.ts`
- `tests/integration/deal-list-page.test.tsx`

### Required Table Fields

- deal name
- account
- owner
- stage
- health
- win probability
- amount
- next step
- next meeting
- risk
- data status
- latest Agent note

### Required Interactions

- sort
- risk filter
- ask Agent why risky
- open detail

### Acceptance Criteria

- high-risk deals are easy to identify
- each risky row has a one-click explanation path

---

## Task 9: Implement `/deals/[dealId]`

### Goal

Create the primary explain-and-act workspace for a single deal.

### Files To Create

- `app/deals/[dealId]/page.tsx`
- `src/features/deals/deal-detail-page.tsx`
- `src/features/deals/deal-overview-panel.tsx`
- `src/features/deals/deal-main-intelligence.tsx`
- `src/features/deals/deal-agent-column.tsx`
- `src/features/deals/deal-tabs.tsx`
- `src/state/proposal-store.ts`
- `tests/integration/deal-detail-page.test.tsx`

### Required UI Blocks

- overview panel
- explainable health card
- explainable win probability card
- risk signals
- customer needs summary
- progress timeline
- next step suggestion
- apply internally action
- sync to CRM action
- Agent chat access

### Required Semantic Tests

- `apply` updates internal state only
- `sync` is still pending until explicit user action
- stale-data banner appears when needed

### Acceptance Criteria

- user can inspect evidence for health and next step
- user can edit or confirm suggestion
- user can distinguish `apply` from `sync`

---

## Task 10: Implement `/meetings/[meetingId]`

### Goal

Turn meeting intelligence into an editable, trustworthy object page.

### Files To Create

- `app/meetings/[meetingId]/page.tsx`
- `src/features/meetings/meeting-detail-page.tsx`
- `src/features/meetings/pre-meeting-panel.tsx`
- `src/features/meetings/transcript-panel.tsx`
- `src/features/meetings/post-meeting-summary.tsx`
- `src/features/meetings/meeting-agent-panel.tsx`
- `tests/integration/meeting-detail-page.test.tsx`

### Required UI Blocks

- pre-meeting context
- transcript and highlights
- post-meeting summary
- action items
- related deal snapshot
- evidence access
- summary correction controls

### Required Actions

- mark summary incorrect
- edit summary
- regenerate summary
- confirm what applies to deal

### Acceptance Criteria

- summary has a visible evidence path
- user can correct summary before it affects deal state

---

## Task 11: Implement `/pipeline`

### Goal

Create a team-level pipeline intelligence page with proposal-first stage movement.

### Files To Create

- `app/pipeline/page.tsx`
- `src/features/pipeline/pipeline-page.tsx`
- `src/features/pipeline/pipeline-funnel-view.tsx`
- `src/features/pipeline/pipeline-board-view.tsx`
- `src/features/pipeline/pipeline-health-matrix.tsx`
- `src/features/pipeline/pipeline-proposal-bar.tsx`
- `tests/integration/pipeline-page.test.tsx`
- `tests/integration/pipeline-board-proposal.test.tsx`

### Required Views

- funnel view
- board view
- health matrix view

### Required Board Behavior

- dragging creates pending proposal
- pending proposal is visually obvious
- user can cancel proposal
- user can confirm proposal into internal state
- sync remains separate

### Acceptance Criteria

- no drag action silently mutates final stage
- user can drill from pipeline element to deal detail or Agent context

---

## Task 12: Add Smoke Flows And Final Verification

### Goal

Prove the critical mocked MVP path works.

### Files To Create

- `playwright/smoke/manager-risk-flow.spec.ts`
- `playwright/smoke/pipeline-proposal-flow.spec.ts`

### Required Smoke Flow 1

```text
/home
-> open risky deal
-> inspect explainable card
-> open evidence
-> confirm next step
-> apply internally
```

### Required Smoke Flow 2

```text
/pipeline
-> drag deal card
-> see proposal pending state
-> confirm proposal
-> verify sync remains separate
```

### Final Commands

```bash
npm run test
npm run build
npm run test:e2e
```

---

## 9. Implementation Constraints

The coding agent must not violate these constraints:

- do not invent incompatible per-page data models
- do not auto-apply Agent outputs
- do not make evidence a hidden or secondary afterthought
- do not hide stale or missing data
- do not combine `confirm`, `apply`, and `sync`
- do not treat pipeline drag as final mutation
- do not add phase 2 pages during round 1

---

## 10. Suggested Checkpoint Commits

If the user later requests commits, use these slices:

1. `chore: bootstrap frontend app shell and test tooling`
2. `feat: add shared domain model and agent semantics`
3. `feat: build global agent panel and trust components`
4. `feat: add manager home and deals list`
5. `feat: add deal and meeting detail workflows`
6. `feat: add pipeline proposal workflow and smoke tests`

Do not commit unless the user explicitly asks.

---

## 11. Stop Conditions

Stop and ask the user before continuing if:

- a different frontend stack is preferred
- auth must be included in round 1
- real backend integration becomes required
- CRM sync must become real in round 1
- the user wants revenue center or CEO mode moved into round 1

---

## 12. Handoff Summary

If a coding agent starts from this file, the first immediate move should be:

1. bootstrap the app and test stack
2. create shared domain types and semantics tests
3. build shell and Agent panel before any page-specific polish

Do not start with visual polish.
Do not start with Revenue Center.
Do not start with isolated charts.
Start with the `Agent-first` core loop.
