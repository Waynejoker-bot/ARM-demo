import { NextResponse } from "next/server";

import { defaultThreadId } from "@/lib/conversational-os/seed";
import { createConversationRuntime } from "@/lib/conversational-os/runtime";

export async function GET() {
  const runtime = createConversationRuntime();

  return NextResponse.json({
    defaultThreadId,
    threads: runtime.listThreadPreviews(),
  });
}
