import Link from "next/link";

import { ErrorState } from "@/components/shared/feedback-states";
import { PageHeader } from "@/components/shared/ui";

export default function NotFound() {
  return (
    <>
      <PageHeader
        title="没有找到对应页面"
        description="可能是对象不存在，或者当前 mock 数据里还没有这条记录。"
        action={<Link href="/home">返回首页</Link>}
      />
      <ErrorState
        title="请求的页面不存在"
        description="你可以回到首页、商机列表或会议列表继续浏览。"
      />
    </>
  );
}
