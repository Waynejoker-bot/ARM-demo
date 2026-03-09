import { notFound } from "next/navigation";

import { MeetingWorkbenchView } from "@/components/meeting/workbench";
import { getMeetingById } from "@/lib/mock-selectors";

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;
  const meeting = getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return <MeetingWorkbenchView meetingId={meeting.id} />;
}
