import Link from "next/link";

import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { getMockDataset } from "@/lib/mock-selectors";
import { formatRecapCategory } from "@/lib/presentation/labels";

export default function RecapsPage() {
  const { recapRecords } = getMockDataset();

  return (
    <>
      <PageHeader
        title="复盘与培训"
        description="面向主管和赋能团队的复盘内容库，沉淀案例、失误和可训练的关键时刻。"
      />

      <SectionCard title="复盘案例库">
        <div className="stack-list">
          {recapRecords.map((recap) => (
            <Link className="stack-card" href={`/recaps/${recap.id}`} key={recap.id}>
              <strong>{recap.title}</strong>
              <p>{recap.summary}</p>
              <div className="button-row">
                <Badge tone={recap.category === "best_practice" ? "success" : recap.category === "high_risk" ? "risk" : "warn"}>
                  {formatRecapCategory(recap.category)}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
