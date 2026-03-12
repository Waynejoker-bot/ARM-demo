import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { getMockDataset } from "@/lib/mock-selectors";
import { formatApplicationStatus } from "@/lib/presentation/labels";

export default function AgentWorkspacePage() {
  const { agentOutputs, deals } = getMockDataset();
  const objectTypeLabel: Record<string, string> = {
    deal: "商机",
    meeting: "会议",
    pipeline: "管道",
    revenue: "收入",
    rep: "销售",
  };

  return (
    <>
      <PageHeader
        title="Agent 工作台"
        description="以对话为先的工作模式，用来围绕商机、会议、管道和收入上下文持续追问。"
      />

      <div className="grid-2">
        <SectionCard title="推荐对话" mobilePriority="primary" mobileDensity="feed">
          <div className="stack-list">
            <div className="stack-card">
              <strong>销售主管应该优先介入哪个后期商机？</strong>
              <p>同时结合当前风险、数据新鲜度和证据缺失情况来判断。</p>
            </div>
            <div className="stack-card">
              <strong>我这周该怎么推动 Atlas 继续前进？</strong>
              <p>生成带证据支撑的下一步动作，而不是泛泛建议。</p>
            </div>
            <div className="stack-card">
              <strong>为什么预测置信度下降了？</strong>
              <p>先用角色感知的话术回答，再让用户继续下钻到具体商机。</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="最近 Agent 输出" mobileDensity="feed">
          <div className="stack-list">
            {agentOutputs.slice(0, 5).map((output) => {
              const deal = deals.find((item) => item.id === output.objectId);

              return (
                <div className="stack-card" key={output.id}>
                  <strong>{output.summary}</strong>
                  <p>{deal?.name ?? objectTypeLabel[output.objectType] ?? output.objectType}</p>
                  <div className="button-row">
                    <Badge tone="info">{Math.round(output.confidence * 100)}% 置信度</Badge>
                    <Badge tone="warn">{formatApplicationStatus(output.applicationStatus)}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </>
  );
}
