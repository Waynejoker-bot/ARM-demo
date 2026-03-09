import { createMockDataset } from "@/lib/mocks";

export type WorkspaceTone = "info" | "warn" | "risk" | "success";

export type WorkspaceLink = {
  href: string;
  label: string;
};

export type AgentBrief = {
  title: string;
  summary: string;
  reasons: string[];
  recommendedAction: string;
};

export type DecisionCard = {
  id: string;
  title: string;
  summary: string;
  impactLabel: string;
  impactValue: string;
  recommendation: string;
  confidence: number;
  freshness: "fresh" | "stale" | "missing";
  coverage: number;
  statusLabel: string;
  statusTone: WorkspaceTone;
  owner: string;
  dueWindow: string;
  autonomyLabel: string;
  approvalRequired: boolean;
  reasons: string[];
  links: WorkspaceLink[];
};

export type SystemActionCard = {
  id: string;
  title: string;
  summary: string;
  statusLabel: string;
  statusTone: WorkspaceTone;
  owner: string;
  links: WorkspaceLink[];
};

export type ContextCard = {
  id: string;
  title: string;
  summary: string;
  highlightLabel: string;
  highlightValue: string;
  tone: WorkspaceTone;
  links: WorkspaceLink[];
};

export type TrustCard = {
  id: string;
  title: string;
  summary: string;
  severityLabel: string;
  severityTone: WorkspaceTone;
  recommendation: string;
  links: WorkspaceLink[];
};

export type WorkspaceSection = {
  title: string;
  description: string;
};

export type RoleWorkspace = {
  slug: "ceo-command-center" | "sales-manager-cockpit" | "sales-war-room";
  href: string;
  navLabel: string;
  title: string;
  description: string;
  eyebrow: string;
  agentBrief: AgentBrief;
  spotlight: WorkspaceSection;
  actionSection: WorkspaceSection;
  trustSection: WorkspaceSection;
  secondarySection: WorkspaceSection;
  decisionCards: DecisionCard[];
  contextCards: ContextCard[];
  systemActions: SystemActionCard[];
  trustCards: TrustCard[];
};

const dataset = createMockDataset();

const revenueRiskDeal = dataset.deals.find((deal) => deal.id === "deal-2");
const staleCommitDeal = dataset.deals.find((deal) => deal.id === "deal-6");
const stableAnchorDeal = dataset.deals.find((deal) => deal.id === "deal-1");
const managerRep = dataset.repScorecards.find((rep) => rep.repId === "rep-2");
const repRiskDeal = dataset.deals.find((deal) => deal.id === "deal-5");
const repProgressDeal = dataset.deals.find((deal) => deal.id === "deal-3");

if (
  !revenueRiskDeal ||
  !staleCommitDeal ||
  !stableAnchorDeal ||
  !managerRep ||
  !repRiskDeal ||
  !repProgressDeal
) {
  throw new Error("Role workspace mock configuration is missing required objects.");
}

export const roleWorkspaces: RoleWorkspace[] = [
  {
    slug: "ceo-command-center",
    href: "/ceo-command-center",
    navLabel: "CEO 主控室",
    eyebrow: "Revenue Brain",
    title: "CEO 主控室",
    description: "围绕收入偏差、战略 deal 和资源配置做判断，不展示大而全 CRM 记录。",
    agentBrief: {
      title: "本周经营判断",
      summary: "本季度收入还有达标路径，但大额商机的信任度正在收窄，必须先处理经营暴露而不是继续看报表。",
      reasons: [
        "玄河网络仍缺少真正对齐的高层赞助与采购共识。",
        "灵境娱乐的后期推进数据已经过期，削弱预测置信度。",
        "星川互动仍然稳定，可以作为本季度的确定性锚点。",
      ],
      recommendedAction: "优先批准主管对两条后期大额商机的介入动作，并要求 72 小时内返回结果。",
    },
    spotlight: {
      title: "Top Decisions",
      description: "先处理影响收入判断的三件事，而不是先看全量 pipeline。",
    },
    secondarySection: {
      title: "Strategic Bets",
      description: "只展示最值得 CEO 关注的战略下注对象和经营影响。",
    },
    actionSection: {
      title: "Interventions In Flight",
      description: "系统和团队已经启动的动作，帮助 CEO 判断是否需要追加背书。",
    },
    trustSection: {
      title: "Trust And Data Integrity",
      description: "收入判断哪里不可靠，必须明确暴露而不是藏到报表后面。",
    },
    decisionCards: [
      {
        id: "ceo-decision-1",
        title: "玄河网络需要 CEO 级经营关注",
        summary: "这条高价值商机不是简单风险升高，而是已经开始影响本季度达标路径的可解释性。",
        impactLabel: "影响金额",
        impactValue: `${revenueRiskDeal.currency} ${revenueRiskDeal.amount.toLocaleString()}`,
        recommendation: "要求主管本周内重建高层赞助人与采购的推进共识，再决定是否继续按当前 forecast 计入 commit。",
        confidence: 0.62,
        freshness: revenueRiskDeal.dataFreshness,
        coverage: revenueRiskDeal.dataCoverage,
        statusLabel: "待 CEO 判断",
        statusTone: "risk",
        owner: "战略客户组主管",
        dueWindow: "48 小时内",
        autonomyLabel: "需人工批准",
        approvalRequired: true,
        reasons: [
          "后期 deal 仍没有明确日期化下一步。",
          "关键异议和采购一致性没有真正收敛。",
          "如果继续计入高置信收入，会放大 forecast 偏差。",
        ],
        links: [
          { href: "/deals/deal-2", label: "查看商机证据" },
          { href: "/revenue", label: "查看收入组成" },
        ],
      },
      {
        id: "ceo-decision-2",
        title: "灵境娱乐不应继续被视为稳定后期收入",
        summary: "问题不是 deal 本身变差，而是系统缺少足够新鲜的经营事实，当前判断已失去可靠基础。",
        impactLabel: "风险暴露",
        impactValue: `${staleCommitDeal.currency} ${staleCommitDeal.amount.toLocaleString()}`,
        recommendation: "先把它从稳定收入预期降级为待核实项，并要求主管回收新的客户互动证据。",
        confidence: 0.58,
        freshness: staleCommitDeal.dataFreshness,
        coverage: staleCommitDeal.dataCoverage,
        statusLabel: "建议降级",
        statusTone: "warn",
        owner: "华东大客户组",
        dueWindow: "72 小时内",
        autonomyLabel: "系统可先代拟动作",
        approvalRequired: true,
        reasons: [
          "过去 14 天没有新鲜推进记录。",
          "CRM 同步失败已经让经营判断失真。",
          "继续按原阶段对待会虚增确定性。",
        ],
        links: [
          { href: "/deals/deal-6", label: "查看风险商机" },
          { href: "/data-sources", label: "查看数据异常" },
        ],
      },
      {
        id: "ceo-decision-3",
        title: "星川互动可以作为本季度确定性支点",
        summary: "这不是要查看更多细节，而是确认资源是否继续优先保护高确定性收入锚点。",
        impactLabel: "确定性收入",
        impactValue: `${stableAnchorDeal.currency} ${stableAnchorDeal.amount.toLocaleString()}`,
        recommendation: "维持资源优先级，避免因为追逐新机会而拖慢已高置信推进的签约收口。",
        confidence: 0.91,
        freshness: stableAnchorDeal.dataFreshness,
        coverage: stableAnchorDeal.dataCoverage,
        statusLabel: "建议保护",
        statusTone: "success",
        owner: "华东大客户组",
        dueWindow: "本周内",
        autonomyLabel: "系统持续跟踪",
        approvalRequired: false,
        reasons: [
          "技术异议已基本排除。",
          "采购流程阻点明确且可执行。",
          "最近会议证据支持其高健康度判断。",
        ],
        links: [
          { href: "/deals/deal-1", label: "查看确定性证据" },
          { href: "/meetings/meeting-1", label: "查看关键会议" },
        ],
      },
    ],
    contextCards: [
      {
        id: "ceo-context-1",
        title: "Revenue Exposure",
        summary: "当前最值得 CEO 关注的不是总 forecast 数字，而是有多少收入正在因为信任问题而变得不稳定。",
        highlightLabel: "当前风险暴露",
        highlightValue: `CNY ${dataset.forecastSnapshots[0].riskExposure.toLocaleString()}`,
        tone: "risk",
        links: [{ href: "/revenue", label: "查看收入中心" }],
      },
      {
        id: "ceo-context-2",
        title: "Strategic Bet",
        summary: "星川互动是当前最稳的收入锚点，玄河网络则是最值得高层关注的战略下注。",
        highlightLabel: "关注组合",
        highlightValue: "1 个锚点 + 1 个高波动下注",
        tone: "info",
        links: [
          { href: "/deals/deal-1", label: "查看锚点 deal" },
          { href: "/deals/deal-2", label: "查看波动 deal" },
        ],
      },
    ],
    systemActions: [
      {
        id: "ceo-action-1",
        title: "系统已起草主管介入动作",
        summary: "已为玄河网络生成主管介入说明和 3 个必须核实的问题，只等 CEO 批准升级优先级。",
        statusLabel: "待批准",
        statusTone: "warn",
        owner: "销售主管",
        links: [{ href: "/sales-manager-cockpit", label: "查看主管驾驶舱" }],
      },
      {
        id: "ceo-action-2",
        title: "系统已持续跟踪星川互动收口节奏",
        summary: "如果采购流程出现延迟，系统会第一时间把影响回传到收入判断层。",
        statusLabel: "已在跟踪",
        statusTone: "success",
        owner: "Revenue Agent",
        links: [{ href: "/agent", label: "进入 Agent 工作台" }],
      },
    ],
    trustCards: [
      {
        id: "ceo-trust-1",
        title: "两条后期收入判断受到数据时效影响",
        summary: "收入判断的问题不只是风险高，而是判断基础正在老化，尤其是 CRM 与会议证据不同步时。",
        severityLabel: "高影响",
        severityTone: "risk",
        recommendation: "在数据补齐前，把这些对象从高置信收入中分离出来。",
        links: [
          { href: "/data-sources", label: "查看数据完整性" },
          { href: "/pipeline", label: "查看后期风险分布" },
        ],
      },
    ],
  },
  {
    slug: "sales-manager-cockpit",
    href: "/sales-manager-cockpit",
    navLabel: "销售主管驾驶舱",
    eyebrow: "Pipeline Engine",
    title: "销售主管驾驶舱",
    description: "围绕介入队列、推进真实性和销售辅导管理团队，不再把首页做成 pipeline 图表墙。",
    agentBrief: {
      title: "本周管理判断",
      summary: "本周最重要的不是看更多 pipeline，而是迅速介入 2 条后期商机，并把 1 位销售的预算资格判断拉回正轨。",
      reasons: [
        "后期商机里已经出现阶段真实度和 CRM 记录脱节。",
        "预算负责人和高层赞助在关键 deal 中持续模糊。",
        "数据缺口正在掩盖一线动作质量问题。",
      ],
      recommendedAction: "优先批准两条介入卡，并安排一次围绕预算资格判断的共创辅导。",
    },
    spotlight: {
      title: "Intervention Queue",
      description: "先看需要主管亲自介入的事项，而不是先看所有商机。",
    },
    secondarySection: {
      title: "Pipeline Reality Gap",
      description: "CRM 阶段与真实推进是否一致，直接影响团队判断的真实性。",
    },
    actionSection: {
      title: "Rep Coaching Queue",
      description: "系统已经识别出的管理和辅导动作，帮助主管快速决策。",
    },
    trustSection: {
      title: "Data And Sync Exceptions",
      description: "把数据问题和销售问题拆开看，避免误判团队表现。",
    },
    decisionCards: [
      {
        id: "manager-decision-1",
        title: "玄河网络需要主管介入高层对齐",
        summary: "这条商机的问题不是下一步写得不够细，而是销售没有重新建立真正的高层赞助。",
        impactLabel: "团队影响",
        impactValue: "后期大额 deal 失真",
        recommendation: "由主管参与下一次高层对齐会，明确赞助人、采购方与日期化下一步。",
        confidence: 0.72,
        freshness: revenueRiskDeal.dataFreshness,
        coverage: revenueRiskDeal.dataCoverage,
        statusLabel: "优先介入",
        statusTone: "risk",
        owner: "顾景行",
        dueWindow: "本周内",
        autonomyLabel: "需主管确认",
        approvalRequired: true,
        reasons: [
          "会议收尾时没有锁定 owner 和日期。",
          "高层赞助态度仍然模糊。",
          "继续放任会导致 pipeline 真实性失真。",
        ],
        links: [
          { href: "/deals/deal-2", label: "查看 deal 详情" },
          { href: "/meetings/meeting-2", label: "查看会议证据" },
        ],
      },
      {
        id: "manager-decision-2",
        title: "灵境娱乐需要先补数据再做阶段判断",
        summary: "当前最大问题不是阶段推进，而是判断基础已过期，主管应先恢复信息采集而不是逼销售改字段。",
        impactLabel: "判断偏差",
        impactValue: "后期阶段可信度下降",
        recommendation: "要求销售补充最新客户互动，并在数据回补后再决定是否保留现阶段。",
        confidence: 0.58,
        freshness: staleCommitDeal.dataFreshness,
        coverage: staleCommitDeal.dataCoverage,
        statusLabel: "先补证据",
        statusTone: "warn",
        owner: "周承安",
        dueWindow: "48 小时内",
        autonomyLabel: "系统已起草提醒",
        approvalRequired: true,
        reasons: [
          "CRM 同步失败会让阶段判断看起来比实际更乐观。",
          "近两周没有新的会话证据。",
          "在缺证据状态下讨论阶段推进没有意义。",
        ],
        links: [
          { href: "/deals/deal-6", label: "查看商机详情" },
          { href: "/data-sources", label: "查看同步异常" },
        ],
      },
      {
        id: "manager-decision-3",
        title: `${managerRep.repName} 需要预算资格判断辅导`,
        summary: "推进速度不是问题，问题是早期 deal 中预算责任人连续过晚确认，正在把风险推迟到后面才暴露。",
        impactLabel: "辅导对象",
        impactValue: managerRep.repName,
        recommendation: "安排一次围绕预算资格判断的 deal 共创，直接用她当前手里的两个商机做示例。",
        confidence: 0.81,
        freshness: "fresh",
        coverage: 0.86,
        statusLabel: "建议辅导",
        statusTone: "info",
        owner: managerRep.teamName,
        dueWindow: "本周内",
        autonomyLabel: "需主管确认",
        approvalRequired: true,
        reasons: [
          "多个商机推进节奏快，但预算 owner 偏模糊。",
          "问题出现在前期，不纠正会转成后期惊喜风险。",
          "系统已经识别到重复模式，不只是单次失误。",
        ],
        links: [
          { href: "/sales-team/rep-2", label: "查看销售详情" },
          { href: "/deals/deal-4", label: "查看早期商机" },
        ],
      },
    ],
    contextCards: [
      {
        id: "manager-context-1",
        title: "Pipeline Reality Gap",
        summary: "后期阶段里已经出现 CRM 状态和真实推进不同步的问题，主管需要优先处理真实度，而不是补图表。",
        highlightLabel: "当前偏差",
        highlightValue: "2 条后期 deal 需重验",
        tone: "warn",
        links: [{ href: "/pipeline", label: "查看商机管道" }],
      },
      {
        id: "manager-context-2",
        title: "Team Commitments",
        summary: "团队的关键不是多做活动，而是让客户承诺有 owner、有日期、有可验证结果。",
        highlightLabel: "本周承诺",
        highlightValue: "3 条需要主管追踪",
        tone: "info",
        links: [
          { href: "/deals/deal-2", label: "查看战略承诺" },
          { href: "/deals/deal-4", label: "查看早期承诺" },
        ],
      },
    ],
    systemActions: [
      {
        id: "manager-action-1",
        title: "系统已生成两条介入说明",
        summary: "对玄河网络和灵境娱乐的主管介入说明已整理好，只等你确认发起。",
        statusLabel: "待你确认",
        statusTone: "warn",
        owner: "Pipeline Agent",
        links: [{ href: "/agent-workflows", label: "查看 Agent 工作流" }],
      },
      {
        id: "manager-action-2",
        title: "系统已准备预算资格辅导提纲",
        summary: "可直接带着当前 deal 和会议证据进入辅导，不需要先自己整理素材。",
        statusLabel: "可立即使用",
        statusTone: "success",
        owner: "Coaching Agent",
        links: [{ href: "/recaps", label: "查看复盘与辅导" }],
      },
    ],
    trustCards: [
      {
        id: "manager-trust-1",
        title: "同步失败和缺失转录会误导 pipeline 判断",
        summary: "如果不把数据问题显式剥离，主管容易把信息盲区误判为销售动作问题。",
        severityLabel: "管理风险",
        severityTone: "risk",
        recommendation: "先恢复一手互动数据，再对后期阶段与辅导动作做最终判断。",
        links: [
          { href: "/data-sources", label: "查看接入状态" },
          { href: "/meetings", label: "查看会议队列" },
        ],
      },
    ],
  },
  {
    slug: "sales-war-room",
    href: "/sales-war-room",
    navLabel: "一线销售作战室",
    eyebrow: "Deal Brain",
    title: "一线销售作战室",
    description: "围绕今天要推进的动作、客户承诺和 Agent 已准备好的内容组织，不再把首页做成个人 CRM 面板。",
    agentBrief: {
      title: "今日推进判断",
      summary: "今天先解决会阻塞成交的真实问题，不要先去更新字段。系统已经把你最该推进的动作和草稿准备好了。",
      reasons: [
        "云岚游戏的试点推进仍有节奏，可以直接发方案跟进。",
        "曜石游戏的信息缺口会让判断失真，今天要先补关键上下文。",
        "早做客户承诺澄清，比晚点再追评分更有价值。",
      ],
      recommendedAction: "先完成一封高质量跟进和一次实施范围澄清，再决定是否推进报价。",
    },
    spotlight: {
      title: "Today Focus Stack",
      description: "今天最该推进的动作，不给你展示无关的大盘信息。",
    },
    secondarySection: {
      title: "Customer Commitment Tracker",
      description: "客户到底答应了什么、谁负责、何时到期，比阶段标签更重要。",
    },
    actionSection: {
      title: "Prepared By Agent",
      description: "系统已经代准备好的材料，目的是缩短你从判断到执行的路径。",
    },
    trustSection: {
      title: "Missing Context",
      description: "哪些判断现在不可靠，必须先补信息再推进。",
    },
    decisionCards: [
      {
        id: "rep-decision-1",
        title: `${repProgressDeal.name} 今天应直接推进方案澄清`,
        summary: "这条商机已经有内部支持者和推进节奏，不需要再反复看摘要，应该立刻把本地化落地方案发出去。",
        impactLabel: "当前目标",
        impactValue: "锁定下一次正式推进",
        recommendation: "发送落地方案草稿，并在邮件里明确请客户确认推进节奏与责任人。",
        confidence: 0.84,
        freshness: repProgressDeal.dataFreshness,
        coverage: repProgressDeal.dataCoverage,
        statusLabel: "今天先做",
        statusTone: "success",
        owner: "你自己",
        dueWindow: "今天 18:00 前",
        autonomyLabel: "系统已起草草稿",
        approvalRequired: false,
        reasons: [
          "客户兴趣和内部支持都还在。",
          "下一步缺的是具体交付说明，不是更多内部讨论。",
          "如果今天推进，最容易把节奏继续保持住。",
        ],
        links: [
          { href: "/deals/deal-3", label: "查看商机细节" },
          { href: "/meetings/meeting-3", label: "查看最近会议" },
        ],
      },
      {
        id: "rep-decision-2",
        title: `${repRiskDeal.name} 不应直接进入报价`,
        summary: "当前问题不是客户没兴趣，而是实施负担和上下文缺失没有被澄清，直接报价会把不确定性前置成阻力。",
        impactLabel: "阻塞点",
        impactValue: "实施范围未澄清",
        recommendation: "先约一轮实施范围澄清，并补齐会议转录或纪要，再决定是否给正式报价。",
        confidence: 0.54,
        freshness: repRiskDeal.dataFreshness,
        coverage: repRiskDeal.dataCoverage,
        statusLabel: "先补信息",
        statusTone: "risk",
        owner: "你自己",
        dueWindow: "明天中午前",
        autonomyLabel: "需你确认后执行",
        approvalRequired: true,
        reasons: [
          "客户的真实顾虑是实施工作量。",
          "当前缺少完整转录，Agent 结论本身也偏低置信。",
          "贸然推进报价会放大不信任感。",
        ],
        links: [
          { href: "/deals/deal-5", label: "查看风险商机" },
          { href: "/meetings/meeting-5", label: "查看缺失会议" },
        ],
      },
      {
        id: "rep-decision-3",
        title: "今天要先盯客户承诺，而不是盯阶段",
        summary: "你当前最容易忽略的是客户承诺是否真的被锁定。系统建议把今天所有动作都改成围绕承诺推进。",
        impactLabel: "行动方式",
        impactValue: "承诺驱动推进",
        recommendation: "每次沟通都明确 owner、截止时间和可验证结果，再把确认后的内容应用到 deal。",
        confidence: 0.76,
        freshness: "fresh",
        coverage: 0.82,
        statusLabel: "建议执行",
        statusTone: "info",
        owner: "你自己",
        dueWindow: "今日持续执行",
        autonomyLabel: "系统持续提醒",
        approvalRequired: false,
        reasons: [
          "阶段标签无法代替真实承诺。",
          "客户承诺明确后，Next Step 质量会显著提高。",
          "这能减少后续突然停滞的概率。",
        ],
        links: [
          { href: "/pipeline", label: "查看阶段提议" },
          { href: "/agent", label: "继续问 Agent" },
        ],
      },
    ],
    contextCards: [
      {
        id: "rep-context-1",
        title: "Customer Commitment Tracker",
        summary: "真正推进 deal 的不是阶段，而是客户是否对下一步给出清晰承诺。",
        highlightLabel: "今日需确认",
        highlightValue: "2 个 owner + 2 个截止时间",
        tone: "info",
        links: [
          { href: "/deals/deal-3", label: "查看推进商机" },
          { href: "/deals/deal-5", label: "查看风险商机" },
        ],
      },
      {
        id: "rep-context-2",
        title: "Deal Risks To Resolve",
        summary: "今天最大的风险不是 win rate 下降，而是你可能带着不完整判断继续往前推。",
        highlightLabel: "当前风险",
        highlightValue: "1 个低置信度判断需先补证据",
        tone: "warn",
        links: [
          { href: "/meetings/meeting-5", label: "查看缺失会议" },
          { href: "/data-sources", label: "查看数据缺口" },
        ],
      },
    ],
    systemActions: [
      {
        id: "rep-action-1",
        title: "系统已准备云岚游戏跟进草稿",
        summary: "邮件主线和要确认的问题已写好，你只需要决定是否发出以及是否调整语气。",
        statusLabel: "可直接发送",
        statusTone: "success",
        owner: "Next Step Agent",
        links: [{ href: "/agent", label: "查看草稿来源" }],
      },
      {
        id: "rep-action-2",
        title: "系统已标出曜石游戏的信息缺口",
        summary: "在你继续推进之前，系统已经把哪些信息缺失、会影响判断哪些部分列出来了。",
        statusLabel: "待你补齐",
        statusTone: "warn",
        owner: "Meeting Agent",
        links: [{ href: "/data-sources", label: "查看缺失原因" }],
      },
    ],
    trustCards: [
      {
        id: "rep-trust-1",
        title: "缺转录时不要把 Agent 总结当成已确认事实",
        summary: "在证据不完整的情况下，系统会继续给建议，但这些建议只能作为草稿，不应直接替代你的客户判断。",
        severityLabel: "低置信度",
        severityTone: "warn",
        recommendation: "优先补纪要或重新确认关键问题，再把内容应用到 deal。",
        links: [
          { href: "/meetings/meeting-5", label: "查看会议详情" },
          { href: "/deals/deal-5", label: "查看受影响商机" },
        ],
      },
    ],
  },
];

export function getRoleWorkspaceBySlug(slug: RoleWorkspace["slug"]) {
  return roleWorkspaces.find((workspace) => workspace.slug === slug) ?? null;
}
