# AI Revenue Management OS Agent-First IA And Wireframe Spec For Coding Agent

## 1. Purpose
This document describes the information architecture, route structure, page composition, and low-fidelity wireframe intent for an AI coding agent.

It is not a visual design document.
It tells the coding agent:

- what pages exist
- what each page must contain
- how pages relate to each other
- what interaction blocks appear on each page
- where the Agent layer should live

The coding agent should use this spec to build layout and page structure before visual polish.

---

## 2. IA Philosophy

The app must be organized around three layers at the same time:

1. object layer
2. role layer
3. Agent collaboration layer

### 2.1 Object Layer

Primary objects:

- deals
- meetings
- accounts
- reps
- forecasts

These are stable and reusable.

### 2.2 Role Layer

Different roles see different summaries, but should still drill into the same underlying objects.

### 2.3 Agent Collaboration Layer

The Agent layer spans across all pages and is not confined to a single route.

Agent collaboration must exist as:

- a global side panel
- embedded brief cards on landing pages
- action cards on detail pages
- evidence and rationale views on intelligence cards

---

## 3. Top-Level Route Map

Recommended route tree:

```text
/
/home
/agent
/deals
/deals/:dealId
/meetings/:meetingId
/pipeline
/sales-team
/revenue
/recaps
/data-sources
/settings
```

### 3.1 MVP Routes To Build Fully

- `/home`
- `/deals`
- `/deals/:dealId`
- `/meetings/:meetingId`
- `/pipeline`

### 3.2 Phase 2 Placeholder Routes

- `/agent`
- `/sales-team`
- `/revenue`
- `/recaps`
- `/data-sources`
- `/settings`

Even placeholder routes should maintain shell consistency.

---

## 4. App Shell Wireframe

```text
+----------------------------------------------------------------------------------+
| Left Nav        | Top Bar: Search | Time | Team | Rep | Data | Notify | Agent  |
+----------------------------------------------------------------------------------+
|                  Main Content Area                                             |
|                                                                                |
|                                                                                |
|                                                                                |
+---------------------------------------------------------------+----------------+
| Optional page footer / bottom details                         | Agent Panel    |
|                                                               | collapsible    |
+---------------------------------------------------------------+----------------+
```

## 4.1 App Shell Rules

- left nav is always visible on desktop
- Agent panel is globally available and collapsible
- top bar owns shared filters and search
- page content should never be blocked by Agent panel; content area should responsively resize

## 4.2 Agent Panel States

- closed
- open with page context
- open with selected object context
- open with selected metric explanation context

---

## 5. Navigation IA

## 5.1 Left Navigation Order

1. Home
2. Agent Workspace
3. Pipeline
4. Deals
5. Meetings
6. Sales Team
7. Revenue Center
8. Recap And Training
9. Data Sources
10. Settings

## 5.2 Navigation Intent

- `Home` is role-based operational landing
- `Agent Workspace` is conversation-first mode
- `Pipeline` is team risk and stage analysis
- `Deals` is object discovery and prioritization
- `Meetings` is source-of-truth conversation intelligence

---

## 6. Home Page Wireframe

Route: `/home`
Primary role in MVP: sales manager

## 6.1 Layout Structure

```text
+------------------------------------------------------------------------------+
| KPI Row: Pipeline Health | New Deals | Stalled Deals | Team Score           |
+------------------------------------------------------------------------------+
| Agent Risk Brief Card                                                         |
| - 1 sentence summary                                                          |
| - 2 to 3 reasons                                                              |
| - 1 recommended action                                                        |
| - quick prompts                                                               |
+--------------------------------------+---------------------------------------+
| Deal Risk List                       | Conversion Funnel Snippet             |
| - top risky deals                    | - stage counts                        |
| - health/risk/data state             | - trend delta                         |
+--------------------------------------+---------------------------------------+
| Team Behavior Insights               | Coaching Suggestions                  |
+------------------------------------------------------------------------------+
```

## 6.2 Required Blocks

- KPI row
- Agent brief
- risky deals list
- funnel summary
- behavior insight panel
- coaching suggestion panel

## 6.3 Required Click Paths

- risky deal row -> deal detail
- brief card prompt -> open Agent panel with manager context
- funnel segment -> pipeline filtered state

## 6.4 UI Priority

Highest priority:

1. Agent brief
2. risky deals list
3. KPI row

The page should read like an operational brief, not like a BI dashboard.

---

## 7. Deal List Wireframe

Route: `/deals`

## 7.1 Layout Structure

```text
+------------------------------------------------------------------------------+
| Page Header: Deals | filters | saved view | bulk review                      |
+------------------------------------------------------------------------------+
| Table/List                                                                     |
| Deal | Account | Owner | Stage | Health | Win % | Amount | Next Step | Risk  |
| Data Status | Agent Note | Actions                                            |
+------------------------------------------------------------------------------+
| Row actions: open detail | ask Agent why | add to review                      |
+------------------------------------------------------------------------------+
```

## 7.2 Required Row Status Indicators

- risk badge
- health visual
- freshness badge
- Agent note preview

## 7.3 Row Interaction Model

Primary click:

- open deal detail

Secondary click:

- ask Agent why risky

Tertiary click:

- quick review selection

## 7.4 IA Notes

- do not overload the row with too many hidden hover actions
- keep risk reason within one click

---

## 8. Deal Detail Wireframe

Route: `/deals/:dealId`

## 8.1 Layout Structure

```text
+----------------------+-------------------------------------------+----------------------+
| Overview             | Main Intelligence                         | Agent Collaboration  |
|                      |                                           |                      |
| Deal title           | Deal Health Card                          | Next Step Card       |
| Account summary      | Win Probability Card                      | Generate Email       |
| Amount               | Risk Signals                              | Generate Brief       |
| Stage                | Customer Needs Summary                    | Request Review       |
| Owner                | Decision Map                              | Apply Internally     |
| Updated At           | Progress Timeline                         | Sync To CRM          |
| Data Completeness    | Data Status Banner                        | Chat / Regenerate    |
+----------------------+-------------------------------------------+----------------------+
| Tabs: Meetings | Communications | Activity Log | Agent Analysis                   |
+----------------------------------------------------------------------------------+
```

## 8.2 Information Hierarchy

Primary:

- deal health
- risk explanation
- next step

Secondary:

- win probability
- evidence timeline
- CRM-related actions

Tertiary:

- supporting tabs

## 8.3 Mandatory Interaction Rules

- `Apply internally` and `Sync to CRM` must be separate buttons
- if data is stale, show banner above intelligence cards
- evidence access must be available from health and next step cards
- Agent chat must inherit current deal context automatically

## 8.4 Tab Rules For MVP

- `Meetings`: fully implemented
- `Communications`: can be partial or placeholder
- `Activity Log`: basic timeline
- `Agent Analysis`: structured output history

---

## 9. Meeting Detail Wireframe

Route: `/meetings/:meetingId`

## 9.1 Layout Structure

```text
+----------------------------------------------------------------------------------+
| Meeting Header: title | account | deal | time | summary status | data status     |
+-----------------------------+--------------------------------+-------------------+
| Pre-Meeting Context         | Transcript + Highlights        | Agent QA Panel    |
| - account background        | - transcript viewer            | - ask about mtg   |
| - goals                     | - highlighted quotes           | - generate next   |
| - suggested questions       | - signal markers              | - challenge summary|
+-----------------------------+--------------------------------+-------------------+
| Post-Meeting Summary                                                               |
| - summary card                                                                      |
| - strengths                                                                         |
| - misses                                                                            |
| - action items                                                                      |
| - confirm to deal                                                                   |
+----------------------------------------------------------------------------------+
| Related Deal Snapshot | Evidence Drawer Trigger                                     |
+----------------------------------------------------------------------------------+
```

## 9.2 Primary Outcomes

- trust the summary
- edit the summary
- convert it into next action
- confirm what flows into deal state

## 9.3 Mandatory Correction Flow

```text
Agent summary generated
-> user inspects evidence
-> user edits or rejects
-> regenerate if needed
-> confirm version
-> apply to deal
```

The coding agent should ensure this flow is visible in the UI, not hidden in menus.

---

## 10. Pipeline Dashboard Wireframe

Route: `/pipeline`

## 10.1 Layout Structure

```text
+------------------------------------------------------------------------------+
| Header: Pipeline | time filter | team filter | view switch                   |
+------------------------------------------------------------------------------+
| Agent Risk Summary                                                         |
+--------------------------------------+---------------------------------------+
| Funnel View / Chart                 | Aging / Conversion Trend               |
+--------------------------------------+---------------------------------------+
| Health Matrix / Board View Toggle                                           |
+------------------------------------------------------------------------------+
| Drilldown / Selected Segment Details                                        |
+------------------------------------------------------------------------------+
```

## 10.2 View Modes

### Funnel View

- stage volume
- amount
- conversion

### Board View

- stage columns
- deal cards
- drag for simulation only
- pending proposal badge

### Health Matrix View

- x = stage
- y = health
- click point -> deal detail or Agent explanation

## 10.3 Mandatory Board State UX

When a card is dragged:

- show proposed destination
- mark row/card as pending
- show action footer or dialog
- allow cancel
- allow confirm internal apply
- optionally allow sync after confirm

The coding agent must not treat drag as immediate backend mutation.

---

## 11. Global Agent Panel Wireframe

Global and available from any page.

## 11.1 Layout Structure

```text
+--------------------------------------------------+
| Agent Panel Header                               |
| Context: Deal X / Pipeline / Meeting Y           |
+--------------------------------------------------+
| Conversation Thread                              |
| Agent: summary / reason / recommendation         |
| User: follow-up                                  |
| Agent: evidence-linked answer                    |
+--------------------------------------------------+
| Quick Prompts                                    |
| [Why risky?] [What next?] [Show evidence]        |
+--------------------------------------------------+
| Evidence List / Citations                        |
+--------------------------------------------------+
| Action Buttons                                   |
| [Edit] [Confirm] [Apply] [Sync] [Regenerate]     |
+--------------------------------------------------+
```

## 11.2 Panel Behavior Rules

- automatically reads page context
- can accept selected object context
- can accept selected metric context
- persists recent conversation within page session
- resets safely when object context changes

## 11.3 Human-Like Response Guidelines For UI Copy

The coding agent should make the Agent sound:

- concise
- confident but not absolute
- operational
- role-aware

Good example:

- "This deal looks risky because budget ownership is still unclear and the last two meetings did not produce a concrete next step."

Bad example:

- "Risk score increased to 74 due to multidimensional feature inference."

The voice should feel like a capable sales operator, not a model debug screen.

---

## 12. Evidence Architecture

Evidence is a first-class UI layer, not a hidden implementation detail.

## 12.1 Evidence Entry Points

Evidence should be reachable from:

- health cards
- next step cards
- meeting summary cards
- Agent chat answers
- forecast explanation cards in phase 2

## 12.2 Evidence Display Modes

- drawer
- inline expandable block
- side panel section

## 12.3 Evidence Payload Shape

Each evidence item should include:

- source type
- source timestamp
- quote or summary snippet
- relation to conclusion

---

## 13. Data State Architecture

Data quality must appear in the IA, not only in backend or settings.

## 13.1 Data State Tokens

Required visible states:

- fresh
- stale
- missing
- syncing
- sync failed

## 13.2 Required Placement

Show data state on:

- home brief cards
- deal rows
- deal detail header
- meeting detail header
- pipeline segments where relevant
- Agent context header

---

## 14. Responsive Behavior Priorities

Desktop-first is acceptable for MVP, but the coding agent should not hardcode impossible layouts.

## 14.1 Desktop

- full left nav
- optional open Agent side panel
- multi-column detail pages

## 14.2 Narrow Laptop

- left nav can collapse
- right Agent panel overlays instead of permanently docking
- detail pages can stack from 3 columns to 1 plus drawers

## 14.3 Avoid

- fixed-width intelligence cards that break when Agent panel opens
- action buttons hidden below long transcripts with no sticky affordance

---

## 15. Build Priorities By Structure

The coding agent should create layout and IA in this order:

1. app shell
2. left nav and top bar
3. global Agent panel
4. home page skeleton
5. deal list skeleton
6. deal detail skeleton
7. meeting detail skeleton
8. pipeline skeleton
9. evidence drawer and data badges
10. stateful actions

The goal is to establish the Agent-first structure before polishing individual widgets.

---

## 16. Final IA Check

The implementation matches the intended IA only if all of the following are true:

1. every core page has an Agent collaboration entry
2. every important AI conclusion has an evidence path
3. every state-changing recommendation has confirmation semantics
4. pipeline drag is proposal-first, not mutation-first
5. data freshness is visible where decisions are made
6. detail pages prioritize action and explanation over passive display

If these conditions are not met, the product is still behaving like a dashboard-first system rather than an Agent-first system.
