import { NextResponse } from "next/server";
import { z } from "zod";

import { requestAgentChat } from "@/lib/model/provider";

const requestSchema = z.object({
  prompt: z.string().min(1),
  contextTitle: z.string().min(1),
  contextDescription: z.string().optional(),
  roleHint: z.enum(["ceo", "manager", "rep"]).optional(),
  attachments: z
    .array(
      z.object({
        type: z.literal("decision-card"),
        title: z.string().min(1),
        summary: z.string().min(1),
        recommendation: z.string().optional(),
        signals: z.array(z.string()).optional(),
        sourceLabel: z.string().optional(),
      })
    )
    .optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      })
    )
    .optional(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = requestSchema.parse(json);
    const message = await requestAgentChat(payload);

    return NextResponse.json({ message });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知的 Agent 请求失败。";

    return NextResponse.json({ message }, { status: 400 });
  }
}
