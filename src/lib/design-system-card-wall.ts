import type { ActionCardRecord } from "@/lib/design-system-action-card";

export type DesignSystemCard = ActionCardRecord & {
  id: string;
};

export type DesignSystemCardCategory = {
  id: string;
  title: string;
  cards: DesignSystemCard[];
};

export const designSystemCardWall: DesignSystemCardCategory[] = [
  {
    id: "facts",
    title: "事实卡",
    cards: [
      {
        id: "fact-meeting-zifei",
        eyebrow: "会议事实卡",
        status: "已确认",
        subjectLabel: "客户",
        subject: "广州紫菲网络科技",
        task: "锁定二访阵容",
        judgment: "客户已经把下一次会的边界收窄到 VOD、云成本和试点 owner。",
        metric: {
          label: "可信度",
          value: "91%",
          tone: "success",
        },
        primaryAction: "查看详情",
        details: {
          reason: "这张卡只锁事实，不替销售做角色判断，但足以支持后续生成下一步。",
          source: "会议录音、参会人列表、销售确认记录",
          updatedAt: "2026 年 3 月 12 日 09:05",
          evidence: "客户在 18:24 到 19:08 两次强调，下周只接受带技术负责人和试点 owner 的二访。",
          completeness: "录音、纪要、CRM 备注均已到齐。",
        },
      },
      {
        id: "fact-thread-atlas",
        eyebrow: "线程变化卡",
        status: "待确认",
        subjectLabel: "客户线程",
        subject: "Atlas 赞助人线程",
        task: "确认线程是否转成 sponsor 风险",
        judgment: "表面推进正常，但真实阻点已经从技术讨论转成高层 sponsor 缺位。",
        metric: {
          label: "可信度",
          value: "76%",
          tone: "warn",
        },
        primaryAction: "生成下一步",
        details: {
          reason: "线程变化卡不是总结会议，而是把 before/after 的真实变化单独抽出来。",
          source: "最近两次会议纪要、Deal 风险日志、销售修订记录",
          updatedAt: "2026 年 3 月 11 日 22:50",
          evidence: "会议里继续在谈技术范围，但始终没有形成 sponsor 对齐动作。",
          completeness: "会议和 CRM 齐全，邮件侧仍缺 2 封关键往来。",
        },
      },
    ],
  },
  {
    id: "rep-decisions",
    title: "销售决策卡",
    cards: [
      {
        id: "rep-follow-up-zifei",
        eyebrow: "一线销售推进卡",
        status: "待动作",
        subjectLabel: "客户",
        subject: "广州紫菲网络科技",
        task: "1 周内锁定二访阵容",
        judgment: "先把二访定下来，不再继续堆信息。",
        metric: {
          label: "可信度",
          value: "82%",
          tone: "success",
        },
        primaryAction: "锁定二访阵容",
        details: {
          reason: "客户要的不是更多产品介绍，而是下一场会的人、问题和边界已经收紧。",
          source: "会议事实卡、线程变化卡、销售 review",
          updatedAt: "2026 年 3 月 12 日 00:10",
          evidence: "如果这周不定阵容，客户会把窗口转给另外两家正在竞争的供应商。",
          completeness: "原始会议证据完整，预算表仍缺。",
        },
      },
    ],
  },
  {
    id: "manager-decisions",
    title: "主管决策卡",
    cards: [
      {
        id: "manager-atlas-intervention",
        eyebrow: "主管介入卡",
        status: "待判断",
        subjectLabel: "机会",
        subject: "Atlas 赞助人线程",
        task: "决定是否发起主管介入",
        judgment: "这条线需要主管加入 sponsor 对齐，但暂时不必继续上报 CEO。",
        metric: {
          label: "可信度",
          value: "79%",
          tone: "info",
        },
        primaryAction: "发起介入",
        details: {
          reason: "销售还能推进技术讨论，但组织资源和高层沟通已经需要主管帮忙切入。",
          source: "下属销售决策卡、最近两场会议摘要、Pipeline 风险提示",
          updatedAt: "2026 年 3 月 12 日 08:05",
          evidence: "没有 sponsor 的情况下继续按健康后期机会处理，会误配团队注意力。",
          completeness: "团队层信息齐全，客户邮件侧覆盖率 68%。",
        },
      },
    ],
  },
  {
    id: "ceo-decisions",
    title: "CEO 决策卡",
    cards: [
      {
        id: "ceo-strategic-support",
        eyebrow: "CEO 资源决策卡",
        status: "待拍板",
        subjectLabel: "关键客户",
        subject: "玄河网络试点",
        task: "判断是否投入跨部门资源",
        judgment: "CEO 需要决定自己要不要成为资源的一部分，而不是继续看更多摘要。",
        metric: {
          label: "可信度",
          value: "88%",
          tone: "success",
        },
        primaryAction: "批准资源调度",
        details: {
          reason: "客户当前要的是高层背书和排期承诺，不是继续讨论功能细节。",
          source: "主管决策卡、关键会议事实、经营影响评估",
          updatedAt: "2026 年 3 月 12 日 09:15",
          evidence: "这条商机一旦延误，Q2 高价值样板客户的节奏会整体后移。",
          completeness: "经营链路完整，法务条款待补。",
        },
      },
    ],
  },
  {
    id: "escalations",
    title: "上报卡",
    cards: [
      {
        id: "escalation-discount",
        eyebrow: "向上求助卡",
        status: "已提交",
        subjectLabel: "上报事项",
        subject: "玄河网络折扣请求",
        task: "请 CEO 判断是否接受阶段性让利",
        judgment: "主管层已经穷尽可行解，这件事必须上升到公司级资源判断。",
        metric: {
          label: "可信度",
          value: "74%",
          tone: "warn",
        },
        primaryAction: "继续上报",
        details: {
          reason: "客户把价格和高层 commitment 绑定在一起谈，主管权限不足以独立决定边界。",
          source: "主管决策卡、报价记录、客户谈判摘要",
          updatedAt: "2026 年 3 月 11 日 19:25",
          evidence: "客户明确要求看到折扣和高层承诺同时成立才会进入年度试点。",
          completeness: "谈判事实齐全，利润测算待补。",
        },
      },
    ],
  },
  {
    id: "commands",
    title: "命令卡",
    cards: [
      {
        id: "command-rep-coaching",
        eyebrow: "向下命令卡",
        status: "执行中",
        subjectLabel: "执行人",
        subject: "Sofia",
        task: "今晚前重做下一场会的提问路径",
        judgment: "先收紧预算 owner、试点边界和 sponsor 路径，再进入下一轮客户沟通。",
        metric: {
          label: "执行状态",
          value: "执行中",
          tone: "info",
        },
        primaryAction: "开始执行",
        details: {
          reason: "这张卡不再讨论要不要做，而是明确谁做、做到什么程度算完成。",
          source: "主管介入卡、教练反馈、执行任务日志",
          updatedAt: "2026 年 3 月 12 日 07:50",
          evidence: "新版提问脚本需要在下一场会前通过主管 review 才算完成。",
          completeness: "命令链完整，执行反馈待回传。",
        },
      },
    ],
  },
];
