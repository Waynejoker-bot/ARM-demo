import type {
  Account,
  AccountThread,
  AgentOutput,
  AlertRecord,
  Contact,
  Conversation,
  DataSourceRecord,
  Deal,
  EntityCandidate,
  EvidenceRef,
  ForecastSnapshot,
  IngestionProposal,
  IntakeItem,
  Meeting,
  MockDataset,
  RealMeetingCase,
  RepReportSnapshot,
  RecapRecord,
  RepScorecard,
  SyncRecord,
  WorkflowEvent,
} from "@/lib/domain/types";
import { deriveAccountThreads } from "@/lib/derived/account-threads";
import { deriveRepReportSnapshots } from "@/lib/derived/report-snapshots";

const accounts: Account[] = [
  { id: "acc-1", name: "星川互动", description: "总部位于上海的中型游戏公司，主营二次元动作手游与海外发行协同业务。", industry: "游戏", size: "mid_market", region: "中国华东", ownerRepId: "rep-1" },
  { id: "acc-2", name: "云岚游戏", description: "位于深圳的中型游戏公司，擅长休闲竞技手游和商业化精细运营。", industry: "游戏", size: "mid_market", region: "中国华南", ownerRepId: "rep-2" },
  { id: "acc-3", name: "玄河网络", description: "位于北京的中型游戏公司，核心业务是发行中台建设和多产品线数据整合。", industry: "游戏", size: "mid_market", region: "中国华北", ownerRepId: "rep-3" },
  { id: "acc-4", name: "赤霄互娱", description: "总部在成都的中型游戏公司，正在推进东南亚市场发行和买量效率升级。", industry: "游戏", size: "mid_market", region: "中国西南", ownerRepId: "rep-2" },
  { id: "acc-5", name: "曜石游戏", description: "位于武汉的中型游戏公司，新作上线期对买量投放和增长分析需求强烈。", industry: "游戏", size: "mid_market", region: "中国华中", ownerRepId: "rep-4" },
  { id: "acc-6", name: "灵境娱乐", description: "位于杭州的中型游戏公司，处于商业化转型阶段，重视合规和精细化运营。", industry: "游戏", size: "mid_market", region: "中国华东", ownerRepId: "rep-1" },
  { id: "acc-7", name: "苍穹互动", description: "位于西安的中型游戏公司，正处于新产品立项阶段，尚未形成稳定采购意向。", industry: "游戏", size: "mid_market", region: "中国西北", ownerRepId: "rep-4" },
  { id: "acc-8", name: "沧澜网络", description: "位于苏州的中型游戏公司，正在评估海外买量试点方案，对效果验证兴趣明确。", industry: "游戏", size: "mid_market", region: "中国华东", ownerRepId: "rep-2" },
];

const contacts: Contact[] = [
  { id: "contact-1", accountId: "acc-1", name: "陈一鸣", title: "运营副总裁", description: "负责海外发行协同和跨团队推进，是当前项目的最终拍板人。", roleType: "decision_maker", influenceLevel: 5, lastInteractionAt: "2026-03-05T09:00:00Z" },
  { id: "contact-2", accountId: "acc-2", name: "林可欣", title: "商业化负责人", description: "推动试点项目落地的内部支持者，关注回本效率和投放数据联动。", roleType: "champion", influenceLevel: 4, lastInteractionAt: "2026-03-04T11:00:00Z" },
  { id: "contact-3", accountId: "acc-3", name: "赵景川", title: "营收负责人", description: "负责年度营收目标和采购节奏，对预算审批影响力很强。", roleType: "buyer", influenceLevel: 5, lastInteractionAt: "2026-03-03T08:30:00Z" },
  { id: "contact-4", accountId: "acc-4", name: "许知夏", title: "发行总监", description: "重点关注东南亚发行效率和素材迭代速度，是关键影响者。", roleType: "influencer", influenceLevel: 3, lastInteractionAt: "2026-03-02T06:15:00Z" },
  { id: "contact-5", accountId: "acc-5", name: "顾言舟", title: "创始人", description: "直接参与新作增长决策，关注实施投入是否会拖慢上线节奏。", roleType: "decision_maker", influenceLevel: 5, lastInteractionAt: "2026-03-01T10:15:00Z" },
  { id: "contact-6", accountId: "acc-6", name: "沈听澜", title: "首席运营官", description: "主导商业化转型项目，对法务合规和内部资源分配非常敏感。", roleType: "buyer", influenceLevel: 4, lastInteractionAt: "2026-03-06T14:10:00Z" },
  { id: "contact-7", accountId: "acc-7", name: "韩知礼", title: "战略负责人", description: "正在收集增长供应商信息，尚未正式进入方案评估。", roleType: "influencer", influenceLevel: 3, lastInteractionAt: "2026-03-07T09:00:00Z" },
  { id: "contact-8", accountId: "acc-8", name: "宋砚清", title: "增长负责人", description: "对试点效果非常敏感，希望先验证买量回收表现。", roleType: "champion", influenceLevel: 4, lastInteractionAt: "2026-03-07T15:00:00Z" },
];

const deals: Deal[] = [
  { id: "deal-1", accountId: "acc-1", name: "星川互动海外发行协同项目", ownerRepId: "rep-1", stage: "negotiation", amount: 3050000, currency: "CNY", healthScore: 88, healthLabel: "健康", winProbability: 0.82, riskLevel: "low", nextStepSummary: "最终确认安全审查并推动采购流程。", nextMeetingAt: "2026-03-11T16:00:00Z", updatedAt: "2026-03-07T12:00:00Z", dataFreshness: "fresh", dataCoverage: 0.94 },
  { id: "deal-2", accountId: "acc-3", name: "玄河网络发行中台升级项目", ownerRepId: "rep-3", stage: "proposal", amount: 4080000, currency: "CNY", healthScore: 43, healthLabel: "高风险", winProbability: 0.39, riskLevel: "high", nextStepSummary: "尽快重新建立高层赞助人与采购方的一致意见。", nextMeetingAt: "2026-03-12T14:30:00Z", updatedAt: "2026-03-07T09:20:00Z", dataFreshness: "stale", dataCoverage: 0.58 },
  { id: "deal-3", accountId: "acc-2", name: "云岚游戏区域试点项目", ownerRepId: "rep-2", stage: "demo", amount: 1320000, currency: "CNY", healthScore: 71, healthLabel: "需关注", winProbability: 0.61, riskLevel: "medium", nextStepSummary: "发送本地化落地方案并确认推进节奏。", nextMeetingAt: "2026-03-10T09:00:00Z", updatedAt: "2026-03-06T17:10:00Z", dataFreshness: "fresh", dataCoverage: 0.86 },
  { id: "deal-4", accountId: "acc-4", name: "赤霄互娱东南亚增长项目", ownerRepId: "rep-2", stage: "qualification", amount: 760000, currency: "CNY", healthScore: 68, healthLabel: "需关注", winProbability: 0.53, riskLevel: "medium", nextStepSummary: "确认区域预算负责人和审批链路。", nextMeetingAt: "2026-03-13T04:00:00Z", updatedAt: "2026-03-05T15:40:00Z", dataFreshness: "fresh", dataCoverage: 0.8 },
  { id: "deal-5", accountId: "acc-5", name: "曜石游戏新作买量试用项目", ownerRepId: "rep-4", stage: "discovery", amount: 220000, currency: "CNY", healthScore: 64, healthLabel: "需关注", winProbability: 0.48, riskLevel: "medium", nextStepSummary: "在正式报价前先澄清实施范围和客户投入。", nextMeetingAt: null, updatedAt: "2026-03-07T07:30:00Z", dataFreshness: "missing", dataCoverage: 0.37 },
  { id: "deal-6", accountId: "acc-6", name: "灵境娱乐商业化转型项目", ownerRepId: "rep-1", stage: "negotiation", amount: 5320000, currency: "CNY", healthScore: 51, healthLabel: "高风险", winProbability: 0.44, riskLevel: "high", nextStepSummary: "尽快恢复法务评审并推动价格审批。", nextMeetingAt: "2026-03-14T13:00:00Z", updatedAt: "2026-03-01T13:20:00Z", dataFreshness: "stale", dataCoverage: 0.63 },
  { id: "deal-7", accountId: "acc-2", name: "云岚游戏数据分析增购项目", ownerRepId: "rep-2", stage: "proposal", amount: 860000, currency: "CNY", healthScore: 79, healthLabel: "健康", winProbability: 0.74, riskLevel: "low", nextStepSummary: "整理价格选项，供财务团队评审。", nextMeetingAt: "2026-03-15T10:00:00Z", updatedAt: "2026-03-06T12:00:00Z", dataFreshness: "fresh", dataCoverage: 0.91 },
  { id: "deal-8", accountId: "acc-3", name: "玄河网络安全合规模块增购", ownerRepId: "rep-3", stage: "demo", amount: 1750000, currency: "CNY", healthScore: 57, healthLabel: "高风险", winProbability: 0.46, riskLevel: "high", nextStepSummary: "联动产品团队正面回应安全异议。", nextMeetingAt: "2026-03-09T18:00:00Z", updatedAt: "2026-03-04T10:00:00Z", dataFreshness: "fresh", dataCoverage: 0.77 },
  { id: "deal-9", accountId: "acc-4", name: "赤霄互娱培训服务包项目", ownerRepId: "rep-2", stage: "proposal", amount: 460000, currency: "CNY", healthScore: 83, healthLabel: "健康", winProbability: 0.76, riskLevel: "low", nextStepSummary: "确认最终参会决策人与利益相关方名单。", nextMeetingAt: "2026-03-11T06:30:00Z", updatedAt: "2026-03-07T08:50:00Z", dataFreshness: "fresh", dataCoverage: 0.89 },
  { id: "deal-10", accountId: "acc-1", name: "星川互动年度续约项目", ownerRepId: "rep-1", stage: "review", amount: 1080000, currency: "CNY", healthScore: 92, healthLabel: "健康", winProbability: 0.9, riskLevel: "low", nextStepSummary: "准备续约摘要，提交财务负责人最终签批。", nextMeetingAt: "2026-03-08T19:00:00Z", updatedAt: "2026-03-07T16:00:00Z", dataFreshness: "fresh", dataCoverage: 0.97 },
  { id: "deal-11", accountId: "acc-8", name: "沧澜网络海外试点项目", ownerRepId: "rep-2", stage: "demo", amount: 560000, currency: "CNY", healthScore: 66, healthLabel: "需关注", winProbability: 0.55, riskLevel: "medium", nextStepSummary: "确认试点范围和下一次验证会议的日期。", nextMeetingAt: null, updatedAt: "2026-03-08T11:20:00Z", dataFreshness: "fresh", dataCoverage: 0.71 },
];

const meetings: Meeting[] = [
  { id: "meeting-1", accountId: "acc-1", dealId: "deal-1", title: "星川互动安全审查会", meetingType: "proposal", scheduledAt: "2026-03-05T16:00:00Z", status: "completed", summaryStatus: "ready", riskSignalPresent: false, transcriptStatus: "ready", dataFreshness: "fresh" },
  { id: "meeting-2", accountId: "acc-3", dealId: "deal-2", title: "玄河网络高层对齐会", meetingType: "review", scheduledAt: "2026-03-04T18:30:00Z", status: "completed", summaryStatus: "needs_review", riskSignalPresent: true, transcriptStatus: "ready", dataFreshness: "stale" },
  { id: "meeting-3", accountId: "acc-2", dealId: "deal-3", title: "云岚游戏试点演示会", meetingType: "demo", scheduledAt: "2026-03-04T09:00:00Z", status: "completed", summaryStatus: "ready", riskSignalPresent: false, transcriptStatus: "ready", dataFreshness: "fresh" },
  { id: "meeting-4", accountId: "acc-4", dealId: "deal-4", title: "赤霄互娱需求发现同步会", meetingType: "discovery", scheduledAt: "2026-03-02T04:00:00Z", status: "completed", summaryStatus: "ready", riskSignalPresent: false, transcriptStatus: "ready", dataFreshness: "fresh" },
  { id: "meeting-5", accountId: "acc-5", dealId: "deal-5", title: "曜石游戏初次沟通会", meetingType: "intro", scheduledAt: "2026-03-01T17:00:00Z", status: "completed", summaryStatus: "needs_review", riskSignalPresent: true, transcriptStatus: "missing", dataFreshness: "missing" },
  { id: "meeting-6", accountId: "acc-6", dealId: "deal-6", title: "灵境娱乐法务升级沟通会", meetingType: "review", scheduledAt: "2026-02-28T13:00:00Z", status: "completed", summaryStatus: "needs_review", riskSignalPresent: true, transcriptStatus: "ready", dataFreshness: "stale" },
  { id: "meeting-7", accountId: "acc-2", dealId: "deal-7", title: "云岚游戏定价研讨会", meetingType: "proposal", scheduledAt: "2026-03-06T10:00:00Z", status: "completed", summaryStatus: "ready", riskSignalPresent: false, transcriptStatus: "ready", dataFreshness: "fresh" },
  { id: "meeting-8", accountId: "acc-3", dealId: "deal-8", title: "玄河网络安全异议回应会", meetingType: "demo", scheduledAt: "2026-03-03T18:00:00Z", status: "completed", summaryStatus: "needs_review", riskSignalPresent: true, transcriptStatus: "ready", dataFreshness: "fresh" },
  { id: "meeting-9", accountId: "acc-4", dealId: "deal-9", title: "赤霄互娱干系人规划会", meetingType: "proposal", scheduledAt: "2026-03-06T06:30:00Z", status: "completed", summaryStatus: "ready", riskSignalPresent: false, transcriptStatus: "ready", dataFreshness: "fresh" },
  { id: "meeting-10", accountId: "acc-1", dealId: "deal-10", title: "星川互动续约收口会", meetingType: "review", scheduledAt: "2026-03-07T19:00:00Z", status: "upcoming", summaryStatus: "ready", riskSignalPresent: false, transcriptStatus: "ready", dataFreshness: "fresh" },
  { id: "meeting-11", accountId: "acc-8", dealId: "deal-11", title: "沧澜网络试点方案沟通会", meetingType: "demo", scheduledAt: "2026-03-08T09:30:00Z", status: "completed", summaryStatus: "ready", riskSignalPresent: false, transcriptStatus: "ready", dataFreshness: "fresh" },
];

const conversations: Conversation[] = [
  { id: "conv-1", relatedType: "deal", relatedId: "deal-2", sourceType: "email", timestamp: "2026-03-04T19:00:00Z", summary: "客户因法务顾虑推迟了价格评审。", rawAvailable: true },
  { id: "conv-2", relatedType: "meeting", relatedId: "meeting-3", sourceType: "chat", timestamp: "2026-03-04T12:00:00Z", summary: "内部支持者要求补充本地化落地说明。", rawAvailable: true },
  { id: "conv-3", relatedType: "deal", relatedId: "deal-5", sourceType: "call", timestamp: "2026-03-01T17:45:00Z", summary: "创始人有兴趣，但对实施工作量仍不清楚。", rawAvailable: false },
  { id: "conv-4", relatedType: "meeting", relatedId: "meeting-11", sourceType: "email", timestamp: "2026-03-08T11:35:00Z", summary: "客户希望在下一次会议前先看试点范围和预估回收指标。", rawAvailable: true },
];

const evidenceRefs: EvidenceRef[] = [
  { id: "evidence-1", sourceType: "meeting", sourceId: "meeting-2", quote: "在继续推进之前，我们还需要 CRO 和采购团队真正对齐。", timestamp: "2026-03-04T18:41:00Z", relevanceReason: "说明后期商机仍存在关键决策对齐风险。" },
  { id: "evidence-2", sourceType: "email", sourceId: "conv-1", quote: "法务团队对区域数据存储问题仍有未解决疑问。", timestamp: "2026-03-04T19:00:00Z", relevanceReason: "解释了法务评审为什么持续停滞。" },
  { id: "evidence-3", sourceType: "meeting", sourceId: "meeting-5", quote: "我需要知道这会给运营团队增加多少实施工作量。", timestamp: "2026-03-01T17:18:00Z", relevanceReason: "暴露出实施阻力和需求界定不足的问题。" },
  { id: "evidence-4", sourceType: "crm", sourceId: "deal-6", quote: "过去 14 天没有任何阶段更新，也没有同步纪要。", timestamp: "2026-03-01T13:20:00Z", relevanceReason: "说明后期商机的运营数据已经明显过期。" },
  { id: "evidence-5", sourceType: "meeting", sourceId: "meeting-1", quote: "安全团队确认剩余事项都属于流程性问题，不构成真正阻塞。", timestamp: "2026-03-05T16:44:00Z", relevanceReason: "支撑该商机处于高置信度的健康推进状态。" },
  { id: "evidence-6", sourceType: "meeting", sourceId: "meeting-11", quote: "如果试点范围控制在两个地区，我们愿意在下次会里确认验证指标。", timestamp: "2026-03-08T09:52:00Z", relevanceReason: "说明客户已从一般兴趣进入可验证的正式试点讨论。" },
  { id: "evidence-7", sourceType: "email", sourceId: "conv-4", quote: "请在下次会议前补充试点范围、回收目标和预计投入。", timestamp: "2026-03-08T11:35:00Z", relevanceReason: "说明下一步动作已具备日期化和内容化条件。" },
];

const agentOutputs: AgentOutput[] = [
  { id: "agent-1", objectType: "deal", objectId: "deal-1", agentType: "deal_agent", outputType: "risk", status: "ready", confidence: 0.91, summary: "当前商机整体健康，采购流程是唯一剩余阻点。", rationaleItems: ["最近一次会议已经消除了技术异议。", "内部支持者和采购方仍然保持活跃。", "下一步动作具体且已经排期。"], evidenceRefs: ["evidence-5"], createdAt: "2026-03-05T17:00:00Z", updatedAt: "2026-03-07T12:00:00Z", userFeedbackStatus: "accepted", applicationStatus: "confirmed", syncStatus: "synced" },
  { id: "agent-2", objectType: "deal", objectId: "deal-2", agentType: "next_step_agent", outputType: "next_step", status: "ready", confidence: 0.62, summary: "在价格继续推进之前，必须先恢复高层赞助人与采购方的对齐。", rationaleItems: ["采购团队尚未重新进入推进节奏。", "CRO 的赞助态度仍然不明确。", "最近一次会议结束时没有形成日期明确的下一步。"], evidenceRefs: ["evidence-1", "evidence-2"], createdAt: "2026-03-04T19:10:00Z", updatedAt: "2026-03-07T09:20:00Z", userFeedbackStatus: "none", applicationStatus: "suggestion", syncStatus: "not_synced" },
  { id: "agent-3", objectType: "meeting", objectId: "meeting-5", agentType: "meeting_agent", outputType: "summary", status: "ready", confidence: 0.54, summary: "客户确实有兴趣，但对实施负担仍然缺乏清晰认知。", rationaleItems: ["当前没有完整转录。", "通话纪要只保留了片段。", "创始人连续追问了实施工作量。"], evidenceRefs: ["evidence-3"], createdAt: "2026-03-01T18:00:00Z", updatedAt: "2026-03-01T18:00:00Z", userFeedbackStatus: "none", applicationStatus: "suggestion", syncStatus: "not_synced" },
  { id: "agent-4", objectType: "deal", objectId: "deal-6", agentType: "crm_sync_agent", outputType: "risk", status: "ready", confidence: 0.58, summary: "该商机风险较高，因为系统内部状态与 CRM 历史已经出现明显偏差。", rationaleItems: ["CRM 已经 14 天没有更新。", "法务评审仍未收敛。", "目前没有高层跟进安排。"], evidenceRefs: ["evidence-4"], createdAt: "2026-03-01T13:30:00Z", updatedAt: "2026-03-07T09:00:00Z", userFeedbackStatus: "edited", applicationStatus: "confirmed", syncStatus: "failed" },
  { id: "agent-5", objectType: "deal", objectId: "deal-3", agentType: "deal_agent", outputType: "summary", status: "ready", confidence: 0.84, summary: "试点商机整体在推进，但落地细节仍带来中等风险。", rationaleItems: ["内部支持者保持活跃。", "范围问题尚未完全解决，但预算仍在。", "下一次跟进已安排。"], evidenceRefs: ["evidence-1"], createdAt: "2026-03-04T12:10:00Z", updatedAt: "2026-03-06T17:10:00Z", userFeedbackStatus: "accepted", applicationStatus: "confirmed", syncStatus: "synced" },
  { id: "agent-6", objectType: "meeting", objectId: "meeting-2", agentType: "coaching_agent", outputType: "coaching", status: "ready", confidence: 0.72, summary: "这位销售在会议收尾时需要更坚决地锁定带日期的下一步。", rationaleItems: ["会议结束时责任归属仍然模糊。", "经济购买者没有被直接拉入。", "风险问题暴露得太晚。"], evidenceRefs: ["evidence-1"], createdAt: "2026-03-04T19:05:00Z", updatedAt: "2026-03-04T19:05:00Z", userFeedbackStatus: "none", applicationStatus: "suggestion", syncStatus: "not_synced" },
  { id: "agent-7", objectType: "pipeline", objectId: "global-pipeline", agentType: "deal_agent", outputType: "risk", status: "ready", confidence: 0.79, summary: "本周有 3 个后期商机的信任信号明显下降。", rationaleItems: ["两个高价值商机的数据已经过期。", "一个后期商机失去了清晰的高层赞助。", "CRM 同步质量不稳定。"], evidenceRefs: ["evidence-1", "evidence-4"], createdAt: "2026-03-07T08:00:00Z", updatedAt: "2026-03-07T08:00:00Z", userFeedbackStatus: "accepted", applicationStatus: "confirmed", syncStatus: "not_synced" },
  { id: "agent-8", objectType: "revenue", objectId: "forecast-q1", agentType: "deal_agent", outputType: "forecast", status: "ready", confidence: 0.69, summary: "预测置信度正在走弱，因为两个大型谈判都出现了过期信号。", rationaleItems: ["灵境娱乐的推进已经停滞。", "玄河网络仍缺少明确的高层赞助。", "星川互动仍然强势，部分对冲了风险。"], evidenceRefs: ["evidence-4", "evidence-5"], createdAt: "2026-03-07T08:10:00Z", updatedAt: "2026-03-07T08:10:00Z", userFeedbackStatus: "none", applicationStatus: "suggestion", syncStatus: "not_synced" },
  { id: "agent-9", objectType: "rep", objectId: "rep-2", agentType: "coaching_agent", outputType: "coaching", status: "ready", confidence: 0.81, summary: "这位销售在推进节奏上表现不错，但预算资格判断还需要更锋利。", rationaleItems: ["多个活跃商机推进速度很快。", "早期商机中的预算负责人仍然偏模糊。", "整体跟进质量保持稳定。"], evidenceRefs: ["evidence-3"], createdAt: "2026-03-07T07:40:00Z", updatedAt: "2026-03-07T07:40:00Z", userFeedbackStatus: "accepted", applicationStatus: "confirmed", syncStatus: "not_synced" },
  { id: "agent-10", objectType: "meeting", objectId: "meeting-8", agentType: "next_step_agent", outputType: "next_step", status: "ready", confidence: 0.67, summary: "下一次会议应带上产品安全负责人，正面处理数据驻留顾虑。", rationaleItems: ["同一异议已经连续重复两次。", "安全顾虑正在阻塞商机推进。", "内部支持者要求有书面跟进。"], evidenceRefs: ["evidence-2"], createdAt: "2026-03-03T19:00:00Z", updatedAt: "2026-03-03T19:00:00Z", userFeedbackStatus: "none", applicationStatus: "suggestion", syncStatus: "not_synced" },
  { id: "agent-11", objectType: "meeting", objectId: "meeting-11", agentType: "meeting_agent", outputType: "summary", status: "ready", confidence: 0.78, summary: "客户已经接受试点方向，当前最重要的是在下一次会议前锁定试点范围和验证指标。", rationaleItems: ["客户首次接受按区域试点推进。", "下一次会议前需要先给出量化验证框架。", "客户没有否定预算，只是要求更明确的试点边界。"], evidenceRefs: ["evidence-6", "evidence-7"], createdAt: "2026-03-08T11:40:00Z", updatedAt: "2026-03-08T11:40:00Z", userFeedbackStatus: "none", applicationStatus: "suggestion", syncStatus: "not_synced" },
];

const forecastSnapshots: ForecastSnapshot[] = [
  { id: "forecast-q1", periodLabel: "2026 年第一季度", total: 17360000, commit: 11980000, bestCase: 14950000, upside: 4720000, confidence: 0.69, riskExposure: 6580000 },
  { id: "forecast-q2", periodLabel: "2026 年第二季度", total: 19840000, commit: 12850000, bestCase: 16260000, upside: 5890000, confidence: 0.73, riskExposure: 6010000 },
];

const repScorecards: RepScorecard[] = [
  { repId: "rep-1", repName: "周承安", teamName: "华东大客户组", closeRate: 0.34, averageHealthScore: 77, capabilityScore: 84, coachingFocus: "在后期商机里进一步强化双向行动计划。 " },
  { repId: "rep-2", repName: "林书瑶", teamName: "华南增长组", closeRate: 0.29, averageHealthScore: 74, capabilityScore: 79, coachingFocus: "更早确认预算负责人。 " },
  { repId: "rep-3", repName: "顾景行", teamName: "战略客户组", closeRate: 0.26, averageHealthScore: 58, capabilityScore: 71, coachingFocus: "在复杂商机中重新建立高层赞助。 " },
  { repId: "rep-4", repName: "许明澈", teamName: "新锐客户组", closeRate: 0.22, averageHealthScore: 62, capabilityScore: 68, coachingFocus: "提升需求发现深度与实施方案表达。 " },
];

const recapRecords: RecapRecord[] = [
  { id: "recap-1", title: "玄河网络高层对齐失误", category: "missed_opportunity", relatedMeetingId: "meeting-2", summary: "销售在后期评审里没有解决高层赞助不明确的问题。" },
  { id: "recap-2", title: "星川互动采购推进示范", category: "best_practice", relatedMeetingId: "meeting-1", summary: "销售有效收敛阻点，并锁定了流程性下一步。" },
  { id: "recap-3", title: "曜石游戏实施顾虑暴露", category: "high_risk", relatedMeetingId: "meeting-5", summary: "在价值框架尚未完整前，客户先暴露了实施负担担忧。" },
];

const workflowEvents: WorkflowEvent[] = [
  { id: "workflow-1", dealId: "deal-1", agentType: "meeting_agent", eventLabel: "会议总结已生成", status: "completed", timestamp: "2026-03-05T17:00:00Z" },
  { id: "workflow-2", dealId: "deal-1", agentType: "deal_agent", eventLabel: "商机健康度已刷新", status: "completed", timestamp: "2026-03-05T17:05:00Z" },
  { id: "workflow-3", dealId: "deal-2", agentType: "next_step_agent", eventLabel: "下一步动作已起草", status: "completed", timestamp: "2026-03-04T19:10:00Z" },
  { id: "workflow-4", dealId: "deal-2", agentType: "crm_sync_agent", eventLabel: "CRM 同步待审核", status: "pending", timestamp: "2026-03-04T19:30:00Z" },
  { id: "workflow-5", dealId: "deal-6", agentType: "crm_sync_agent", eventLabel: "CRM 同步失败", status: "failed", timestamp: "2026-03-07T09:00:00Z" },
  { id: "workflow-6", dealId: "deal-8", agentType: "meeting_agent", eventLabel: "已捕捉安全异议", status: "completed", timestamp: "2026-03-03T19:00:00Z" },
  { id: "workflow-7", dealId: "deal-3", agentType: "coaching_agent", eventLabel: "辅导建议已生成", status: "completed", timestamp: "2026-03-06T18:00:00Z" },
  { id: "workflow-8", dealId: "deal-5", agentType: "meeting_agent", eventLabel: "缺少转录告警", status: "failed", timestamp: "2026-03-01T18:01:00Z" },
];

const dataSources: DataSourceRecord[] = [
  { id: "source-1", sourceName: "客户关系系统", sourceType: "crm", status: "warning", coverage: 0.72, lastSyncedAt: "2026-03-06T23:00:00Z", warning: "两个大型商机存在过期同步记录。" },
  { id: "source-2", sourceName: "企业邮箱", sourceType: "email", status: "connected", coverage: 0.88, lastSyncedAt: "2026-03-07T15:45:00Z", warning: null },
  { id: "source-3", sourceName: "团队日历", sourceType: "calendar", status: "connected", coverage: 0.93, lastSyncedAt: "2026-03-07T15:50:00Z", warning: null },
  { id: "source-4", sourceName: "协同聊天", sourceType: "chat", status: "warning", coverage: 0.61, lastSyncedAt: "2026-03-06T12:00:00Z", warning: "有多个客户沟通频道尚未关联。" },
  { id: "source-5", sourceName: "会议录音服务", sourceType: "recording", status: "disconnected", coverage: 0.44, lastSyncedAt: null, warning: "有一场需求发现会议缺少转录。" },
  { id: "source-6", sourceName: "外勤移动端", sourceType: "mobile", status: "connected", coverage: 0.79, lastSyncedAt: "2026-03-07T14:15:00Z", warning: null },
];

const intakeItems: IntakeItem[] = [
  {
    id: "intake-1",
    sourceKind: "email",
    submittedByRepId: "rep-2",
    submittedAt: "2026-03-09T08:40:00Z",
    status: "ready_to_apply",
    title: "沧澜网络试点会后邮件",
    rawTextPreview: "请在周三前补充试点范围、预估回收指标和预计投入，我们下次会里确认。",
    fileName: null,
    externalUrl: null,
    classificationConfidence: 0.92,
    needsManualInput: false,
    missingFields: [],
    selectedAccountId: "acc-8",
    selectedDealId: "deal-11",
    selectedMeetingId: "meeting-11",
    candidateIds: ["candidate-1", "candidate-2"],
    proposalIds: ["proposal-1", "proposal-2"],
  },
  {
    id: "intake-2",
    sourceKind: "recording",
    submittedByRepId: "rep-1",
    submittedAt: "2026-03-08T13:30:00Z",
    status: "needs_confirmation",
    title: "灵境娱乐法务电话录音",
    rawTextPreview: "客户提到法务和采购都要重新加入评审，但还没听清是哪场会的上下文。",
    fileName: "灵境娱乐-法务跟进.m4a",
    externalUrl: null,
    classificationConfidence: 0.64,
    needsManualInput: true,
    missingFields: ["会议归属", "素材类型"],
    selectedAccountId: "acc-6",
    selectedDealId: "deal-6",
    selectedMeetingId: null,
    candidateIds: ["candidate-3", "candidate-4"],
    proposalIds: ["proposal-3"],
  },
  {
    id: "intake-3",
    sourceKind: "link",
    submittedByRepId: "rep-2",
    submittedAt: "2026-03-09T10:05:00Z",
    status: "parsing",
    title: "云岚游戏外部案例链接",
    rawTextPreview: "用户刚贴进来一个行业案例链接，系统正在判断它更像会前材料还是外部佐证。",
    fileName: null,
    externalUrl: "https://example.com/case-study",
    classificationConfidence: 0.48,
    needsManualInput: true,
    missingFields: ["关联客户", "是否需要写入"],
    selectedAccountId: null,
    selectedDealId: null,
    selectedMeetingId: null,
    candidateIds: [],
    proposalIds: [],
  },
  {
    id: "intake-4",
    sourceKind: "text",
    submittedByRepId: "rep-2",
    submittedAt: "2026-03-08T09:55:00Z",
    status: "ready_to_apply",
    title: "云岚游戏会后速记",
    rawTextPreview: "客户认可试点方向，但要求我们在下次会前补齐本地化落地说明和资源投入边界。",
    fileName: null,
    externalUrl: null,
    classificationConfidence: 0.87,
    needsManualInput: false,
    missingFields: [],
    selectedAccountId: "acc-2",
    selectedDealId: "deal-3",
    selectedMeetingId: "meeting-3",
    candidateIds: ["candidate-5", "candidate-6"],
    proposalIds: ["proposal-4", "proposal-5"],
  },
  {
    id: "intake-5",
    sourceKind: "recording",
    submittedByRepId: "rep-4",
    submittedAt: "2026-03-07T17:20:00Z",
    status: "failed",
    title: "曜石游戏现场录音",
    rawTextPreview: "录音已上传，但缺少可用转写文本，系统暂时不能给出可靠归属。",
    fileName: "曜石游戏-现场交流.wav",
    externalUrl: null,
    classificationConfidence: 0.18,
    needsManualInput: true,
    missingFields: ["转写文本"],
    selectedAccountId: "acc-5",
    selectedDealId: "deal-5",
    selectedMeetingId: null,
    candidateIds: [],
    proposalIds: [],
  },
];

const entityCandidates: EntityCandidate[] = [
  {
    id: "candidate-1",
    intakeItemId: "intake-1",
    entityType: "account",
    entityId: "acc-8",
    label: "沧澜网络",
    confidence: 0.93,
    reason: "邮件里明确提到试点范围、回收指标和下次验证会议，与沧澜网络当前推进一致。",
    isPrimary: true,
  },
  {
    id: "candidate-2",
    intakeItemId: "intake-1",
    entityType: "meeting",
    entityId: "meeting-11",
    label: "沧澜网络试点方案沟通会",
    confidence: 0.91,
    reason: "邮件语义明显承接会后动作，且与最近一次试点方案沟通会时间相邻。",
    isPrimary: true,
  },
  {
    id: "candidate-3",
    intakeItemId: "intake-2",
    entityType: "deal",
    entityId: "deal-6",
    label: "灵境娱乐商业化转型项目",
    confidence: 0.69,
    reason: "录音片段集中在法务、采购和价格评审，最贴近灵境娱乐当前阻塞点。",
    isPrimary: true,
  },
  {
    id: "candidate-4",
    intakeItemId: "intake-2",
    entityType: "meeting",
    entityId: "meeting-6",
    label: "灵境娱乐法务升级沟通会",
    confidence: 0.57,
    reason: "提到了法务评审，但录音里没有明确会议日期，需要人工确认。",
    isPrimary: false,
  },
  {
    id: "candidate-5",
    intakeItemId: "intake-4",
    entityType: "deal",
    entityId: "deal-3",
    label: "云岚游戏区域试点项目",
    confidence: 0.88,
    reason: "速记文本中出现试点、本地化和推进节奏，和云岚当前 demo 阶段完全吻合。",
    isPrimary: true,
  },
  {
    id: "candidate-6",
    intakeItemId: "intake-4",
    entityType: "meeting",
    entityId: "meeting-3",
    label: "云岚游戏试点演示会",
    confidence: 0.83,
    reason: "内容像一条会后补录纪要，且和最近一次试点演示会的上下文一致。",
    isPrimary: true,
  },
];

const ingestionProposals: IngestionProposal[] = [
  {
    id: "proposal-1",
    intakeItemId: "intake-1",
    targetType: "next_step",
    targetObjectId: "deal-11",
    title: "补齐试点范围与验证指标",
    summary: "建议把下一步动作更新为：在下次会议前提供试点范围、回收指标和预计投入。",
    confidence: 0.91,
    status: "suggestion",
    evidenceRefIds: ["evidence-6", "evidence-7"],
    requiresManualReview: false,
  },
  {
    id: "proposal-2",
    intakeItemId: "intake-1",
    targetType: "conversation",
    targetObjectId: "deal-11",
    title: "新增一条会后邮件摘要",
    summary: "将这封邮件整理成会后跟进摘要，挂到当前商机时间线里。",
    confidence: 0.88,
    status: "suggestion",
    evidenceRefIds: ["evidence-7"],
    requiresManualReview: false,
  },
  {
    id: "proposal-3",
    intakeItemId: "intake-2",
    targetType: "deal_note",
    targetObjectId: "deal-6",
    title: "补记法务与采购重新介入",
    summary: "录音显示客户要求法务和采购重新加入评审，但仍需销售确认具体是哪次沟通。",
    confidence: 0.66,
    status: "suggestion",
    evidenceRefIds: ["evidence-4"],
    requiresManualReview: true,
  },
  {
    id: "proposal-4",
    intakeItemId: "intake-4",
    targetType: "meeting_summary",
    targetObjectId: "meeting-3",
    title: "更新会后总结",
    summary: "在会议总结里加入客户认可试点方向，但要求补齐本地化落地说明和资源投入边界。",
    confidence: 0.89,
    status: "suggestion",
    evidenceRefIds: [],
    requiresManualReview: false,
  },
  {
    id: "proposal-5",
    intakeItemId: "intake-4",
    targetType: "evidence_ref",
    targetObjectId: "meeting-3",
    title: "新增一条推进证据",
    summary: "客户已经给出明确的会前准备要求，可作为 next step 建议的直接依据。",
    confidence: 0.84,
    status: "confirmed",
    evidenceRefIds: [],
    requiresManualReview: false,
  },
];

const syncRecords: SyncRecord[] = [
  { id: "sync-1", objectType: "deal", objectId: "deal-1", status: "synced", destination: "crm", updatedAt: "2026-03-06T23:30:00Z" },
  { id: "sync-2", objectType: "deal", objectId: "deal-2", status: "pending", destination: "crm", updatedAt: "2026-03-07T09:30:00Z" },
  { id: "sync-3", objectType: "deal", objectId: "deal-6", status: "failed", destination: "crm", updatedAt: "2026-03-07T09:00:00Z" },
  { id: "sync-4", objectType: "meeting", objectId: "meeting-3", status: "synced", destination: "crm", updatedAt: "2026-03-04T12:10:00Z" },
];

const alerts: AlertRecord[] = [
  { id: "alert-1", level: "high", title: "玄河网络发行中台升级项目的后期风险明显上升", relatedDealId: "deal-2" },
  { id: "alert-2", level: "medium", title: "曜石游戏新作买量试用项目的数据覆盖率下降", relatedDealId: "deal-5" },
  { id: "alert-3", level: "high", title: "灵境娱乐商业化转型项目的客户关系系统同步失败", relatedDealId: "deal-6" },
];

const realMeetingCases: RealMeetingCase[] = [
  {
    id: "real-meeting-1",
    ownerLabel: "外勤销售：杨文星",
    sourceLabel: "杨文星实录 · 3月3日短剧与游戏业务讨论",
    title: "短剧与游戏业务发展讨论",
    accountName: "葫芦娃产品线团队",
    accountProfile:
      "国内卡牌产品线与短剧团队并行，短剧团队约 30 多人，当前在评估云游转小游戏和音视频能力。",
    meetingType: "discovery",
    occurredAt: "2026-03-03T14:17:00+08:00",
    status: "completed",
    summaryStatus: "ready",
    transcriptStatus: "ready",
    dataFreshness: "fresh",
    priorityLabel: "有明确切口",
    insightLabel: "核心结论",
    insight:
      "短期更适合切入 VOD 聚合 API，而不是直接推动整体云迁移；客户现有游戏服务器迁移意愿很低。",
    nextStep:
      "先拉技术负责人一起看当前云与音视频账单，再判断是否能以 VOD 聚合 API 或云成本报价切入。",
    publicContext:
      "公开资料显示，Unity 已支持微信小游戏导出，抖音小游戏生态也在持续完善，客户提到的云游转小游戏路线具备外部技术参照。",
    publicSourceLabel: "Unity 小游戏官方文档",
    publicSourceUrl:
      "https://docs.unity.cn/6000.0/Documentation/Manual/webgl-distributions-wechat.html",
  },
  {
    id: "real-meeting-2",
    ownerLabel: "外勤销售：杨文星",
    sourceLabel: "杨文星实录 · 3月4日产品合作与功能优势讨论",
    title: "产品合作及功能优势讨论",
    accountName: "广州研发转发行团队",
    accountProfile:
      "团队已有自研归因与后台，技术负责人兼具产品背景并与老板深度绑定，替换现有后台的组织阻力较大。",
    meetingType: "demo",
    occurredAt: "2026-03-04T11:20:00+08:00",
    status: "completed",
    summaryStatus: "ready",
    transcriptStatus: "ready",
    dataFreshness: "fresh",
    priorityLabel: "需高层在场",
    insightLabel: "核心结论",
    insight:
      "客户并不否认产品能力，但主要阻力不是功能缺失，而是技术团队担心被替代；整体 APP 后台替换难度高。",
    nextStep:
      "等月底技术负责人和老板都在广州时，组织一场技术对齐会，优先从小游戏线试点切入。",
    publicContext: null,
    publicSourceLabel: null,
    publicSourceUrl: null,
  },
  {
    id: "real-meeting-3",
    ownerLabel: "外勤销售：杨文星",
    sourceLabel: "杨文星实录 · 3月4日游戏买量中台讨论",
    title: "游戏买量中台功能及合作讨论",
    accountName: "广州买量运营团队",
    accountProfile:
      "运营主要依赖巨量后台和 Excel 汇总，研发已买埋点分析工具并负责接入，但业务侧看数仍然碎片化。",
    meetingType: "demo",
    occurredAt: "2026-03-04T14:11:00+08:00",
    status: "completed",
    summaryStatus: "ready",
    transcriptStatus: "ready",
    dataFreshness: "fresh",
    priorityLabel: "可继续扩线",
    insightLabel: "核心结论",
    insight:
      "客户明确承认巨量后台复杂、业务侧很少直接看明细；真正的痛点是发行、研发、运营三方数据没有统一工作面。",
    nextStep:
      "借客户引荐约上硬核发行联系人和研发接口人，验证一站式归因分析中台是否能替代当前手工汇总链路。",
    publicContext:
      "公开行业报告显示，小游戏市场仍在增长，投放团队对素材 ROI 与跨渠道归因的精细化要求会继续抬高。",
    publicSourceLabel: "QuestMobile 小游戏观察",
    publicSourceUrl: "https://www.questmobile.com.cn/research/report-new/197",
  },
  {
    id: "real-meeting-4",
    ownerLabel: "外勤销售：杨文星",
    sourceLabel: "杨文星实录 · 3月5日广告中台行业讨论",
    title: "广告中台功能及行业合作讨论",
    accountName: "广州成熟投放中台团队",
    accountProfile:
      "团队自建广告中台多年，运营与技术都能看长期 ROI、转端和回传策略，对第三方接入保持强烈数据安全警惕。",
    meetingType: "review",
    occurredAt: "2026-03-05T16:45:00+08:00",
    status: "completed",
    summaryStatus: "ready",
    transcriptStatus: "ready",
    dataFreshness: "fresh",
    priorityLabel: "关系维护",
    insightLabel: "核心结论",
    insight:
      "整套中台替换概率低，当前更现实的价值不是强推产品，而是保持关系、交换行业信息，再看是否有局部合作切口。",
    nextStep:
      "先让客户帮忙引荐同圈层技术负责人，维持高质量交流，暂不强推整套中台方案。",
    publicContext: null,
    publicSourceLabel: null,
    publicSourceUrl: null,
  },
];

export function createMockDataset(): MockDataset {
  const baseDataset = {
    accounts,
    contacts,
    deals,
    meetings,
    conversations,
    evidenceRefs,
    agentOutputs,
    forecastSnapshots,
    repScorecards,
    recapRecords,
    workflowEvents,
    dataSources,
    intakeItems,
    entityCandidates,
    ingestionProposals,
    syncRecords,
    alerts,
    realMeetingCases,
  };
  const accountThreads: AccountThread[] = deriveAccountThreads(baseDataset);
  const repReportSnapshots: RepReportSnapshot[] = deriveRepReportSnapshots(
    {
      repScorecards,
      meetings,
    },
    accountThreads
  );

  return {
    ...baseDataset,
    accountThreads,
    repReportSnapshots,
    roleViews: {
      ceo: {
        role: "ceo",
        topDealIds: deals.slice(0, 3).map((deal) => deal.id),
      },
      manager: {
        role: "manager",
        stalledDealIds: deals
          .filter((deal) => deal.riskLevel === "high" || deal.dataFreshness === "stale")
          .map((deal) => deal.id),
      },
      rep: {
        role: "rep",
        todoDealIds: deals
          .filter((deal) => deal.ownerRepId === "rep-2")
          .slice(0, 3)
          .map((deal) => deal.id),
      },
    },
  };
}
