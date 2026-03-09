import { requestGlmCompletion } from "@/lib/model/glm-client";
import { buildAgentMessages } from "@/lib/model/prompts";
import type { AgentChatRequest } from "@/lib/model/types";

export async function requestAgentChat(input: AgentChatRequest) {
  return requestGlmCompletion({
    ...input,
    messages: buildAgentMessages(input),
  });
}
