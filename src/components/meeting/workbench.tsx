import Link from "next/link";

import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { EmptyState } from "@/components/shared/feedback-states";
import {
  getAccountById,
  getAccountThreadById,
  getAgentOutputsForObject,
  getDealById,
  getEvidenceForIds,
  getMeetingById,
  getMockDataset,
} from "@/lib/mock-selectors";
import {
  formatEvidenceSource,
  formatFreshness,
  formatMeetingStatus,
  formatMeetingType,
} from "@/lib/presentation/labels";

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

function getToneFromState(state: keyof typeof executionLabels) {
  if (state === "blocked" || state === "stalled") return "risk" as const;
  if (state === "meeting_done_pending_review" || state === "next_step_pending_confirm") {
    return "warn" as const;
  }

  return "info" as const;
}

export function MeetingWorkbenchView({ meetingId }: { meetingId: string }) {
  const dataset = getMockDataset();
  const meeting = getMeetingById(meetingId);

  if (!meeting) {
    return <EmptyState title="Meeting 不存在" description="当前无法找到对应会议。" />;
  }

  const account = getAccountById(meeting.accountId);
  const deal = meeting.dealId ? getDealById(meeting.dealId) : null;
  const thread = getAccountThreadById(meeting.accountId);
  const outputs = getAgentOutputsForObject("meeting", meeting.id);
  const summary = outputs[0] ?? null;
  const evidence = summary ? getEvidenceForIds(summary.evidenceRefs) : [];
  const relatedConversations = dataset.conversations.filter(
    (conversation) =>
      (conversation.relatedType === "meeting" && conversation.relatedId === meeting.id) ||
      (conversation.relatedType === "deal" && conversation.relatedId === meeting.dealId)
  );
  const lowTrust =
    meeting.transcriptStatus === "missing" ||
    (summary ? summary.confidence < 0.65 : true);

  return (
    <>
      <PageHeader
        title={meeting.title}
        description={`${account?.name ?? "未知客户"} · ${formatMeetingType(meeting.meetingType)} · ${formatMeetingStatus(meeting.status)}`}
        action={
          <div className="button-row">
            {thread ? (
              <Badge tone={getToneFromState(thread.executionState)}>
                {executionLabels[thread.executionState]}
              </Badge>
            ) : null}
            <Badge
              tone={
                meeting.dataFreshness === "fresh"
                  ? "success"
                  : meeting.dataFreshness === "stale"
                    ? "warn"
                    : "risk"
              }
            >
              {formatFreshness(meeting.dataFreshness)}
            </Badge>
            <Badge tone={meeting.transcriptStatus === "missing" ? "risk" : "info"}>
              {meeting.transcriptStatus === "missing" ? "转录缺失" : "证据可用"}
            </Badge>
          </div>
        }
      />

      <div className="grid-3">
        <SectionCard title="会前准备" mobileDensity="feed">
          <ul className="list-plain">
            <li>客户：{account?.name ?? "未知客户"}</li>
            <li>当前线程：{thread ? progressLabels[thread.customerProgressStage] : "暂无线程"}</li>
            <li>会议目标：确认客户是否接受下一次试点或商务推进安排。</li>
            <li>建议提问：预算边界、参与角色、下一次会议日期。</li>
          </ul>
        </SectionCard>

        <SectionCard title="会议证据" mobilePriority="primary" mobileDensity="feed">
          <div className="stack-list">
            <div className="stack-card">
              <strong>{meeting.transcriptStatus === "missing" ? "会议转录缺失" : "录音与转录可回看"}</strong>
              <p>
                {meeting.transcriptStatus === "missing"
                  ? "当前可信度已下降，需要更多人工确认。"
                  : "关键证据优先来自 Meeting 转录，其次是邮件和截图补充。"}
              </p>
              <p className="muted">数据状态：{formatFreshness(meeting.dataFreshness)}</p>
              <p className="muted">证据覆盖：{evidence.length} 条高相关依据</p>
            </div>
            {evidence.length ? (
              evidence.map((item) => (
                <div className="stack-card" key={item.id}>
                  <strong>{formatEvidenceSource(item.sourceType)}</strong>
                  <p>{item.quote}</p>
                </div>
              ))
            ) : relatedConversations.length ? (
              relatedConversations.map((conversation) => (
                <div className="stack-card" key={conversation.id}>
                  <strong>{conversation.sourceType.toUpperCase()}</strong>
                  <p>{conversation.summary}</p>
                </div>
              ))
            ) : (
              <div className="stack-card">
                <strong>当前没有可展示的高亮证据</strong>
                <p>需要进一步补充录音、截图或邮件片段。</p>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Agent BP 判断" mobileDensity="feed">
          <div className="stack-list">
            <div className="stack-card">
              <strong>{summary?.summary ?? thread?.currentFocus ?? "当前 Meeting 仍待 Agent 生成判断。"}</strong>
              <p>
                {lowTrust
                  ? "低可信度：当前结论受转录缺失或证据覆盖不足影响，必须先做人工确认。"
                  : "当前判断可直接作为会后推进提议，但仍需人工确认后再应用。"}
              </p>
            </div>
            {summary?.rationaleItems?.length ? (
              <ul className="list-plain">
                {summary.rationaleItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="会后总结与状态提议" mobilePriority="primary">
        <div className="grid-2">
          <div className="stack-list">
            <div className="stack-card">
              <strong>总结候选</strong>
              <p>{summary?.summary ?? "当前尚无自动总结，请先补齐证据。"}</p>
            </div>
            <div className="stack-card">
              <strong>客户进展变化提议</strong>
              <p>
                {thread
                  ? `建议维持为 ${progressLabels[thread.customerProgressStage]}，并把当前动作切到 ${executionLabels[thread.executionState]}。`
                  : "请先建立客户推进线程。"}
              </p>
            </div>
            <div className="stack-card">
              <strong>下一步动作提议</strong>
              <p>{deal?.nextStepSummary ?? thread?.currentFocus ?? "需先确认下一步动作。"}</p>
            </div>
          </div>
          <div className="stack-list">
            <div className="stack-card">
              <strong>是否形成正式商机</strong>
              <p>
                {deal
                  ? `当前已关联 Deal：${deal.name}`
                  : "当前还不建议直接形成 Deal，应先继续推进客户线程。"}
              </p>
            </div>
            <div className="button-row">
              <button className="ghost-button" type="button">修改提议</button>
              <button className="ghost-button" type="button">驳回提议</button>
              <button className="ghost-button" type="button">重新生成</button>
              <button className="primary-button" type="button">确认并应用</button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="影响范围" mobileCollapsible>
        <div className="grid-3">
          <div className="stack-card">
            <strong>影响客户线程</strong>
            <p>
              {thread
                ? `当前线程将更新为 ${progressLabels[thread.customerProgressStage]} / ${executionLabels[thread.executionState]}。`
                : "暂无客户线程可更新。"}
            </p>
            {thread ? (
              <Link className="ghost-button" href={`/customers/${thread.accountId}`}>
                查看客户线程
              </Link>
            ) : null}
          </div>
          <div className="stack-card">
            <strong>影响 Deal 投影</strong>
            <p>
              {deal
                ? `本次确认会继续影响 Deal：${deal.name}`
                : "当前尚未形成 Deal 或不建议直接更新 Deal。"}
            </p>
            {deal ? (
              <Link className="ghost-button" href={`/deals/${deal.id}`}>
                查看正式商机
              </Link>
            ) : null}
          </div>
          <div className="stack-card">
            <strong>CRM 同步仍需单独决定</strong>
            <p>即使内部状态已经应用，是否同步 CRM 仍应保持单独确认。</p>
          </div>
        </div>
      </SectionCard>
    </>
  );
}
