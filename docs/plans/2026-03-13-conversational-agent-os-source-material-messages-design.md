# Conversational Agent OS: Source Material Messages

## Why

The current Yang Wenxing thread starts with a human-written conclusion. That is too processed for the real workflow.

In the intended product, a frontline rep should send raw working material into the thread:

- a meeting link
- a WeChat screenshot
- an audio file
- a hardware-generated meeting summary
- a short note like "刚见完客户，你先看"

The Agent should be the one that turns source material into:

- an acknowledgement
- a structured summary
- a decision card

## Design Decision

Add a source-material message pattern to the conversation feed and use it for the default Yang thread.

The thread sequence should become:

1. Yang sends a source bundle
2. Sales AgentBP acknowledges receipt
3. Sales AgentBP returns a short synthesis plus the decision card
4. Manager Agent returns the visibility-limited handoff status

## Message Model

Introduce a dedicated message kind for raw input:

- `source_input`

Allow that message to include a lightweight list of source items. Each item should show:

- type
- title
- optional detail

Supported demo item types:

- `meeting_summary`
- `audio`
- `screenshot`
- `link`

This is only for frontend rendering in the current demo. No real file handling is required.

## UI Behavior

### Human source message

Do not render it as a long paragraph bubble.

Render it as a compact source-material block inside the message bubble:

- short human note at the top
- source item list below
- each item displayed as a single row or chip-like row

### Agent messages

Keep them text-first:

- first acknowledgement
- then synthesis and decision card

This makes the Agent’s value visible without making the human do the preprocessing.

## Scope

In scope:

- new source-input message rendering
- Yang thread seed updated to use real-material bundle semantics
- updated copy in the composer to reflect raw material submission

Out of scope:

- real uploads
- image/audio preview playback
- multi-file composer
- attachment persistence beyond current mock/demo behavior

## Acceptance Criteria

- the first Yang-thread human message is a raw source bundle, not a final conclusion
- the feed visually distinguishes source material from processed Agent replies
- the Agent acknowledges receipt before presenting the summary card
- the rest of the thread and handoff behavior remain intact
