export type NavItem = {
  href: string;
  label: string;
};

export const mobilePrimaryNavItems: NavItem[] = [
  { href: "/conversational-agent-os", label: "首页" },
  { href: "/deals", label: "商机" },
  { href: "/meetings", label: "会议" },
  { href: "/pipeline", label: "商机管道" },
];

export const primaryNavItems: NavItem[] = [
  { href: "/conversational-agent-os", label: "首页" },
  { href: "/design-system", label: "设计系统" },
  { href: "/agent-task-cards", label: "Agent 任务卡片版" },
  { href: "/ceo-command-center", label: "CEO 主控室" },
  { href: "/sales-manager-cockpit", label: "销售主管驾驶舱" },
  { href: "/sales-war-room", label: "一线销售作战室" },
  { href: "/intake", label: "素材导入" },
  { href: "/agent", label: "Agent 工作台" },
  { href: "/revenue", label: "收入中心" },
  { href: "/pipeline", label: "商机管道" },
  { href: "/deals", label: "商机" },
  { href: "/customers", label: "客户" },
  { href: "/meetings", label: "会议" },
  { href: "/sales-team", label: "销售团队" },
  { href: "/recaps", label: "复盘与培训" },
  { href: "/agent-workflows", label: "Agent 工作流" },
  { href: "/data-sources", label: "数据接入" },
  { href: "/settings", label: "设置" },
];

export const mobileOverflowNavItems: NavItem[] = primaryNavItems.filter(
  ({ href }) => !mobilePrimaryNavItems.some((item) => item.href === href) && href !== "/agent"
);
