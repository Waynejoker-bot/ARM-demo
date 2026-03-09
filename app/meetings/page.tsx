import Link from "next/link";

import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { getMockDataset } from "@/lib/mock-selectors";
import {
  formatFreshness,
  formatMeetingStatus,
  formatMeetingType,
  formatSummaryStatus,
} from "@/lib/presentation/labels";

export default function MeetingsPage() {
  const dataset = getMockDataset();
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

  return (
    <>
      <PageHeader
        title="会议"
        description="先处理待确认会议，再查看完整 Meeting Queue，确保每场会议都能推动线程和商机。"
      />

      <SectionCard title="待确认优先队列">
        <div className="stack-list">
          {pendingMeetings.map((meeting) => {
            const account = dataset.accounts.find((item) => item.id === meeting.accountId);
            const thread = dataset.accountThreads.find((item) => item.accountId === meeting.accountId);

            return (
              <div className="stack-card" key={`pending-${meeting.id}`}>
                <div className="button-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <Link href={`/meetings/${meeting.id}`}>
                      <strong>{meeting.title}</strong>
                    </Link>
                    {account ? (
                      <p>
                        <Link href={`/customers/${account.id}`}>{account.name}</Link>
                      </p>
                    ) : null}
                  </div>
                  <Badge tone={meeting.riskSignalPresent ? "risk" : "warn"}>
                    {thread?.executionState === "meeting_done_pending_review"
                      ? "会后待确认"
                      : "优先处理"}
                  </Badge>
                </div>
                <div className="button-row">
                  <Badge tone={meeting.transcriptStatus === "missing" ? "risk" : "info"}>
                    {meeting.transcriptStatus === "missing" ? "转录缺失" : "证据可用"}
                  </Badge>
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
                  <Badge tone={meeting.summaryStatus === "needs_review" ? "warn" : "success"}>
                    {formatSummaryStatus(meeting.summaryStatus)}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Meeting Queue">
        <div className="table-like">
          {queuedMeetings.map((meeting) => {
            const account = dataset.accounts.find((item) => item.id === meeting.accountId);

            return (
              <div className="table-row" key={meeting.id}>
                <div>
                  <Link href={`/meetings/${meeting.id}`}>
                    <strong>{meeting.title}</strong>
                  </Link>
                  {account ? (
                    <>
                      <span>{account.name}</span>
                      <Link href={`/customers/${account.id}`}>查看客户线程</Link>
                    </>
                  ) : null}
                </div>
                <span>{formatMeetingType(meeting.meetingType)}</span>
                <span>{formatMeetingStatus(meeting.status)}</span>
                <span>{formatSummaryStatus(meeting.summaryStatus)}</span>
                <div className="button-row">
                  <Badge tone={meeting.riskSignalPresent ? "risk" : "success"}>
                    {meeting.riskSignalPresent ? "有风险" : "稳定"}
                  </Badge>
                  <Badge tone={meeting.transcriptStatus === "missing" ? "risk" : "info"}>
                    {meeting.transcriptStatus === "missing" ? "缺少转录" : "转录可用"}
                  </Badge>
                  <Badge
                    tone={
                      meeting.dataFreshness === "fresh"
                        ? "success"
                        : meeting.dataFreshness === "stale"
                          ? "warn"
                          : "risk"
                    }
                  >
                    {meeting.dataFreshness === "missing"
                      ? "缺失数据"
                      : formatFreshness(meeting.dataFreshness)}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </>
  );
}
