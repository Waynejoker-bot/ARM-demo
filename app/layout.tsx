import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { AppShell } from "@/components/shared/ui";

export const metadata: Metadata = {
  title: "ARM | AI Revenue Management OS",
  description: "以 Agent 为核心交互、以 mock 数据驱动的 AI Revenue Management OS 前端演示。",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
