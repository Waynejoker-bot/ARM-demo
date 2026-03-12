# Remove Global Top Bar Design

## Context

The current `AppShell` renders a sticky global top bar above all page content. On pages that already have a strong page-level header, this creates a double-header effect, wastes vertical space, and pulls attention away from the main reading surface.

The user requested that the entire global top bar be removed.

## Goals

- Remove the global shell top bar entirely.
- Keep the shell stable: left navigation, main content area, and global Agent panel stay intact.
- Let each page own its own context through page-level headers and cards.
- Avoid collateral visual regressions in the current design-system work.

## Chosen Approach

Remove the `top-bar` block from `AppShell` and collapse the shell so `main-content` starts directly under the left navigation and beside the Agent panel.

This is the smallest change that fixes the visual problem. It also matches the current page composition better: pages already expose title, framing, and status through `PageHeader` and local sections.

## Alternatives Considered

### 1. Compress the top bar into a thinner status strip

Rejected because the problem is not only the height. The extra global chrome still competes with the page header and keeps duplicated context in view.

### 2. Keep the bar only on selected routes

Rejected because it introduces route-specific shell logic for a problem that should be solved at the shell level. The current request is explicit: remove the global top bar altogether.

## UI Impact

- Desktop shell becomes visually cleaner and gives more vertical space to page content.
- Mobile and tablet layouts no longer need responsive fallbacks for the removed top bar.
- Page-level headers become the single top-most contextual surface.

## Testing Strategy

- Add a shell-level regression test that asserts the removed top-bar copy is no longer rendered.
- Keep the existing brand/navigation expectation intact.
- Run the shell test plus the affected design-system page test as targeted verification.
