> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Remove Global Top Bar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the global shell top bar so pages start directly with their own content headers.

**Architecture:** Delete the `top-bar` markup from `AppShell`, then trim only the CSS rules that exist solely to support that bar. Preserve shell layout, left navigation, and Agent panel behavior. Validate with a shell regression test first, then rerun impacted tests after the implementation.

**Tech Stack:** Next.js App Router, TypeScript, React Testing Library, Vitest, global CSS

---

### Task 1: Add the failing shell regression test

**Files:**
- Modify: `tests/unit/app/app-shell.test.tsx`
- Reference: `src/components/shared/ui.tsx`

**Step 1: Write the failing test**

Add assertions that the shell does not render:

- `Revenue Command Surface`
- `Command Search`
- `搜索商机、会议、纪要、风险信号`
- `演示模式`
- `Agent 已联动`

Keep the existing brand assertion.

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/app/app-shell.test.tsx`

Expected: FAIL because the current shell still renders the top bar content.

**Step 3: No production implementation in this task**

Do not edit production code until the failure is observed.

**Step 4: Record the failure and move to implementation**

Use the failure output as proof that the regression test is real.

### Task 2: Remove the shell top bar and dead CSS

**Files:**
- Modify: `src/components/shared/ui.tsx`
- Modify: `app/globals.css`
- Verify: `tests/unit/app/app-shell.test.tsx`
- Verify: `tests/unit/pages/design-system-page.test.tsx`

**Step 1: Write the minimal implementation**

- Remove the `<header className="top-bar">...</header>` block from `AppShell`.
- Remove only the CSS selectors that are now unused because of the deleted top bar:
  - `.top-bar`
  - `.top-bar-search-stack`
  - `.top-bar-kicker`
  - `.search-pill`
  - `.search-pill strong`
  - `.search-pill-label`
  - `.top-bar-meta`
  - `.context-chip`
  - `.context-chip-live`
  - `.context-chip-agent`
- Remove responsive overrides that only target `.top-bar` or `.top-bar-meta`.

**Step 2: Run the shell regression test**

Run: `npm run test -- tests/unit/app/app-shell.test.tsx`

Expected: PASS

**Step 3: Run impacted page verification**

Run: `npm run test -- tests/unit/pages/design-system-page.test.tsx`

Expected: PASS

**Step 4: Optional focused regression check**

Run: `npm run test -- tests/unit/app/app-shell.test.tsx tests/unit/pages/design-system-page.test.tsx`

Expected: both files pass in the same run.
