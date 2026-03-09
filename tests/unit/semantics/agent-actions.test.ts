import {
  applyAgentSuggestion,
  confirmAgentSuggestion,
  createAgentSuggestionState,
  syncAppliedAgentSuggestion,
} from "@/lib/semantics/agent-actions";

describe("agent action semantics", () => {
  it("starts as a suggestion that is not confirmed, applied, or synced", () => {
    const state = createAgentSuggestionState("suggestion-1");

    expect(state).toMatchObject({
      suggestionId: "suggestion-1",
      confirmedAt: null,
      appliedAt: null,
      syncStatus: "not_synced",
    });
  });

  it("does not allow apply before confirm", () => {
    const state = createAgentSuggestionState("suggestion-1");

    expect(() => applyAgentSuggestion(state)).toThrow(
      "Cannot apply an unconfirmed suggestion."
    );
  });

  it("does not imply sync after apply", () => {
    const state = confirmAgentSuggestion(createAgentSuggestionState("suggestion-2"));
    const applied = applyAgentSuggestion(state);

    expect(applied.confirmedAt).not.toBeNull();
    expect(applied.appliedAt).not.toBeNull();
    expect(applied.syncStatus).toBe("not_synced");
  });

  it("allows sync only after apply", () => {
    const state = createAgentSuggestionState("suggestion-3");

    expect(() => syncAppliedAgentSuggestion(state)).toThrow(
      "Cannot sync a suggestion that has not been applied."
    );
  });

  it("marks sync as pending first when sync is requested", () => {
    const state = confirmAgentSuggestion(createAgentSuggestionState("suggestion-4"));
    const applied = applyAgentSuggestion(state);
    const syncing = syncAppliedAgentSuggestion(applied);

    expect(syncing.syncStatus).toBe("pending");
  });
});
