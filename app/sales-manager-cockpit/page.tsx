import { notFound } from "next/navigation";

import { SalesManagerCockpitView } from "@/components/reports/report-cards";
import { getMockDataset } from "@/lib/mock-selectors";

export default function SalesManagerCockpitPage() {
  const dataset = getMockDataset();

  if (!dataset.repReportSnapshots.length) {
    notFound();
  }

  return <SalesManagerCockpitView />;
}
