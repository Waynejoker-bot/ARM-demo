> Status: archived
> Archived because: 这是一份阶段性文档快照，当前 canonical 方向与实现基线已经收敛到 `docs/current/*`。
> Superseded by: `docs/current/README.md`, `docs/current/product-direction.md`, `docs/current/implementation-status.md`
>
> 仅保留作历史上下文与复盘材料使用，不再作为当前实现依据。

# Design System Mobile Card Wall Design

## Goal

Create a `/design-system` page that behaves like a mobile-first card review surface, not a documentation page.
The user should review real card content on phone-sized canvases, open any card into a full-screen reading state, and judge hierarchy by reading the cards themselves.

## Approved Direction

- Use a categorized card wall, not a role workspace and not a prose-heavy spec page.
- Keep the page focused on UI review.
- Remove any `demo`, `system`, `explanation`, or instructional labels from the visible card content.
- Every card preview should feel like a real in-product mobile card.
- Tapping a card should open a full-screen single-card reading state on mobile.

## Information Architecture

The page contains:

1. A compact header with category chips only
2. A vertical wall of categories
3. Inside each category, a stack of phone-width card previews
4. A full-screen overlay reader for a selected card

Approved categories:

- Facts
- Rep Decisions
- Manager Decisions
- CEO Decisions
- Escalations
- Commands

## Card Review Principles

- Review happens through content, not annotations
- Each preview card shows only the strongest layers first
- Full-screen state reveals the complete card
- Cards should read like live operating objects, not component samples

## Interaction Model

### Wall State

- Cards are shown in category stacks
- Each card is readable in preview form
- Preview cards should already show enough hierarchy to compare title, signal density, and action pressure

### Full-Screen State

- Opens from tapping any card
- Covers the viewport on mobile
- Uses a close control only
- Allows vertical scrolling through the entire card
- Keeps status and primary action visible near the top

## Visual Direction

- Preserve the current dark command-room language of the app shell
- Make the cards feel calmer and more editorial than the surrounding shell
- Emphasize reading blocks, contrast, spacing, and section rhythm over dashboard chrome
- Use phone-sized frames or constrained widths so the design reads truthfully on mobile

## Content Rules

- Use real business-style content in every card
- Avoid placeholder component labels
- Avoid paragraphs explaining what the card is doing
- Let the user infer hierarchy from typography, grouping, and spacing

## Initial Card Set

Build 1 to 2 representative cards per category.

The initial wall should include:

- one meeting fact card
- one thread delta / factual change card
- one frontline rep decision card
- one manager intervention card
- one CEO resource decision card
- one escalation card
- one command card

## Delivery Requirement

After implementation and verification:

- expose the page on a public URL
- send that URL to Wayne on Feishu
- use the new `feishu-send-message` skill path for delivery
