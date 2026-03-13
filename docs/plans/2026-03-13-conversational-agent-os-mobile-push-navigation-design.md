# Conversational Agent OS: Mobile Push Navigation

## Why

The current mobile layout is still a flattened desktop composition. It stacks:

- thread list
- conversation
- detail panel

This is not a natural mobile interaction model. On phones, the conversational Agent OS should behave like a message app:

- enter from a thread list
- tap into a single conversation
- tap deeper into a card or evidence detail
- go back one level at a time

## Design Decision

Keep desktop unchanged.

Replace the mobile layout with a WeChat-style push-navigation stack:

1. thread list
2. thread conversation
3. card detail

Each mobile level must have a clear top bar and a back action.

## Mobile IA

### Level 1: Thread List

Show:

- thread list only
- unread counts
- latest message preview
- message time

Do not show:

- conversation messages
- detail panel

### Level 2: Thread Conversation

Show:

- back button to thread list
- current thread title
- status strip
- message stream
- composer

Do not show:

- thread rail
- right-side detail panel

### Level 3: Card Detail

Show:

- back button to conversation
- full card detail
- trust information
- source drilldown actions

Do not show:

- thread list
- message composer

## State Model

Mobile view state should be explicit:

- `thread_list`
- `thread_view`
- `detail_view`

This state should only affect narrow screens. Desktop keeps the current multi-panel view.

## Interaction Rules

- entering mobile defaults to `thread_list`
- tapping a thread opens `thread_view`
- tapping `查看详情` opens `detail_view`
- tapping the detail back button returns to `thread_view`
- tapping the thread back button returns to `thread_list`

## Scope

In scope:

- mobile-only navigation state
- mobile-specific headers and back buttons
- mobile-specific hiding of the desktop multi-panel structure

Out of scope:

- real route-based mobile navigation
- browser history integration between mobile subviews
- source-item dedicated detail pages

## Acceptance Criteria

- on mobile, the page first shows only the thread list
- opening a thread hides the list and shows only the conversation
- opening a card hides the conversation and shows only the detail page
- each mobile level has a back button
- desktop behavior remains unchanged
