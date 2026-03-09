import { notFound } from "next/navigation";

import { PageHeader, SectionCard } from "@/components/shared/ui";
import { getMeetingById, getMockDataset } from "@/lib/mock-selectors";
import { formatRecapCategory } from "@/lib/presentation/labels";

export default async function RecapDetailPage({
  params,
}: {
  params: Promise<{ recapId: string }>;
}) {
  const { recapId } = await params;
  const recap = getMockDataset().recapRecords.find((item) => item.id === recapId);

  if (!recap) {
    notFound();
  }

  const meeting = getMeetingById(recap.relatedMeetingId);

  return (
    <>
      <PageHeader
        title={recap.title}
        description={`分类：${formatRecapCategory(recap.category)} · 来源于 ${meeting?.title ?? "会议复盘"}`}
      />

      <div className="grid-2">
        <SectionCard title="发生了什么">
          <div className="stack-card">
            <strong>{recap.summary}</strong>
            <p>
              这个模块刻意被设计成可复用的辅导素材，而不只是一个静态审计日志。
            </p>
          </div>
        </SectionCard>

        <SectionCard title="本来可以怎么处理">
          <ul className="list-plain">
            <li>在会议结束前先确认责任归属。</li>
            <li>把模糊担忧转换成具名的后续动作。</li>
            <li>用 Agent 提供的证据链支撑辅导结论。</li>
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
