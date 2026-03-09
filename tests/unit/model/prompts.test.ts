import { buildAgentMessages } from "@/lib/model/prompts";

describe("agent prompt builder", () => {
  it("includes page context, dragged attachments, and conversation history", () => {
    const messages = buildAgentMessages({
      prompt: "这张决策卡还缺什么信息？",
      contextTitle: "CEO 主控室",
      contextDescription: "当前页面聚焦收入偏差与战略商机判断。",
      roleHint: "ceo",
      attachments: [
        {
          type: "decision-card",
          title: "玄河网络需要 CEO 级经营关注",
          summary: "这条高价值商机已经开始影响本季度达标路径。",
          recommendation: "要求主管重建高层赞助人与采购的推进共识。",
          signals: ["后期 deal 没有明确日期化下一步。"],
        },
      ],
      history: [
        { role: "user", content: "它为什么重要？" },
        { role: "assistant", content: "因为它影响本季度收入解释路径。" },
      ],
    } as any);

    expect(messages.some((message) => message.role === "assistant")).toBe(true);
    expect(messages.at(-1)?.content).toContain("CEO 主控室");
    expect(messages.at(-1)?.content).toContain("玄河网络需要 CEO 级经营关注");
    expect(messages.at(-1)?.content).toContain("这张决策卡还缺什么信息？");
  });
});
