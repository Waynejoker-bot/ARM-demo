import type { ProposalStatus, SyncStatus } from "@/lib/domain/enums";

export type StageProposal = {
  dealId: string;
  committedStage: string;
  proposedStage: string;
  appliedStage: string;
  status: ProposalStatus;
  syncStatus: SyncStatus;
};

export function createStageProposal(input: {
  dealId: string;
  committedStage: string;
  proposedStage: string;
}): StageProposal {
  return {
    ...input,
    appliedStage: input.committedStage,
    status: "pending",
    syncStatus: "not_synced",
  };
}

export function confirmStageProposal(proposal: StageProposal): StageProposal {
  return {
    ...proposal,
    status: "applied",
    appliedStage: proposal.proposedStage,
    syncStatus: "not_synced",
  };
}

export function cancelStageProposal(proposal: StageProposal): StageProposal {
  return {
    ...proposal,
    status: "cancelled",
    appliedStage: proposal.committedStage,
  };
}
