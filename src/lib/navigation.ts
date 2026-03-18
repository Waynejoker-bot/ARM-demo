export type NavItem = {
  href: string;
  label: string;
};

export const primaryNavItems: NavItem[] = [
  { href: "/", label: "首页" },
  { href: "/pipeline", label: "商机管道" },
  { href: "/settings", label: "设置" },
];

export const mobilePrimaryNavItems: NavItem[] = [
  { href: "/", label: "首页" },
  { href: "/pipeline", label: "商机管道" },
  { href: "/settings", label: "设置" },
];

export const devNavItems: NavItem[] = [
  { href: "/design-system", label: "设计系统" },
];

export const mobileOverflowNavItems: NavItem[] = devNavItems;
