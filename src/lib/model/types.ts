export type AgentChatAttachment = {
  type: "decision-card";
  title: string;
  summary: string;
  recommendation?: string;
  signals?: string[];
  sourceLabel?: string;
};

export type AgentChatHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

export type AgentChatRequest = {
  prompt: string;
  contextTitle: string;
  contextDescription?: string;
  roleHint?: "ceo" | "manager" | "rep";
  attachments?: AgentChatAttachment[];
  history?: AgentChatHistoryItem[];
};

export type ModelMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ProviderChatInput = AgentChatRequest & {
  messages: ModelMessage[];
};
