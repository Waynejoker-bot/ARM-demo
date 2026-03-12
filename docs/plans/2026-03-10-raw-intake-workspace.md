# Raw Intake Workspace Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a new first-level `素材导入` workspace where reps can submit raw material, review GLM-backed recognition, and confirm suggestion-only write proposals before apply.

**Architecture:** Add a dedicated `/intake` route backed by shared mock-first domain objects for intake items, entity candidates, and ingestion proposals. Use a thin GLM route handler for structured recognition of raw input, and keep all write targets in explicit suggestion/confirm/apply semantics that connect back to existing mock objects.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Testing Library, Zod, existing GLM proxy utilities, shared mock dataset, project CSS system.

---

### Task 1: Define intake domain types and mock dataset coverage

**Files:**
- Modify: `src/lib/domain/types.ts`
- Modify: `src/lib/mocks/index.ts`
- Modify: `src/lib/mock-selectors.ts`
- Test: `tests/unit/mocks/mock-dataset.test.ts`

**Step 1: Write the failing test**

Add assertions to `tests/unit/mocks/mock-dataset.test.ts` that the mock dataset now includes:

- `intakeItems`
- `entityCandidates`
- `ingestionProposals`
- at least one low-confidence item
- at least one item already `ready_to_apply`

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/mocks/mock-dataset.test.ts`
Expected: FAIL because the dataset shape does not yet expose intake objects.

**Step 3: Write minimal implementation**

Update `src/lib/domain/types.ts` with:

- `IntakeSourceKind`
- `IntakeStatus`
- `IntakeItem`
- `EntityCandidate`
- `IngestionProposal`

Extend `MockDataset` and `src/lib/mocks/index.ts` with realistic sample intake records and proposal targets aligned to existing deals and meetings.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/mocks/mock-dataset.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/unit/mocks/mock-dataset.test.ts src/lib/domain/types.ts src/lib/mocks/index.ts src/lib/mock-selectors.ts
git commit -m "feat: add intake workspace mock domain"
```

### Task 2: Register the new route in navigation and add a page rendering test

**Files:**
- Modify: `src/lib/navigation.ts`
- Create: `tests/unit/pages/intake-page.test.tsx`
- Modify: `tests/unit/navigation/navigation-config.test.ts`
- Create: `app/intake/page.tsx`

**Step 1: Write the failing tests**

1. Extend `tests/unit/navigation/navigation-config.test.ts` to assert:

```ts
expect(primaryNavItems).toEqual(
  expect.arrayContaining([
    expect.objectContaining({ href: "/intake", label: "素材导入" }),
  ])
);
```

2. Create `tests/unit/pages/intake-page.test.tsx` asserting the page renders:

- heading `素材导入`
- heading `导入新素材`
- heading `待确认写入`
- a low-confidence fallback state

**Step 2: Run tests to verify they fail**

Run: `npm test -- tests/unit/navigation/navigation-config.test.ts tests/unit/pages/intake-page.test.tsx`
Expected: FAIL because the route and page do not exist yet.

**Step 3: Write minimal implementation**

Add `/intake` to `src/lib/navigation.ts` and create `app/intake/page.tsx` using existing `PageHeader`, `SectionCard`, and mock selectors with simple placeholder rendering for the four required sections.

**Step 4: Run tests to verify they pass**

Run: `npm test -- tests/unit/navigation/navigation-config.test.ts tests/unit/pages/intake-page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/navigation.ts app/intake/page.tsx tests/unit/navigation/navigation-config.test.ts tests/unit/pages/intake-page.test.tsx
git commit -m "feat: add intake workspace route"
```

### Task 3: Build GLM intake recognition prompt and route handler

**Files:**
- Create: `src/lib/intake/types.ts`
- Create: `src/lib/intake/prompts.ts`
- Create: `src/lib/intake/mock-classification.ts`
- Create: `app/api/intake/classify/route.ts`
- Test: `tests/unit/intake/prompts.test.ts`

**Step 1: Write the failing test**

Create `tests/unit/intake/prompts.test.ts` covering:

- the prompt contains the rep-oriented system framing
- the prompt requests JSON only
- the prompt includes candidate account / deal / meeting context

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/intake/prompts.test.ts`
Expected: FAIL because intake prompt builders do not exist.

**Step 3: Write minimal implementation**

Create intake-specific types and a prompt builder that emits structured GLM messages for raw material classification. Add `app/api/intake/classify/route.ts` to:

- validate input with `zod`
- call the existing GLM client
- parse JSON output
- fall back to mock classification if no API key is present

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/intake/prompts.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/intake/types.ts src/lib/intake/prompts.ts src/lib/intake/mock-classification.ts app/api/intake/classify/route.ts tests/unit/intake/prompts.test.ts
git commit -m "feat: add intake classification route"
```

### Task 4: Add interactive intake workbench UI with confirmation questions

**Files:**
- Create: `src/components/intake/intake-workspace.tsx`
- Modify: `app/intake/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/unit/pages/intake-page.test.tsx`

**Step 1: Write the failing test**

Extend `tests/unit/pages/intake-page.test.tsx` to assert the page exposes:

- source-type selection buttons
- candidate match cards
- confirmation questions
- proposal cards with `确认写入` and `暂不采用`

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/pages/intake-page.test.tsx`
Expected: FAIL because the placeholder page does not yet render the workbench details.

**Step 3: Write minimal implementation**

Create `src/components/intake/intake-workspace.tsx` with:

- import hero
- recognition cards
- question chips / radio actions
- proposal review cards
- queue section

Use the project CSS system and add only the new classes needed in `app/globals.css`.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/pages/intake-page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/intake/intake-workspace.tsx app/intake/page.tsx app/globals.css tests/unit/pages/intake-page.test.tsx
git commit -m "feat: build intake workspace ui"
```

### Task 5: Wire client-side classification interaction and verify targeted behavior

**Files:**
- Create: `src/components/intake/intake-client.tsx`
- Modify: `src/components/intake/intake-workspace.tsx`
- Modify: `tests/unit/pages/intake-page.test.tsx`
- Modify: `app/intake/page.tsx`

**Step 1: Write the failing test**

Extend `tests/unit/pages/intake-page.test.tsx` with a client interaction test that:

- enters raw text
- submits classification
- receives a rendered recognition result
- shows low-confidence manual follow-up when the mock classifier cannot confidently match

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/unit/pages/intake-page.test.tsx`
Expected: FAIL because the page is static and does not handle submissions.

**Step 3: Write minimal implementation**

Add a small client wrapper that posts to `/api/intake/classify`, manages loading and error state, and updates the workspace with returned recognition results while keeping proposal actions in suggestion-only UI state.

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/unit/pages/intake-page.test.tsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/intake/intake-client.tsx src/components/intake/intake-workspace.tsx app/intake/page.tsx tests/unit/pages/intake-page.test.tsx
git commit -m "feat: connect intake recognition flow"
```

### Task 6: Run verification commands and inspect final output

**Files:**
- No code changes required unless verification reveals issues

**Step 1: Run targeted unit tests**

Run:

```bash
npm test -- tests/unit/mocks/mock-dataset.test.ts tests/unit/navigation/navigation-config.test.ts tests/unit/pages/intake-page.test.tsx tests/unit/intake/prompts.test.ts
```

Expected: PASS

**Step 2: Run full test suite**

Run: `npm test`
Expected: PASS

**Step 3: Run production build**

Run: `npm run build`
Expected: exit 0

**Step 4: Review git diff**

Run: `git status --short && git diff --stat`
Expected: only intended intake workspace changes plus plan docs.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add raw intake workspace"
```
