import type { ActionCardRecord } from "@/lib/design-system-action-card";

export type DesignDirection = {
  id: string;
  label: string;
  title: string;
  summary: string;
  material: string;
  mood: string;
  className: string;
};

export type DesignVariantCard = ActionCardRecord & {
  className: string;
};

export const designDirections: DesignDirection[] = [
  {
    id: "a",
    label: "Direction A",
    title: "冷静指挥舱",
    summary: "把卡片放进低噪音、高秩序的深色指挥界面里，像一张被点亮的决策屏。",
    material: "磨砂玻璃 + 冷青光带 + 稀疏网格",
    mood: "适合 CEO / 主管判断层",
    className: "direction-calm",
  },
  {
    id: "b",
    label: "Direction B",
    title: "编辑部情报台",
    summary: "让卡片像一张正在被编辑的情报页面，有版式、有层次、有内容重量。",
    material: "米白纸感 + 墨色排版 + 朱砂强调",
    mood: "适合任务卡评审和内容对比",
    className: "direction-editorial",
  },
  {
    id: "c",
    label: "Direction C",
    title: "高压任务流",
    summary: "把动作优先级做成高压调度板，像任务正被推送到执行链路里。",
    material: "工业红线 + 压暗底色 + 警戒边框",
    mood: "适合一线执行与升级态展示",
    className: "direction-intense",
  },
];

export const designVariantCards: DesignVariantCard[] = [
  {
    eyebrow: "一线销售推进卡",
    status: "已确认",
    subjectLabel: "客户",
    subject: "广州紫菲网络科技",
    task: "1 周内锁定二访阵容",
    judgment: "先锁二访，不继续堆产品信息。",
    metric: {
      label: "可信度",
      value: "82%",
      tone: "success",
    },
    primaryAction: "锁定二访阵容",
    details: {
      reason: "客户已经把窗口收紧到 VOD、云成本和试点边界，这一轮继续讲产品只会拉长节奏。",
      source: "会议录音、客户线程变化、销售确认记录",
      updatedAt: "2026 年 3 月 12 日 00:10",
      evidence: "客户在 18:24 到 19:08 明确要求下一次会必须带技术负责人和试点 owner。",
      completeness: "录音、CRM 和销售 review 已齐，缺失项为客户内部预算表。",
    },
    className: "variant-rep",
  },
  {
    eyebrow: "销售主管编排卡",
    status: "待判断",
    subjectLabel: "机会",
    subject: "Atlas 赞助人线程",
    task: "决定是否预留售前资源",
    judgment: "这条线值得主管介入，但还不到 CEO 出面的程度。",
    metric: {
      label: "可信度",
      value: "81%",
      tone: "info",
    },
    primaryAction: "决定是否升级 CEO",
    details: {
      reason: "销售还能推进技术细节，但高层 sponsor 没被拉进来，单兵推进已经接近边界。",
      source: "下属决策卡、最近两场会议纪要、Pipeline 风险信号",
      updatedAt: "2026 年 3 月 11 日 21:40",
      evidence: "最近两场会都没有形成 sponsor 对齐动作，但技术范围还在继续扩大。",
      completeness: "会议和 CRM 齐全，邮件侧覆盖率 64%。",
    },
    className: "variant-manager",
  },
  {
    eyebrow: "CEO 升级介入卡",
    status: "已升级",
    subjectLabel: "关键客户",
    subject: "玄河网络试点",
    task: "判断是否给到跨部门资源调度",
    judgment: "如果要保住窗口，CEO 要做的是批资源，而不是自己下场读所有会。",
    metric: {
      label: "可信度",
      value: "88%",
      tone: "success",
    },
    primaryAction: "批准资源调度",
    details: {
      reason: "当前风险不是产品不匹配，而是客户在等更高层的资源承诺和内部排期配合。",
      source: "主管介入卡、关键会议摘要、经营影响评估",
      updatedAt: "2026 年 3 月 12 日 09:15",
      evidence: "客户要求在下周高层会上看到明确的交付 owner 和联合排期承诺。",
      completeness: "高层事实链完整，缺少法务条款确认。",
    },
    className: "variant-ceo",
  },
  {
    eyebrow: "低置信度卡",
    status: "低置信度",
    subjectLabel: "客户",
    subject: "曜石游戏",
    task: "先判断要不要继续报价",
    judgment: "先补齐事实，再决定是否推进价格动作。",
    metric: {
      label: "可信度",
      value: "54%",
      tone: "warn",
    },
    primaryAction: "先补齐事实",
    details: {
      reason: "转录缺失且关键信息来自二手同步，继续推进会放大误判。",
      source: "不完整会议摘要、CRM 备注、销售人工补记",
      updatedAt: "2026 年 3 月 11 日 18:20",
      evidence: "缺失客户预算 owner 和试点边界，现有报价依据来自会后回忆。",
      completeness: "会议转录缺失，邮件未同步，数据完整度 41%。",
    },
    className: "variant-low-trust",
  },
  {
    eyebrow: "已撤销卡",
    status: "已撤销",
    subjectLabel: "下游任务",
    subject: "玄河网络执行链",
    task: "回收已派发的下游动作",
    judgment: "上游判断已变更，原任务不能继续执行，但必须留下撤销痕迹。",
    metric: {
      label: "执行状态",
      value: "已回收",
      tone: "risk",
    },
    primaryAction: "查看撤销原因",
    details: {
      reason: "客户的高层承诺条件发生变化，原本的执行任务已经不再成立。",
      source: "上游决策卡、任务路由日志、执行人确认记录",
      updatedAt: "2026 年 3 月 12 日 08:35",
      evidence: "上游把目标从报价推进切换为高层对齐，原脚本准备任务已失效。",
      completeness: "回收链路完整，等待 CRM 同步状态回写。",
    },
    className: "variant-revoked",
  },
  {
    eyebrow: "已下发卡",
    status: "已下发",
    subjectLabel: "执行人",
    subject: "Sofia",
    task: "确认是否收到新的客户任务卡",
    judgment: "任务不是改一段状态，而是要让执行人真实接收到并回应。",
    metric: {
      label: "执行状态",
      value: "已送达",
      tone: "info",
    },
    primaryAction: "查看下游接收情况",
    details: {
      reason: "组织流转如果只停留在上游界面，就无法保证命令真的到达下游。",
      source: "Task Router、消息回执、执行人确认动作",
      updatedAt: "2026 年 3 月 12 日 09:40",
      evidence: "Sofia 已查看任务，但尚未开始执行新的提问脚本。",
      completeness: "派发链完整，执行反馈还未产生。",
    },
    className: "variant-assigned",
  },
];
