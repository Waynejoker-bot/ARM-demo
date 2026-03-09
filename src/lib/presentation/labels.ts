import type { DataFreshnessStatus, RiskLevel } from "@/lib/domain/types";

const stageLabels: Record<string, string> = {
  qualification: "资格确认",
  demo: "产品演示",
  proposal: "方案报价",
  negotiation: "商务谈判",
  review: "最终评审",
  discovery: "需求发现",
};

const riskLabels: Record<RiskLevel, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险",
};

const freshnessLabels: Record<DataFreshnessStatus, string> = {
  fresh: "数据新鲜",
  stale: "数据过期",
  missing: "数据缺失",
};

const meetingTypeLabels: Record<string, string> = {
  intro: "初次沟通",
  discovery: "需求发现",
  demo: "产品演示",
  proposal: "方案沟通",
  review: "复盘评审",
};

const meetingStatusLabels: Record<string, string> = {
  upcoming: "待进行",
  completed: "已完成",
};

const summaryStatusLabels: Record<string, string> = {
  ready: "已生成总结",
  needs_review: "待人工确认",
};

const sourceTypeLabels: Record<string, string> = {
  crm: "CRM",
  email: "邮件",
  calendar: "日历",
  chat: "聊天",
  recording: "录音设备",
  mobile: "移动端",
};

const sourceStatusLabels: Record<string, string> = {
  connected: "已连接",
  warning: "需关注",
  disconnected: "已断开",
};

const sizeLabels: Record<string, string> = {
  startup: "初创",
  mid_market: "中型企业",
  enterprise: "大型企业",
};

const contactRoleLabels: Record<string, string> = {
  champion: "内部支持者",
  buyer: "采购方",
  decision_maker: "决策人",
  influencer: "关键影响者",
};

const workflowStatusLabels: Record<string, string> = {
  completed: "已完成",
  pending: "处理中",
  failed: "失败",
};

const recapCategoryLabels: Record<string, string> = {
  high_risk: "高风险复盘",
  high_value: "高价值案例",
  best_practice: "最佳实践",
  missed_opportunity: "错失机会",
};

const applicationStatusLabels: Record<string, string> = {
  suggestion: "待确认建议",
  confirmed: "已确认",
  applied: "已应用",
};

const agentTypeLabels: Record<string, string> = {
  meeting_agent: "会议 Agent",
  deal_agent: "商机 Agent",
  next_step_agent: "下一步 Agent",
  crm_sync_agent: "CRM 同步 Agent",
  coaching_agent: "辅导 Agent",
};

const evidenceSourceLabels: Record<string, string> = {
  meeting: "会议",
  email: "邮件",
  chat: "聊天",
  crm: "CRM",
  timeline: "时间线",
};

export function formatStage(value: string) {
  return stageLabels[value] ?? value;
}

export function formatRisk(value: RiskLevel) {
  return riskLabels[value];
}

export function formatFreshness(value: DataFreshnessStatus) {
  return freshnessLabels[value];
}

export function formatMeetingType(value: string) {
  return meetingTypeLabels[value] ?? value;
}

export function formatMeetingStatus(value: string) {
  return meetingStatusLabels[value] ?? value;
}

export function formatSummaryStatus(value: string) {
  return summaryStatusLabels[value] ?? value;
}

export function formatSourceType(value: string) {
  return sourceTypeLabels[value] ?? value;
}

export function formatSourceStatus(value: string) {
  return sourceStatusLabels[value] ?? value;
}

export function formatCompanySize(value: string) {
  return sizeLabels[value] ?? value;
}

export function formatContactRole(value: string) {
  return contactRoleLabels[value] ?? value;
}

export function formatWorkflowStatus(value: string) {
  return workflowStatusLabels[value] ?? value;
}

export function formatRecapCategory(value: string) {
  return recapCategoryLabels[value] ?? value;
}

export function formatApplicationStatus(value: string) {
  return applicationStatusLabels[value] ?? value;
}

export function formatAgentType(value: string) {
  return agentTypeLabels[value] ?? value;
}

export function formatEvidenceSource(value: string) {
  return evidenceSourceLabels[value] ?? value;
}
