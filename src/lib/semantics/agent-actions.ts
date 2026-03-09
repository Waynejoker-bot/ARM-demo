import type {
  AgentSuggestionLifecycle,
  SyncStatus,
} from "@/lib/domain/enums";

export type AgentSuggestionState = {
  suggestionId: string;
  lifecycle: AgentSuggestionLifecycle;
  confirmedAt: string | null;
  appliedAt: string | null;
  syncStatus: SyncStatus;
};

export function createAgentSuggestionState(
  suggestionId: string
): AgentSuggestionState {
  return {
    suggestionId,
    lifecycle: "suggestion",
    confirmedAt: null,
    appliedAt: null,
    syncStatus: "not_synced",
  };
}

export function confirmAgentSuggestion(
  state: AgentSuggestionState
): AgentSuggestionState {
  return {
    ...state,
    lifecycle: "confirmed",
    confirmedAt: state.confirmedAt ?? new Date().toISOString(),
  };
}

export function applyAgentSuggestion(
  state: AgentSuggestionState
): AgentSuggestionState {
  if (state.lifecycle === "suggestion") {
    throw new Error("Cannot apply an unconfirmed suggestion.");
  }

  return {
    ...state,
    lifecycle: "applied",
    appliedAt: state.appliedAt ?? new Date().toISOString(),
    syncStatus: "not_synced",
  };
}

export function syncAppliedAgentSuggestion(
  state: AgentSuggestionState
): AgentSuggestionState {
  if (state.lifecycle !== "applied") {
    throw new Error("Cannot sync a suggestion that has not been applied.");
  }

  return {
    ...state,
    syncStatus: "pending",
  };
}
