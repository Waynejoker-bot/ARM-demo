# Conversational Agent OS Chat Density Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce thread-list noise and restyle `/conversational-agent-os` into a desktop chat-first surface without losing the pinned top task loop.

**Architecture:** Keep the existing thread/message/card persistence untouched. Refactor the page layout into three clearer layers: slim thread rail, chat-like main stage, and weakened detail panel. Drive the behavior change with page tests first, then implement the minimal component and CSS changes.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS in `app/globals.css`, Vitest + Testing Library

---

### Task 1: Write the failing page tests

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/tests/unit/pages/conversational-agent-os-page.test.tsx`

**Step 1: Write the failing test**

Add assertions that:
- thread rail no longer renders the verbose thread description
- thread rail no longer renders repeated `当前最重要`
- thread rail still renders the latest time
- main stage exposes a chat-like thread header and message composer label

**Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/unit/pages/conversational-agent-os-page.test.tsx
```

Expected: FAIL because the old rail still shows description and repeated summary blocks.

### Task 2: Slim the thread rail

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/thread-list.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/app/globals.css`

**Step 1: Write minimal implementation**

- Remove verbose description and pinned-card preview from each thread item
- Keep only title, role badge, unread, latest single-line status, and time
- Add compact styling to make the rail feel like a chat thread list

**Step 2: Run targeted test**

Run:

```bash
npm test -- tests/unit/pages/conversational-agent-os-page.test.tsx
```

Expected: partial progress, remaining failures should now focus on main-stage structure.

### Task 3: Refactor the main stage into a desktop-chat layout

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/page.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/pinned-priority.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/app/globals.css`

**Step 1: Write minimal implementation**

- Make the thread header feel like a chat conversation header
- Restyle the pinned priority card as a lighter “置顶事务” block
- Turn the message list into stronger chat bubbles
- Make the composer feel fixed and chat-like
- Weaken the detail panel so it reads as supporting drilldown rather than a second main canvas

**Step 2: Run targeted test**

Run:

```bash
npm test -- tests/unit/pages/conversational-agent-os-page.test.tsx
```

Expected: PASS

### Task 4: Verify full regression and production build

**Files:**
- No code changes unless verification fails

**Step 1: Run full test suite**

Run:

```bash
npm test
```

Expected: all tests pass

**Step 2: Run production build**

Run:

```bash
npm run build
```

Expected: build exits 0

### Task 5: Refresh the running demo

**Files:**
- No code changes unless startup fails

**Step 1: Restart the local production server on the existing tunnel port**

Run the existing production server on `127.0.0.1:3046`.

**Step 2: Verify the public URL**

Check:

```bash
curl -I https://extensive-boating-communist-meditation.trycloudflare.com/conversational-agent-os
```

Expected: `HTTP 200`
