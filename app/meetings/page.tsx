import Link from "next/link";

import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { getMockDataset } from "@/lib/mock-selectors";
import {
  formatFreshness,
  formatMeetingType,
  formatSummaryStatus,
} from "@/lib/presentation/labels";

type MeetingCardViewModel = {
  id: string;
  sourceLabel?: string | null;
  ownerLabel?: string | null;
  title: string;
  href?: string | null;
  accountName: string;
  accountHref?: string | null;
  accountProfile?: string | null;
  lifecycleLabel: string;
  priorityLabel: string;
  insightLabel: string;
  insight: string;
  nextStep: string;
  meetingTypeLabel: string;
  scheduledLabel: string;
  summaryStatusLabel: string;
  freshnessLabel: string;
  transcriptLabel: string;
  transcriptTone: "risk" | "info";
  freshnessTone: "success" | "warn" | "risk";
  summaryTone: "success" | "warn";
  priorityTone: "risk" | "warn" | "info";
  publicContext?: string | null;
  publicSourceLabel?: string | null;
  publicSourceUrl?: string | null;
};

function formatMeetingMoment(timestamp: string) {
  return new Date(timestamp).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildMeetingCardViewModel(
  meeting: ReturnType<typeof getMockDataset>["meetings"][number],
  dataset: ReturnType<typeof getMockDataset>
): MeetingCardViewModel {
  const account = dataset.accounts.find((item) => item.id === meeting.accountId);
  const thread = dataset.accountThreads.find((item) => item.accountId === meeting.accountId);
  const deal = dataset.deals.find((item) => item.id === meeting.dealId);
  const meetingOutput = dataset.agentOutputs.find(
    (output) => output.objectType === "meeting" && output.objectId === meeting.id
  );
  const dealOutput = meeting.dealId
    ? dataset.agentOutputs.find(
        (output) => output.objectType === "deal" && output.objectId === meeting.dealId
      )
    : null;

  const lifecycleLabel = meeting.status === "completed" ? "已开完" : "待开";
  const insightLabel = meeting.status === "completed" ? "核心结论" : "会议目标";
  const insight =
    meeting.status === "completed"
      ? meetingOutput?.summary ??
        dealOutput?.summary ??
        (meeting.transcriptStatus === "missing"
          ? "当前转录缺失，必须先通过人工确认补齐核心结论。"
          : meeting.riskSignalPresent
            ? "本次 Meeting 已暴露风险信号，建议先人工确认结论再推进。"
            : "当前 Meeting 已完成，等待系统补齐总结和下一步。")
      : deal?.nextStepSummary ??
        thread?.currentFocus ??
        "本次 Meeting 尚未开始，先明确参会角色、目标和关键问题。";
  const nextStep =
    deal?.nextStepSummary ??
    thread?.currentFocus ??
    (meeting.status === "completed"
      ? "先确认下一步动作，再决定是否同步 CRM。"
      : "补齐会前材料，并锁定本次 Meeting 的推进目标。");

  const priorityLabel =
    meeting.status === "upcoming"
      ? "待开准备"
      : thread?.executionState === "meeting_done_pending_review"
        ? "会后待确认"
        : meeting.riskSignalPresent || meeting.summaryStatus === "needs_review"
          ? "优先处理"
          : "节奏正常";

  return {
    id: meeting.id,
    title: meeting.title,
    href: `/meetings/${meeting.id}`,
    accountName: account?.name ?? "未知客户",
    accountHref: `/customers/${meeting.accountId}`,
    lifecycleLabel,
    priorityLabel,
    insightLabel,
    insight,
    nextStep,
    meetingTypeLabel: formatMeetingType(meeting.meetingType),
    scheduledLabel: formatMeetingMoment(meeting.scheduledAt),
    summaryStatusLabel: formatSummaryStatus(meeting.summaryStatus),
    freshnessLabel:
      meeting.dataFreshness === "missing"
        ? "数据缺失"
        : formatFreshness(meeting.dataFreshness),
    transcriptLabel: meeting.transcriptStatus === "missing" ? "转录缺失" : "证据可用",
    transcriptTone: meeting.transcriptStatus === "missing" ? "risk" : "info",
    freshnessTone:
      meeting.dataFreshness === "fresh"
        ? "success"
        : meeting.dataFreshness === "stale"
          ? "warn"
          : "risk",
    summaryTone: meeting.summaryStatus === "needs_review" ? "warn" : "success",
    priorityTone:
      priorityLabel === "会后待确认" || priorityLabel === "优先处理"
        ? "risk"
        : meeting.status === "upcoming"
          ? "info"
          : "warn",
  };
}

function buildRealMeetingCardViewModel(
  realMeeting: ReturnType<typeof getMockDataset>["realMeetingCases"][number]
): MeetingCardViewModel {
  return {
    id: realMeeting.id,
    sourceLabel: realMeeting.sourceLabel,
    ownerLabel: realMeeting.ownerLabel,
    title: realMeeting.title,
    href: null,
    accountName: realMeeting.accountName,
    accountHref: null,
    accountProfile: realMeeting.accountProfile,
    lifecycleLabel: realMeeting.status === "completed" ? "已开完" : "待开",
    priorityLabel: realMeeting.priorityLabel,
    insightLabel: realMeeting.insightLabel,
    insight: realMeeting.insight,
    nextStep: realMeeting.nextStep,
    meetingTypeLabel: formatMeetingType(realMeeting.meetingType),
    scheduledLabel: formatMeetingMoment(realMeeting.occurredAt),
    summaryStatusLabel: formatSummaryStatus(realMeeting.summaryStatus),
    freshnessLabel:
      realMeeting.dataFreshness === "missing"
        ? "数据缺失"
        : formatFreshness(realMeeting.dataFreshness),
    transcriptLabel: realMeeting.transcriptStatus === "missing" ? "转录缺失" : "证据可用",
    transcriptTone: realMeeting.transcriptStatus === "missing" ? "risk" : "info",
    freshnessTone:
      realMeeting.dataFreshness === "fresh"
        ? "success"
        : realMeeting.dataFreshness === "stale"
          ? "warn"
          : "risk",
    summaryTone: realMeeting.summaryStatus === "needs_review" ? "warn" : "success",
    priorityTone:
      realMeeting.priorityLabel === "需高层在场"
        ? "warn"
        : realMeeting.priorityLabel === "关系维护"
          ? "info"
          : "warn",
    publicContext: realMeeting.publicContext,
    publicSourceLabel: realMeeting.publicSourceLabel,
    publicSourceUrl: realMeeting.publicSourceUrl,
  };
}

function MeetingExecutionCard({ card }: { card: MeetingCardViewModel }) {
  return (
    <div className="meeting-queue-card">
      <div className="meeting-queue-card-header">
        <div className="meeting-queue-card-title-block">
          {card.sourceLabel ? (
            <div className="meeting-queue-source-row">
              <Badge tone="info">{card.sourceLabel}</Badge>
              {card.ownerLabel ? <Badge tone="warn">{card.ownerLabel}</Badge> : null}
            </div>
          ) : null}
          <span className="meeting-queue-kicker">当前状态：{card.lifecycleLabel}</span>
          {card.href ? (
            <Link href={card.href}>
              <strong>{card.title}</strong>
            </Link>
          ) : (
            <strong>{card.title}</strong>
          )}
          <p>
            {card.accountHref ? (
              <Link href={card.accountHref}>{card.accountName}</Link>
            ) : (
              <span>{card.accountName}</span>
            )}
          </p>
          {card.accountProfile ? (
            <p className="meeting-queue-account-profile">{card.accountProfile}</p>
          ) : null}
          <div className="meeting-queue-meta">
            <span>{card.meetingTypeLabel}</span>
            <span>{card.scheduledLabel}</span>
            <span>{card.summaryStatusLabel}</span>
          </div>
        </div>
        <Badge tone={card.priorityTone}>{card.priorityLabel}</Badge>
      </div>

      <div className="meeting-queue-insight-grid">
        <div className="meeting-queue-insight">
          <span className="meeting-queue-label">{card.insightLabel}</span>
          <p>{card.insight}</p>
        </div>
        <div className="meeting-queue-insight">
          <span className="meeting-queue-label">下一步动作</span>
          <p>{card.nextStep}</p>
        </div>
      </div>

      {card.publicContext ? (
        <div className="meeting-queue-context">
          <span className="meeting-queue-label">公开补充</span>
          <p>
            {card.publicContext}
            {card.publicSourceUrl && card.publicSourceLabel ? (
              <>
                {" "}
                <a href={card.publicSourceUrl} target="_blank" rel="noreferrer">
                  {card.publicSourceLabel}
                </a>
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      <div className="button-row">
        <Badge tone={card.transcriptTone}>{card.transcriptLabel}</Badge>
        <Badge tone={card.freshnessTone}>{card.freshnessLabel}</Badge>
        <Badge tone={card.summaryTone}>{card.summaryStatusLabel}</Badge>
      </div>
    </div>
  );
}

export default function MeetingsPage() {
  const dataset = getMockDataset();
  const realMeetingCards = dataset.realMeetingCases.map((realMeeting) =>
    buildRealMeetingCardViewModel(realMeeting)
  );
  const pendingMeetings = dataset.meetings
    .filter(
      (meeting) =>
        meeting.summaryStatus === "needs_review" ||
        meeting.transcriptStatus === "missing" ||
        meeting.riskSignalPresent
    )
    .sort((left, right) => {
      const leftPriority =
        Number(left.transcriptStatus === "missing") +
        Number(left.summaryStatus === "needs_review") +
        Number(left.riskSignalPresent);
      const rightPriority =
        Number(right.transcriptStatus === "missing") +
        Number(right.summaryStatus === "needs_review") +
        Number(right.riskSignalPresent);

      if (rightPriority !== leftPriority) {
        return rightPriority - leftPriority;
      }

      return right.scheduledAt.localeCompare(left.scheduledAt);
    });
  const queuedMeetings = dataset.meetings.filter(
    (meeting) => !pendingMeetings.some((item) => item.id === meeting.id)
  );
  const pendingCards = pendingMeetings.map((meeting) => buildMeetingCardViewModel(meeting, dataset));
  const queuedCards = queuedMeetings.map((meeting) => buildMeetingCardViewModel(meeting, dataset));

  return (
    <>
      <PageHeader
        title="会议"
        description="先处理待确认会议，再查看完整 Meeting Queue，确保每场会议都能推动线程和商机。"
      />

      <SectionCard title="杨文星真实会议样本" action={<Badge tone="info">团队级客户表达</Badge>}>
        <p className="muted meeting-real-samples-note">
          样本来自杨文星的线下实录。无法从会议文字唯一确认法务主体时，客户名按产品线或团队表达处理；公开补充只作为行业与技术背景，不强行写成客户硬事实。
        </p>
        <div className="stack-list">
          {realMeetingCards.map((card) => (
            <MeetingExecutionCard key={card.id} card={card} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="待确认优先队列" mobilePriority="primary" mobileDensity="feed">
        <div className="stack-list">
          {pendingCards.map((card) => (
            <MeetingExecutionCard key={`pending-${card.id}`} card={card} />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Meeting Queue" mobileDensity="cards">
        <div className="stack-list">
          {queuedCards.map((card) => (
            <MeetingExecutionCard key={card.id} card={card} />
          ))}
        </div>
      </SectionCard>
    </>
  );
}
