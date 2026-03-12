# Design System Merged Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Merge the existing design-principles version and the live mobile card-wall version into a single `/design-system` page in this codebase and expose one public link for review.

**Architecture:** Keep `/design-system` as one page that renders four layers in order: design framing, background directions, universal card container and variant gallery, then the real mobile card wall. Reuse the existing `CardWall` component for the live content, add a dedicated design-system content model for the older review sections, and preserve the current full-screen card-reader interaction.

**Tech Stack:** Next.js app router, React client components, Vitest, CSS in `app/globals.css`

---

### Task 1: Lock merged-page expectations with tests

**Files:**
- Modify: `tests/unit/pages/design-system-page.test.tsx`

**Step 1: Write the failing test**

Add assertions for:
- page header text `设计系统`
- legacy review sections `Background Directions`, `Universal Card Container`, `Card Gallery`
- current live section heading `卡片墙`
- one representative legacy card title and one representative real card-wall title

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`
Expected: FAIL because the current page only renders the real card wall.

**Step 3: Do not touch production code yet**

Leave the page implementation unchanged until the failure is confirmed.

**Step 4: Commit**

Do not commit in this session unless explicitly requested.

### Task 2: Port the design-principles content and gallery into this codebase

**Files:**
- Create: `src/lib/design-system-review-content.ts`
- Create: `src/components/design-system/design-variant-gallery.tsx`

**Step 1: Write the minimal content model**

Add structured data for:
- background directions
- variant cards

**Step 2: Implement the minimal gallery**

Add a client component that:
- renders desktop variant cards inline
- renders a mobile card list with a fullscreen detail view

**Step 3: Keep scope tight**

Do not redesign the live `CardWall`; this task only ports the old review layer.

### Task 3: Merge both versions into one `/design-system` page

**Files:**
- Modify: `app/design-system/page.tsx`

**Step 1: Add the design review header and principle sections**

Render:
- `PageHeader`
- review brief
- `Background Directions`
- `Universal Card Container`
- `Card Gallery`

**Step 2: Append the real mobile card wall**

Render the current `CardWall` below the design review sections, inside the same page.

**Step 3: Preserve one route**

Do not add a second design-system path. Everything stays on `/design-system`.

### Task 4: Add styling for the merged review layer without regressing the live card wall

**Files:**
- Modify: `app/globals.css`

**Step 1: Add only the classes required by the review layer**

Port and adapt styles for:
- review brief
- direction cards
- universal container
- variant gallery
- mobile detail dialog

**Step 2: Keep the live card-wall styles intact**

Avoid rewriting the existing `.card-wall-*` rules beyond what is required for composition.

### Task 5: Verify merged behavior and public availability

**Files:**
- None

**Step 1: Run focused tests**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx tests/unit/navigation/navigation-config.test.ts tests/unit/app/app-shell.test.tsx`

Expected: PASS

**Step 2: Run a production build**

Run: `npm run build`

Expected: exit 0 with `/design-system` present in the route output

**Step 3: Verify the active public link**

Run:
- `curl -sS -I https://waves-zen-clients-manga.trycloudflare.com/design-system`
- `curl -sSf https://waves-zen-clients-manga.trycloudflare.com/design-system | rg "设计系统|Background Directions|卡片墙"`

Expected:
- HTTP 200
- content contains both the review layer and the live card-wall layer
