import { NextResponse } from "next/server";
import { z } from "zod";

import { recordPersistedTaskCardAction } from "@/lib/task-cards/persistence";

const actionRequestSchema = z.object({
  cardId: z.string().min(1),
  actionKind: z.enum([
    "confirm",
    "accept",
    "dispatch",
    "report",
    "escalate",
    "approve",
    "request_info",
    "revoke",
  ]),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = actionRequestSchema.parse(json);
    const { state } = recordPersistedTaskCardAction(payload);

    return NextResponse.json({ state });
  } catch (error) {
    const message = error instanceof Error ? error.message : "任务卡动作写入失败。";

    return NextResponse.json({ message }, { status: 400 });
  }
}
