import { NextResponse } from "next/server";

import { createConversationRuntime } from "@/lib/conversational-os/runtime";

export async function POST() {
  const runtime = createConversationRuntime();

  return NextResponse.json(runtime.reset());
}
