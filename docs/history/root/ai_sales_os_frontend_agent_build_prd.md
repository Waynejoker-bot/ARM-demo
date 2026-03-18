> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# AI Revenue Management OS Frontend Build PRD For Coding Agent

## 1. Purpose
This document is written for an AI coding agent, not for a human design team.

The goal is to turn the product plan into an implementation-ready specification with:

- stable scope
- explicit page responsibilities
- shared data contracts
- interaction semantics
- component boundaries
- phased delivery order
- acceptance criteria

The coding agent should optimize for:

1. shipping an `Agent-first` frontend product covering the planned frontend page system
2. avoiding semantic ambiguity in state-changing actions
3. keeping shared objects and components reusable across roles
4. making AI outputs explainable, editable, and confirmable
5. using mock data for all business content until a real backend exists

## 1.1 Current Implementation Mode

For the current build cycle, this project is not limited to the earlier MVP subset.

Current execution mode:

- build the full frontend page system described in the product plan
- do not build business backend data services
- use mock data for all page content and workflows
- ensure mock data is realistic enough to exercise all major business states
- connect final Agent conversation features to the model API referenced by `APIkey.md`

Allowed exception:

- a thin server-side proxy or route handler for model invocation only

Not allowed:

- building real CRM data services
- building real meeting ingestion pipelines
- blocking page implementation on backend readiness

---

## 2. Product Stance

The product is `Agent-first`, not `dashboard-first`.

Interpretation for implementation:

- dashboards and charts are supporting views
- the primary interaction layer is an Agent that can speak, explain, and take action in context
- every major page must expose both structured information and an Agent collaboration surface
- do not implement this as a pure analytics UI with a chatbot added later

Non-goal:

- do not make the whole app chat-only
- do not replace tables, charts, or detail pages with a single conversation page
- do not auto-apply AI outputs without explicit confirmation

---

## 3. Full Frontend Scope

## 3.1 In Scope

The current implementation target includes the full planned frontend page system:

1. role-based home pages
2. Agent workspace
3. revenue center
4. pipeline
5. deal list and deal detail
6. customer pages
7. meeting list and meeting detail
8. sales team pages
9. recap and training pages
10. Agent workflow pages
11. data sources pages
12. settings pages
13. global Agent side panel

## 3.2 Core Capabilities

The product must make these jobs work well across the page set:

1. meeting understanding
2. deal health explanation
3. next step generation
4. pipeline risk identification
5. revenue visibility
6. coaching and recap visibility
7. data source transparency
8. natural Agent dialogue in context

## 3.3 Out Of Scope

Do not build these in the current frontend cycle:

- real business backend services
- real CRM persistence
- real meeting ingestion services
- real authentication and org management unless later required

If useful, represent future integration points through adapters or placeholders.

## 3.4 Mock-First Requirement

All business-facing data must be mocked first.

The coding agent must:

1. define shared domain types
2. build a realistic full mock data layer
3. implement pages against the mock layer
4. keep business data replaceable later by real APIs

Mock coverage must include:

- healthy and risky deals
- stalled and progressing deals
- fresh, stale, and missing data states
- high-confidence and low-confidence Agent outputs
- successful and failed sync states
- multiple role views
- enough data volume for tables, dashboards, and charts to look realistic

---

## 4. Shared Domain Model

The coding agent must preserve one shared object model across all pages.

## 4.1 Core Entities

### `Account`
- id
- name
- industry
- size
- region
- owner_rep_id

### `Contact`
- id
- account_id
- name
- title
- role_type
- influence_level
- last_interaction_at

### `Deal`
- id
- account_id
- name
- owner_rep_id
- stage
- amount
- currency
- health_score
- health_label
- win_probability
- risk_level
- next_step_summary
- next_meeting_at
- updated_at
- data_freshness
- data_coverage

### `Meeting`
- id
- account_id
- deal_id
- title
- meeting_type
- scheduled_at
- status
- summary_status
- risk_signal_present
- transcript_status
- data_freshness

### `Conversation`
- id
- related_type
- related_id
- source_type
- timestamp
- summary
- raw_available

### `AgentOutput`
- id
- object_type
- object_id
- agent_type
- output_type
- status
- confidence
- summary
- rationale_items
- evidence_refs
- created_at
- updated_at
- user_feedback_status
- application_status
- sync_status

### `EvidenceRef`
- id
- source_type
- source_id
- quote
- timestamp
- relevance_reason

## 4.2 Shared Enums

The coding agent should centralize enums and never duplicate raw string literals in many places.

Required enums:

- `RoleType`: `ceo`, `manager`, `rep`
- `DealStage`: configurable stage values
- `RiskLevel`: `low`, `medium`, `high`
- `AgentType`: `meeting_agent`, `deal_agent`, `next_step_agent`, `crm_sync_agent`, `coaching_agent`
- `OutputStatus`: `draft`, `ready`, `confirmed`, `rejected`, `applied`
- `SyncStatus`: `not_synced`, `pending`, `synced`, `failed`
- `DataFreshnessStatus`: `fresh`, `stale`, `missing`

---

## 5. Global Interaction Semantics

These semantics are mandatory. The coding agent must encode them clearly in UI text, button labels, and state models.

## 5.1 Suggestion vs Confirmation vs Apply vs Sync

### `suggestion`
AI-generated result only. Not persisted as authoritative business state.

### `confirm`
User accepts or edits the suggestion.

### `apply`
Confirmed result is written into internal product state.

### `sync`
Applied result is pushed to CRM or an external system.

Never collapse these into one action.

## 5.2 Simulate vs Official Stage Change

Pipeline drag-and-drop in MVP is `simulation-first`.

Rules:

- dragging a deal card creates a proposed stage change
- proposal is visibly marked as not yet applied
- user must confirm before official change
- official change may optionally sync to CRM
- change reason and audit metadata should be supported in the model, even if simplified in MVP

## 5.3 Explainability Requirements

Every AI output card must display:

- conclusion
- confidence
- updated time
- data range
- data coverage
- up to 3 rationale bullets
- evidence entry point
- feedback or regenerate action

## 5.4 Data Quality Requirements

Every core page must expose:

- freshness state
- coverage state
- missing-source warning if applicable

Do not hide missing data behind a healthy-looking score.

## 5.5 Model Integration Requirements

Final Agent interactions in the UI must use the model API referenced by `APIkey.md`.

Implementation requirements:

- do not hardcode the API key in client-rendered code
- prefer reading the key from environment variables at runtime
- `APIkey.md` should be treated as a local reference source, not as a value to embed in shipped source code
- if using Next.js, use a thin route handler or server-side proxy for model requests
- only the Agent conversation layer should call the model API
- all business entities and analytics data must still come from mocks

Allowed:

- a lightweight `/api/agent/chat` style endpoint that forwards requests to the model provider

Not allowed:

- creating a general-purpose business backend
- blocking page rendering on live model responses
- replacing explainable mock business state with opaque model-generated state

---

## 6. App Shell Requirements

## 6.1 Layout

Implement a shared shell with:

- left navigation
- top context bar
- main content area
- global Agent side panel

## 6.2 Left Navigation Items

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

MVP can hide non-implemented routes behind placeholders, but route stubs should exist if useful for future expansion.

## 6.3 Top Bar

Required slots:

- global search
- time filter
- team filter
- rep filter
- notifications
- data status entry
- Agent open button

---

## 7. Page Specifications

## 7.1 Sales Manager Home

### Purpose
Show the manager what matters now, why it matters, and what action to take next.

### Required Sections

1. KPI summary row
2. Agent risk brief card
3. deal risk list
4. conversion funnel snippet
5. team behavior insight snippet
6. coaching suggestions

### Required KPI Cards

- pipeline health this week
- new deals this week
- stalled deal count
- team capability score placeholder

### Agent Risk Brief Card

Must include:

- one-sentence summary
- 2 to 3 reasons
- 1 recommended action
- quick follow-up prompts

### Acceptance Criteria

- manager can identify top risks without opening another page
- manager can jump from risk summary to related deal
- manager can open Agent panel in page context

## 7.2 Deal List

### Purpose
Surface which deals deserve attention and why.

### Required Table Columns

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

- sort by stage
- sort by health
- sort by amount
- sort by time
- filter by risk
- saved view placeholder
- open Agent explanation from row action

### Acceptance Criteria

- user can identify high-risk deals in under 10 seconds
- each risky row exposes a reason path via Agent or evidence entry

## 7.3 Deal Detail

### Purpose
Support decision, explanation, and action in one place.

### Layout

- left overview column
- main evidence and intelligence column
- right Agent collaboration column
- bottom tab section

### Left Overview Required Data

- deal title
- account summary
- amount
- stage
- owner
- updated time
- data completeness

### Main Column Required Blocks

- deal health card
- win probability card
- risk signals
- customer needs summary
- decision map placeholder
- progress timeline
- data status banner when stale or missing

### Right Agent Collaboration Required Blocks

- next step suggestion card
- generate email action
- generate brief action
- request review action
- apply internally action
- sync to CRM action
- chat with Agent
- reject or regenerate action

### Bottom Tabs For MVP

- meetings
- communications placeholder
- activity log
- Agent analysis

### Acceptance Criteria

- user can inspect why a deal is risky
- user can view evidence
- user can edit or confirm next step
- user can clearly distinguish apply vs sync

## 7.4 Meeting Detail

### Purpose
Turn meeting content into trustworthy, editable sales intelligence.

### Required Sections

- pre-meeting context
- transcript and highlights
- post-meeting summary
- action items
- related deal snapshot
- evidence viewer

### Required Actions

- mark summary incorrect
- edit key summary points
- regenerate summary
- generate next step
- confirm what syncs to deal

### Acceptance Criteria

- user can see source evidence for summary
- user can correct summary before it affects deal state
- user can produce a usable next action from the meeting

## 7.5 Pipeline Dashboard

### Purpose
Give the manager a team-level risk view plus drill-down into deal-level action.

### Required Views

- funnel view
- board view
- health matrix view

### Required Charts Or Visual Blocks

- stage funnel
- conversion trend
- aging distribution
- risk matrix
- rep comparison placeholder

### Board View Rules

- drag creates proposed change only
- unsaved state is visually obvious
- confirmation required for official change

### Acceptance Criteria

- user can identify stage bottlenecks
- user can identify late-stage low-health deals
- user can drill from chart to deal or Agent context

## 7.6 Global Agent Side Panel

### Purpose
Provide a universal contextual Agent across the product.

### Required Features

- open from any page
- aware of current page context
- can explain any selected card or row
- can generate next action
- can show evidence refs
- can accept feedback and regenerate

### Required Panel Structure

- header with current context
- conversation thread
- quick prompts
- evidence list
- action buttons

### Acceptance Criteria

- panel reflects current page object without extra user input
- panel can answer "why" for a highlighted metric or suggestion

---

## 8. Reusable Component Requirements

The coding agent should build reusable components first if they appear across 2 or more pages.

Required reusable components:

- `KpiCard`
- `AgentBriefCard`
- `HealthScoreRing`
- `RiskTag`
- `StageTag`
- `ConfidenceBadge`
- `DataFreshnessBadge`
- `ExplainableCard`
- `EvidenceDrawer`
- `Timeline`
- `AgentChatPanel`
- `SuggestionActionCard`
- `EmptyState`
- `ErrorState`
- `LoadingState`

Each component should support:

- loading state
- empty state if applicable
- compact and default size where useful

---

## 9. State Management Requirements

The coding agent should separate:

- server state
- UI state
- pending simulation state
- draft AI output state

Recommended state slices:

- auth and role
- filters
- current page context
- Agent panel state
- proposal changes for pipeline board
- draft confirmation forms

Never store authoritative backend objects only inside ad hoc local component state.

---

## 10. Routing Requirements

Recommended route shape:

- `/`
- `/home`
- `/deals`
- `/deals/:dealId`
- `/meetings/:meetingId`
- `/pipeline`
- `/agent`

If using nested layout, keep the Agent panel available at the app layout level.

---

## 11. Data Mocking Requirements

The coding agent should implement realistic mock data first.

Mocks must include:

- healthy deals
- high-risk deals
- stale-data deals
- low-confidence AI outputs
- meetings with missing transcript
- pipeline stage proposal states

This is required so the UX for trust, missing data, and correction can be tested before backend integration.

---

## 12. Error And Edge Case Requirements

The coding agent must account for:

- AI output unavailable
- transcript missing
- data stale
- CRM sync failed
- low confidence recommendation
- empty pipeline
- no meetings attached to a deal
- Agent regeneration in progress

Each of these should produce explicit UI states, not generic silent failure.

---

## 13. Delivery Order

Implement in this order:

1. app shell and shared layout
2. shared entity types and enums
3. reusable badges, cards, evidence drawer
4. global Agent side panel
5. sales manager home
6. deal list
7. deal detail
8. meeting detail
9. pipeline dashboard
10. proposal and confirmation semantics

Reason:

- the Agent layer and semantics must shape page implementation, not be patched on later

---

## 14. Definition Of Done

The MVP is done only if all of the following are true:

1. manager can discover a risky deal from home or pipeline
2. manager can open the deal and understand why it is risky
3. manager can inspect evidence
4. manager can ask the Agent what to do next
5. manager can confirm or edit the suggested next step
6. manager can apply it internally
7. manager can optionally sync it to CRM
8. stale or missing data is visible in the UI

If any of the above is missing, the app is not yet delivering the intended `Agent-first` workflow.

---

## 15. Implementation Notes For Coding Agent

When making implementation decisions:

- prefer explicit UX states over clever hidden automation
- prefer shared data model over per-page shortcuts
- prefer reversible actions over auto-committing AI actions
- prefer extension points for phase 2 modules
- prefer evidence-linked AI UI over decorative "AI badges"

Do not optimize for visual density first.
Optimize for trust, clarity, and actionability first.
