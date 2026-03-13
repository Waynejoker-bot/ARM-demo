# Conversational Agent OS: Remove System Pinned Task

## Why

The current `置顶任务` block duplicates priority information that is already implied by the message stream. In the new conversation-first IA, users should read the latest P0 message directly instead of scanning a separate system-level priority module.

This reduces visual competition between:

- the left thread rail
- the main conversation stream
- the right-side drill-down panel

## Design Decision

Remove the system-managed pinned task feature from `/conversational-agent-os`.

After this change:

- the center panel opens directly into the conversation stream
- there is no automatic `置顶任务` card above the messages
- incoming messages are treated as the current P0 feed by default
- the right drill-down panel still shows card detail when the user selects a card message

## Conversation Surface Behavior

- Keep the lightweight thread status chip above the stream
- Start the main content with the message list
- Keep the composer at the bottom
- Do not add any replacement summary block in this change

## Detail Panel Behavior

- Do not derive the selected card from `pinnedCard`
- If the currently selected card still exists in the current thread, keep it selected
- Otherwise fall back to the newest card available in the current thread
- If no card exists, render the existing empty detail state

## Scope

In scope:

- remove the pinned-task UI from the conversation page
- remove state wiring that depends on `pinnedCard`
- adjust tests to match the direct message-flow layout

Out of scope:

- user-managed pinning
- new prioritization controls
- backend changes to how cards are generated

## Acceptance Criteria

- `置顶任务` no longer appears on `/conversational-agent-os`
- the main conversation area starts with thread status and then messages
- no thread card or header repeats the removed priority feature
- existing detail drill-down remains usable
