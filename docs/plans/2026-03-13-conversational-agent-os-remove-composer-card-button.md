# Conversational Agent OS Remove Composer Card Button Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the ambiguous `发送当前卡片` button from the conversational Agent OS composer.

**Architecture:** This is a minimal UI cleanup. Keep card actions in the message flow and simplify the composer to a single send path. No state, routing, or persistence changes are required.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, Testing Library

---

### Task 1: Add regression assertions

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/tests/unit/pages/conversational-agent-os-page.test.tsx`

**Step 1: Write the failing test**

Add assertions that `发送当前卡片` is not present in:

- the default desktop conversation view
- the mobile thread view

**Step 2: Run test to verify it fails**

Run:

```bash
npm test -- tests/unit/pages/conversational-agent-os-page.test.tsx
```

Expected: FAIL because the button still renders.

### Task 2: Remove the button from the shared composer

**Files:**
- Modify: `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/page.tsx`

**Step 1: Delete the extra button**

Remove the `发送当前卡片` button from the shared composer block.

**Step 2: Keep the main send action**

Do not change the text input or the main `发送` button.

### Task 3: Verify

**Step 1: Run focused test**

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
