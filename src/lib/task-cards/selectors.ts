import { getMockDataset } from "@/lib/mock-selectors";
import {
  realAccounts,
  realDeals,
  realEvidenceRefs,
  realMeetings,
  realMeetingCases as yangWenxingRealMeetingCases,
} from "@/lib/mocks/yang-wenxing-real";

import { taskCardSeed } from "@/lib/task-cards/mock-data";
import type {
  FlowEvent,
  TaskAssignment,
  TaskCardActionExecutionContext,
  TaskCardActionRequest,
  TaskCardDetail,
  TaskCardRecord,
  TaskCardState,
  TaskLineage,
} from "@/lib/task-cards/types";

const dataset = getMockDataset();
const taskCardAccounts = [...dataset.accounts, ...realAccounts];
const taskCardDeals = [...dataset.deals, ...realDeals];
const taskCardMeetings = [...dataset.meetings, ...realMeetings];
const taskCardEvidences = [...dataset.evidenceRefs, ...realEvidenceRefs];
const taskCardCompanySources = [...dataset.realMeetingCases, ...yangWenxingRealMeetingCases];

function cloneState(state: TaskCardState): TaskCardState {
  return {
    cards: state.cards.map((card) => ({ ...card, availableActions: [...card.availableActions] })),
    assignments: state.assignments.map((assignment) => ({ ...assignment })),
    lineages: state.lineages.map((lineage) => ({
      ...lineage,
      parentCardIds: [...lineage.parentCardIds],
      sourceCardIds: [...lineage.sourceCardIds],
      childCardIds: [...lineage.childCardIds],
      meetingIds: [...lineage.meetingIds],
      dealIds: [...lineage.dealIds],
      accountIds: [...lineage.accountIds],
      accountThreadIds: [...lineage.accountThreadIds],
      evidenceIds: [...lineage.evidenceIds],
    })),
    flowEvents: state.flowEvents.map((event) => ({ ...event })),
  };
}

function getCard(state: TaskCardState, cardId: string) {
  return state.cards.find((card) => card.id === cardId) ?? null;
}

function getLineage(state: TaskCardState, cardId: string) {
  return state.lineages.find((lineage) => lineage.cardId === cardId) ?? null;
}

function buildAssignment(
  upstream: TaskCardRecord,
  downstream: TaskCardRecord,
  index: number,
  occurredAt: string
): TaskAssignment {
  return {
    id: `assignment-generated-${upstream.id}-${downstream.id}-${index}`,
    upstreamCardId: upstream.id,
    downstreamCardId: downstream.id,
    assignedByRole: upstream.ownerRole,
    assignedByName: upstream.ownerName,
    assignedToRole: downstream.ownerRole,
    assignedToName: downstream.ownerName,
    assignedAt: occurredAt,
    status: "active",
    revokeReason: null,
  };
}

function buildFlowEvent(
  lineage: TaskLineage,
  cardId: string,
  role: TaskCardRecord["ownerRole"] | "system",
  actorLabel: string,
  eventType: FlowEvent["eventType"],
  summary: string,
  suffix: string,
  occurredAt: string
): FlowEvent {
  return {
    id: `flow-${cardId}-${suffix}`,
    lineageId: lineage.id,
    cardId,
    eventType,
    actorLabel,
    role,
    occurredAt,
    summary,
  };
}

function mapActionKindToFlowEvent(actionKind: TaskCardActionRequest["actionKind"]): FlowEvent["eventType"] {
  switch (actionKind) {
    case "confirm":
      return "confirmed";
    case "accept":
      return "accepted";
    case "report":
      return "reported";
    case "escalate":
      return "escalated";
    case "approve":
      return "approved";
    case "dispatch":
      return "assigned";
    case "revoke":
      return "revoked";
    case "request_info":
      return "reviewed";
  }
}

export function createTaskCardState(): TaskCardState {
  return cloneState(taskCardSeed);
}

export function selectTaskCardsForRole(state: TaskCardState, role: TaskCardRecord["level"]) {
  return state.cards
    .filter((card) => card.level === role && card.isVisible)
    .sort((left, right) => right.priority - left.priority);
}

export function selectTaskCardDetail(state: TaskCardState, cardId: string): TaskCardDetail | null {
  const card = getCard(state, cardId);
  const lineage = getLineage(state, cardId);

  if (!card || !lineage) {
    return null;
  }

  return {
    card,
    lineage,
    flowEvents: state.flowEvents
      .filter((event) => event.lineageId === lineage.id)
      .sort((left, right) => left.occurredAt.localeCompare(right.occurredAt)),
    assignments: state.assignments.filter(
      (assignment) =>
        assignment.upstreamCardId === cardId || assignment.downstreamCardId === cardId
    ),
    accounts: taskCardAccounts.filter((account) => lineage.accountIds.includes(account.id)),
    deals: taskCardDeals.filter((deal) => lineage.dealIds.includes(deal.id)),
    meetings: taskCardMeetings.filter((meeting) => lineage.meetingIds.includes(meeting.id)),
    evidences: taskCardEvidences.filter((evidence) => lineage.evidenceIds.includes(evidence.id)),
    companySources: taskCardCompanySources.filter(
      (meetingCase) =>
        (meetingCase.accountId ? lineage.accountIds.includes(meetingCase.accountId) : false) ||
        (meetingCase.meetingId ? lineage.meetingIds.includes(meetingCase.meetingId) : false)
    ),
  };
}

export function applyTaskCardAction(
  state: TaskCardState,
  request: TaskCardActionRequest,
  executionContext: TaskCardActionExecutionContext = {}
): TaskCardState {
  const nextState = cloneState(state);
  const card = getCard(nextState, request.cardId);

  if (!card) {
    return nextState;
  }

  const action = card.availableActions.find((candidate) => candidate.kind === request.actionKind);

  if (!action) {
    return nextState;
  }

  const lineage = getLineage(nextState, card.id);
  const occurredAt = executionContext.occurredAt ?? new Date().toISOString();
  const actorRole = executionContext.actorRole ?? card.ownerRole;
  const actorName = executionContext.actorName ?? card.ownerName;

  card.status = action.nextStatus;
  card.availableActions = card.availableActions.filter((candidate) => candidate.kind !== action.kind);

  if (lineage) {
    nextState.flowEvents.push(
      buildFlowEvent(
        lineage,
        card.id,
        actorRole,
        actorName,
        mapActionKindToFlowEvent(action.kind),
        `${actorName}执行了动作：${action.label}`,
        `${action.kind}-${nextState.flowEvents.length + 1}`,
        occurredAt
      )
    );
  }

  if (action.revealCardIds?.length) {
    action.revealCardIds.forEach((revealedCardId, index) => {
      const revealedCard = getCard(nextState, revealedCardId);
      const revealedLineage = getLineage(nextState, revealedCardId);

      if (!revealedCard) {
        return;
      }

      revealedCard.isVisible = true;
      revealedCard.status = "received";
      nextState.assignments.push(buildAssignment(card, revealedCard, index, occurredAt));

      if (revealedLineage) {
        nextState.flowEvents.push(
          buildFlowEvent(
            revealedLineage,
            revealedCard.id,
            "system",
            "Task Router",
            "received",
            `${revealedCard.ownerName}真实收到一张新的任务卡。`,
            `received-${nextState.flowEvents.length + 1}`,
            occurredAt
          )
        );
      }
    });
  }

  if (action.revokeCardIds?.length) {
    action.revokeCardIds.forEach((revokedCardId, index) => {
      const revokedCard = getCard(nextState, revokedCardId);
      const revokedLineage = getLineage(nextState, revokedCardId);

      if (!revokedCard) {
        return;
      }

      revokedCard.isVisible = true;
      revokedCard.status = "revoked";

      nextState.assignments = nextState.assignments.map((assignment) =>
        assignment.upstreamCardId === card.id && assignment.downstreamCardId === revokedCardId
          ? { ...assignment, status: "revoked", revokeReason: `${card.ownerName}撤销了上游任务。` }
          : assignment
      );

      if (revokedLineage) {
        nextState.flowEvents.push(
          buildFlowEvent(
            revokedLineage,
            revokedCard.id,
            card.ownerRole,
            card.ownerName,
            "revoked",
            `${card.ownerName}撤销了这张下游任务卡。`,
            `revoked-${index + 1}-${nextState.flowEvents.length + 1}`,
            occurredAt
          )
        );
      }
    });
  }

  return nextState;
}
