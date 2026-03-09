"use client";

import { AgentPanel } from "@/components/agent/agent-panel";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import clsx from "clsx";

import { primaryNavItems } from "@/lib/navigation";
import { useAgentPanelStore } from "@/state/agent-panel-store";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isOpen, collapsePanel, expandPanel, context } = useAgentPanelStore();

  return (
    <div className={clsx("app-shell", !isOpen && "app-shell-panel-collapsed")}>
      <aside className="left-nav">
        <div className="brand-block">
          <Link href="/home" className="brand-mark">
            ARM-DEMO
          </Link>
        </div>

        <div className="nav-group-label">Operating Surfaces</div>
        <nav className="nav-list">
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

        <main className={clsx("main-content", isOpen && "main-content-panel-open")}>
          {children}
        </main>
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
  supportingCopy,
  action,
}: {
  title: string;
  description: ReactNode;
  supportingCopy?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div className="page-header-copy">
        <div className="eyebrow">Agent 优先工作台</div>
        <h1>{title}</h1>
        <div className="page-header-description">
          <p>{description}</p>
          {supportingCopy ? (
            <p className="page-header-supporting-copy">{supportingCopy}</p>
          ) : null}
        </div>
      </div>
      {action ? <div className="page-header-action">{action}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="section-card">
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
