# Conversational Agent OS Mobile Push Navigation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the flattened mobile conversational layout with a WeChat-style thread list -> thread view -> detail view navigation flow.

**Architecture:** Keep the desktop layout intact and add a mobile-only navigation state machine inside the conversation page view. Narrow screens render one layer at a time: thread list, conversation, or detail. Reuse the existing thread, message, and detail data rather than introducing new routes.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library, CSS in `app/globals.css`

---

### Task 1: Add mobile navigation regression tests

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/tests/unit/pages/conversational-agent-os-page.test.tsx`

**Step 1: Write the failing tests**

Add tests that:

- force a mobile viewport
- verify the first mobile render shows only the thread list
- verify tapping `杨文星私有群` opens the conversation view with a back button
- verify tapping `查看详情` opens the detail view with a back button

**Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/unit/pages/conversational-agent-os-page.test.tsx
```

Expected: FAIL because the current mobile page still renders the desktop stack.

### Task 2: Add mobile view state to the conversation page

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/page.tsx`

**Step 1: Introduce mobile navigation state**

Add a mobile-only state with:

- `thread_list`
- `thread_view`
- `detail_view`

**Step 2: Keep desktop code path intact**

Do not change desktop interaction behavior.

### Task 3: Render mobile-only level screens

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/page.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/app/globals.css`

**Step 1: Create mobile thread list screen**

Render only the thread list and a compact mobile header.

**Step 2: Create mobile thread view**

Render:

- back button
- thread title
- status strip
- message list
- composer

**Step 3: Create mobile detail view**

Render:

- back button
- detail body
- trust info
- source drilldown buttons

### Task 4: Wire navigation transitions

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/page.tsx`

**Step 1: Thread selection**

On mobile, selecting a thread should move from `thread_list` to `thread_view`.

**Step 2: Detail open**

On mobile, opening a card detail should move from `thread_view` to `detail_view`.

**Step 3: Back actions**

Implement:

- detail -> thread
- thread -> list

### Task 5: Verify

**Step 1: Run focused page test**

```bash
npm test -- tests/unit/pages/conversational-agent-os-page.test.tsx
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

**Step 4: Re-check the live mobile page after restart if needed**

Confirm mobile now enters through the thread list instead of a flattened stack.
