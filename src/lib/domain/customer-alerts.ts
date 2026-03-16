import type { Account, AccountThread } from "@/lib/domain/types";

export type CustomerAlert = {
  level: "info" | "warn" | "risk";
  title: string;
  detail: string;
};

const FOLLOW_UP_GAP_DAYS = 5;
const LOW_COVERAGE_THRESHOLD = 0.5;

function daysBetween(from: string, to: Date): number {
  return Math.floor((to.getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24));
}

export function deriveCustomerAlerts(
  thread: AccountThread,
  _account: Account,
  now: Date = new Date()
): CustomerAlert[] {
  const alerts: CustomerAlert[] = [];

  if (thread.executionState === "stalled") {
    alerts.push({
      level: "risk",
      title: "推进已停滞",
      detail: thread.latestBlocker
        ? `原因：${thread.latestBlocker}`
        : "当前没有明确的推进动作，建议尽快制定下一步计划。",
    });
  }

  if (thread.executionState === "blocked") {
    alerts.push({
      level: "risk",
      title: "推进被阻塞",
      detail: thread.latestBlocker
        ? `阻塞原因：${thread.latestBlocker}`
        : "存在阻塞但未记录具体原因，建议确认并排除。",
    });
  }

  if (thread.lastMeetingAt) {
    const gap = daysBetween(thread.lastMeetingAt, now);
    if (gap > FOLLOW_UP_GAP_DAYS) {
      alerts.push({
        level: "warn",
        title: `已 ${gap} 天未跟进`,
        detail: "距上次会议超过 5 天，建议安排跟进或主动联系客户确认进展。",
      });
    }
  }

  if (thread.interventionNeed !== "none") {
    const who = thread.interventionNeed === "manager" ? "主管" : "高管";
    alerts.push({
      level: "warn",
      title: `需要${who}介入`,
      detail: `当前客户状态需要${who}层级的支持或决策。`,
    });
  }

  if (thread.dataCoverage < LOW_COVERAGE_THRESHOLD) {
    alerts.push({
      level: "warn",
      title: "数据覆盖不足",
      detail: `当前数据覆盖率仅 ${Math.round(thread.dataCoverage * 100)}%，Agent 判断可能不够准确。`,
    });
  }

  return alerts;
}

export function deriveOneLineSummary(
  thread: AccountThread,
  account: Account,
  now: Date = new Date()
): string {
  const alerts = deriveCustomerAlerts(thread, account, now);

  if (alerts.length === 0) {
    return "推进正常，暂无需要特别关注的事项。";
  }

  const riskAlerts = alerts.filter((a) => a.level === "risk");
  if (riskAlerts.length > 0) {
    return riskAlerts[0]!.title + "——" + riskAlerts[0]!.detail;
  }

  return alerts[0]!.title + "——" + alerts[0]!.detail;
}
