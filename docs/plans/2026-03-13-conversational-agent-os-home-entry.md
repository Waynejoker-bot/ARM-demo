# Conversational Agent OS Home Entry Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `/conversational-agent-os` the single homepage surface, with `/` and `/home` serving as aliases into the same conversation-first entry.

**Architecture:** Reuse the existing conversational Agent OS route as the canonical homepage and converge the root route, `/home`, and navigation onto it. Keep the conversation-first shell, but change the desktop first-open behavior to the most recently active thread, group thread navigation by role, and keep the detail drill-down collapsed until explicitly opened.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library, CSS in `app/globals.css`

---

### Task 1: Add homepage convergence regression tests

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/tests/unit/app/root-page.test.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/tests/unit/pages/home-page.test.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/tests/unit/navigation/navigation-config.test.ts`
- Modify: `/Users/wayne/Desktop/ARM-demo/tests/unit/app/app-shell.test.tsx`

**Step 1: Write the failing tests**

Add assertions that:

- `/` renders the conversation-first homepage instead of the old manager dashboard
- `/home` renders the same homepage semantics as `/conversational-agent-os`
- navigation exposes only one homepage entry pointing at `/conversational-agent-os`
- shell brand and mobile primary nav both route users to `/conversational-agent-os`

**Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/unit/app/root-page.test.tsx tests/unit/pages/home-page.test.tsx tests/unit/navigation/navigation-config.test.ts tests/unit/app/app-shell.test.tsx
```

Expected: FAIL because `/` and `/home` still render the legacy dashboard and navigation still treats `/home` and `/conversational-agent-os` as parallel entries.

### Task 2: Add conversation homepage behavior tests

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/tests/unit/pages/conversational-agent-os-page.test.tsx`

**Step 1: Write the failing tests**

Add assertions that:

- desktop first-open selects the most recently active thread
- thread list renders role-group headings
- desktop detail panel is absent until `查看详情` is clicked
- composer copy describes replying/asking follow-up instead of sending raw material

**Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/unit/pages/conversational-agent-os-page.test.tsx
```

Expected: FAIL because the current page opens the hard-coded default thread, renders a flat thread list, shows detail on desktop immediately, and still uses source-material composer copy.

### Task 3: Converge homepage routes and navigation

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/app/page.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/app/home/page.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/src/lib/navigation.ts`
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/shared/ui.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/app/not-found.tsx`

**Step 1: Reuse the conversation homepage route**

Make `/` and `/home` render the same homepage output as `/conversational-agent-os` without introducing a second homepage implementation.

**Step 2: Collapse navigation**

Update desktop nav, mobile nav, icons, and brand link so `首页` points to `/conversational-agent-os` and no separate `会话版 Agent OS` top-level entry remains.

### Task 4: Update conversation homepage behavior

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/app/conversational-agent-os/page.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/page.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/thread-list.tsx`
- Create: `/Users/wayne/Desktop/ARM-demo/src/lib/conversational-os/thread-previews.ts`
- Modify: `/Users/wayne/Desktop/ARM-demo/app/globals.css`

**Step 1: Select the default thread by recent activity**

Derive the initial desktop selection from the latest visible thread activity instead of the seed constant.

**Step 2: Group the thread rail by role**

Render role sections in fixed order and sort threads inside each section by latest activity.

**Step 3: Collapse desktop detail by default**

Keep selected-card logic, but render the desktop detail layer only after explicit open, with a close action.

**Step 4: Narrow the composer semantics**

Update the composer label and placeholder so the homepage first version is read/reply/follow-up only.

### Task 5: Verify focused flows and regressions

**Step 1: Run homepage-focused tests**

```bash
npm test -- tests/unit/app/root-page.test.tsx tests/unit/pages/home-page.test.tsx tests/unit/pages/conversational-agent-os-page.test.tsx tests/unit/navigation/navigation-config.test.ts tests/unit/app/app-shell.test.tsx
```

Expected: PASS

**Step 2: Run full suite**

```bash
npm test
```

Expected: PASS

**Step 3: Run build**

```bash
npm run build
```

Expected: PASS
