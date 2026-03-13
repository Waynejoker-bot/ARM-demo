# Conversational Agent OS: Remove Composer Card Button

## Why

The composer-level `发送当前卡片` button is ambiguous. Users already have clear card-level actions inside the message flow:

- 查看详情
- 上报
- 批准

Placing another card-send action in the input area creates a second, unclear path that does not explain what will happen.

## Design Decision

Remove the composer-level `发送当前卡片` button from the conversational Agent OS.

After this change:

- the composer only contains the text input and the main `发送` action
- card-level actions remain inside message cards
- detail and escalation behavior remain unchanged

## Scope

In scope:

- remove the extra composer button in desktop and mobile conversation views
- update tests to assert the button is absent

Out of scope:

- changing card actions inside the message stream
- redesigning the composer
- adding replacement shortcuts

## Acceptance Criteria

- `发送当前卡片` no longer appears in the composer
- `发送` remains available
- message-card actions still work as before
