import { PageHeader, SectionCard } from "@/components/shared/ui";
import { getMockDataset } from "@/lib/mock-selectors";

export default function IntakePage() {
  const { intakeItems, entityCandidates, ingestionProposals } = getMockDataset();
  const lowConfidenceItems = intakeItems.filter((item) => item.classificationConfidence < 0.7);
  const readyToApply = ingestionProposals.filter((proposal) => proposal.status === "suggestion");

  return (
    <>
      <PageHeader
        title="素材导入"
        description="给一线销售一个可直接导入客户原始素材、查看 AI 识别结果，并在写入前逐项确认的工作台。"
      />

      <SectionCard title="导入新素材">
        <div className="stack-list">
          <div className="stack-card">
            <strong>支持录音、文字、邮件、链接</strong>
            <p>导入后先做 AI 识别，再让销售确认归属和待写入建议。</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="待确认写入">
        <div className="stack-list">
          {readyToApply.map((proposal) => (
            <div className="stack-card" key={proposal.id}>
              <strong>{proposal.title}</strong>
              <p>{proposal.summary}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="最近处理队列">
        <div className="stack-list">
          {intakeItems.map((item) => (
            <div className="stack-card" key={item.id}>
              <strong>{item.title}</strong>
              <p>{item.rawTextPreview}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="低置信度提醒">
        <div className="stack-list">
          {lowConfidenceItems.map((item) => (
            <div className="stack-card" key={item.id}>
              <strong>{item.title}</strong>
              <p>需要补充信息：{item.missingFields.join("、")}</p>
              <p>
                候选归属：
                {entityCandidates
                  .filter((candidate) => candidate.intakeItemId === item.id)
                  .map((candidate) => candidate.label)
                  .join(" / ") || "暂无可用归属"}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
