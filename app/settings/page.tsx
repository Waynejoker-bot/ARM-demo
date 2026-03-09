import { PageHeader, SectionCard } from "@/components/shared/ui";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="设置"
        description="管理 Agent 行为、证据展示、角色权限和系统同步策略的完整配置页。"
      />

      <div className="grid-2">
        <SectionCard title="AI 偏好" mobilePriority="primary" mobileDensity="feed">
          <div className="stack-list">
            <div className="stack-card">
              <strong>Agent 语气风格</strong>
              <p>当前：专业、直接、带执行建议。</p>
            </div>
            <div className="stack-card">
              <strong>默认证据展示深度</strong>
              <p>当前：优先展示最关键证据，再允许下钻完整链路。</p>
            </div>
            <div className="stack-card">
              <strong>自动草稿生成策略</strong>
              <p>当前：会议结束后生成总结草稿，但必须人工确认后才能应用。</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="集成策略" mobilePriority="secondary" mobileDensity="feed">
          <div className="stack-list">
            <div className="stack-card">
              <strong>CRM 同步审批规则</strong>
              <p>当前：应用与同步严格分离，所有同步动作都需要单独触发。</p>
            </div>
            <div className="stack-card">
              <strong>会议转录保留策略</strong>
              <p>当前：缺失转录时直接降低总结置信度，并给出可见告警。</p>
            </div>
            <div className="stack-card">
              <strong>按角色控制可见范围</strong>
              <p>当前：CEO、销售主管、一线销售各自看到不同首页和优先级。</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
