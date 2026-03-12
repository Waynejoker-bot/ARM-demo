"use client";

import { useMemo, useState, useTransition } from "react";

import { Badge, PageHeader } from "@/components/shared/ui";
import { PinnedPriorityCard } from "@/components/conversational-os/pinned-priority";
import { ConversationThreadList } from "@/components/conversational-os/thread-list";
import type {
  ConversationThreadDetail,
  ConversationThreadPreview,
} from "@/lib/conversational-os/runtime";
import {
  formatAbsoluteConversationTime,
  formatRelativeConversationTime,
} from "@/lib/conversational-os/time";
import type { ConversationDecisionCard, ConversationMessage } from "@/lib/conversational-os/types";

function findHumanMember(thread: ConversationThreadDetail) {
  return thread.members.find((member) => member.role !== "agent");
}

function messageTone(message: ConversationMessage) {
  if (message.kind === "human") return "human";
  if (message.kind === "system_handoff") return "system";
  if (message.kind === "card_summary") return "card";
  return "agent";
}

function formatCardButton(card: ConversationDecisionCard) {
  if (card.primaryActionLabel.includes("上报")) return "上报";
  if (card.primaryActionLabel.includes("升级")) return "升级";
  if (card.primaryAction === "confirm") return "确认";
  if (card.primaryAction === "approve") return "批准";
  if (card.primaryAction === "report_upstream") return "上报";
  return "查看详情";
}

export function ConversationalAgentOsPageView({
  initialDefaultThreadId,
  initialThreadPreviews,
  initialThread,
}: {
  initialDefaultThreadId: string;
  initialThreadPreviews: ConversationThreadPreview[];
  initialThread: ConversationThreadDetail;
}) {
  const [threadPreviews, setThreadPreviews] = useState(initialThreadPreviews);
  const [selectedThreadId, setSelectedThreadId] = useState(initialDefaultThreadId);
  const [currentThread, setCurrentThread] = useState(initialThread);
  const [draftMessage, setDraftMessage] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(initialThread.pinnedCard?.id ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedCard = useMemo(
    () =>
      currentThread.cards.find((card) => card.id === selectedCardId) ??
      currentThread.pinnedCard ??
      null,
    [currentThread.cards, currentThread.pinnedCard, selectedCardId]
  );

  async function loadThread(threadId: string) {
    setError(null);
    setSelectedThreadId(threadId);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/conversational-os/threads/${threadId}`);
        const payload = (await response.json()) as ConversationThreadDetail & {
          message?: string;
          threadPreviews?: ConversationThreadPreview[];
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "读取线程失败。");
        }

        setCurrentThread(payload);
        if (payload.threadPreviews) {
          setThreadPreviews(payload.threadPreviews);
        }
        setSelectedCardId(payload.pinnedCard?.id ?? null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "读取线程失败。");
      }
    });
  }

  async function submitTextMessage(body: string) {
    const humanMember = findHumanMember(currentThread);

    if (!body.trim() || !humanMember) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/conversational-os/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            threadId: currentThread.thread.id,
            actorId: humanMember.actorId,
            actorName: humanMember.actorName,
            messageType: "text",
            body: body.trim(),
          }),
        });
        const payload = (await response.json()) as {
          message?: string;
          currentThread?: ConversationThreadDetail;
          threadPreviews?: ConversationThreadPreview[];
        };

        if (!response.ok || !payload.currentThread || !payload.threadPreviews) {
          throw new Error(payload.message ?? "发送消息失败。");
        }

        setCurrentThread(payload.currentThread);
        setThreadPreviews(payload.threadPreviews);
        setSelectedCardId(payload.currentThread.pinnedCard?.id ?? null);
        setDraftMessage("");
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "发送消息失败。");
      }
    });
  }

  async function submitCardMessage(cardId: string) {
    const humanMember = findHumanMember(currentThread);

    if (!humanMember) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/conversational-os/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            threadId: currentThread.thread.id,
            actorId: humanMember.actorId,
            actorName: humanMember.actorName,
            messageType: "card",
            cardId,
          }),
        });
        const payload = (await response.json()) as {
          message?: string;
          currentThread?: ConversationThreadDetail;
          threadPreviews?: ConversationThreadPreview[];
        };

        if (!response.ok || !payload.currentThread || !payload.threadPreviews) {
          throw new Error(payload.message ?? "发送卡片失败。");
        }

        setCurrentThread(payload.currentThread);
        setThreadPreviews(payload.threadPreviews);
        setSelectedCardId(payload.currentThread.pinnedCard?.id ?? null);
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "发送卡片失败。");
      }
    });
  }

  async function resetDemo() {
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/conversational-os/reset", {
          method: "POST",
        });
        const payload = (await response.json()) as {
          ok?: boolean;
          message?: string;
          defaultThreadId?: string;
          threadPreviews?: ConversationThreadPreview[];
        };

        if (!response.ok || !payload.ok || !payload.defaultThreadId || !payload.threadPreviews) {
          throw new Error(payload.message ?? "重置 Demo 失败。");
        }

        setThreadPreviews(payload.threadPreviews);
        setSelectedThreadId(payload.defaultThreadId);
        await loadThread(payload.defaultThreadId);
      } catch (resetError) {
        setError(resetError instanceof Error ? resetError.message : "重置 Demo 失败。");
      }
    });
  }

  return (
    <div className="conversation-page-shell">
      <PageHeader
        title="会话版 Agent OS"
        description="把卡片当作消息，把 Agent 当作秘书，让组织协作过程真实可见但按权限收束。"
        supportingCopy="每个线程顶部都固定保留当前最重要的任务卡，避免产品退化成纯聊天工具。"
        action={
          <div className="button-row">
            <button type="button" className="ghost-button" onClick={resetDemo} disabled={isPending}>
              重置 Demo
            </button>
          </div>
        }
      />

      <div className="conversation-layout">
        <ConversationThreadList
          threads={threadPreviews}
          selectedThreadId={selectedThreadId}
          onSelectThread={loadThread}
        />

        <section className="conversation-main-stage">
          <PinnedPriorityCard
            card={currentThread.pinnedCard}
            onOpenDetail={(cardId) => setSelectedCardId(cardId)}
          />

          <section className="conversation-surface">
            <div className="conversation-surface-header">
              <div>
                <span className="conversation-kicker">当前线程</span>
                <h2>{currentThread.thread.title}</h2>
              </div>
              <Badge tone="info">{findHumanMember(currentThread)?.actorName ?? "Agent"}</Badge>
            </div>

            {error ? (
              <div className="conversation-inline-alert">
                <strong>会话处理失败</strong>
                <p>{error}</p>
              </div>
            ) : (
              <div className="conversation-inline-status">
                <span>{isPending ? "Agent 正在处理…" : "当前消息和卡片都写入 SQLite，可刷新后继续。"}</span>
              </div>
            )}

            <div className="conversation-message-list">
              {currentThread.messages.map((message) => {
                const relatedCard = message.relatedCardId
                  ? currentThread.cards.find((card) => card.id === message.relatedCardId) ?? null
                  : null;

                return (
                  <article
                    key={message.id}
                    className={`conversation-message conversation-message-${messageTone(message)}`}
                  >
                    <div className="conversation-message-topline">
                      <strong>{message.actorName}</strong>
                      <div className="conversation-message-meta">
                        <span>{message.kind === "system_handoff" ? "状态通知" : "消息"}</span>
                        <time
                          className="conversation-message-time"
                          dateTime={message.occurredAt}
                          title={formatAbsoluteConversationTime(message.occurredAt)}
                        >
                          {formatRelativeConversationTime(message.occurredAt)}
                        </time>
                      </div>
                    </div>
                    <p>{message.body}</p>

                    {relatedCard ? (
                      <div className="conversation-inline-card">
                        <div className="conversation-inline-card-topline">
                          <span>卡片摘要</span>
                          <Badge tone="info">{relatedCard.primaryActionLabel}</Badge>
                        </div>
                        <strong>{relatedCard.title}</strong>
                        <p>{relatedCard.summary}</p>
                        <div className="conversation-inline-card-footer">
                          <div className="conversation-inline-card-meta">
                            <span>{relatedCard.trustNote}</span>
                            <time
                              className="conversation-inline-card-time"
                              dateTime={relatedCard.createdAt}
                              title={formatAbsoluteConversationTime(relatedCard.createdAt)}
                            >
                              到达 {formatRelativeConversationTime(relatedCard.createdAt)}
                            </time>
                          </div>
                          <div className="button-row">
                            <button
                              type="button"
                              className="ghost-button"
                              onClick={() => setSelectedCardId(relatedCard.id)}
                            >
                              查看详情
                            </button>
                            <button
                              type="button"
                              className="primary-button"
                              disabled={isPending}
                              onClick={() => void submitCardMessage(relatedCard.id)}
                            >
                              {formatCardButton(relatedCard)}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <form
              className="conversation-composer"
              onSubmit={(event) => {
                event.preventDefault();
                void submitTextMessage(draftMessage);
              }}
            >
              <label className="conversation-composer-label" htmlFor="conversation-message-input">
                直接和当前 Agent 说清楚你的下一步，或把当前卡片确认后继续处理。
              </label>
              <textarea
                id="conversation-message-input"
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                placeholder="例如：我已经把二访时间定下来了，请帮我整理成上报摘要。"
                rows={4}
              />
              <div className="conversation-composer-actions">
                {selectedCard ? (
                  <button
                    type="button"
                    className="ghost-button"
                    disabled={isPending}
                    onClick={() => void submitCardMessage(selectedCard.id)}
                  >
                    发送当前卡片
                  </button>
                ) : null}
                <button type="submit" className="primary-button" disabled={isPending || !draftMessage.trim()}>
                  发送
                </button>
              </div>
            </form>
          </section>

          <section className="conversation-card-detail">
            <div className="conversation-card-detail-topline">
              <span className="conversation-kicker">卡片详情</span>
              {selectedCard ? <Badge tone="info">{selectedCard.primaryActionLabel}</Badge> : null}
            </div>
            {selectedCard ? (
              <>
                <h3>{selectedCard.title}</h3>
                <p>{selectedCard.detail}</p>
                <div className="conversation-card-detail-grid">
                  <div>
                    <span>信任信息</span>
                    <strong>{selectedCard.trustNote}</strong>
                  </div>
                  <div>
                    <span>到达时间</span>
                    <strong>{formatAbsoluteConversationTime(selectedCard.createdAt)}</strong>
                  </div>
                  <div>
                    <span>来源下钻</span>
                    <div className="button-row">
                      {selectedCard.sourceMeetingId ? (
                        <a className="ghost-button" href={`/meetings/${selectedCard.sourceMeetingId}`}>
                          查看会议
                        </a>
                      ) : null}
                      {selectedCard.sourceDealId ? (
                        <a className="ghost-button" href={`/deals/${selectedCard.sourceDealId}`}>
                          查看商机
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p>当前线程还没有可下钻的卡片详情。</p>
            )}
          </section>
        </section>
      </div>
    </div>
  );
}
