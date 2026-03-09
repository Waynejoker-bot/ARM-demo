import { primaryNavItems } from "@/lib/navigation";

describe("primary navigation", () => {
  it("registers the new role workspace pages in the sidebar", () => {
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
          href: "/intake",
          label: "素材导入",
        }),
      ])
    );
  });
});
