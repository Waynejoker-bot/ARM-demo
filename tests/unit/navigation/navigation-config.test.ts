import { primaryNavItems } from "@/lib/navigation";

describe("primary navigation", () => {
  it("keeps a single canonical homepage entry in the sidebar", () => {
    expect(primaryNavItems.filter((item) => item.label === "首页")).toEqual([
      {
        href: "/conversational-agent-os",
        label: "首页",
      },
    ]);
    expect(primaryNavItems.some((item) => item.href === "/home")).toBe(false);
    expect(primaryNavItems.some((item) => item.label === "会话版 Agent OS")).toBe(false);
  });

  it("still keeps the other operating surfaces available", () => {
    expect(primaryNavItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: "/ceo-command-center",
          label: "CEO 主控室",
        }),
        expect.objectContaining({
          href: "/sales-manager-cockpit",
          label: "销售主管驾驶舱",
        }),
        expect.objectContaining({
          href: "/sales-war-room",
          label: "一线销售作战室",
        }),
        expect.objectContaining({
          href: "/design-system",
          label: "设计系统",
        }),
        expect.objectContaining({
          href: "/agent-task-cards",
          label: "Agent 任务卡片版",
        }),
        expect.objectContaining({
          href: "/intake",
          label: "素材导入",
        }),
      ])
    );
  });
});
