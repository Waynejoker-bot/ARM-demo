import {
  applyTaskCardAction,
  createTaskCardState,
  selectTaskCardDetail,
  selectTaskCardsForRole,
} from "@/lib/task-cards/selectors";

describe("task card selectors", () => {
  it("returns rep-level cards for the default frontline view", () => {
    const state = createTaskCardState();
    const repCards = selectTaskCardsForRole(state, "rep");

    expect(repCards.length).toBeGreaterThan(0);
    expect(repCards.every((card) => card.level === "rep")).toBe(true);
    expect(repCards[0]?.title).toMatch(/需要|必须|先/i);
  });

  it("returns assignment-capable cards for the manager view", () => {
    const state = createTaskCardState();
    const managerCards = selectTaskCardsForRole(state, "manager");

    expect(managerCards.some((card) => card.canAssign)).toBe(true);
    expect(managerCards.some((card) => card.level === "manager")).toBe(true);
  });

  it("returns the four CEO escalation categories including other", () => {
    const state = createTaskCardState();
    const ceoCards = selectTaskCardsForRole(state, "ceo");

    expect(ceoCards.map((card) => card.escalationCategory)).toEqual(
      expect.arrayContaining([
        "resource_dispatch",
        "pricing_approval",
        "executive_intervention",
        "other",
      ])
    );
  });

  it("returns lineage and flow events for a selected card", () => {
    const state = createTaskCardState();
    const detail = selectTaskCardDetail(state, "ceo-card-1");

    expect(detail?.card.id).toBe("ceo-card-1");
    expect(detail?.lineage.parentCardIds).toEqual(expect.arrayContaining(["manager-card-1"]));
    expect(detail?.lineage.meetingIds).toEqual(expect.arrayContaining(["meeting-real-1"]));
    expect(detail?.flowEvents.length).toBeGreaterThan(2);
  });

  it("marks downstream cards as revoked when an upstream assignment is revoked", () => {
    const state = createTaskCardState();

    const nextState = applyTaskCardAction(state, {
      cardId: "manager-card-2",
      actionKind: "revoke",
    });

    const repCards = selectTaskCardsForRole(nextState, "rep");
    const revokedCard = repCards.find((card) => card.id === "rep-card-2");

    expect(revokedCard?.status).toBe("revoked");
    expect(selectTaskCardDetail(nextState, "rep-card-2")?.flowEvents.at(-1)?.eventType).toBe(
      "revoked"
    );
  });
});
