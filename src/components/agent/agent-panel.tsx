"use client";

import { PanelRightClose, PanelRightOpen, SendHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

import type { AgentChatAttachment, AgentChatHistoryItem } from "@/lib/model/types";
import type { AgentPanelContext } from "@/state/agent-panel-store";

type AgentPanelProps = {
  isOpen: boolean;
  context: AgentPanelContext;
  onCollapse: () => void;
  onExpand: () => void;
};

type PanelMessage = AgentChatHistoryItem & {
  id: string;
};

const ATTACHMENT_MIME = "application/x-agent-context";

function safeParseAttachment(raw: string): AgentChatAttachment | null {
  try {
    const parsed = JSON.parse(raw) as AgentChatAttachment;

    if (parsed?.type !== "decision-card" || !parsed.title || !parsed.summary) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function AgentPanel({
  isOpen,
  context,
  onCollapse,
  onExpand,
}: AgentPanelProps) {
  const [messages, setMessages] = useState<PanelMessage[]>([]);
  const [attachments, setAttachments] = useState<AgentChatAttachment[]>([]);
  const [draft, setDraft] = useState("");
  const [agentError, setAgentError] = useState<string | null>(null);
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [isDropActive, setIsDropActive] = useState(false);

  useEffect(() => {
    setMessages([]);
    setAttachments([]);
    setDraft("");
    setAgentError(null);
  }, [context.title, context.description, context.roleHint]);

  const suggestedPrompts = useMemo(
    () => ["缺什么信息？", "下一步做什么？"],
    []
  );

  const taskSummary = context.prompt?.trim() || "围绕当前任务继续追问、补证据或修正判断。";

  function addAttachment(attachment: AgentChatAttachment) {
    setAttachments((current) => {
      if (current.some((item) => item.title === attachment.title)) {
        return current;
      }

      return [...current, attachment];
    });
  }

  function removeAttachment(title: string) {
    setAttachments((current) => current.filter((item) => item.title !== title));
  }

  async function sendMessage() {
    const prompt = draft.trim() || context.prompt?.trim();

    if (!prompt) {
      return;
    }

    try {
      setIsLoadingReply(true);
      setAgentError(null);

      const history = messages.map(({ role, content }) => ({ role, content }));

      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          contextTitle: context.title,
          contextDescription: context.description,
          roleHint: context.roleHint,
          attachments,
          history,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Agent 请求失败。");
      }

      setMessages((current) => [
        ...current,
        {
          id: `user-${Date.now()}`,
          role: "user",
          content: prompt,
        },
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message ?? "Agent 返回了空内容。",
        },
      ]);
      setDraft("");
    } catch (error) {
      setAgentError(error instanceof Error ? error.message : "Agent 出现未知错误。");
    } finally {
      setIsLoadingReply(false);
    }
  }

  function handleDrop(raw: string) {
    const attachment = safeParseAttachment(raw);

    if (attachment) {
      addAttachment(attachment);
    }
  }

  if (!isOpen) {
    return (
      <aside
        className="agent-panel agent-panel-collapsed"
        data-mobile-sheet-state="collapsed"
      >
        <button
          className="panel-toggle-pill"
          type="button"
          aria-label="展开 Agent 面板"
          onClick={onExpand}
        >
          <PanelRightOpen size={18} />
          <span>展开</span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="agent-panel" data-mobile-sheet-state="expanded">
      <div className="mobile-sheet-handle" aria-label="移动端 Agent 抽屉把手" />

      <div className="panel-header panel-header-strong">
        <div>
          <div className="eyebrow">作战对话</div>
          <h2>{context.title}</h2>
        </div>
        <button
          className="panel-toggle-pill"
          onClick={onCollapse}
          type="button"
          aria-label="收起 Agent 面板"
        >
          <PanelRightClose size={18} />
          <span>收起</span>
        </button>
      </div>

      <div className="agent-panel-scroll-region" aria-label="Agent 面板滚动区">
        <div className="agent-task-strip">
          <span className="bubble-label">当前任务</span>
          <p>{taskSummary}</p>
        </div>

        <div className="agent-thread">
          {messages.length === 0 ? (
            <div className="agent-bubble subdued">
              <span className="bubble-label">开始协作</span>
              <p>先输入问题，或把左侧决策卡拖到输入区里，再围绕这项任务持续细聊。</p>
            </div>
          ) : null}

          {messages.map((message) => (
            <div
              key={message.id}
              className={clsx("agent-bubble", message.role === "assistant" && "agent-bubble-assistant")}
            >
              <span className="bubble-label">{message.role === "assistant" ? "Agent" : "你"}</span>
              <p>{message.content}</p>
            </div>
          ))}

          {isLoadingReply ? (
            <div className="agent-bubble subdued">
              <span className="bubble-label">模型处理中</span>
              <p>正在结合当前页面上下文、拖入卡片和你的问题生成回复。</p>
            </div>
          ) : null}

          {agentError ? (
            <div className="agent-bubble subdued">
              <span className="bubble-label">Agent 错误</span>
              <p>{agentError}</p>
            </div>
          ) : null}
        </div>

        <div
          className={clsx("agent-composer", isDropActive && "agent-composer-active")}
          aria-label="Agent 输入区"
          onDragOver={(event) => {
            event.preventDefault();
            setIsDropActive(true);
          }}
          onDragLeave={() => setIsDropActive(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDropActive(false);
            handleDrop(event.dataTransfer.getData(ATTACHMENT_MIME));
          }}
        >
          {attachments.length ? (
            <div className="agent-attachment-strip">
              {attachments.map((attachment) => (
                <div className="agent-attachment-chip" key={attachment.title}>
                  <div>
                    <span className="agent-attachment-label">决策卡</span>
                    <strong>{attachment.title}</strong>
                  </div>
                  <button
                    type="button"
                    className="agent-attachment-remove"
                    aria-label={`移除 ${attachment.title}`}
                    onClick={() => removeAttachment(attachment.title)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          <div className="agent-input-shell">
            <label className="agent-input-wrap" htmlFor="agent-input">
              <span className="sr-only">Agent 输入</span>
              <textarea
                id="agent-input"
                aria-label="Agent 输入"
                className="agent-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="问一个具体问题，或拖入卡片继续细聊"
              />
            </label>
            <button
              className="agent-send-button"
              onClick={sendMessage}
              type="button"
              aria-label="发送给 Agent"
            >
              <SendHorizontal size={16} />
            </button>
          </div>

          <div className="agent-suggestion-row">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="agent-suggestion-chip"
                onClick={() => setDraft(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
