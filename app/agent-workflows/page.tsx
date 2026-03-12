import { Badge, PageHeader, SectionCard } from "@/components/shared/ui";
import { getMockDataset } from "@/lib/mock-selectors";
import { formatAgentType, formatWorkflowStatus } from "@/lib/presentation/labels";

export default function AgentWorkflowPage() {
  const { workflowEvents } = getMockDataset();

  return (
    <>
      <PageHeader
        title="Agent 工作流"
        description="用时间线展示不同 Agent 做了什么、哪些在处理中、哪些已经失败。"
      />

      <SectionCard title="工作流事件流" mobilePriority="primary" mobileDensity="cards">
        <div className="timeline">
          {workflowEvents.map((event) => (
            <div className="timeline-item" key={event.id}>
              <strong>{event.eventLabel}</strong>
              <p className="muted">{formatAgentType(event.agentType)} · {new Date(event.timestamp).toLocaleString()}</p>
              <div className="button-row">
                <Badge tone={event.status === "failed" ? "risk" : event.status === "pending" ? "warn" : "success"}>
                  {formatWorkflowStatus(event.status)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
