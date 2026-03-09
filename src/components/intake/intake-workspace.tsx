import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { classifyIntakeWithMock } from "@/lib/intake/mock-classification";
import type { MockDataset } from "@/lib/domain/types";

function formatIntakeStatus(status: MockDataset["intakeItems"][number]["status"]) {
  switch (status) {
    case "parsing":
      return "识别中";
    case "needs_confirmation":
      return "待确认";
    case "ready_to_apply":
      return "待写入";
    case "applied":
      return "已应用";
    case "failed":
      return "处理失败";
    default:
      return "已接收";
  }
}

function getStatusTone(status: MockDataset["intakeItems"][number]["status"]) {
  if (status === "failed") return "risk" as const;
  if (status === "needs_confirmation" || status === "parsing") return "warn" as const;
  if (status === "ready_to_apply" || status === "applied") return "success" as const;
  return "info" as const;
}

export function IntakeWorkspace({ dataset }: { dataset: MockDataset }) {
  const focusItem =
    dataset.intakeItems.find((item) => item.status === "ready_to_apply") ?? dataset.intakeItems[0];
  const recognition = classifyIntakeWithMock(
    {
      sourceKind: focusItem.sourceKind,
      rawText: focusItem.rawTextPreview,
      repId: focusItem.submittedByRepId,
      fileName: focusItem.fileName ?? undefined,
      externalUrl: focusItem.externalUrl ?? undefined,
    },
    dataset
  );
  const focusProposals = dataset.ingestionProposals.filter((proposal) =>
    focusItem.proposalIds.includes(proposal.id)
  );
  const lowConfidenceItems = dataset.intakeItems.filter(
    (item) => item.classificationConfidence < 0.7
  );
  const sourceButtons = [
    { label: "录音", value: "recording" },
    { label: "文字", value: "text" },
    { label: "邮件", value: "email" },
    { label: "链接", value: "link" },
  ] as const;

  return (
    <>
      <PageHeader
        title="素材导入"
        description="给一线销售一个可直接导入客户原始素材、查看 AI 识别结果，并在写入前逐项确认的工作台。"
        supportingCopy="导入只是开始。系统会先识别归属、提出确认题，再把待写入建议交给你确认。"
      />

      <SectionCard title="导入新素材">
        <div className="intake-hero-grid">
          <div className="stack-card intake-focus-card">
            <strong>把客户原始素材先扔进来</strong>
            <p>支持录音、文字、邮件、链接。系统会先识别归属，再生成待确认写入建议。</p>
            <div className="intake-source-row">
              {sourceButtons.map((button) => (
                <button
                  key={button.value}
                  type="button"
                  className="ghost-button intake-source-button"
                  aria-pressed={focusItem.sourceKind === button.value}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>

          <div className="stack-card intake-focus-card">
            <strong>{focusItem.title}</strong>
            <p>{focusItem.rawTextPreview}</p>
            <div className="button-row">
              <Badge tone={getStatusTone(focusItem.status)}>
                {formatIntakeStatus(focusItem.status)}
              </Badge>
              <Badge tone={focusItem.classificationConfidence < 0.75 ? "warn" : "success"}>
                置信度 {Math.round(focusItem.classificationConfidence * 100)}%
              </Badge>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="AI 识别与确认">
        <div className="intake-recognition-grid">
          <div className="stack-list">
            {recognition.candidates.map((candidate) => (
              <div className="stack-card" key={`${candidate.entityType}-${candidate.entityId}`}>
                <strong>{candidate.label}</strong>
                <p>{candidate.reason}</p>
                <div className="button-row">
                  <Badge tone={candidate.confidence < 0.75 ? "warn" : "info"}>
                    {candidate.entityType}
                  </Badge>
                  <Badge tone={candidate.confidence < 0.75 ? "warn" : "success"}>
                    匹配度 {Math.round(candidate.confidence * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="intake-question-list">
            {recognition.questions.map((question) => (
              <div className="stack-card intake-question-card" key={question.id}>
                <strong>{question.prompt}</strong>
                <p>{question.reason}</p>
                <div className="button-row">
                  {question.options.map((option) => (
                    <button key={option} type="button" className="ghost-button">
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="待确认写入">
        <div className="stack-list">
          {focusProposals.map((proposal) => (
            <div className="stack-card" key={proposal.id}>
              <strong>{proposal.title}</strong>
              <p>{proposal.summary}</p>
              <div className="button-row">
                <Badge tone={proposal.requiresManualReview ? "warn" : "success"}>
                  {proposal.requiresManualReview ? "需人工复核" : "可直接确认"}
                </Badge>
                <Badge tone={proposal.confidence < 0.75 ? "warn" : "info"}>
                  置信度 {Math.round(proposal.confidence * 100)}%
                </Badge>
              </div>
              <div className="button-row">
                <button type="button" className="primary-button">
                  确认写入
                </button>
                <button type="button" className="ghost-button">
                  暂不采用
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="最近处理队列">
        <div className="stack-list">
          {dataset.intakeItems.map((item) => (
            <div className="stack-card" key={item.id}>
              <strong>{item.title}</strong>
              <p>{item.rawTextPreview}</p>
              <div className="button-row">
                <Badge tone={getStatusTone(item.status)}>{formatIntakeStatus(item.status)}</Badge>
                <Badge tone={item.classificationConfidence < 0.75 ? "warn" : "success"}>
                  置信度 {Math.round(item.classificationConfidence * 100)}%
                </Badge>
              </div>
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
                {dataset.entityCandidates
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
