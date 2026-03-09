import { getMockDataset } from "@/lib/mock-selectors";
import { buildIntakeClassificationMessages } from "@/lib/intake/prompts";

describe("intake prompts", () => {
  it("frames the classifier as a frontline-sales intake agent and requests JSON output only", () => {
    const messages = buildIntakeClassificationMessages({
      input: {
        sourceKind: "text",
        rawText:
          "云岚游戏会后补充：客户认可试点方向，但要求在下次会前补齐本地化落地说明。",
        repId: "rep-2",
      },
      dataset: getMockDataset(),
    });

    expect(messages[0]?.content).toContain("一线销售");
    expect(messages[0]?.content).toContain("JSON");
    expect(messages.at(-1)?.content).toContain("只输出 JSON");
  });

  it("includes account, deal, and meeting context so GLM can map raw material back to shared objects", () => {
    const messages = buildIntakeClassificationMessages({
      input: {
        sourceKind: "email",
        rawText: "请在周三前补充试点范围、预估回收指标和预计投入。",
        repId: "rep-2",
      },
      dataset: getMockDataset(),
    });

    const userMessage = messages.at(-1)?.content ?? "";

    expect(userMessage).toContain("星川互动");
    expect(userMessage).toContain("灵境娱乐商业化转型项目");
    expect(userMessage).toContain("沧澜网络试点方案沟通会");
  });
});
