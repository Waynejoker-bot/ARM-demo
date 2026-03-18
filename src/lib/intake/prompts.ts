import type { MockDataset } from "@/lib/domain/types";
import type { ModelMessage } from "@/lib/model/types";

import type { IntakeClassificationInput } from "@/lib/intake/types";

function buildDatasetContext(dataset: MockDataset) {
  const accountContext = dataset.accounts
    .map((account) => `- ${account.name}｜${account.description}`)
    .join("\n");
  const dealContext = dataset.deals
    .map((deal) => `- ${deal.name}｜阶段 ${deal.stage}｜下一步 ${deal.nextStepSummary}`)
    .join("\n");
  const meetingContext = dataset.meetings
    .map((meeting) => `- ${meeting.title}｜状态 ${meeting.status}｜时间 ${meeting.scheduledAt}`)
    .join("\n");

  return [
    "候选客户上下文：",
    accountContext,
    "",
    "候选商机上下文：",
    dealContext,
    "",
    "候选会议上下文：",
    meetingContext,
  ].join("\n");
}

export function buildIntakeClassificationMessages({
  input,
  dataset,
}: {
  input: IntakeClassificationInput;
  dataset: MockDataset;
}): ModelMessage[] {
  return [
    {
      role: "system",
      content: [
        "你是 AI Revenue Management OS 的素材导入 Agent。",
        "你当前在服务一线销售，需要先帮助他把原始素材映射回正确的客户上下文。",
        "你只能基于给定素材和候选对象作答。",
        "你必须只输出 JSON，不要输出 Markdown、解释、前后缀或代码块。",
        "JSON 必须包含 title、normalizedSourceKind、confidence、reasoning、needsManualInput、missingFields、candidates、questions、proposals。",
      ].join(" "),
    },
    {
      role: "user",
      content: [
        `素材类型：${input.sourceKind}`,
        `销售：${input.repId}`,
        input.fileName ? `文件名：${input.fileName}` : null,
        input.externalUrl ? `外部链接：${input.externalUrl}` : null,
        `原始素材内容：${input.rawText}`,
        buildDatasetContext(dataset),
        [
          "输出要求：",
          "1. 判断素材更接近哪个客户 / 商机 / 会议。",
          "2. 给出 0 到 1 的置信度。",
          "3. 如果证据不足，needsManualInput 必须为 true，并列出 missingFields。",
          "4. questions 提供 3 个供销售快速确认的选择题。",
          "5. proposals 只给建议，不得假设系统已经 apply。",
          "6. 只输出 JSON。",
        ].join("\n"),
        "只输出 JSON。",
      ]
        .filter(Boolean)
        .join("\n\n"),
    },
  ];
}
