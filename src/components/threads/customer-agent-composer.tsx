"use client";

import { useState } from "react";

type CustomerAgentComposerProps = {
  accountName: string;
  accountContext: string;
};

export function CustomerAgentComposer({ accountName, accountContext }: CustomerAgentComposerProps) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "agent"; body: string }[]>([]);
  const [isPending, setIsPending] = useState(false);

  const quickPrompts = [
    { label: "现在什么情况？", prompt: `${accountName}现在什么情况？` },
    { label: "我该怎么跟进？", prompt: `我该怎么跟进${accountName}？` },
    { label: "帮我准备会议", prompt: `帮我准备和${accountName}的下次会议` },
  ];

  async function sendMessage(body: string) {
    if (!body.trim() || isPending) return;

    const userMsg = body.trim();
    setMessages((prev) => [...prev, { role: "user", body: userMsg }]);
    setDraft("");
    setIsPending(true);

    try {
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userMsg,
          contextTitle: `客户：${accountName}`,
          contextDescription: accountContext,
          roleHint: "rep",
        }),
      });

      const data = (await response.json()) as { reply?: string; message?: string };

      setMessages((prev) => [
        ...prev,
        { role: "agent", body: data.reply ?? data.message ?? "Agent 暂时无法回复。" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", body: "网络错误，请稍后重试。" },
      ]);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="customer-agent-composer">
      {messages.length > 0 ? (
        <div className="customer-agent-chat-history">
          {messages.map((msg, idx) => (
            <article
              key={idx}
              className={`conversation-message conversation-message-${msg.role === "user" ? "human" : "agent"}`}
            >
              <div className="conversation-message-topline">
                <strong>{msg.role === "user" ? "你" : "Agent 教练"}</strong>
              </div>
              <p>{msg.body}</p>
            </article>
          ))}
          {isPending ? (
            <div className="conversation-inline-status">
              <span>Agent 正在思考…</span>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="customer-agent-quick-prompts">
        {quickPrompts.map((qp) => (
          <button
            key={qp.label}
            type="button"
            className="ghost-button"
            disabled={isPending}
            onClick={() => void sendMessage(qp.prompt)}
          >
            {qp.label}
          </button>
        ))}
      </div>

      <form
        className="conversation-composer"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage(draft);
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`问 Agent 关于 ${accountName} 的任何问题...`}
          rows={3}
        />
        <div className="conversation-composer-actions">
          <button
            type="submit"
            className="primary-button"
            disabled={isPending || !draft.trim()}
          >
            发送
          </button>
        </div>
      </form>
    </div>
  );
}
