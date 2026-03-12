import { NextResponse } from "next/server";

import { createConversationRuntime } from "@/lib/conversational-os/runtime";

type RouteContext = {
  params: Promise<{
    threadId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const runtime = createConversationRuntime();
  const { threadId } = await context.params;

  try {
    return NextResponse.json({
      ...runtime.openThread(threadId),
      threadPreviews: runtime.listThreadPreviews(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "无法读取会话线程。";

    return NextResponse.json({ message }, { status: 404 });
  }
}
