import { notFound } from "next/navigation";

import { RepReportView } from "@/components/reports/report-cards";
import { getRepReportByRepId, getRepById } from "@/lib/mock-selectors";

export default async function SalesRepDetailPage({
  params,
}: {
  params: Promise<{ repId: string }>;
}) {
  const { repId } = await params;
  const rep = getRepById(repId);
  const report = getRepReportByRepId(repId);

  if (!rep || !report) {
    notFound();
  }

  return <RepReportView repId={rep.repId} />;
}
