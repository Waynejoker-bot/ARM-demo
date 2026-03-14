import { primaryNavItems, mobilePrimaryNavItems, devNavItems } from "@/lib/navigation";

describe("primary navigation", () => {
  it("uses root path as the canonical homepage", () => {
    expect(primaryNavItems.filter((item) => item.label === "首页")).toEqual([
      { href: "/", label: "首页" },
    ]);
    expect(primaryNavItems.some((item) => item.href === "/home")).toBe(false);
    expect(primaryNavItems.some((item) => item.href === "/conversational-agent-os")).toBe(false);
  });

  it("contains only the focused navigation set after product simplification", () => {
    const hrefs = primaryNavItems.map((item) => item.href);
    expect(hrefs).toEqual(["/", "/pipeline", "/settings"]);
  });

  it("excludes archived surfaces from primary navigation", () => {
    const hrefs = primaryNavItems.map((item) => item.href);
    const archived = [
      "/ceo-command-center",
      "/sales-manager-cockpit",
      "/sales-war-room",
      "/agent-task-cards",
      "/intake",
      "/agent",
      "/revenue",
      "/deals",
      "/customers",
      "/meetings",
      "/sales-team",
      "/recaps",
      "/agent-workflows",
      "/data-sources",
      "/design-system",
    ];
    for (const path of archived) {
      expect(hrefs).not.toContain(path);
    }
  });

  it("keeps design-system in a separate dev-only export", () => {
    expect(devNavItems).toEqual([{ href: "/design-system", label: "设计系统" }]);
  });

  it("provides a focused mobile primary navigation", () => {
    const hrefs = mobilePrimaryNavItems.map((item) => item.href);
    expect(hrefs).toEqual(["/", "/pipeline", "/settings"]);
  });
});
