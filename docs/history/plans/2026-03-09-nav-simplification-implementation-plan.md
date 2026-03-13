> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Navigation Simplification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify the left navigation so it keeps only the `arm-demo` title and move the removed demo description into the `/home` top header.

**Architecture:** Keep the change local to the shared app shell, the home route, and shell/header CSS. Protect the behavior with focused UI tests so the navigation remains minimal while the home page absorbs the explanatory copy.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Vitest, Testing Library, global CSS

---

### Task 1: Lock the new shell behavior with a failing test

**Files:**
- Modify: `tests/unit/app/app-shell.test.tsx`
- Test: `tests/unit/app/app-shell.test.tsx`

**Step 1: Write the failing test**

Add a test that renders `AppShell` and asserts:

- `arm-demo` is visible in the left rail
- `AI Sales OS` is not rendered
- `Meeting-first Demo` is not rendered
- the old descriptive paragraph is not rendered

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/app/app-shell.test.tsx`

Expected: FAIL because the current shell still renders the large brand card content.

**Step 3: Write minimal implementation**

Update `src/components/shared/ui.tsx` so the left navigation brand area only renders a compact `arm-demo` title.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/app/app-shell.test.tsx`

Expected: PASS

### Task 2: Lock the new home header behavior with a failing test

**Files:**
- Create: `tests/unit/pages/home-page.test.tsx`
- Test: `tests/unit/pages/home-page.test.tsx`

**Step 1: Write the failing test**

Add a test that renders the default manager home page and asserts the top header contains the demo description:

`以 Agent 为核心交互、以 Meeting 驱动推进、以 mock 数据完成演示闭环。`

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/pages/home-page.test.tsx`

Expected: FAIL because the current `/home` page header does not include that copy.

**Step 3: Write minimal implementation**

Update `app/home/page.tsx` so the manager home top `PageHeader` includes the demo description alongside the existing role-focused copy.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/pages/home-page.test.tsx`

Expected: PASS

### Task 3: Refine shell and header styling

**Files:**
- Modify: `app/globals.css`

**Step 1: Write the failing test**

No extra CSS-only test. Use the existing UI behavior tests from Tasks 1 and 2 as regression coverage.

**Step 2: Run test to verify it fails**

Not applicable for CSS-only refinement.

**Step 3: Write minimal implementation**

Adjust shell styles to:

- replace the large branded card with a compact title block
- rebalance nav spacing after the card removal
- support a slightly richer home header copy without making the page feel taller

**Step 4: Run test to verify it passes**

Run:

- `npm test -- tests/unit/app/app-shell.test.tsx`
- `npm test -- tests/unit/pages/home-page.test.tsx`

Expected: PASS

### Task 4: Final verification

**Files:**
- Verify only

**Step 1: Run targeted regression tests**

Run:

- `npm test -- tests/unit/app/app-shell.test.tsx tests/unit/pages/home-page.test.tsx tests/unit/app/root-page.test.tsx`

Expected: PASS

**Step 2: Run build verification**

Run: `npm run build`

Expected: exit 0

**Step 3: Review diff**

Run: `git diff -- docs/plans/2026-03-09-nav-simplification-design.md docs/plans/2026-03-09-nav-simplification-implementation-plan.md src/components/shared/ui.tsx app/home/page.tsx app/globals.css tests/unit/app/app-shell.test.tsx tests/unit/pages/home-page.test.tsx`

Expected: only the planned files change for this task.
