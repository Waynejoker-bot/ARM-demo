import type {
  CustomerProgressStage,
  ExecutionState,
  InterventionNeed,
  SyncStatus,
} from "@/lib/domain/enums";

export type DataFreshnessStatus = "fresh" | "stale" | "missing";
export type RiskLevel = "low" | "medium" | "high";
export type RoleType = "ceo" | "manager" | "rep";
export type AgentType =
  | "meeting_agent"
  | "deal_agent"
  | "next_step_agent"
  | "crm_sync_agent"
  | "coaching_agent";
export type IntakeSourceKind = "recording" | "text" | "email" | "link";
export type IntakeStatus =
  | "received"
  | "parsing"
  | "needs_confirmation"
  | "ready_to_apply"
  | "applied"
  | "failed";
export type IntakeEntityType = "account" | "deal" | "meeting" | "contact";
export type IngestionTargetType =
  | "meeting_summary"
  | "conversation"
  | "evidence_ref"
  | "deal_note"
  | "next_step";

export type Account = {
  id: string;
  name: string;
  description: string;
  industry: string;
  size: "startup" | "mid_market" | "enterprise";
  region: string;
  ownerRepId: string;
};

export type Contact = {
  id: string;
  accountId: string;
  name: string;
  title: string;
  description: string;
  roleType: "champion" | "buyer" | "decision_maker" | "influencer";
  influenceLevel: number;
  lastInteractionAt: string;
};

export type Deal = {
  id: string;
  accountId: string;
  name: string;
  ownerRepId: string;
  stage: string;
  amount: number;
  currency: string;
  healthScore: number;
  healthLabel: string;
  winProbability: number;
  riskLevel: RiskLevel;
  nextStepSummary: string;
  nextMeetingAt: string | null;
  updatedAt: string;
  dataFreshness: DataFreshnessStatus;
  dataCoverage: number;
};

export type Meeting = {
  id: string;
  accountId: string;
  dealId: string | null;
  title: string;
  meetingType: "intro" | "discovery" | "demo" | "proposal" | "review";
  scheduledAt: string;
  status: "upcoming" | "completed";
  summaryStatus: "ready" | "needs_review";
  riskSignalPresent: boolean;
  transcriptStatus: "ready" | "missing";
  dataFreshness: DataFreshnessStatus;
};

export type Conversation = {
  id: string;
  relatedType: "deal" | "meeting" | "account";
  relatedId: string;
  sourceType: "email" | "chat" | "call";
  timestamp: string;
  summary: string;
  rawAvailable: boolean;
};

export type EvidenceRef = {
  id: string;
  sourceType: "meeting" | "email" | "chat" | "crm" | "timeline";
  sourceId: string;
  quote: string;
  timestamp: string;
  relevanceReason: string;
};

export type AgentOutput = {
  id: string;
  objectType: "deal" | "meeting" | "pipeline" | "revenue" | "rep";
  objectId: string;
  agentType: AgentType;
  outputType: "summary" | "risk" | "next_step" | "coaching" | "forecast";
  status: "draft" | "ready" | "confirmed" | "rejected" | "applied";
  confidence: number;
  summary: string;
  rationaleItems: string[];
  evidenceRefs: string[];
  createdAt: string;
  updatedAt: string;
  userFeedbackStatus: "none" | "accepted" | "edited" | "rejected";
  applicationStatus: "suggestion" | "confirmed" | "applied";
  syncStatus: SyncStatus;
};

export type ForecastSnapshot = {
  id: string;
  periodLabel: string;
  total: number;
  commit: number;
  bestCase: number;
  upside: number;
  confidence: number;
  riskExposure: number;
};

export type RepScorecard = {
  repId: string;
  repName: string;
  teamName: string;
  closeRate: number;
  averageHealthScore: number;
  capabilityScore: number;
  coachingFocus: string;
};

export type RecapRecord = {
  id: string;
  title: string;
  category: "high_risk" | "high_value" | "best_practice" | "missed_opportunity";
  relatedMeetingId: string;
  summary: string;
};

export type WorkflowEvent = {
  id: string;
  dealId: string;
  agentType: AgentType;
  eventLabel: string;
  status: "completed" | "pending" | "failed";
  timestamp: string;
};

export type DataSourceRecord = {
  id: string;
  sourceName: string;
  sourceType: "crm" | "email" | "calendar" | "chat" | "recording" | "mobile";
  status: "connected" | "warning" | "disconnected";
  coverage: number;
  lastSyncedAt: string | null;
  warning: string | null;
};

export type SyncRecord = {
  id: string;
  objectType: "deal" | "meeting";
  objectId: string;
  status: SyncStatus;
  destination: "crm";
  updatedAt: string;
};

export type AlertRecord = {
  id: string;
  level: RiskLevel;
  title: string;
  relatedDealId: string | null;
};

export type AccountThread = {
  id: string;
  accountId: string;
  ownerRepId: string;
  primaryContactIds: string[];
  relatedDealIds: string[];
  relatedMeetingIds: string[];
  activeDealId: string | null;
  customerProgressStage: CustomerProgressStage;
  executionState: ExecutionState;
  objectiveProgressSummary: string;
  currentFocus: string;
  latestBlocker: string | null;
  lastMeetingId: string | null;
  lastMeetingAt: string | null;
  nextMeetingAt: string | null;
  interventionNeed: InterventionNeed;
  dataFreshness: DataFreshnessStatus;
  dataCoverage: number;
  updatedAt: string;
};

export type RepReportSnapshot = {
  id: string;
  repId: string;
  repName: string;
  teamName: string;
  periodLabel: string;
  touchedAccountCount: number;
  completedMeetingCount: number;
  activeDealCount: number;
  newOpportunityCount: number;
  stalledThreadCount: number;
  interventionCount: number;
  summary: string;
  highlightedThreadId: string | null;
  highlightedReason: string;
  accountThreadIds: string[];
};

export type RealMeetingCase = {
  id: string;
  accountId?: string;
  meetingId?: string;
  ownerLabel: string;
  sourceLabel: string;
  title: string;
  accountName: string;
  accountProfile: string;
  meetingType: Meeting["meetingType"];
  occurredAt: string;
  status: Meeting["status"];
  summaryStatus: Meeting["summaryStatus"];
  transcriptStatus: Meeting["transcriptStatus"];
  dataFreshness: DataFreshnessStatus;
  priorityLabel: string;
  insightLabel: "核心结论" | "会议目标";
  insight: string;
  nextStep: string;
  companyNameSource?: "raw_verified" | "internal_match";
  companyNameSourceLabel?: string;
  companyNameSourceNote?: string;
  publicContext: string | null;
  publicSourceLabel: string | null;
  publicSourceUrl: string | null;
};

export type IntakeItem = {
  id: string;
  sourceKind: IntakeSourceKind;
  submittedByRepId: string;
  submittedAt: string;
  status: IntakeStatus;
  title: string;
  rawTextPreview: string;
  fileName: string | null;
  externalUrl: string | null;
  classificationConfidence: number;
  needsManualInput: boolean;
  missingFields: string[];
  selectedAccountId: string | null;
  selectedDealId: string | null;
  selectedMeetingId: string | null;
  candidateIds: string[];
  proposalIds: string[];
};

export type EntityCandidate = {
  id: string;
  intakeItemId: string;
  entityType: IntakeEntityType;
  entityId: string;
  label: string;
  confidence: number;
  reason: string;
  isPrimary: boolean;
};

export type IngestionProposal = {
  id: string;
  intakeItemId: string;
  targetType: IngestionTargetType;
  targetObjectId: string | null;
  title: string;
  summary: string;
  confidence: number;
  status: "suggestion" | "confirmed" | "applied" | "rejected";
  evidenceRefIds: string[];
  requiresManualReview: boolean;
};

export type RoleViewCollection = {
  ceo: {
    role: RoleType;
    topDealIds: string[];
  };
  manager: {
    role: RoleType;
    stalledDealIds: string[];
  };
  rep: {
    role: RoleType;
    todoDealIds: string[];
  };
};

export type MockDataset = {
  accounts: Account[];
  contacts: Contact[];
  deals: Deal[];
  meetings: Meeting[];
  conversations: Conversation[];
  evidenceRefs: EvidenceRef[];
  agentOutputs: AgentOutput[];
  forecastSnapshots: ForecastSnapshot[];
  repScorecards: RepScorecard[];
  recapRecords: RecapRecord[];
  workflowEvents: WorkflowEvent[];
  dataSources: DataSourceRecord[];
  syncRecords: SyncRecord[];
  alerts: AlertRecord[];
  accountThreads: AccountThread[];
  repReportSnapshots: RepReportSnapshot[];
  realMeetingCases: RealMeetingCase[];
  intakeItems: IntakeItem[];
  entityCandidates: EntityCandidate[];
  ingestionProposals: IngestionProposal[];
  roleViews: RoleViewCollection;
};
