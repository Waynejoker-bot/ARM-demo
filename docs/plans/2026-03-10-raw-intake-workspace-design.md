# Raw Intake Workspace Design

## Summary

Add a new first-level navigation entry and page for frontline sales reps to import raw customer materials such as recordings, text notes, emails, and links. The page will act as an Agent-first intake workspace: reps submit raw material, the system asks GLM to classify ownership and output candidate write targets, and the rep confirms before anything is applied into internal state.

This page is distinct from `数据接入`. `数据接入` remains a transparency page for source connectivity, coverage, freshness, and sync problems. The new workspace handles day-to-day raw material intake, AI recognition, human confirmation, and proposal application.

## Product Intent

The workflow must preserve the project semantics:

- import raw material does not directly change business state
- AI recognition produces `suggestion`
- rep performs `confirm`
- confirmed items can be `apply`-ed into internal mock state
- `sync` remains a separate downstream decision

The page should feel like a rep workbench, not a settings screen or generic upload form.

## Primary User

Primary high-frequency user: frontline sales rep.

This changes the page priority:

- strongest first action is `导入新素材`
- queue and review states are visible, but secondary
- language should emphasize customer context, next step speed, and confidence

## Route And IA

- Add new first-level nav item: `素材导入`
- Add route: `/intake`
- Keep `/data-sources` focused on data source transparency only

## Page Structure

### 1. Import Hero

The page opens with a large import workbench that supports:

- drag/drop file shell for recordings
- paste text
- paste email body
- submit external link

This area immediately creates a raw intake record and shows what the system will do next.

### 2. AI Recognition Panel

After import, GLM performs initial triage and returns:

- likely content type
- candidate account / deal / meeting / contact
- confidence
- why the guess was made
- missing fields if confidence is too low

The UI then asks 3 to 5 confirmation questions using structured choices. If confidence is too low, the page falls back to manual completion instead of pretending the match is known.

### 3. Pending Apply Proposals

The system converts recognized content into proposal cards. Cards stay explicitly in suggestion state until confirmed. Expected proposal targets:

- `meeting_summary`
- `conversation`
- `evidence_ref`
- `deal_note`
- `next_step`

Each card must show:

- target location
- confidence
- key evidence references
- last updated time
- confirm / reject affordances

### 4. Processing Queue

The lower section shows recent intake records with status:

- parsing
- needs confirmation
- ready to apply
- applied
- failed

This lets reps resume unfinished intake work.

## Shared Domain Additions

Add new shared objects instead of overloading existing source records:

### `IntakeItem`

- raw user-submitted material
- includes source kind, status, preview, confidence, missing fields, and chosen entity ids

### `EntityCandidate`

- candidate destination object detected by AI
- includes entity type, entity id, display label, confidence, and reasoning

### `IngestionProposal`

- candidate write target generated from the intake item
- remains a suggestion until confirmed and applied

These objects connect back to existing shared objects:

- `Meeting`
- `Conversation`
- `Deal`
- `EvidenceRef`
- `AgentOutput`

## Agent Orchestration

Users should not manually choose which agent receives the material. The system orchestrates the chain and exposes it transparently:

`intake recognition -> entity matching -> evidence extraction -> next-step drafting -> proposal generation`

The UI should show progress in human terms, not technical plumbing.

## Model Integration

Use the existing GLM server-side proxy pattern. Do not place API keys in the client. Add a new route handler dedicated to intake triage so the prompt and response contract are explicit and testable.

The route should request structured JSON from GLM and validate it with `zod`.

## Mock-First Boundaries

Business objects remain mock-backed. This feature adds:

- mock intake records
- mock recognition candidates
- mock proposal cards

Live GLM usage is limited to recognition/classification assistance. No real persistence layer is introduced.

## Error And Trust States

Required visible states:

- AI unavailable
- recording without transcript text
- low-confidence recognition
- missing account / deal / meeting match
- proposal rejected
- apply blocked because required confirmation is missing

No state may silently fail or appear healthy when it is not.

## Acceptance Direction

The feature is directionally complete when:

- the sidebar contains a `素材导入` entry
- `/intake` opens an Agent-first rep workbench
- reps can inspect mocked intake items and import a new one
- GLM-backed recognition can classify raw text/link/email input
- AI suggestions stay confirmable before apply
- confidence, evidence, freshness, and missing-state cues remain visible
