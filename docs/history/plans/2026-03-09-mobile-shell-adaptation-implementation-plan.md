> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Mobile Shell Adaptation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a responsive mobile shell to the existing AI Revenue Management OS frontend so the same routes render desktop layouts on desktop and phone-optimized layouts on mobile, without forking business logic.

**Architecture:** Introduce shell-level adaptation first, then layer mobile density variants into shared UI primitives and the highest-value routes. Keep routes, domain objects, page responsibilities, and agent semantics shared; only presentation containers and density change across breakpoints.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS in `app/globals.css`, Zustand, Vitest, Testing Library, Playwright/WebKit verification.

---

### Task 1: Add responsive shell test coverage

**Files:**
- Modify: `tests/unit/app/app-shell.test.tsx`
- Test: `tests/unit/app/app-shell.test.tsx`

**Step 1: Write the failing tests**

Add tests that assert:

- the shell exposes a mobile navigation landmark for phone layouts
- the desktop left navigation can be hidden from phone layouts while remaining in the DOM
- the mobile agent trigger is present as a distinct control

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/app/app-shell.test.tsx`

Expected: FAIL because the current shell renders only the desktop structure.

**Step 3: Write minimal implementation**

Update the shared shell component so it renders:

- a mobile navigation structure
- a mobile agent trigger
- accessible labels that let tests distinguish desktop and mobile shell landmarks

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/app/app-shell.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add tests/unit/app/app-shell.test.tsx src/components/shared/ui.tsx app/globals.css
git commit -m "feat: add responsive mobile shell scaffolding"
```

### Task 2: Add mobile shell styling and safe-area support

**Files:**
- Modify: `app/globals.css`
- Test: `tests/unit/app/app-shell.test.tsx`

**Step 1: Write the failing test**

Extend shell tests to assert classnames or structural markers needed for:

- mobile header
- bottom navigation
- main content spacing that accounts for mobile bottom chrome

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/app/app-shell.test.tsx`

Expected: FAIL because the new markers and layout hooks do not exist yet.

**Step 3: Write minimal implementation**

Add CSS and shell hooks for:

- desktop/mobile shell split
- mobile-safe bottom padding
- compact mobile top briefing header
- persistent bottom navigation
- mobile agent sheet container state

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/app/app-shell.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add app/globals.css tests/unit/app/app-shell.test.tsx src/components/shared/ui.tsx
git commit -m "feat: style mobile shell and navigation"
```

### Task 3: Add mobile list/card density coverage for deals and meetings

**Files:**
- Modify: `tests/unit/pages/meetings-page.test.tsx`
- Modify: `tests/unit/pages/sales-manager-cockpit-page.test.tsx`
- Modify: `tests/unit/pages/meeting-workbench-page.test.tsx`
- Modify: `tests/unit/pages/account-thread-page.test.tsx`
- Test: `tests/unit/pages/*.test.tsx`

**Step 1: Write the failing tests**

Add targeted assertions that mobile-friendly semantic wrappers exist for:

- summary cards
- stacked list groups
- collapsible or sectioned supporting content

Use shared test expectations rather than page-specific pixel assumptions.

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/pages/meetings-page.test.tsx tests/unit/pages/sales-manager-cockpit-page.test.tsx tests/unit/pages/meeting-workbench-page.test.tsx tests/unit/pages/account-thread-page.test.tsx`

Expected: FAIL because pages currently assume desktop composition.

**Step 3: Write minimal implementation**

Refactor shared page sections and page markup so key pages expose:

- mobile-ready feed sections
- stacked content ordering
- semantic wrappers for collapsible or secondary content blocks

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/pages/meetings-page.test.tsx tests/unit/pages/sales-manager-cockpit-page.test.tsx tests/unit/pages/meeting-workbench-page.test.tsx tests/unit/pages/account-thread-page.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add tests/unit/pages/meetings-page.test.tsx tests/unit/pages/sales-manager-cockpit-page.test.tsx tests/unit/pages/meeting-workbench-page.test.tsx tests/unit/pages/account-thread-page.test.tsx src/components src/features app
git commit -m "feat: adapt core pages to mobile feed layout"
```

### Task 4: Add mobile agent sheet interaction coverage

**Files:**
- Modify: `tests/unit/agent/agent-panel.test.tsx`
- Modify: `src/components/agent/agent-panel.tsx`
- Modify: `src/state/agent-panel-store.ts`

**Step 1: Write the failing tests**

Add tests that assert:

- the mobile agent entry opens the panel
- the panel exposes a sheet-like expanded state hook
- collapse/expand controls remain available

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/agent/agent-panel.test.tsx`

Expected: FAIL because the current panel is desktop-biased.

**Step 3: Write minimal implementation**

Adjust panel markup and state wiring to support a mobile sheet presentation while preserving existing desktop behavior.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/agent/agent-panel.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add tests/unit/agent/agent-panel.test.tsx src/components/agent/agent-panel.tsx src/state/agent-panel-store.ts app/globals.css src/components/shared/ui.tsx
git commit -m "feat: support mobile agent sheet behavior"
```

### Task 5: Verify phase-one responsive behavior end to end

**Files:**
- Modify: `playwright/` only if existing smoke coverage needs extension
- Optional artifact: local screenshots for manual verification

**Step 1: Write the failing verification if automation is needed**

If existing browser checks do not cover phone rendering, add the smallest possible browser assertion for:

- mobile shell presence
- bottom navigation presence
- route rendering on a phone-sized viewport

**Step 2: Run verification to confirm current failure**

Run the chosen browser verification command and confirm the shell does not yet satisfy the new mobile expectations before final implementation changes are complete.

**Step 3: Write minimal automation or final assertions**

Add only the verification needed to prove the responsive shell works on phone-sized viewports.

**Step 4: Run full verification**

Run:

```bash
npm test
npm run build
```

Then run a WebKit/iPhone viewport verification against the local app.

Expected:

- unit tests pass
- build passes
- phone viewport renders the mobile shell

**Step 5: Commit**

```bash
git add app src tests playwright
git commit -m "test: verify mobile shell phase one"
```
