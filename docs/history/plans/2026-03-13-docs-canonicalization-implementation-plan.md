> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Documentation Canonicalization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize the project documentation so the repository exposes one canonical current-doc set, archives superseded plans, and captures historical lessons that prevent future regressions.

**Architecture:** Add a small `docs/current`, `docs/history`, and `docs/insights` structure, migrate or summarize existing plans into the correct tier, then update `AGENTS.md` and the documentation entrypoints to point at the new canonical set. Preserve old files by moving them rather than deleting them, and add explicit archive banners so old plans remain useful as history instead of acting like live specs.

**Tech Stack:** Markdown, repository filesystem, Git history, existing project docs

---

### Task 1: Create the new documentation directories and canonical entrypoint files

**Files:**
- Create: `docs/current/README.md`
- Create: `docs/current/product-direction.md`
- Create: `docs/current/implementation-status.md`
- Create: `docs/history/README.md`
- Create: `docs/insights/README.md`
- Create: `docs/insights/historical-summary.md`
- Create: `docs/insights/anti-regression.md`

**Step 1: Write the new canonical docs**

Create the new current/history/insights files with clear role separation:

- `docs/current/README.md`: navigation entrypoint
- `docs/current/product-direction.md`: latest product stance and current canonical narrative
- `docs/current/implementation-status.md`: what `main` has actually implemented
- `docs/history/README.md`: what belongs in archive and how to read it
- `docs/insights/*`: distilled timeline and “do not regress” lessons

**Step 2: Review the new docs for overlap**

Make sure the current docs summarize and absorb live ideas instead of simply linking to a long list of old plans.

### Task 2: Archive superseded plan documents under `docs/history/plans`

**Files:**
- Move: `docs/plans/*.md`
- Create if needed: `docs/history/plans/`

**Step 1: Create the archive destination**

Create `docs/history/plans/`.

**Step 2: Move the existing dated plan files**

Move all existing dated planning/design files from `docs/plans/` into `docs/history/plans/`, preserving filenames.

**Step 3: Add archive banners**

Prepend a short archive banner to each moved historical plan file containing:

- `Status: archived`
- `Archived because`
- `Superseded by`

Use consistent wording, with more specific replacement references where appropriate.

### Task 3: Update project entrypoints to reference the new canonical docs

**Files:**
- Modify: `AGENTS.md`
- Modify: root product docs only if they need a short redirect banner

**Step 1: Rewrite `AGENTS.md` source-of-truth references**

Update the source-of-truth section so it prefers:

- `docs/current/README.md`
- `docs/current/product-direction.md`
- `docs/current/implementation-status.md`

Keep only the minimum remaining root-level references needed for implementation.

**Step 2: Add light redirect notes to root docs if useful**

If root-level product docs remain in place, add a short note pointing readers to `docs/current/README.md` for the latest canonical interpretation.

### Task 4: Add a historical summary that explains the iterations and avoids regressions

**Files:**
- Modify: `docs/insights/historical-summary.md`
- Modify: `docs/insights/anti-regression.md`

**Step 1: Summarize the main product iterations**

Capture the progression from:

- full mock frontend scope
- role workspace push
- meeting-first and account-thread model
- mobile shell and intake
- design-system and action-card experiments
- conversational agent os

**Step 2: Extract anti-regression rules**

Turn the historical lessons into crisp guardrails:

- do not revert to dashboard-first
- do not split the product into multiple top-level narratives
- do not confuse design review surfaces with product surfaces
- do not let agent interaction degrade into decorative side commentary

### Task 5: Verify the documentation structure and repository state

**Files:**
- Entire repo

**Step 1: Verify directory structure**

Run:

```bash
find docs -maxdepth 3 -type f | sort
```

Expected: new current/history/insights files exist and old dated plans now live under `docs/history/plans/`.

**Step 2: Verify references**

Run:

```bash
rg -n "docs/current/README.md|docs/current/product-direction.md|docs/current/implementation-status.md|docs/history/plans" AGENTS.md docs
```

Expected: `AGENTS.md` and new docs reference the canonical structure correctly.

**Step 3: Verify git state**

Run:

```bash
git status --short --branch
```

Expected: only the intended doc reorganization changes appear.
