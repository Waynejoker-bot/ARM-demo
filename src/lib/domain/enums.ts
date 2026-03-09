export type SyncStatus = "not_synced" | "pending" | "synced" | "failed";

export type AgentSuggestionLifecycle = "suggestion" | "confirmed" | "applied";

export type ProposalStatus = "pending" | "applied" | "cancelled";

export type CustomerProgressStage =
  | "prospect"
  | "engaged"
  | "opportunity"
  | "commercial_active"
  | "closed_won"
  | "closed_lost";

export type ExecutionState =
  | "need_prep"
  | "meeting_scheduled"
  | "meeting_done_pending_review"
  | "next_step_pending_confirm"
  | "waiting_customer"
  | "waiting_internal"
  | "blocked"
  | "stalled";

export type InterventionNeed = "none" | "manager" | "executive";
