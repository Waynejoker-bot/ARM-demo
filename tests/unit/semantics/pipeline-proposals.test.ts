import {
  cancelStageProposal,
  confirmStageProposal,
  createStageProposal,
} from "@/lib/semantics/pipeline-proposals";

describe("pipeline proposal semantics", () => {
  it("creates a proposal without changing the committed stage", () => {
    const proposal = createStageProposal({
      dealId: "deal-1",
      committedStage: "proposal",
      proposedStage: "negotiation",
    });

    expect(proposal).toMatchObject({
      dealId: "deal-1",
      committedStage: "proposal",
      proposedStage: "negotiation",
      status: "pending",
      appliedStage: "proposal",
    });
  });

  it("confirms a proposal into internal state without implying sync", () => {
    const proposal = createStageProposal({
      dealId: "deal-2",
      committedStage: "demo",
      proposedStage: "negotiation",
    });

    const confirmed = confirmStageProposal(proposal);

    expect(confirmed.status).toBe("applied");
    expect(confirmed.appliedStage).toBe("negotiation");
    expect(confirmed.syncStatus).toBe("not_synced");
  });

  it("allows a proposal to be canceled cleanly", () => {
    const proposal = createStageProposal({
      dealId: "deal-3",
      committedStage: "qualification",
      proposedStage: "demo",
    });

    const canceled = cancelStageProposal(proposal);

    expect(canceled.status).toBe("cancelled");
    expect(canceled.appliedStage).toBe("qualification");
  });
});
