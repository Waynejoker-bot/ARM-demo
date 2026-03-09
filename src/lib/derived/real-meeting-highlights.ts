import type { RealMeetingCase } from "@/lib/domain/types";
import { formatMeetingType } from "@/lib/presentation/labels";

export type RealMeetingHighlight = {
  id: string;
  sourceLabel: string;
  ownerLabel: string;
  accountName: string;
  accountProfile: string;
  title: string;
  priorityLabel: string;
  statusLabel: string;
  metaLine: string;
  insight: string;
  nextStep: string;
  publicContext: string | null;
  publicSourceLabel: string | null;
  publicSourceUrl: string | null;
};

function formatMeetingMoment(timestamp: string) {
  return new Date(timestamp).toLocaleString("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function deriveRealMeetingHighlights(
  realMeetingCases: RealMeetingCase[]
): RealMeetingHighlight[] {
  return realMeetingCases.map((realMeeting) => ({
    id: realMeeting.id,
    sourceLabel: realMeeting.sourceLabel,
    ownerLabel: realMeeting.ownerLabel,
    accountName: realMeeting.accountName,
    accountProfile: realMeeting.accountProfile,
    title: realMeeting.title,
    priorityLabel: realMeeting.priorityLabel,
    statusLabel: realMeeting.status === "completed" ? "已开完" : "待开",
    metaLine: `${formatMeetingType(realMeeting.meetingType)} · ${formatMeetingMoment(realMeeting.occurredAt)}`,
    insight: realMeeting.insight,
    nextStep: realMeeting.nextStep,
    publicContext: realMeeting.publicContext,
    publicSourceLabel: realMeeting.publicSourceLabel,
    publicSourceUrl: realMeeting.publicSourceUrl,
  }));
}
