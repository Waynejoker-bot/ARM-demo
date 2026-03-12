import { NextResponse } from "next/server";

import { getMockDataset } from "@/lib/mock-selectors";
import { buildIntakeClassificationMessages } from "@/lib/intake/prompts";
import { classifyIntakeWithMock } from "@/lib/intake/mock-classification";
import {
  intakeClassificationInputSchema,
  intakeClassificationResponseSchema,
} from "@/lib/intake/types";
import { getGlmApiKey, requestGlmCompletion } from "@/lib/model/glm-client";

function stripCodeFence(value: string) {
  return value.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = intakeClassificationInputSchema.parse(json);
    const dataset = getMockDataset();

    if (!getGlmApiKey()) {
      return NextResponse.json(classifyIntakeWithMock(payload, dataset));
    }

    const responseText = await requestGlmCompletion({
      prompt: "素材导入识别",
      contextTitle: "素材导入识别",
      contextDescription: "识别素材归属并返回 JSON。",
      roleHint: "rep",
      messages: buildIntakeClassificationMessages({ input: payload, dataset }),
    });

    const parsed = JSON.parse(stripCodeFence(responseText));
    const result = intakeClassificationResponseSchema.parse(parsed);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "素材识别失败。";

    return NextResponse.json({ message }, { status: 400 });
  }
}
