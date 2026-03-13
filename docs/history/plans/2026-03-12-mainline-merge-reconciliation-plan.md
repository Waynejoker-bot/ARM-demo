> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Mainline Merge Reconciliation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Merge the remaining feature branches into `main`, preserve the latest design-system work, and leave one canonical code path and one canonical public `/design-system` experience.

**Architecture:** Reconcile the in-progress merge by combining the mobile shell chrome and responsive hooks from `codex/mobile-shell-adaptation` with the latest `main` content and design-system work. Use existing page tests as the red-green safety rail, then merge `codex/raw-intake-workspace`, verify the full suite, and document the remaining branch/worktree state.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Testing Library, Git worktrees, Cloudflare tunnel-backed local dev servers.

---

### Task 1: Capture the current merge target behavior

**Files:**
- Inspect: `app/globals.css`
- Inspect: `app/meetings/page.tsx`
- Inspect: `src/components/reports/report-cards.tsx`
- Inspect: `src/components/shared/ui.tsx`
- Inspect: `src/components/threads/account-thread-panels.tsx`
- Inspect: `tests/unit/app/app-shell.test.tsx`
- Inspect: `tests/unit/pages/account-thread-page.test.tsx`
- Inspect: `tests/unit/pages/home-page.test.tsx`
- Inspect: `tests/unit/pages/meetings-page.test.tsx`
- Inspect: `tests/unit/pages/today-cockpit-page.test.tsx`

**Step 1: Confirm the merge is still in progress**

Run:

```bash
git status --short --branch
```

Expected: `main` is ahead of `origin/main`, and the listed files show `UU` or `AA`.

**Step 2: Record the intended merge rule**

Document in working notes:

- Keep `main`'s latest design-system and real-meeting showcase content.
- Keep `codex/mobile-shell-adaptation` mobile shell chrome and section mobile hooks.
- Update tests so they assert the merged behavior rather than either pre-merge extreme.

**Step 3: Confirm only two branches remain unmerged**

Run:

```bash
git branch --no-merged main
```

Expected: only `codex/mobile-shell-adaptation` and `codex/raw-intake-workspace`.

### Task 2: Resolve the mobile shell merge in tests first

**Files:**
- Modify: `tests/unit/app/app-shell.test.tsx`
- Modify: `tests/unit/pages/account-thread-page.test.tsx`
- Modify: `tests/unit/pages/home-page.test.tsx`
- Modify: `tests/unit/pages/meetings-page.test.tsx`
- Modify: `tests/unit/pages/today-cockpit-page.test.tsx`

**Step 1: Write the merged assertions into the conflicted tests**

Update tests to reflect the intended merged behavior:

- `app shell` should assert the mobile briefing header, top-bar context chips, bottom nav, and mobile-safe content spacing.
- `home` should keep header-copy assertions and mobile section priority assertions.
- `meetings`, `today cockpit`, and `account thread` should keep the real sample content assertions and add the mobile section attributes.

**Step 2: Run the targeted tests to verify RED**

Run:

```bash
npm run test -- tests/unit/app/app-shell.test.tsx tests/unit/pages/account-thread-page.test.tsx tests/unit/pages/home-page.test.tsx tests/unit/pages/meetings-page.test.tsx tests/unit/pages/today-cockpit-page.test.tsx
```

Expected: fail because production files still contain unresolved merge conflicts or stale behavior.

**Step 3: Keep the tests ready as the merge contract**

Do not weaken assertions to make them pass; use them to drive the conflict resolution.

### Task 3: Resolve the mobile shell merge in production files

**Files:**
- Modify: `src/components/shared/ui.tsx`
- Modify: `app/globals.css`
- Modify: `app/meetings/page.tsx`
- Modify: `src/components/reports/report-cards.tsx`
- Modify: `src/components/threads/account-thread-panels.tsx`

**Step 1: Merge shell chrome and content**

In `src/components/shared/ui.tsx`:

- Keep the minimal left-nav branding already on `main`.
- Keep the `mobile-briefing-header`, `top-bar`, `mobile-shell-rail`, and `main-content-mobile-safe` additions from `codex/mobile-shell-adaptation`.

**Step 2: Merge page semantics**

In the page/content files:

- Preserve the latest real-meeting showcase sections already on `main`.
- Add `mobilePriority`, `mobileDensity`, and `mobileCollapsible` props from `codex/mobile-shell-adaptation` where they do not change meaning.
- Prefer richer current card presentations over simplified older queue/table presentations unless a test explicitly requires otherwise.

**Step 3: Merge styles**

In `app/globals.css`:

- Keep the latest action-card and design-system styles already on `main`.
- Add the missing top-bar and mobile shell styles from `codex/mobile-shell-adaptation`.
- Remove conflict markers without dropping either required style family.

**Step 4: Run the targeted tests to verify GREEN**

Run:

```bash
npm run test -- tests/unit/app/app-shell.test.tsx tests/unit/pages/account-thread-page.test.tsx tests/unit/pages/home-page.test.tsx tests/unit/pages/meetings-page.test.tsx tests/unit/pages/today-cockpit-page.test.tsx
```

Expected: pass with `0 failed`.

**Step 5: Complete the merge commit**

Run:

```bash
git add app/globals.css app/meetings/page.tsx src/components/reports/report-cards.tsx src/components/shared/ui.tsx src/components/threads/account-thread-panels.tsx tests/unit/app/app-shell.test.tsx tests/unit/pages/account-thread-page.test.tsx tests/unit/pages/home-page.test.tsx tests/unit/pages/meetings-page.test.tsx tests/unit/pages/today-cockpit-page.test.tsx
git commit
```

Expected: Git finishes the `codex/mobile-shell-adaptation` merge.

### Task 4: Merge `codex/raw-intake-workspace` into `main`

**Files:**
- Inspect/modify: any files Git marks conflicted after the second merge
- Test: `tests/unit/**/*`

**Step 1: Start the second merge**

Run:

```bash
git merge --no-ff codex/raw-intake-workspace
```

Expected: either a clean merge or a bounded new set of conflicts.

**Step 2: If conflicts appear, repeat red-green on the affected tests**

For each conflicted behavior:

- update or create the smallest relevant failing test first
- run the narrow test command and confirm the failure
- resolve the production conflict
- rerun the narrow test until green

**Step 3: Finish the second merge**

Run:

```bash
git add <resolved files>
git commit
```

Expected: `main` now contains both previously unmerged branches.

### Task 5: Verify mainline state, public entry point, and branch cleanup status

**Files:**
- Inspect: repository root

**Step 1: Run the full automated verification**

Run:

```bash
npm run test
npm run build
```

Expected: both commands exit `0`.

**Step 2: Confirm no branches remain unmerged**

Run:

```bash
git branch --no-merged main
```

Expected: no local branches listed.

**Step 3: Confirm the canonical local design-system endpoint**

Run:

```bash
curl -I http://127.0.0.1:3000/design-system
curl -s http://127.0.0.1:3000/design-system | rg "对象|玄河网络试点|设计系统"
```

Expected: `HTTP/1.1 200 OK` and markers from the merged new design-system page.

**Step 4: Summarize remaining worktree and tunnel drift**

Run:

```bash
git worktree list --porcelain
ps -ef | rg "cloudflared tunnel --url|next dev"
```

Expected: enough evidence to tell the user which local processes still expose stale pages and which URL should be treated as canonical.
