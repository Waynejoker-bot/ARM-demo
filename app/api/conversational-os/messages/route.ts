import { NextResponse } from "next/server";
import { z } from "zod";

import { createConversationRuntime } from "@/lib/conversational-os/runtime";

const requestSchema = z.discriminatedUnion("messageType", [
  z.object({
    threadId: z.string().min(1),
    actorId: z.string().min(1),
    actorName: z.string().min(1),
    messageType: z.literal("text"),
    body: z.string().min(1),
  }),
  z.object({
    threadId: z.string().min(1),
    actorId: z.string().min(1),
    actorName: z.string().min(1),
    messageType: z.literal("card"),
    cardId: z.string().min(1),
  }),
]);

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = requestSchema.parse(
      "messageType" in json ? json : { ...json, messageType: "text" }
    );
    const runtime = createConversationRuntime();
    const result = await runtime.sendMessage(payload);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "发送会话消息失败。";

    return NextResponse.json({ message }, { status: 400 });
  }
}
