> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Mobile Shell Phase Two Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extend the phase-one mobile shell adaptation across the remaining route families so every current page renders coherently on phones under the same URL and shared interaction model.

**Architecture:** Reuse the mobile shell and responsive section metadata introduced in phase one. Adapt remaining routes by annotating shared page sections, converting remaining table-like views to mobile card density, and tightening mobile spacing without altering route responsibilities or business logic.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS in `app/globals.css`, Vitest, Testing Library, Playwright/WebKit verification.

---

### Task 1: Add route coverage tests for remaining top-level surfaces

**Files:**
- Create or modify: `tests/unit/pages/home-page.test.tsx`
- Create or modify: `tests/unit/pages/deals-page.test.tsx`
- Create or modify: `tests/unit/pages/pipeline-page.test.tsx`
- Create or modify: `tests/unit/pages/revenue-page.test.tsx`
- Create or modify: `tests/unit/pages/data-sources-page.test.tsx`
- Create or modify: `tests/unit/pages/agent-workspace-page.test.tsx`

**Step 1: Write the failing tests**

Add tests that assert the remaining pages expose mobile adaptation hooks such as:

- primary mobile sections
- card-density conversion hooks
- collapsible or secondary mobile sections where applicable

**Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/unit/pages/home-page.test.tsx tests/unit/pages/deals-page.test.tsx tests/unit/pages/pipeline-page.test.tsx tests/unit/pages/revenue-page.test.tsx tests/unit/pages/data-sources-page.test.tsx tests/unit/pages/agent-workspace-page.test.tsx
```

Expected: FAIL because the current pages are not fully annotated for mobile behavior.

**Step 3: Write minimal implementation**

Annotate remaining pages with shared mobile section metadata and mobile density semantics using the existing `PageHeader`, `SectionCard`, and shared list/table primitives.

**Step 4: Run test to verify it passes**

Run the same command and confirm all added tests pass.

**Step 5: Commit**

```bash
git add app src/components tests/unit/pages
git commit -m "feat: adapt remaining route surfaces for mobile"
```

### Task 2: Tighten shared mobile density for the remaining route patterns

**Files:**
- Modify: `app/globals.css`
- Modify any shared components needed in `src/components/shared/` and `src/components/intelligence/`

**Step 1: Write the failing test**

Extend page tests to assert the remaining route families use the correct mobile density markers for:

- table-like lists
- multi-card grids
- secondary detail sections

**Step 2: Run test to verify it fails**

Run the targeted failing test command from Task 1.

Expected: FAIL because the CSS hooks and metadata are not sufficient for all remaining route patterns.

**Step 3: Write minimal implementation**

Add only the CSS and shared markup needed to make:

- home role views
- deals list
- pipeline surfaces
- revenue surfaces
- data source surfaces
- agent workspace surfaces

behave consistently on phone-sized layouts.

**Step 4: Run test to verify it passes**

Re-run the targeted tests and confirm they pass.

**Step 5: Commit**

```bash
git add app/globals.css app src/components tests/unit/pages
git commit -m "feat: extend mobile density across remaining pages"
```

### Task 3: Verify phase-two coverage across the full app

**Files:**
- Optional: add or adjust minimal browser verification only if needed

**Step 1: Add failing verification if necessary**

If coverage is still missing for key routes under phone-sized viewports, add the smallest browser-level assertion set needed.

**Step 2: Run verification to confirm the failure state**

Run only the new verification and confirm it fails before implementing any missing coverage.

**Step 3: Write minimal verification or final route hooks**

Add the least amount of verification or markup necessary to prove the remaining routes render under the mobile shell.

**Step 4: Run full verification**

Run:

```bash
npm test
npm run build
```

Then run WebKit/iPhone viewport checks against:

- `/home`
- `/deals`
- `/meetings`
- `/pipeline`
- `/revenue`
- `/agent`

Expected:

- all unit tests pass
- build passes
- the checked routes render the mobile shell correctly on phone-sized viewports

**Step 5: Commit**

```bash
git add app src tests playwright
git commit -m "test: verify mobile shell phase two coverage"
```
