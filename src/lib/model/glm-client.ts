import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

import type { ProviderChatInput } from "@/lib/model/types";

const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const DEFAULT_MODEL = "glm-4-flash";

export function readApiKeyFromLocalFile(startDir = process.cwd()) {
  let currentDir = startDir;

  while (true) {
    const apiKeyPath = join(currentDir, "APIkey.md");

    if (existsSync(apiKeyPath)) {
      const content = readFileSync(apiKeyPath, "utf8");
      const match = content.match(/([A-Za-z0-9._-]+\.[A-Za-z0-9._-]+)/);

      return match?.[1] ?? null;
    }

    const parentDir = dirname(currentDir);

    if (parentDir === currentDir) {
      return null;
    }

    currentDir = parentDir;
  }
}

export function getGlmApiKey() {
  return process.env.GLM_API_KEY ?? readApiKeyFromLocalFile();
}

export async function requestGlmCompletion(input: ProviderChatInput) {
  const apiKey = getGlmApiKey();

  if (!apiKey) {
    throw new Error("缺少 GLM API Key。");
  }

  const response = await fetch(GLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: input.messages,
      temperature: input.temperature ?? 0.5,
      ...(input.responseFormat ? { response_format: input.responseFormat } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`GLM 请求失败，状态码 ${response.status}。`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("GLM 返回结果中缺少文本内容。");
  }

  return content;
}
