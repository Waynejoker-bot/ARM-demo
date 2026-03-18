import Link from "next/link";

import { RealMeetingShowcaseSection } from "@/components/real-cases/showcase";
import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { EmptyState } from "@/components/shared/feedback-states";
import { CustomerAgentComposer } from "@/components/threads/customer-agent-composer";
import { deriveCustomerAlerts, deriveOneLineSummary } from "@/lib/domain/customer-alerts";
import { getAccountById, getAccountThreadById, getMockDataset } from "@/lib/mock-selectors";
import { formatFreshness, formatStage } from "@/lib/presentation/labels";

const progressLabels = {
  prospect: "线索期",
  engaged: "已建联",
  opportunity: "商机形成中",
  commercial_active: "商务推进中",
  closed_won: "已成交",
  closed_lost: "已流失",
} as const;

const executionLabels = {
  need_prep: "待准备",
  meeting_scheduled: "已排期下一次 Meeting",
  meeting_done_pending_review: "会后待确认",
  next_step_pending_confirm: "待确认下一步",
  waiting_customer: "等待客户反馈",
  waiting_internal: "等待内部支持",
  blocked: "阻塞中",
  stalled: "已停滞",
} as const;

function toneForExecution(state: keyof typeof executionLabels) {
  if (state === "blocked" || state === "stalled") return "risk" as const;
  if (state === "meeting_done_pending_review" || state === "next_step_pending_confirm") {
    return "warn" as const;
  }
  return "info" as const;
}

function alertLevelToBadgeTone(level: "info" | "warn" | "risk") {
  if (level === "risk") return "risk" as const;
  if (level === "warn") return "warn" as const;
  return "info" as const;
}

export function AccountThreadListView() {
  const dataset = getMockDataset();
  const threads = [...dataset.accountThreads].sort((left, right) => {
    const interventionDelta = Number(right.interventionNeed !== "none") - Number(left.interventionNeed !== "none");
    if (interventionDelta !== 0) return interventionDelta;
    const stalledDelta =
      Number(right.executionState === "stalled" || right.executionState === "blocked") -
      Number(left.executionState === "stalled" || left.executionState === "blocked");
    if (stalledDelta !== 0) return stalledDelta;
    return right.updatedAt.localeCompare(left.updatedAt);
  });

  return (
    <>
      <PageHeader
        title="客户中心"
        description="按风险和紧急程度排列，Agent 为每个客户生成一句话判断。点击进入客户专属 Agent 对话。"
      />

      <SectionCard title="Agent 判断" mobileDensity="feed">
        <div className="stack-list">
          {threads.map((thread) => {
            const account = dataset.accounts.find((item) => item.id === thread.accountId);
            if (!account) return null;
            const alerts = deriveCustomerAlerts(thread, account);
            const summary = deriveOneLineSummary(thread, account);
            const deals = dataset.deals.filter((deal) => thread.relatedDealIds.includes(deal.id));
            const dealTotal = deals.reduce((sum, deal) => sum + deal.amount, 0);

            return (
              <Link
                key={thread.id}
                href={`/customers/${thread.accountId}`}
                className="stack-card customer-card-link"
                aria-label="客户卡片"
              >
                <div className="customer-card-header">
                  <strong>{account.name}</strong>
                  <div className="button-row">
                    <Badge tone="info">{account.industry}</Badge>
                    <Badge tone={toneForExecution(thread.executionState)}>
                      {executionLabels[thread.executionState]}
                    </Badge>
                    {alerts.length > 0 ? (
                      <Badge tone={alertLevelToBadgeTone(alerts[0]!.level)}>
                        {alerts[0]!.title}
                      </Badge>
                    ) : null}
                  </div>
                </div>
                <p className="customer-card-summary">{summary}</p>
                <div className="customer-card-meta">
                  <span>
                    {thread.lastMeetingAt
                      ? `上次互动 ${thread.lastMeetingAt.slice(0, 10)}`
                      : "暂无互动记录"}
                  </span>
                  {thread.nextMeetingAt ? (
                    <span>下次会议 {thread.nextMeetingAt.slice(0, 10)}</span>
                  ) : null}
                  {deals.length > 0 ? (
                    <span>
                      {deals.length} 个商机 · ¥{dealTotal.toLocaleString()}
                    </span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}

export function AccountThreadDetailView({ accountId }: { accountId: string }) {
  const dataset = getMockDataset();
  const account = getAccountById(accountId);
  const thread = getAccountThreadById(accountId);

  if (!account || !thread) {
    return <EmptyState title="线程不存在" description="当前无法找到该客户的推进线程。" />;
  }

  const meetings = dataset.meetings.filter((meeting) => thread.relatedMeetingIds.includes(meeting.id));
  const deals = dataset.deals.filter((deal) => thread.relatedDealIds.includes(deal.id));
  const alerts = deriveCustomerAlerts(thread, account);

  const agentOpeningParts: string[] = [];
  if (alerts.length > 0) {
    agentOpeningParts.push(alerts.map((a) => a.title + "：" + a.detail).join("\n"));
  }
  agentOpeningParts.push(`当前阶段：${progressLabels[thread.customerProgressStage]}，${executionLabels[thread.executionState]}。`);
  agentOpeningParts.push(thread.currentFocus);
  if (thread.latestBlocker) {
    agentOpeningParts.push(`阻点：${thread.latestBlocker}`);
  }
  const agentOpening = agentOpeningParts.join("\n");

  return (
    <div className="customer-agent-shell">
      <div className="customer-agent-header">
        <div>
          <h1>{account.name}</h1>
          <p className="customer-agent-desc">{account.description}</p>
        </div>
        <div className="button-row">
          <Badge tone="info">{progressLabels[thread.customerProgressStage]}</Badge>
          <Badge tone={toneForExecution(thread.executionState)}>{executionLabels[thread.executionState]}</Badge>
          <Badge
            tone={thread.dataFreshness === "fresh" ? "success" : thread.dataFreshness === "stale" ? "warn" : "risk"}
          >
            {formatFreshness(thread.dataFreshness)}
          </Badge>
          <Badge tone="default">{Math.round(thread.dataCoverage * 100)}%</Badge>
        </div>
      </div>

      <div className="customer-agent-conversation">
        <div className="agent-source-tag">客户 Agent 判断</div>
        <article className="conversation-message conversation-message-agent">
          <div className="conversation-message-topline">
            <strong>Agent 教练</strong>
            <span className="conversation-message-meta">客户专属 Agent</span>
          </div>
          <p style={{ whiteSpace: "pre-line" }}>{agentOpening}</p>
        </article>

        {alerts.map((alert, idx) => (
          <div key={`alert-${idx}`} className="conversation-inline-card">
            <div className="conversation-inline-card-topline">
              <span>主动提醒</span>
              <Badge tone={alertLevelToBadgeTone(alert.level)}>{alert.title}</Badge>
            </div>
            <p>{alert.detail}</p>
          </div>
        ))}

        {deals.length > 0 ? (
          <div className="conversation-inline-card">
            <div className="conversation-inline-card-topline">
              <span>关联商机</span>
              <Badge tone="info">{deals.length} 个</Badge>
            </div>
            {deals.map((deal) => (
              <div key={deal.id} className="stack-card">
                <Link href={`/deals/${deal.id}`}>
                  <strong>{deal.name}</strong>
                </Link>
                <p>{formatStage(deal.stage)} · ¥{deal.amount.toLocaleString()} · {deal.nextStepSummary}</p>
              </div>
            ))}
          </div>
        ) : null}

        {meetings.length > 0 ? (
          <div className="conversation-inline-card">
            <div className="conversation-inline-card-topline">
              <span>相关会议</span>
              <Badge tone="info">{meetings.length} 场</Badge>
            </div>
            {meetings.map((meeting) => (
              <div key={meeting.id} className="stack-card">
                <Link href={`/meetings/${meeting.id}`}>
                  <strong>{meeting.title}</strong>
                </Link>
                <p>
                  {meeting.status === "completed" ? "已完成" : "待进行"} ·
                  {meeting.riskSignalPresent ? " 暴露风险信号" : " 推进正常"}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <CustomerAgentComposer accountName={account.name} accountContext={agentOpening} />
    </div>
  );
}
