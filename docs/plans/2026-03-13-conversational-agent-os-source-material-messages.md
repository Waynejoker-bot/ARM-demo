# Conversational Agent OS Source Material Messages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Yang-thread opening message with a source-material bundle so the Agent, not the human rep, performs the first synthesis.

**Architecture:** Extend the conversation message model with a `source_input` kind and lightweight source item metadata, then update the seeded Yang thread and the conversation renderer to display a source-material block. Keep routing, cards, and persistence behavior unchanged.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library, CSS in `app/globals.css`

---

### Task 1: Add page-level regression tests for source-material rendering

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/tests/unit/pages/conversational-agent-os-page.test.tsx`

**Step 1: Write the failing test**

Add assertions that the default Yang thread shows:

- a source-material label instead of a normal human conclusion bubble
- source item rows such as `硬件会议摘要` and `微信截图`
- an Agent acknowledgement message before the summary card

**Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/unit/pages/conversational-agent-os-page.test.tsx
```

Expected: FAIL because the current seed still renders a plain human summary message.

### Task 2: Extend the conversation message model for raw inputs

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/src/lib/conversational-os/types.ts`

**Step 1: Write the minimal type change**

Add:

- `source_input` to `ConversationMessageKind`
- a `sourceItems` optional array on `ConversationMessage`
- a small source item type with `kind`, `title`, and optional `detail`

**Step 2: Keep the change minimal**

Do not change routing or card schemas.

### Task 3: Update the seeded Yang thread

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/src/lib/conversational-os/seed.ts`

**Step 1: Replace the first Yang message**

Change it from a processed human summary to:

- a short note from Yang
- a `source_input` message
- 3 to 4 mock source items based on real-meeting context

**Step 2: Add an Agent acknowledgement**

Insert an acknowledgement message before the existing synthesis + card message.

### Task 4: Render source-material messages in the conversation feed

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/page.tsx`
- Modify: `/Users/wayne/Desktop/ARM-demo/app/globals.css`

**Step 1: Add source-message presentation**

In the message renderer:

- treat `source_input` as a human-side material bundle
- render the short note as text
- render each source item in a compact row list

**Step 2: Update copy**

Adjust the composer label and placeholder so the feed feels like a place to send raw material, not just conclusions.

### Task 5: Verify everything

**Files:**
- No code changes

**Step 1: Run focused page test**

```bash
npm test -- tests/unit/pages/conversational-agent-os-page.test.tsx
```

Expected: PASS

**Step 2: Run full test suite**

```bash
npm test
```

Expected: PASS

**Step 3: Run production build**

```bash
npm run build
```

Expected: PASS

**Step 4: Re-check the live page if restarted**

Confirm the public or local `/conversational-agent-os` page now shows a raw-material first message for Yang.
