# Implementation Plan: Remove System Pinned Task

1. Update the page tests in `/Users/wayne/Desktop/ARM-demo/tests/unit/pages/conversational-agent-os-page.test.tsx`.
   - Remove expectations for `置顶任务`
   - Assert the page still renders the conversation workspace and direct message flow
   - Run the focused test file and confirm RED

2. Remove the pinned-task feature from `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/page.tsx`.
   - Delete the `PinnedPriorityCard` import and render path
   - Stop initializing selection from `initialThread.pinnedCard`
   - Replace pinned-card fallback logic with current-thread card fallback only

3. Clean up now-unused styling and component references.
   - Remove obsolete priority-card styles from `/Users/wayne/Desktop/ARM-demo/app/globals.css` if they are no longer used
   - Delete `/Users/wayne/Desktop/ARM-demo/src/components/conversational-os/pinned-priority.tsx` if it becomes unused

4. Verify the change.
   - Run the focused page test and confirm GREEN
   - Run `npm test`
   - Run `npm run build`
   - Re-check the public page if the dev/prod server needs a restart
