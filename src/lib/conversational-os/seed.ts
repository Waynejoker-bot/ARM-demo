import { realMeetings } from "@/lib/mocks/yang-wenxing-real";

import type { ConversationSeed } from "@/lib/conversational-os/types";

const zifeiMeeting = realMeetings.find((meeting) => meeting.id === "meeting-real-1");
const dakewanMeeting = realMeetings.find((meeting) => meeting.id === "meeting-real-2");

if (!zifeiMeeting || !dakewanMeeting) {
  throw new Error("Conversational Agent OS seed is missing required Yang Wenxing real meetings.");
}

export const defaultThreadId = "thread-rep-yang";

export const conversationSeed: ConversationSeed = {
  threads: [
    {
      id: "thread-rep-yang",
      title: "杨文星的工作台",
      description: "杨文星与一线销售 BPAgent 的协作空间。BPAgent 帮助理解素材、推进商机、闭环执行。",
      threadType: "rep_private",
      primaryRole: "rep",
      pinnedCardId: "card-flow-meeting-summary",
    },
    {
      id: "thread-manager-liu",
      title: "刘建明的工作台",
      description: "刘建明与主管 BPAgent 的协作空间。BPAgent 帮助看清全局、辅导团队、高效干预。",
      threadType: "manager_private",
      primaryRole: "manager",
      pinnedCardId: "card-mgr-team-status",
    },
  ],
  members: [
    {
      id: "member-rep-human-yang",
      threadId: "thread-rep-yang",
      actorId: "human-yang",
      actorName: "杨文星",
      memberType: "human_rep",
      role: "rep",
    },
    {
      id: "member-rep-agent-bp",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      memberType: "agent_rep_bp",
      role: "agent",
    },
    {
      id: "member-manager-human-liu",
      threadId: "thread-manager-liu",
      actorId: "human-liu",
      actorName: "刘建明",
      memberType: "human_manager",
      role: "manager",
    },
    {
      id: "member-manager-agent-bp",
      threadId: "thread-manager-liu",
      actorId: "agent-manager-bp",
      actorName: "主管 BPAgent",
      memberType: "agent_manager_bp",
      role: "agent",
    },
  ],
  messages: [
    // ═══════════════════════════════════════════════
    // 销售线程：会后流程（Post-Meeting Flow 步骤 1-12）
    // ═══════════════════════════════════════════════

    // 步骤 1: 销售发送会议链接
    {
      id: "msg-flow-01-source",
      threadId: "thread-rep-yang",
      actorId: "human-yang",
      actorName: "杨文星",
      kind: "source_input",
      body: "刚开完和紫菲科技的技术评估会，这是会议链接和现场录音，帮我整理一下。",
      occurredAt: "2026-03-15T16:30:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: null,
      sourceItems: [
        {
          kind: "meeting_summary",
          title: "紫菲科技技术评估会",
          detail: `${zifeiMeeting.title}，来自现场硬件转录与结构化总结。`,
        },
        {
          kind: "audio",
          title: "现场录音 45 分钟",
          detail: "包含对 VOD 聚合 API、云游戏试点和降本诉求的完整讨论。",
        },
        {
          kind: "link",
          title: "会议详情",
          detail: `/meetings/${zifeiMeeting.id}`,
        },
      ],
    },

    // 步骤 2-3: BPAgent 识别并理解
    {
      id: "msg-flow-02-processing",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "收到素材，正在理解会议内容。我会帮你提取关键信息，生成结构化摘要卡片。",
      occurredAt: "2026-03-15T16:31:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: null,
    },

    // 步骤 4: 生成会议摘要卡片
    {
      id: "msg-flow-03-summary-card",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "会议内容已整理完毕。核心发现：紫菲对 VOD 聚合 API 兴趣最高，但预算责任人（CTO 张总）本次未出席。建议优先锁定二访并确保 CTO 参加。",
      occurredAt: "2026-03-15T16:32:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-flow-meeting-summary",
    },

    // 步骤 5: 销售追问细节
    {
      id: "msg-flow-04-followup",
      threadId: "thread-rep-yang",
      actorId: "human-yang",
      actorName: "杨文星",
      kind: "human",
      body: "他们到底怎么说预算的？有没有提到具体数字或者时间线？",
      occurredAt: "2026-03-15T16:33:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: null,
    },

    // BPAgent 回答追问
    {
      id: "msg-flow-05-answer",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "会议中技术负责人提到\"Q2 有一笔专项预算用于视频基础设施升级\"，但没有给出具体金额。他还说\"最终要 CTO 张总拍板\"。建议二访时直接和 CTO 确认预算范围和决策时间线。",
      occurredAt: "2026-03-15T16:34:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: null,
    },

    // 步骤 6: 销售 confirm
    {
      id: "msg-flow-06-confirm",
      threadId: "thread-rep-yang",
      actorId: "human-yang",
      actorName: "杨文星",
      kind: "human",
      body: "摘要没问题，确认。帮我更新到客户档案里。",
      occurredAt: "2026-03-15T16:35:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: null,
    },

    // 步骤 7: BPAgent apply
    {
      id: "msg-flow-07-apply",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "已确认并更新：\n✓ 紫菲科技 Account Thread 已追加本次会议记录\n✓ 商机「紫菲 VOD 聚合平台」状态已同步\n\n客户 Agent 和商机 Agent 正在重新评估...",
      occurredAt: "2026-03-15T16:36:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: null,
    },

    // 步骤 8: 客户 Agent 响应（健康度变化）
    {
      id: "msg-flow-08-customer-agent",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "客户 Agent 更新完毕：紫菲科技关系健康度从 72 → 68（小幅下降），主要因为预算决策人 CTO 张总连续两次会议未出席。",
      occurredAt: "2026-03-15T16:37:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-flow-health-change",
    },

    // 步骤 9-10: 商机 Agent 响应（阶段推进 + 风险 + 下一步）
    {
      id: "msg-flow-09-deal-agent",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "商机 Agent 分析完毕，有 3 个关键建议：",
      occurredAt: "2026-03-15T16:38:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-flow-deal-stage",
    },

    {
      id: "msg-flow-10-risk",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "⚠️ 风险提醒：预算决策人缺席 + 竞品在同期接触客户。商机风险等级从「中」升至「中高」。已自动通知刘经理关注。",
      occurredAt: "2026-03-15T16:39:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-flow-risk-warning",
    },

    // 步骤 11: 销售 confirm 下一步
    {
      id: "msg-flow-11-confirm-next",
      threadId: "thread-rep-yang",
      actorId: "human-yang",
      actorName: "杨文星",
      kind: "human",
      body: "阶段推进先不动，风险我知道了。帮我先安排二访，重点拉上 CTO。",
      occurredAt: "2026-03-15T16:40:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: null,
    },

    // 步骤 12: apply 下一步
    {
      id: "msg-flow-12-apply-next",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "好的，已创建任务：\n✓「1 周内安排紫菲二访，确保 CTO 张总参加」\n✓ 暂不推进商机阶段，等二访确认后再评估\n✓ 风险已同步到刘经理的工作台",
      occurredAt: "2026-03-15T16:41:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: null,
    },

    // ═══════════════════════════════════════════════
    // 销售线程：日常任务推送（次日早上）
    // ═══════════════════════════════════════════════

    {
      id: "msg-daily-brief",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "早上好，今天你需要重点关注 3 件事：\n\n1️⃣ 【商机 Agent 提醒】紫菲二访阵容锁定——剩余窗口 5 天，CTO 张总必须出席\n2️⃣ 【客户 Agent 提醒】大可玩上次会议后 5 天未回复，关系有降温迹象\n3️⃣ 【会议准备】下午 2 点和大臣食品开会，上次遗留：试点方案细节和接入时间表",
      occurredAt: "2026-03-16T09:00:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: null,
    },

    // 会议前准备卡片
    {
      id: "msg-meeting-prep",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "大臣食品会议准备就绪，这是你需要的关键信息：",
      occurredAt: "2026-03-16T13:30:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-meeting-prep",
    },

    // ═══════════════════════════════════════════════
    // 销售线程：向上求助 / 上报流程
    // ═══════════════════════════════════════════════

    {
      id: "msg-escalate-request",
      threadId: "thread-rep-yang",
      actorId: "human-yang",
      actorName: "杨文星",
      kind: "human",
      body: "大可玩那边要求 15% 的折扣，超出我的权限了，需要刘经理审批。",
      occurredAt: "2026-03-16T15:00:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: null,
    },

    {
      id: "msg-escalate-ack",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "已生成审批请求并发送给刘经理。我打包了完整的商机上下文、客户历史和折扣理由，等待主管审批。",
      occurredAt: "2026-03-16T15:01:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-escalate-discount",
    },

    // 主管审批结果回传
    {
      id: "msg-escalate-result",
      threadId: "thread-rep-yang",
      actorId: "agent-rep-bp",
      actorName: "销售 BPAgent",
      kind: "agent_reply",
      body: "好消息！刘经理已批准折扣申请：\n✓ 大可玩折扣上限 15%，附条件：签约周期不超过 Q2\n✓ 建议你在下次沟通时直接推进合同条款",
      occurredAt: "2026-03-16T16:30:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-escalate-approved",
    },

    // ═══════════════════════════════════════════════
    // 主管线程：团队状态 + 风险升级 + 审批 + 辅导
    // ═══════════════════════════════════════════════

    {
      id: "msg-mgr-team-status",
      threadId: "thread-manager-liu",
      actorId: "agent-manager-bp",
      actorName: "主管 BPAgent",
      kind: "agent_reply",
      body: "早上好刘经理，以下是今日团队状态：\n\n📊 团队总览：3 个活跃销售，11 个在途商机\n⚠️ 需关注：杨文星的紫菲商机风险升高（预算决策人缺席）\n✅ 进展良好：王小明的瑞能科技已进入合同谈判\n📋 待你审批：杨文星申请大可玩 15% 折扣",
      occurredAt: "2026-03-16T09:00:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-mgr-team-status",
    },

    // 风险升级
    {
      id: "msg-mgr-risk-escalation",
      threadId: "thread-manager-liu",
      actorId: "agent-manager-bp",
      actorName: "主管 BPAgent",
      kind: "agent_reply",
      body: "商机 Agent 风险升级通知：杨文星负责的紫菲 VOD 聚合平台商机风险从「中」升至「中高」。\n\n主要原因：预算决策人 CTO 张总连续两次会议未出席 + 竞品在同期接触客户。\n\n建议：考虑是否需要你亲自出面协调二访阵容。",
      occurredAt: "2026-03-16T09:01:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-mgr-risk-zifei",
    },

    // 审批请求
    {
      id: "msg-mgr-approval-request",
      threadId: "thread-manager-liu",
      actorId: "agent-manager-bp",
      actorName: "主管 BPAgent",
      kind: "agent_reply",
      body: "杨文星提交了折扣审批：大可玩要求 15% 折扣。\n\n背景：大可玩创始人直接参与决策，对竞品痛点认知清晰，本轮谈判对价格敏感度高。商机金额 80 万，当前阶段「方案评估」。\n\n建议：可以批准，但附条件——签约周期不超过 Q2。",
      occurredAt: "2026-03-16T15:02:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-mgr-approve-discount",
    },

    // 辅导建议
    {
      id: "msg-mgr-coaching",
      threadId: "thread-manager-liu",
      actorId: "agent-manager-bp",
      actorName: "主管 BPAgent",
      kind: "agent_reply",
      body: "辅导建议：杨文星在紫菲会议中没有主动推进预算讨论，建议提醒他在下次二访中优先确认预算责任人和决策时间线。\n\n参考：同团队王小明在瑞能科技的类似场景中，第二次会议就直接锁定了预算范围。",
      occurredAt: "2026-03-16T09:05:00+08:00",
      visibility: "visible_to_thread",
      relatedCardId: "card-mgr-coaching-yang",
    },
  ],
  cards: [
    // ── 会后流程卡片 ──
    {
      id: "card-flow-meeting-summary",
      threadId: "thread-rep-yang",
      title: "紫菲科技技术评估会摘要",
      summary: "核心议题：VOD 聚合 API 对接方案。客户技术负责人表达强兴趣但 CTO 未出席。Q2 有专项预算但金额未确认。",
      detail: "关键议题：1) VOD 聚合 API 性能评估 2) 云游戏试点可行性 3) AI 视频处理需求\n参会人态度：技术负责人积极，但多次强调需 CTO 拍板\n关键信号：Q2 专项预算、竞品同期接触\n建议下一步：1 周内安排二访，确保 CTO 参加",
      trustNote: "基于会议录音转写和现场材料分析，置信度 85%",
      priorityRank: 100,
      primaryAction: "confirm",
      primaryActionLabel: "确认摘要",
      sourceMeetingId: "meeting-real-1",
      sourceDealId: "deal-real-1",
      createdAt: "2026-03-15T16:32:00+08:00",
      sourceAgent: "sales_bp",
    },
    {
      id: "card-flow-health-change",
      threadId: "thread-rep-yang",
      title: "紫菲科技关系健康度下降：72 → 68",
      summary: "预算决策人 CTO 张总连续两次会议未出席，客户关系有降温风险。",
      detail: "健康度变化因子：\n- CTO 缺席（-3 分）\n- 竞品同期接触信号（-1 分）\n- 技术层面沟通正常（无变化）\n数据覆盖率：65%（缺少 CTO 直接互动数据）",
      trustNote: "基于 Account Thread 历史互动分析，数据新鲜度 2 小时内",
      priorityRank: 88,
      primaryAction: "confirm",
      primaryActionLabel: "知悉",
      sourceMeetingId: "meeting-real-1",
      sourceDealId: "deal-real-1",
      createdAt: "2026-03-15T16:37:00+08:00",
      sourceAgent: "customer_agent",
    },
    {
      id: "card-flow-deal-stage",
      threadId: "thread-rep-yang",
      title: "商机阶段推进建议：暂不推进，等待二访确认",
      summary: "当前阶段「需求确认」，推进到「方案评估」还缺 2 个条件：预算确认和 CTO 认可。",
      detail: "已满足条件：✓ 技术可行性验证 ✓ 关键需求明确（VOD 聚合 API）\n缺失条件：✗ 预算责任人确认 ✗ CTO 参与决策\n建议：等二访后 CTO 确认再推进阶段",
      trustNote: "基于商机阶段定义和推进标准评估，置信度 78%",
      priorityRank: 92,
      primaryAction: "confirm",
      primaryActionLabel: "同意暂不推进",
      sourceMeetingId: "meeting-real-1",
      sourceDealId: "deal-real-1",
      createdAt: "2026-03-15T16:38:00+08:00",
      sourceAgent: "deal_agent",
    },
    {
      id: "card-flow-risk-warning",
      threadId: "thread-rep-yang",
      title: "⚠️ 紫菲商机风险升高：中 → 中高",
      summary: "预算决策人缺席 + 竞品同期接触，风险评分从 45 升至 62。",
      detail: "风险因子：\n- 决策人缺席（+10 分）\n- 竞品信号（+7 分）\n- 商机已进入第 3 周无实质推进（无变化）\n降风险建议：1 周内安排二访拉上 CTO，同时了解竞品方案细节",
      trustNote: "综合多因子风险评估，已自动通知主管 BPAgent",
      priorityRank: 95,
      primaryAction: "confirm",
      primaryActionLabel: "知悉风险",
      sourceMeetingId: "meeting-real-1",
      sourceDealId: "deal-real-1",
      createdAt: "2026-03-15T16:39:00+08:00",
      sourceAgent: "deal_agent",
    },

    // ── 会议准备卡片 ──
    {
      id: "card-meeting-prep",
      threadId: "thread-rep-yang",
      title: "会议准备：大臣食品 · 今天 14:00",
      summary: "上次遗留：试点方案细节和接入时间表。客户已确认小游戏线试点，本次重点确认技术方案和 3 月底启动时间。",
      detail: "客户最新动态：大臣食品已内部完成技术评审\n上次遗留问题：1) 接入方式（SDK vs API） 2) 数据验证标准 3) 成功指标定义\n建议讨论要点：直接推进合同条款，争取本周内签署试点协议",
      trustNote: "基于历史会议记录和客户 Agent 最新分析",
      priorityRank: 85,
      primaryAction: "confirm",
      primaryActionLabel: "已准备",
      sourceMeetingId: null,
      sourceDealId: "deal-real-5",
      createdAt: "2026-03-16T13:30:00+08:00",
      sourceAgent: "sales_bp",
    },

    // ── 向上求助卡片 ──
    {
      id: "card-escalate-discount",
      threadId: "thread-rep-yang",
      title: "审批请求已提交：大可玩 15% 折扣",
      summary: "已打包完整上下文发送给刘经理，等待审批。",
      detail: "商机：大可玩效果广告平台，金额 80 万\n请求：15% 折扣（超出一线销售 10% 权限）\n理由：竞品报价压力 + 创始人直接参与谈判\n状态：待主管审批",
      trustNote: "基于商机数据和客户历史自动打包",
      priorityRank: 82,
      primaryAction: "request_details",
      primaryActionLabel: "查看审批状态",
      sourceMeetingId: "meeting-real-2",
      sourceDealId: "deal-real-2",
      createdAt: "2026-03-16T15:01:00+08:00",
      sourceAgent: "sales_bp",
    },
    {
      id: "card-escalate-approved",
      threadId: "thread-rep-yang",
      title: "✅ 审批通过：大可玩折扣 15%",
      summary: "刘经理已批准，附条件：签约周期不超过 Q2。",
      detail: "审批结果：批准\n折扣上限：15%\n附加条件：签约必须在 Q2 内完成\n建议下一步：尽快安排合同条款沟通",
      trustNote: "来自主管 BPAgent 审批回传",
      priorityRank: 80,
      primaryAction: "confirm",
      primaryActionLabel: "确认并推进",
      sourceMeetingId: null,
      sourceDealId: "deal-real-2",
      createdAt: "2026-03-16T16:30:00+08:00",
      sourceAgent: "manager_bp",
    },

    // ── 主管线程卡片 ──
    {
      id: "card-mgr-team-status",
      threadId: "thread-manager-liu",
      title: "今日团队状态：3 活跃销售 · 11 在途商机",
      summary: "1 个高风险商机需关注（紫菲），1 个待审批请求（大可玩折扣），1 个进展良好（瑞能）。",
      detail: "杨文星：3 个商机，紫菲风险升高\n王小明：4 个商机，瑞能进入合同谈判\n李明月：4 个商机，进展正常\n\n团队 Pipeline 总额：580 万\n加权预测：320 万",
      trustNote: "基于各销售 BPAgent 汇总数据，数据新鲜度 1 小时内",
      priorityRank: 90,
      primaryAction: "request_details",
      primaryActionLabel: "查看详情",
      sourceMeetingId: null,
      sourceDealId: null,
      createdAt: "2026-03-16T09:00:00+08:00",
      sourceAgent: "manager_bp",
    },
    {
      id: "card-mgr-risk-zifei",
      threadId: "thread-manager-liu",
      title: "⚠️ 风险升级：紫菲 VOD 聚合平台",
      summary: "杨文星负责的紫菲商机风险从「中」升至「中高」，预算决策人连续缺席。",
      detail: "风险原因：CTO 张总连续两次未出席 + 竞品同期接触\n商机金额：120 万，阶段「需求确认」\n杨文星计划：1 周内安排二访拉上 CTO\n建议：考虑你是否需要亲自协调二访阵容",
      trustNote: "来自商机 Agent 风险评估自动升级",
      priorityRank: 96,
      primaryAction: "confirm",
      primaryActionLabel: "知悉并跟进",
      sourceMeetingId: "meeting-real-1",
      sourceDealId: "deal-real-1",
      createdAt: "2026-03-16T09:01:00+08:00",
      sourceAgent: "deal_agent",
    },
    {
      id: "card-mgr-approve-discount",
      threadId: "thread-manager-liu",
      title: "待审批：大可玩 15% 折扣申请",
      summary: "杨文星申请大可玩 15% 折扣，超出一线权限。商机 80 万，竞品价格压力。",
      detail: "申请人：杨文星\n商机：大可玩效果广告平台，80 万\n请求折扣：15%（一线权限 10%）\n理由：竞品报价压力 + 创始人直接谈判\n建议：可批准，附条件签约不超过 Q2",
      trustNote: "基于销售 BPAgent 打包的完整商机上下文",
      priorityRank: 94,
      primaryAction: "approve",
      primaryActionLabel: "批准折扣",
      sourceMeetingId: "meeting-real-2",
      sourceDealId: "deal-real-2",
      createdAt: "2026-03-16T15:02:00+08:00",
      sourceAgent: "sales_bp",
    },
    {
      id: "card-mgr-coaching-yang",
      threadId: "thread-manager-liu",
      title: "辅导建议：杨文星未主动推进预算讨论",
      summary: "在紫菲会议中杨文星没有主动问预算，建议提醒他在二访时优先确认。",
      detail: "观察：紫菲技术评估会 45 分钟，杨文星全程聚焦技术细节，未主动引导预算和决策流程讨论\n对比：王小明在瑞能科技第二次会议直接锁定了预算范围\n建议辅导要点：提醒杨文星在二访前准备预算确认话术",
      trustNote: "基于会议内容分析和团队对比",
      priorityRank: 75,
      primaryAction: "confirm",
      primaryActionLabel: "确认并发送辅导",
      sourceMeetingId: "meeting-real-1",
      sourceDealId: "deal-real-1",
      createdAt: "2026-03-16T09:05:00+08:00",
      sourceAgent: "manager_bp",
    },
  ],
  handoffs: [
    {
      id: "handoff-risk-to-manager",
      fromThreadId: "thread-rep-yang",
      toThreadId: "thread-manager-liu",
      summary: "紫菲商机风险升级，自动通知主管。",
      detailVisibleToDownstream: false,
      createdAt: "2026-03-15T16:39:00+08:00",
      relatedCardId: "card-flow-risk-warning",
    },
    {
      id: "handoff-discount-to-manager",
      fromThreadId: "thread-rep-yang",
      toThreadId: "thread-manager-liu",
      summary: "杨文星提交大可玩折扣审批请求。",
      detailVisibleToDownstream: false,
      createdAt: "2026-03-16T15:01:00+08:00",
      relatedCardId: "card-escalate-discount",
    },
  ],
  deliveries: [
    {
      id: "delivery-risk-to-manager",
      fromThreadId: "thread-rep-yang",
      toThreadId: "thread-manager-liu",
      deliveryType: "report_upstream",
      summary: "紫菲商机风险升级通知。",
      createdAt: "2026-03-15T16:39:00+08:00",
      relatedCardId: "card-flow-risk-warning",
    },
    {
      id: "delivery-discount-to-manager",
      fromThreadId: "thread-rep-yang",
      toThreadId: "thread-manager-liu",
      deliveryType: "report_upstream",
      summary: "大可玩折扣审批请求。",
      createdAt: "2026-03-16T15:01:00+08:00",
      relatedCardId: "card-escalate-discount",
    },
    {
      id: "delivery-approval-to-rep",
      fromThreadId: "thread-manager-liu",
      toThreadId: "thread-rep-yang",
      deliveryType: "decision_return",
      summary: "折扣审批已通过，附条件签约不超过 Q2。",
      createdAt: "2026-03-16T16:30:00+08:00",
      relatedCardId: "card-escalate-approved",
    },
  ],
  readStates: [
    {
      threadId: "thread-rep-yang",
      lastReadAt: "2026-03-15T16:35:00+08:00",
    },
    {
      threadId: "thread-manager-liu",
      lastReadAt: "2026-03-16T09:00:00+08:00",
    },
  ],
};
