# Design System Mobile Card Wall Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a `/design-system` route that presents categorized mobile card previews and a tap-to-open full-screen card reader, then verify it locally and send the public link to Wayne on Feishu.

**Architecture:** Add a standalone route and local card-wall data source rather than folding this into an existing workspace page. Reuse the app shell and shared button/badge primitives, but create dedicated mobile card-wall components and CSS so the page reads like a real phone review surface instead of a dashboard. Finish by verifying route rendering, mobile interaction, public reachability, and Feishu delivery.

**Tech Stack:** Next.js App Router, TypeScript, React 19, existing global CSS, Vitest, Testing Library

---

### Task 1: Add navigation and route coverage

**Files:**
- Modify: `src/lib/navigation.ts`
- Create: `tests/unit/pages/design-system-page.test.tsx`
- Modify: `tests/unit/navigation/navigation-config.test.ts`

**Step 1: Write the failing tests**

- Add a navigation assertion for `/design-system`
- Add a page test that expects the page heading and at least one category title

**Step 2: Run tests to verify failure**

Run:

```bash
npm run test -- tests/unit/navigation/navigation-config.test.ts tests/unit/pages/design-system-page.test.tsx
```

Expected:
- navigation test fails because `/design-system` is absent
- page test fails because the route does not exist

**Step 3: Write minimal implementation**

- Add `{ href: "/design-system", label: "设计系统" }` to `primaryNavItems`
- Add a placeholder `app/design-system/page.tsx` returning the expected heading and category seed text

**Step 4: Run tests to verify pass**

Run:

```bash
npm run test -- tests/unit/navigation/navigation-config.test.ts tests/unit/pages/design-system-page.test.tsx
```

Expected:
- both tests pass

### Task 2: Add mobile card-wall data and preview components

**Files:**
- Create: `src/lib/design-system-card-wall.ts`
- Create: `src/components/design-system/card-wall.tsx`
- Modify: `tests/unit/pages/design-system-page.test.tsx`

**Step 1: Write the failing test**

- Extend the page test to expect:
  - six category sections
  - at least one preview card title in each relevant section
  - no visible `demo` copy

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- tests/unit/pages/design-system-page.test.tsx
```

Expected:
- page test fails because the placeholder page lacks structured card-wall content

**Step 3: Write minimal implementation**

- Define typed card-wall categories and seed card content
- Build preview sections using dedicated card preview components
- Keep card text business-real and annotation-free

**Step 4: Run test to verify pass**

Run:

```bash
npm run test -- tests/unit/pages/design-system-page.test.tsx
```

Expected:
- page test passes with real category content

### Task 3: Add full-screen mobile card reader interaction

**Files:**
- Modify: `src/components/design-system/card-wall.tsx`
- Modify: `tests/unit/pages/design-system-page.test.tsx`

**Step 1: Write the failing test**

- Add an interaction test that clicks a card preview and expects:
  - full-screen reader content to appear
  - close control to be visible
  - reader to close after tapping the close control

**Step 2: Run test to verify failure**

Run:

```bash
npm run test -- tests/unit/pages/design-system-page.test.tsx
```

Expected:
- interaction assertions fail because preview cards are not interactive yet

**Step 3: Write minimal implementation**

- Add selected-card UI state
- Render a full-screen overlay reader with scrollable content
- Add close interaction and preserve mobile-first layout

**Step 4: Run test to verify pass**

Run:

```bash
npm run test -- tests/unit/pages/design-system-page.test.tsx
```

Expected:
- interaction test passes

### Task 4: Refine styling for phone-truthful review

**Files:**
- Modify: `app/globals.css`
- Modify: `src/components/design-system/card-wall.tsx`

**Step 1: Write the failing test**

- No new unit test; use the existing route test suite as protection

**Step 2: Implement styling**

- Add dedicated card-wall classes
- Constrain previews to phone-like widths
- Improve reading rhythm, section spacing, overlay depth, and mobile controls
- Ensure the page still behaves cleanly when the global agent panel is open

**Step 3: Run regression tests**

Run:

```bash
npm run test -- tests/unit/navigation/navigation-config.test.ts tests/unit/pages/design-system-page.test.tsx
```

Expected:
- tests remain green

### Task 5: Verify route and deliver the link

**Files:**
- No code changes required unless verification reveals issues

**Step 1: Run broader verification**

Run:

```bash
npm run test -- tests/unit/navigation/navigation-config.test.ts tests/unit/pages/design-system-page.test.tsx tests/unit/app/app-shell.test.tsx
```

Expected:
- all targeted tests pass

**Step 2: Verify the route manually**

- Start the app if needed
- Confirm `/design-system` renders and card open/close works in a mobile viewport
- Confirm the public URL returns `200`

**Step 3: Send Feishu message**

- Use `~/.codex/skills/feishu-send-message/scripts/send_feishu_message.py`
- Send the verified public `/design-system` link to Wayne
- Capture the returned `message_id`
