# Mobile Shell Adaptation Design

## Goal

Adapt the existing AI Revenue Management OS frontend to phones without creating a separate product, route tree, or business logic path.

The same link must render:

- desktop shell and density on desktop browsers
- mobile shell and density on phone browsers

This design does not add new product capabilities or change page responsibilities.

## Constraints

- Keep the current route structure and page semantics.
- Keep the current shared domain model and agent semantics.
- Do not introduce separate mobile-only routes such as `/m` or `/mobile`.
- Do not split business logic between desktop and mobile.
- Preserve `suggestion`, `confirm`, `apply`, and `sync` semantics.
- Keep explainability, evidence access, and data freshness visibility reachable on mobile.

## Root Cause Note

The screenshot that looked "unstyled" is not sufficient evidence of a CSS compatibility failure by itself.

Observed evidence:

- A local WebKit/iPhone simulation renders the current CSS correctly.
- The temporary `trycloudflare.com` link has intermittently returned `530`, which can cause HTML to load while CSS chunks fail to load.

The implementation should still proceed with mobile adaptation, but the transport instability must not be confused with the responsive design problem.

## Product Position

This remains an `Agent-first` product on mobile.

Mobile adaptation should not turn the app into:

- a compressed desktop dashboard
- a chat-only shell
- a second, simplified product

The mobile version should preserve the current operating model while changing how information is staged and navigated.

## Chosen Approach

Use a shared application model with two presentation shells:

- `DesktopShell` for desktop and wide layouts
- `MobileShell` for phone layouts

Both shells consume the same page content, routes, data, and interaction semantics.

Differences between shells are limited to:

- navigation structure
- spatial composition
- component density
- panel presentation
- progressive disclosure for secondary content

## Why This Approach

This is the best balance between product continuity and mobile usability.

It avoids:

- maintaining separate mobile pages
- forking business logic
- forcing a three-column desktop shell into a phone viewport

It supports future iteration because new product work can continue to land in shared page modules and shared state, with shell-level adaptation layered on top.

## Adaptive Model

Adaptation should be driven by viewport and layout breakpoints, not by iPhone-only branching.

Rules:

- Desktop and tablet-wide layouts use the desktop shell.
- Phone-sized layouts use the mobile shell.
- iPhone and Android differences are handled only through compatibility details such as safe-area padding, dynamic viewport height, sticky behavior, and browser chrome overlap.

## Mobile Shell Principles

### 1. Same app, different shell

The user is still in the same app and same route.
Only the surrounding shell changes.

### 2. Agent-led hierarchy

On mobile, pages should lead with agent interpretation before dense supporting structure whenever the current page already exposes that summary.

### 3. Single-column feed

Complex pages become a single-column feed with clear sections.
Parallel desktop panels become stacked sections.

### 4. Progressive disclosure

Secondary evidence, timelines, and auxiliary analysis blocks may collapse behind section affordances, but the underlying information and actions remain available.

### 5. Interaction equivalence

Desktop interactions may change container on mobile while preserving meaning.

Examples:

- side panel -> bottom sheet
- wide table -> object card list
- parallel evidence columns -> stacked sections

## Mobile Navigation

### Bottom navigation

The mobile shell uses a persistent bottom navigation bar with:

- `Home`
- `Deals`
- `Meetings`
- `Pipeline`
- center `Agent` entry
- `More` for secondary routes

This mirrors the current information architecture more faithfully than a compressed three-tab model.

### More menu

Secondary routes remain accessible through `More`, including:

- revenue
- sales team
- recaps
- agent workflows
- data sources
- settings
- customers

### Persistent behavior

The bottom navigation remains visible on list pages and detail pages for consistency.

## Agent Presentation On Mobile

The global agent becomes a bottom sheet that:

- opens from the persistent center agent entry
- can be dragged from partial height to full-screen
- preserves page context
- does not create a separate business flow

This keeps the agent globally available without forcing a permanent side panel into a narrow viewport.

## Top Bar Adaptation

The current desktop top bar is too dense for phones.

On mobile, the top header should:

- keep brand recognition
- keep the most agent-like active summary
- avoid becoming a chip-heavy dashboard ribbon

The mobile header is therefore a compact briefing header rather than a direct port of the desktop command strip.

## Role Switching

Role switching remains visible at the top of applicable pages.

Mobile presentation:

- compact segmented pills near the top of the page

This keeps demo flows for CEO, manager, and rep visible without burying them in filters.

## Content Density Rules

### Cards

- Keep the same card semantics.
- Reduce padding and visual depth where necessary.
- Preserve freshness, confidence, risk, and sync state indicators.

### Tables

- Convert tabular lists into stacked object cards on phones.
- Preserve core row actions and object signals.

### Detail pages

- Use a single-column feed.
- Put the primary summary and recommended actions first.
- Follow with evidence, timeline, related meetings, and secondary analysis sections.
- Allow important secondary sections to collapse.

### Charts and board-like views

- Avoid forcing wide desktop compositions into narrow scroll prisons.
- Recompose into vertically grouped sections or horizontal slices only where interaction remains clear.

## Page-Specific Direction

### `/home`

- Keep the page as the existing role-based landing page.
- Move the strongest agent brief into the top of the mobile feed.
- Stack KPI, risky objects, and insight blocks below it.

### `/deals`

- Replace the desktop table layout with mobile deal cards.
- Preserve health, risk, next step, freshness, and agent note visibility.

### `/deals/:dealId`

- Keep deal summary, actions, evidence, timeline, and related intelligence.
- Reorder into a single feed with primary decision content first.

### `/meetings` and `/meetings/:meetingId`

- Keep meetings as their own page surface.
- Preserve recap, evidence, next step, and related deal context.
- Present them in a mobile reading and action order rather than a desktop split-pane order.

### `/pipeline`

- Preserve pipeline semantics and proposal-first interactions.
- Recompose the board for mobile rather than shrinking the desktop board.

### Remaining routes

Apply the same shell and density rules to all current routes after the phase-one primitives are stable.

## Compatibility Rules

The mobile implementation must explicitly account for:

- iPhone safe-area insets
- dynamic browser bars on iOS and Android
- sticky header and sticky footer interactions
- bottom navigation overlap with content
- long-press and touch target sizing

Compatibility fixes should be CSS- and layout-driven, not device-branch-driven.

## Phased Delivery

### Phase 1

- mobile shell
- mobile bottom navigation
- mobile agent sheet
- shared responsive primitives
- `home`
- `deals`
- `deals/:dealId`
- `meetings/:meetingId`
- `pipeline`

### Phase 2

- all remaining current routes
- final density and consistency cleanup across the app

## Success Criteria

The adaptation is successful when:

- the same URL renders appropriately on desktop and phone
- no separate mobile route tree exists
- phone layouts remain clearly `Agent-first`
- core actions and evidence paths remain reachable
- page responsibilities stay aligned with the existing product plan
- future feature work can continue to land in shared page logic with shell-level adaptations
