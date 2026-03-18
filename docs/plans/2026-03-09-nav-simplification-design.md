# Navigation Simplification Design

## Context

The current left navigation uses a large brand card that combines product label, demo badge, title, and descriptive copy.
This block visually outweighs the navigation itself and makes the shell feel crowded.

The approved direction is to make the left rail purely navigational and move the explanatory copy into the home landing area.

## Approved Direction

### Left Navigation

- Remove the current large brand card treatment.
- Keep only a compact `arm-demo` title at the top of the left rail.
- Preserve the existing navigation list and active-item behavior.
- Keep the left rail visually consistent with the current shell, but reduce vertical weight and visual competition.

### Home Top Section

- Move the demo explanation from the left rail into `/home`.
- Integrate that explanation into the topmost home header so the home page answers “what is this workspace” without adding a separate promotional block.
- Keep the page header focused on role-based operational context first, with the demo description as supporting copy.

## UX Intent

- The left rail should answer “where do I go”.
- The home header should answer “what is this demo and how should I read it”.
- The shell should feel lighter and less crowded without weakening the product identity.

## Scope

In scope:

- `AppShell` branding structure
- `/home` header copy
- shell and header styling needed to support the new hierarchy
- regression tests covering the new shell and home behavior

Out of scope:

- navigation IA changes
- top bar structure changes
- non-home page copy rewrites
- business data or Agent behavior changes

## Acceptance Criteria

1. The left rail shows only `arm-demo` as the brand title.
2. The left rail no longer shows `AI Revenue Management OS`, `Meeting-first Demo`, or the long demo description.
3. The home page top section includes the demo description that was removed from the left rail.
4. Existing navigation items and top bar chips remain intact.
5. Tests cover the changed shell and home content placement.
