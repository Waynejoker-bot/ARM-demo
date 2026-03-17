"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import clsx from "clsx";
import { House, Radar, Settings, Users } from "lucide-react";

import {
  mobilePrimaryNavItems,
  primaryNavItems,
} from "@/lib/navigation";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const mobileNavIcons = {
    "/": House,
    "/customers": Users,
    "/pipeline": Radar,
    "/settings": Settings,
  } as const;

  return (
    <div className="app-shell app-shell-panel-collapsed">
      <aside className="left-nav">
        <div className="brand-block">
          <Link href="/" className="brand-mark">
            ARM
          </Link>
        </div>

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
        <main className="main-content main-content-mobile-safe">
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
        </nav>
      </div>
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
