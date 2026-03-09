const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const DEFAULT_MODEL = "glm-4-flash";

export function getGlmApiKey() {
  return process.env.GLM_API_KEY ?? null;
}

export async function requestGlmChat(input: {
  prompt: string;
  contextTitle: string;
  contextDescription?: string;
}) {
  const apiKey = getGlmApiKey();

  if (!apiKey) {
    throw new Error("缺少 GLM API Key。");
  }

  const systemPrompt = [
    "你是 AI Sales OS 内部的销售 Agent。",
    "请使用简洁、专业、偏销售运营同事的语气回答。",
    "只基于给定上下文作答。",
    "优先给出直接、可执行、角色感知的建议。",
    "默认使用中文回答。",
  ].join(" ");

  const response = await fetch(GLM_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `上下文标题：${input.contextTitle}\n上下文说明：${
            input.contextDescription ?? "无"
          }\n问题：${input.prompt}`,
        },
      ],
      temperature: 0.5,
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
