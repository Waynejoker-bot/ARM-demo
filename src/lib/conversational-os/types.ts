import type { RoleType } from "@/lib/domain/types";

export type ConversationThreadType = "rep_private" | "manager_private" | "ceo_private";

export type ConversationMemberType =
  | "human_rep"
  | "human_manager"
  | "human_ceo"
  | "agent_rep_bp"
  | "agent_manager_bp"
  | "agent_ceo_admin";

export type ConversationThread = {
  id: string;
  title: string;
  description: string;
  threadType: ConversationThreadType;
  primaryRole: RoleType;
  pinnedCardId: string;
};

export type ConversationThreadReadState = {
  threadId: string;
  lastReadAt: string;
};

export type ConversationThreadMember = {
  id: string;
  threadId: string;
  actorId: string;
  actorName: string;
  memberType: ConversationMemberType;
  role: RoleType | "agent";
};

export type ConversationMessageKind =
  | "human"
  | "agent_reply"
  | "system_handoff"
  | "card_summary";

export type ConversationMessageVisibility =
  | "visible_to_thread"
  | "visible_as_summary_only"
  | "system_only";

export type ConversationMessage = {
  id: string;
  threadId: string;
  actorId: string;
  actorName: string;
  kind: ConversationMessageKind;
  body: string;
  occurredAt: string;
  visibility: ConversationMessageVisibility;
  relatedCardId: string | null;
};

export type ConversationCardAction =
  | "confirm"
  | "report_upstream"
  | "approve"
  | "request_details";

export type ConversationDecisionCard = {
  id: string;
  threadId: string;
  title: string;
  summary: string;
  detail: string;
  trustNote: string;
  priorityRank: number;
  primaryAction: ConversationCardAction;
  primaryActionLabel: string;
  sourceMeetingId: string | null;
  sourceDealId: string | null;
  createdAt: string;
};

export type ConversationHandoff = {
  id: string;
  fromThreadId: string;
  toThreadId: string;
  summary: string;
  detailVisibleToDownstream: false;
  createdAt: string;
  relatedCardId: string | null;
};

export type ConversationDeliveryType =
  | "report_upstream"
  | "escalate_upstream"
  | "decision_return"
  | "task_downstream";

export type ConversationDelivery = {
  id: string;
  fromThreadId: string;
  toThreadId: string;
  deliveryType: ConversationDeliveryType;
  summary: string;
  createdAt: string;
  relatedCardId: string | null;
};

export type ConversationSeed = {
  threads: ConversationThread[];
  members: ConversationThreadMember[];
  messages: ConversationMessage[];
  cards: ConversationDecisionCard[];
  handoffs: ConversationHandoff[];
  deliveries: ConversationDelivery[];
  readStates: ConversationThreadReadState[];
};
