import type { AgentChatRequest, ModelMessage } from "@/lib/model/types";

function getRolePrefix(roleHint?: AgentChatRequest["roleHint"]) {
  if (roleHint === "ceo") return "你当前在服务 CEO，需要先给经营层判断。";
  if (roleHint === "manager") return "你当前在服务销售主管，需要先给团队风险和介入建议。";
  if (roleHint === "rep") return "你当前在服务一线销售，需要先给当下最该执行的动作。";
  return "你当前在服务销售团队，需要先给最直接的下一步建议。";
}

export function buildAgentMessages(input: AgentChatRequest): ModelMessage[] {
  const systemPrompt = [
    "你是 AI Revenue Management OS 内部的销售 Agent。",
    "请使用简洁、专业、偏销售运营同事的语气回答。",
    "只基于给定上下文作答。",
    "优先给出直接、可执行、角色感知的建议。",
    "默认使用中文回答。",
    getRolePrefix(input.roleHint),
  ].join(" ");

  const historyMessages: ModelMessage[] = (input.history ?? []).map((item) => ({
    role: item.role,
    content: item.content,
  }));

  const attachmentBlock = input.attachments?.length
    ? input.attachments
        .map((attachment, index) =>
          [
            `附件 ${index + 1}：${attachment.title}`,
            `摘要：${attachment.summary}`,
            attachment.recommendation ? `建议动作：${attachment.recommendation}` : null,
            attachment.signals?.length
              ? `关键信号：${attachment.signals.join("；")}`
              : null,
            attachment.sourceLabel ? `来源：${attachment.sourceLabel}` : null,
          ]
            .filter(Boolean)
            .join("\n")
        )
        .join("\n\n")
    : null;

  return [
    { role: "system", content: systemPrompt },
    ...historyMessages,
    {
      role: "user",
      content: [
        `上下文标题：${input.contextTitle}`,
        `上下文说明：${input.contextDescription ?? "无"}`,
        attachmentBlock ? `已附加上下文卡片：\n${attachmentBlock}` : null,
        "请结合当前页面上下文、已附加卡片和已有对话继续回答。",
        `问题：${input.prompt}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    },
  ];
}
