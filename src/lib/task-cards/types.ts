import type {
  Account,
  DataFreshnessStatus,
  Deal,
  EvidenceRef,
  Meeting,
  RealMeetingCase,
  RoleType,
} from "@/lib/domain/types";

export type TaskCardStatus =
  | "suggested"
  | "confirmed"
  | "assigned"
  | "received"
  | "accepted"
  | "in_progress"
  | "reported"
  | "reviewed"
  | "escalated"
  | "resolved"
  | "closed"
  | "revoked"
  | "returned";

export type TaskCardActionKind =
  | "confirm"
  | "accept"
  | "dispatch"
  | "report"
  | "escalate"
  | "approve"
  | "request_info"
  | "revoke";

export type TaskCardSourceKind =
  | "meeting"
  | "account_thread"
  | "report_snapshot"
  | "manager_assignment"
  | "escalation"
  | "executive_decision";

export type TaskCardType =
  | "rep_execution"
  | "manager_intervention"
  | "ceo_escalation";

export type EscalationCategory =
  | "resource_dispatch"
  | "pricing_approval"
  | "executive_intervention"
  | "other";

export type UpgradeReason = "model_suggested" | "user_reported";

export type TaskCardActionSpec = {
  kind: TaskCardActionKind;
  label: string;
  nextStatus: TaskCardStatus;
  revealCardIds?: string[];
  revokeCardIds?: string[];
};

export type TaskCardRecord = {
  id: string;
  level: RoleType;
  cardType: TaskCardType;
  escalationCategory: EscalationCategory | null;
  upgradeReason: UpgradeReason | null;
  title: string;
  summary: string;
  recommendedAction: string;
  whyNow: string;
  impactLabel: string;
  impactValue: string;
  ownerRole: RoleType;
  ownerName: string;
  targetRole: RoleType | null;
  targetName: string | null;
  status: TaskCardStatus;
  dueLabel: string;
  priority: number;
  confidence: number;
  dataFreshness: DataFreshnessStatus;
  coverage: number;
  trustNote: string;
  reasonItems: string[];
  lineageId: string;
  sourceKind: TaskCardSourceKind;
  sourceIds: string[];
  evidenceIds: string[];
  accountIds: string[];
  dealIds: string[];
  meetingIds: string[];
  isVisible: boolean;
  canAssign: boolean;
  canEscalate: boolean;
  canRevoke: boolean;
  canDrillDown: boolean;
  availableActions: TaskCardActionSpec[];
};

export type TaskAssignment = {
  id: string;
  upstreamCardId: string;
  downstreamCardId: string;
  assignedByRole: RoleType;
  assignedByName: string;
  assignedToRole: RoleType;
  assignedToName: string;
  assignedAt: string;
  status: "active" | "revoked" | "completed";
  revokeReason: string | null;
};

export type TaskLineage = {
  id: string;
  cardId: string;
  parentCardIds: string[];
  sourceCardIds: string[];
  childCardIds: string[];
  meetingIds: string[];
  dealIds: string[];
  accountIds: string[];
  accountThreadIds: string[];
  evidenceIds: string[];
};

export type FlowEventType =
  | "meeting_ingested"
  | "suggested"
  | "confirmed"
  | "assigned"
  | "received"
  | "accepted"
  | "reported"
  | "reviewed"
  | "escalated"
  | "approved"
  | "revoked";

export type FlowEvent = {
  id: string;
  lineageId: string;
  cardId: string;
  eventType: FlowEventType;
  actorLabel: string;
  role: RoleType | "system";
  occurredAt: string;
  summary: string;
};

export type TaskCardSeed = {
  cards: TaskCardRecord[];
  assignments: TaskAssignment[];
  lineages: TaskLineage[];
  flowEvents: FlowEvent[];
};

export type TaskCardState = TaskCardSeed;

export type TaskCardActionRequest = {
  cardId: string;
  actionKind: TaskCardActionKind;
};

export type TaskCardActionExecutionContext = {
  occurredAt?: string;
  actorRole?: RoleType | "system";
  actorName?: string;
};

export type TaskCardDetail = {
  card: TaskCardRecord;
  lineage: TaskLineage;
  flowEvents: FlowEvent[];
  assignments: TaskAssignment[];
  accounts: Account[];
  deals: Deal[];
  meetings: Meeting[];
  evidences: EvidenceRef[];
  companySources: RealMeetingCase[];
};
