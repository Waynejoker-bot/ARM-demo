# Single Mainline Consolidation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidate the remaining `codex-agent-task-cards-v1` worktree into `main` so the repository keeps one mainline, retains only the newest implementations, and drops stale or temporary artifacts.

**Architecture:** Treat `main` as the source of truth, then selectively absorb only the capabilities that exist in the residual worktree but not yet in `main`. Move tests first, verify they fail on `main`, then copy the smallest required implementation and shared model/navigation changes without overwriting the current design-system and mobile-shell semantics.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Testing Library, local Git worktrees, Cloudflare-backed local dev flow.

---

### Task 1: Classify the remaining worktree deltas

**Files:**
- Inspect: `/Users/wayne/Desktop/ARM-demo/.worktrees/codex-agent-task-cards-v1/**`
- Inspect: repository root equivalents in `main`

**Step 1: Identify files that are brand-new to `main`**

Run:

```bash
for path in \
  app/agent-task-cards/page.tsx \
  app/conversational-agent-os/page.tsx \
  app/api/task-cards/actions/route.ts \
  app/api/conversational-os/messages/route.ts \
  src/components/task-cards/task-card-page.tsx \
  src/components/conversational-os/page.tsx \
  src/lib/task-cards/types.ts \
  src/lib/conversational-os/types.ts \
  tests/unit/pages/agent-task-cards-page.test.tsx \
  tests/unit/pages/conversational-agent-os-page.test.tsx \
  tests/unit/task-cards/task-card-page-semantics.test.tsx \
  tests/unit/conversational-os/routes.test.ts
do
  [ -e "$path" ] && echo "EXISTS $path" || echo "MISSING $path"
done
```

Expected: the task-card and conversational-os files are missing from `main`.

**Step 2: Identify overlapping files that must stay `main`-first**

Focus on:

- `app/globals.css`
- `app/home/page.tsx`
- `app/meetings/page.tsx`
- `app/design-system/page.tsx`
- `src/components/design-system/*`
- `src/lib/navigation.ts`

Only absorb missing semantics from these files; do not replace them wholesale.

**Step 3: Exclude temporary artifacts**

Ignore:

- `.playwright-cli/*`
- installer zips
- console logs
- screenshots
- yml captures

### Task 2: Add the missing tests to `main` first

**Files:**
- Create: `tests/unit/pages/agent-task-cards-page.test.tsx`
- Create: `tests/unit/pages/conversational-agent-os-page.test.tsx`
- Create: `tests/unit/pages/design-system-mobile-gallery.test.tsx` only if it tests behavior not already covered by `tests/unit/pages/design-system-page.test.tsx`
- Create: `tests/unit/task-cards/task-card-page-semantics.test.tsx`
- Create: `tests/unit/task-cards/task-card-interactions.test.tsx`
- Create: `tests/unit/task-cards/task-card-persistence.test.ts`
- Create: `tests/unit/task-cards/selectors.test.ts`
- Create: `tests/unit/conversational-os/model.test.ts`
- Create: `tests/unit/conversational-os/persistence.test.ts`
- Create: `tests/unit/conversational-os/routes.test.ts`
- Create: `tests/unit/conversational-os/seed.test.ts`
- Create: `tests/unit/conversational-os/time.test.ts`
- Create: `tests/unit/model/glm-client.test.ts`

**Step 1: Copy only the test files that describe genuinely missing capability**

Do not import tests that only assert older design-system wording if current `main` already has a newer equivalent.

**Step 2: Run the new narrow test set to verify RED**

Run:

```bash
npm run test -- \
  tests/unit/pages/agent-task-cards-page.test.tsx \
  tests/unit/pages/conversational-agent-os-page.test.tsx \
  tests/unit/task-cards/task-card-page-semantics.test.tsx \
  tests/unit/task-cards/task-card-interactions.test.tsx \
  tests/unit/task-cards/task-card-persistence.test.ts \
  tests/unit/task-cards/selectors.test.ts \
  tests/unit/conversational-os/model.test.ts \
  tests/unit/conversational-os/persistence.test.ts \
  tests/unit/conversational-os/routes.test.ts \
  tests/unit/conversational-os/seed.test.ts \
  tests/unit/conversational-os/time.test.ts \
  tests/unit/model/glm-client.test.ts
```

Expected: fail because the corresponding implementation is not yet on `main`.

### Task 3: Absorb task-card and conversational-os implementations

**Files:**
- Create: `app/agent-task-cards/page.tsx`
- Create: `app/conversational-agent-os/page.tsx`
- Create: `app/api/task-cards/actions/route.ts`
- Create: `app/api/conversational-os/messages/route.ts`
- Create: `app/api/conversational-os/reset/route.ts`
- Create: `app/api/conversational-os/threads/route.ts`
- Create: `app/api/conversational-os/threads/[threadId]/route.ts`
- Create: `src/components/task-cards/*`
- Create: `src/components/conversational-os/*`
- Create: `src/lib/task-cards/*`
- Create: `src/lib/conversational-os/*`
- Modify: `src/lib/navigation.ts`
- Modify: `src/lib/domain/types.ts`
- Modify: `src/lib/mocks/index.ts`
- Modify: `src/lib/mock-selectors.ts`
- Modify: `app/globals.css` only where new components need styles not already present

**Step 1: Copy brand-new implementation files from the old worktree**

Use file copies for new files rather than retyping large modules.

**Step 2: Merge shared files carefully**

For overlapping shared files:

- keep current `main` wording, shell, and design-system behavior
- add only new routes, types, data, and minimal style support needed for the absorbed features

**Step 3: Run the narrow absorbed-feature tests to verify GREEN**

Run the same narrow command from Task 2.

Expected: all pass.

### Task 4: Reconcile overlapping design-system/task-card surfaces

**Files:**
- Inspect/modify: `app/design-system/page.tsx`
- Inspect/modify: `src/components/design-system/*`
- Inspect/modify: any copied task-card or conversational-os page that duplicates existing design-system ideas

**Step 1: Ensure there is only one live design-system route**

If the old worktree contains alternate design-system content, either:

- discard it if fully obsolete, or
- integrate only the missing latest behaviors already validated in `main`

**Step 2: Ensure navigation points to current, not legacy, entry points**

Keep `/design-system` as the single design-system route and add new feature routes only if they are real product surfaces, not legacy demos.

### Task 5: Full verification and cleanup

**Files:**
- entire repo

**Step 1: Run full verification**

Run:

```bash
npm run test
npm run build
```

Expected: both exit `0`.

**Step 2: Verify repository state**

Run:

```bash
git status --short --branch
git branch --no-merged main
```

Expected: clean working tree, and no unmerged branches.

**Step 3: Remove the final obsolete worktree and branch**

Only after its remaining useful files are absorbed and the worktree is clean:

```bash
git worktree remove /Users/wayne/Desktop/ARM-demo/.worktrees/codex-agent-task-cards-v1
git branch -d codex/agent-task-cards-v1
```

Expected: only the main worktree remains.
