"use client";

import { ErrorState } from "@/components/shared/feedback-states";
import { PageHeader } from "@/components/shared/ui";

export default function GlobalError() {
  return (
    <>
      <PageHeader
        title="页面出现错误"
        description="这是前端的兜底错误态，用于保证异常时仍然能给出清晰反馈。"
      />
      <ErrorState
        title="当前页面未能正常渲染"
        description="请刷新页面，或回到其他页面继续查看 mock 数据。"
      />
    </>
  );
}
