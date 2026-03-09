"use client";

import { AgentPanel } from "@/components/agent/agent-panel";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import clsx from "clsx";
import { Bot, Grid2x2, House, PanelBottom, PanelsTopLeft, Radar } from "lucide-react";

import {
  mobileOverflowNavItems,
  mobilePrimaryNavItems,
  primaryNavItems,
} from "@/lib/navigation";
import { useAgentPanelStore } from "@/state/agent-panel-store";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isOpen, collapsePanel, expandPanel, context } = useAgentPanelStore();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mobileNavIcons = {
    "/home": House,
    "/deals": Grid2x2,
    "/meetings": PanelBottom,
    "/pipeline": Radar,
  } as const;

  return (
    <div className={clsx("app-shell", !isOpen && "app-shell-panel-collapsed")}>
      <aside className="left-nav">
        <div className="brand-block">
          <div className="brand-kicker">AI Sales OS</div>
          <div className="brand-status-row">
            <span className="brand-status-dot" />
            <span>Meeting-first Demo</span>
          </div>
          <h1>ARM-demo</h1>
          <p>以 Agent 为核心交互、以 Meeting 驱动推进、以 mock 数据完成演示闭环。</p>
        </div>

        <div className="nav-group-label">Operating Surfaces</div>
        <nav className="nav-list" aria-label="桌面主导航">
          {primaryNavItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx("nav-item", pathname === href && "nav-item-active")}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="main-shell">
        <div className="mobile-briefing-header" aria-label="移动端简报头">
          <div className="mobile-briefing-copy">
            <span className="eyebrow">AI Sales OS</span>
            <strong>Agent 正在持续监听本页上下文与风险变化</strong>
          </div>
          <button
            className="ghost-button mobile-briefing-agent-button"
            type="button"
            onClick={expandPanel}
          >
            打开 Agent
          </button>
        </div>

        <header className="top-bar">
          <div className="top-bar-search-stack">
            <div className="top-bar-kicker">Revenue Command Surface</div>
            <div className="search-pill">
              <span className="search-pill-label">Command Search</span>
              <strong>搜索商机、会议、纪要、风险信号</strong>
            </div>
          </div>
          <div className="top-bar-meta">
            <span className="context-chip context-chip-live">演示模式</span>
            <span className="context-chip">2026 年 Q1</span>
            <span className="context-chip">全球销售团队</span>
            <span className="context-chip context-chip-agent">Agent 已联动</span>
            <span className="context-chip">数据状态：新鲜度混合</span>
          </div>
        </header>

        <main
          className={clsx("main-content", "main-content-mobile-safe", isOpen && "main-content-panel-open")}
        >
          {children}
        </main>
      </div>

      <div className="mobile-shell-rail" aria-label="移动端底部导航容器">
        <nav className="mobile-bottom-nav" aria-label="移动端主导航">
          {mobilePrimaryNavItems.map(({ href, label }) => {
            const Icon = mobileNavIcons[href as keyof typeof mobileNavIcons];

            return (
              <Link
                key={href}
                href={href}
                className={clsx("mobile-nav-link", pathname === href && "mobile-nav-link-active")}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            );
          })}

          <button
            className="mobile-agent-trigger"
            type="button"
            aria-label="打开移动端 Agent 工作台"
            onClick={expandPanel}
          >
            <Bot size={18} />
            <span>Agent</span>
          </button>

          <button
            className={clsx("mobile-more-trigger", isMoreOpen && "mobile-more-trigger-active")}
            type="button"
            aria-label="打开更多页面"
            onClick={() => setIsMoreOpen((current) => !current)}
          >
            <PanelsTopLeft size={18} />
            <span>More</span>
          </button>
        </nav>

        <div className={clsx("mobile-more-sheet", isMoreOpen && "mobile-more-sheet-open")}>
          <div className="mobile-more-sheet-header">
            <span className="eyebrow">更多页面</span>
            <button
              type="button"
              className="ghost-button mobile-more-close"
              onClick={() => setIsMoreOpen(false)}
            >
              收起
            </button>
          </div>
          <div className="mobile-more-list">
            {mobileOverflowNavItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx("mobile-more-link", pathname === href && "mobile-more-link-active")}
                onClick={() => setIsMoreOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <AgentPanel
        isOpen={isOpen}
        context={context}
        onCollapse={collapsePanel}
        onExpand={expandPanel}
      />
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div className="page-header-copy">
        <div className="eyebrow">Agent 优先工作台</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="page-header-action">{action}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  children,
  action,
  mobilePriority,
  mobileDensity,
  mobileCollapsible = false,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  mobilePriority?: "primary" | "secondary";
  mobileDensity?: "feed" | "cards";
  mobileCollapsible?: boolean;
}) {
  return (
    <section
      className="section-card"
      data-mobile-priority={mobilePriority}
      data-mobile-density={mobileDensity}
      data-mobile-collapsible={mobileCollapsible ? "true" : undefined}
    >
      <div className="section-card-header">
        <h3>{title}</h3>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function MetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "risk" | "positive" | "info" | "warn";
}) {
  return (
    <div className={clsx("metric-card", `metric-${tone}`)}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "risk" | "warn" | "success" | "info";
}) {
  return <span className={clsx("badge", `badge-${tone}`)}>{children}</span>;
}
