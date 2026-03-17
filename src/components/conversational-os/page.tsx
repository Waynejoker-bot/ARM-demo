"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import { Badge } from "@/components/shared/ui";
import { ConversationThreadList } from "@/components/conversational-os/thread-list";
import type {
  ConversationThreadDetail,
  ConversationThreadPreview,
} from "@/lib/conversational-os/runtime";
import {
  formatAbsoluteConversationTime,
  formatRelativeConversationTime,
} from "@/lib/conversational-os/time";
import type {
  ConversationDecisionCard,
  ConversationMessage,
  ConversationSourceItem,
} from "@/lib/conversational-os/types";

const MOBILE_LAYOUT_MEDIA_QUERY = "(max-width: 720px)";

type MobileConversationView = "thread_list" | "thread_view" | "detail_view";

function isMobileConversationViewport() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(MOBILE_LAYOUT_MEDIA_QUERY).matches;
}

function findHumanMember(thread: ConversationThreadDetail) {
  return thread.members.find((member) => member.role !== "agent");
}

function messageTone(message: ConversationMessage) {
  if (message.kind === "source_input") return "source";
  if (message.kind === "human") return "human";
  if (message.kind === "system_handoff") return "system";
  if (message.kind === "card_summary") return "card";
  return "agent";
}

function messageLabel(message: ConversationMessage) {
  if (message.kind === "source_input") return "源数据";
  if (message.kind === "system_handoff") return "状态通知";
  if (message.kind === "card_summary") return "卡片摘要";
  return "消息";
}

function sourceItemLabel(kind: ConversationSourceItem["kind"]) {
  if (kind === "meeting_summary") return "会议";
  if (kind === "audio") return "录音";
  if (kind === "screenshot") return "截图";
  return "链接";
}

function formatCardButton(card: ConversationDecisionCard) {
  if (card.primaryActionLabel.includes("上报")) return "上报";
  if (card.primaryActionLabel.includes("升级")) return "升级";
  if (card.primaryAction === "confirm") return "确认";
  if (card.primaryAction === "approve") return "批准";
  if (card.primaryAction === "report_upstream") return "上报";
  return "查看详情";
}

function getDefaultSelectedCardId(thread: ConversationThreadDetail) {
  const latestRelatedCardId = [...thread.messages]
    .reverse()
    .find((message) => message.relatedCardId && thread.cards.some((card) => card.id === message.relatedCardId))
    ?.relatedCardId;

  return latestRelatedCardId ?? thread.cards.at(-1)?.id ?? null;
}

function resolveSelectedCardId(thread: ConversationThreadDetail, currentCardId: string | null) {
  if (currentCardId && thread.cards.some((card) => card.id === currentCardId)) {
    return currentCardId;
  }

  return getDefaultSelectedCardId(thread);
}

export function ConversationalAgentOsPageView({
  initialSelectedThreadId,
  initialThreadPreviews,
  initialThread,
}: {
  initialSelectedThreadId: string;
  initialThreadPreviews: ConversationThreadPreview[];
  initialThread: ConversationThreadDetail;
}) {
  const initialMobileViewport = isMobileConversationViewport();
  const [threadPreviews, setThreadPreviews] = useState(initialThreadPreviews);
  const [selectedThreadId, setSelectedThreadId] = useState(initialSelectedThreadId);
  const [currentThread, setCurrentThread] = useState(initialThread);
  const [draftMessage, setDraftMessage] = useState("");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(getDefaultSelectedCardId(initialThread));
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(initialMobileViewport);
  const [mobileView, setMobileView] = useState<MobileConversationView>(
    initialMobileViewport ? "thread_list" : "thread_view"
  );
  const [actionedCardIds, setActionedCardIds] = useState<Set<string>>(new Set());
  const [pendingAttachments, setPendingAttachments] = useState<{ name: string; kind: ConversationSourceItem["kind"] }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedCard = useMemo(
    () => currentThread.cards.find((card) => card.id === selectedCardId) ?? null,
    [currentThread.cards, selectedCardId]
  );
  const latestThreadMessage = currentThread.messages[currentThread.messages.length - 1] ?? null;

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQueryList = window.matchMedia(MOBILE_LAYOUT_MEDIA_QUERY);
    const updateViewport = (matches: boolean) => {
      setIsMobileViewport(matches);

      if (matches) {
        setMobileView("thread_list");
      }
    };

    updateViewport(mediaQueryList.matches);

    const onChange = (event: MediaQueryListEvent) => {
      updateViewport(event.matches);
    };

    if (typeof mediaQueryList.addEventListener === "function") {
      mediaQueryList.addEventListener("change", onChange);

      return () => mediaQueryList.removeEventListener("change", onChange);
    }

    mediaQueryList.addListener(onChange);
    return () => mediaQueryList.removeListener(onChange);
  }, []);

  async function loadThread(
    threadId: string,
    options?: {
      mobileViewOnSuccess?: MobileConversationView;
    }
  ) {
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
        setSelectedCardId(resolveSelectedCardId(payload, null));
        setIsDetailOpen(false);
        if (options?.mobileViewOnSuccess) {
          setMobileView(options.mobileViewOnSuccess);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "读取线程失败。");
      }
    });
  }

  function inferSourceKind(file: File): ConversationSourceItem["kind"] {
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type.startsWith("image/")) return "screenshot";
    return "meeting_summary";
  }

  function handleFileSelection(files: FileList | null) {
    if (!files || files.length === 0) return;

    const newAttachments = Array.from(files).map((file) => ({
      name: file.name,
      kind: inferSourceKind(file),
    }));

    setPendingAttachments((current) => [...current, ...newAttachments]);
  }

  function removeAttachment(index: number) {
    setPendingAttachments((current) => current.filter((_, i) => i !== index));
  }

  async function submitTextMessage(body: string) {
    const humanMember = findHumanMember(currentThread);
    const hasContent = body.trim() || pendingAttachments.length > 0;

    if (!hasContent || !humanMember) {
      return;
    }

    const attachmentsSnapshot = [...pendingAttachments];
    setPendingAttachments([]);
    setError(null);

    startTransition(async () => {
      try {
        const sourceItems: ConversationSourceItem[] = attachmentsSnapshot.map((att) => ({
          kind: att.kind,
          title: att.name,
        }));

        const response = await fetch("/api/conversational-os/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            threadId: currentThread.thread.id,
            actorId: humanMember.actorId,
            actorName: humanMember.actorName,
            messageType: attachmentsSnapshot.length > 0 ? "source_material" : "text",
            body: body.trim() || `上传了 ${attachmentsSnapshot.length} 份素材`,
            sourceItems: sourceItems.length > 0 ? sourceItems : undefined,
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
        setSelectedCardId((currentCardId) => resolveSelectedCardId(payload.currentThread!, currentCardId));
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
        setSelectedCardId((currentCardId) => resolveSelectedCardId(payload.currentThread!, currentCardId));
        setActionedCardIds((current) => new Set([...current, cardId]));
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
        setIsDetailOpen(false);
        if (isMobileViewport) {
          setMobileView("thread_list");
        }
        await loadThread(payload.defaultThreadId, {
          mobileViewOnSuccess: isMobileViewport ? "thread_list" : undefined,
        });
      } catch (resetError) {
        setError(resetError instanceof Error ? resetError.message : "重置 Demo 失败。");
      }
    });
  }

  function handleThreadSelection(threadId: string) {
    if (threadId === currentThread.thread.id) {
      setSelectedThreadId(threadId);

      if (isMobileViewport) {
        setMobileView("thread_view");
      }

      return;
    }

    void loadThread(threadId, {
      mobileViewOnSuccess: isMobileViewport ? "thread_view" : undefined,
    });
  }

  function openCardDetail(cardId: string) {
    setSelectedCardId(cardId);

    if (isMobileViewport) {
      setMobileView("detail_view");
      return;
    }

    setIsDetailOpen(true);
  }

  const conversationStatus = error ? (
    <div className="conversation-inline-alert">
      <strong>会话处理失败</strong>
      <p>{error}</p>
    </div>
  ) : (
    <div className="conversation-inline-status">
      <span>{isPending ? "Agent 正在处理…" : "最近同步至 SQLite，可刷新后继续。"}</span>
    </div>
  );

  const conversationMessages = (
    <div className="conversation-message-list">
      {currentThread.messages.map((message) => {
        const relatedCard = message.relatedCardId
          ? currentThread.cards.find((card) => card.id === message.relatedCardId) ?? null
          : null;

        return (
          <div
            key={message.id}
            className={`conversation-message-wrapper conversation-message-wrapper-${messageTone(message)}`}
          >
            <div className="conversation-message-topline">
              <strong>{message.actorName}</strong>
              <div className="conversation-message-meta">
                <span>{messageLabel(message)}</span>
                <time
                  className="conversation-message-time"
                  dateTime={message.occurredAt}
                  title={formatAbsoluteConversationTime(message.occurredAt)}
                >
                  {formatRelativeConversationTime(message.occurredAt)}
                </time>
              </div>
            </div>
            <article className={`conversation-message conversation-message-${messageTone(message)}`}>
              <p>{message.body}</p>

            {message.kind === "source_input" && message.sourceItems?.length ? (
              <div className="conversation-source-bundle" aria-label="源数据清单">
                {message.sourceItems.map((item) => (
                  <div key={`${message.id}-${item.kind}-${item.title}`} className="conversation-source-item">
                    <div className="conversation-source-item-topline">
                      <span>{sourceItemLabel(item.kind)}</span>
                      <strong>{item.title}</strong>
                    </div>
                    {item.detail ? <p>{item.detail}</p> : null}
                  </div>
                ))}
              </div>
            ) : null}

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
                      onClick={() => openCardDetail(relatedCard.id)}
                    >
                      查看详情
                    </button>
                    {actionedCardIds.has(relatedCard.id) ? (
                      <Badge tone="success">已确认</Badge>
                    ) : (
                      <button
                        type="button"
                        className="primary-button"
                        disabled={isPending}
                        onClick={() => void submitCardMessage(relatedCard.id)}
                      >
                        {formatCardButton(relatedCard)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
            </article>
          </div>
        );
      })}
    </div>
  );

  const conversationComposer = (
    <form
      className="conversation-composer"
      onSubmit={(event) => {
        event.preventDefault();
        void submitTextMessage(draftMessage);
      }}
    >
      <label className="conversation-composer-label" htmlFor="conversation-message-input">
        继续在当前会话里回复、追问或确认 Agent 的结论。
      </label>

      {pendingAttachments.length > 0 ? (
        <div className="conversation-composer-attachments" aria-label="待发送附件">
          {pendingAttachments.map((att, idx) => (
            <div key={`${att.name}-${idx}`} className="conversation-composer-attachment-chip">
              <span>{sourceItemLabel(att.kind)}</span>
              <strong>{att.name}</strong>
              <button
                type="button"
                className="ghost-button"
                aria-label={`移除 ${att.name}`}
                onClick={() => removeAttachment(idx)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <textarea
        id="conversation-message-input"
        value={draftMessage}
        onChange={(event) => setDraftMessage(event.target.value)}
        placeholder="例如：把这条判断拆成下周动作，并说明为什么要我现在确认。"
        rows={4}
      />
      <div className="conversation-composer-actions">
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          aria-label="选择文件"
          multiple
          accept="audio/*,image/*,.txt,.md,.doc,.docx,.pdf,.eml"
          onChange={(event) => {
            handleFileSelection(event.target.files);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          className="ghost-button"
          onClick={() => fileInputRef.current?.click()}
        >
          上传素材
        </button>
        <span className="conversation-composer-hint">支持文字、录音、截图、邮件、链接等</span>
        <button
          type="submit"
          className="primary-button"
          disabled={isPending || (!draftMessage.trim() && pendingAttachments.length === 0)}
        >
          发送
        </button>
      </div>
    </form>
  );

  const detailPanelContent = selectedCard ? (
    <>
      <div className="conversation-card-detail-topline">
        <span className="conversation-kicker">辅助下钻</span>
        <Badge tone="info">{selectedCard.primaryActionLabel}</Badge>
      </div>
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
    <>
      <div className="conversation-card-detail-topline">
        <span className="conversation-kicker">辅助下钻</span>
      </div>
      <p>当前线程还没有可下钻的卡片详情。</p>
    </>
  );

  if (isMobileViewport) {
    return (
      <div className="conversation-page-shell conversation-page-shell-mobile">
        {mobileView === "thread_list" ? (
          <section className="conversation-mobile-screen conversation-mobile-thread-list">
            <div className="conversation-mobile-topbar">
              <div className="conversation-mobile-title-stack">
                <span className="conversation-kicker">会话列表</span>
              </div>
              <button type="button" className="ghost-button" onClick={resetDemo} disabled={isPending}>
                重置 Demo
              </button>
            </div>

            <ConversationThreadList
              threads={threadPreviews}
              selectedThreadId={selectedThreadId}
              onSelectThread={handleThreadSelection}
            />
          </section>
        ) : null}

        {mobileView === "thread_view" ? (
          <section className="conversation-mobile-screen conversation-mobile-thread-view">
            <div className="conversation-mobile-topbar">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setMobileView("thread_list")}
                aria-label="返回会话列表"
              >
                返回会话列表
              </button>
              <div className="conversation-mobile-title-stack">
                <span className="conversation-kicker">会话中</span>
                <h2>{currentThread.thread.title}</h2>
              </div>
              <Badge tone="info">{findHumanMember(currentThread)?.actorName ?? "Agent"}</Badge>
            </div>

            {conversationStatus}
            {conversationMessages}
            {conversationComposer}
          </section>
        ) : null}

        {mobileView === "detail_view" ? (
          <section className="conversation-mobile-screen conversation-mobile-detail-view">
            <div className="conversation-mobile-topbar">
              <button
                type="button"
                className="ghost-button"
                onClick={() => setMobileView("thread_view")}
                aria-label="返回会话"
              >
                返回会话
              </button>
              <div className="conversation-mobile-title-stack">
                <span className="conversation-kicker">卡片详情</span>
                <h2>{selectedCard?.title ?? "详情"}</h2>
              </div>
            </div>

            <section className="conversation-card-detail conversation-mobile-detail-card">
              {detailPanelContent}
            </section>
          </section>
        ) : null}
      </div>
    );
  }

  return (
    <div className="conversation-page-shell">
      <div className="conversation-layout">
        <ConversationThreadList
          threads={threadPreviews}
          selectedThreadId={selectedThreadId}
          onSelectThread={handleThreadSelection}
        />

        <section className="conversation-main-stage" data-detail-open={isDetailOpen}>
          <section className="conversation-surface">
            <div className="conversation-surface-header">
              <div>
                <span className="conversation-kicker">会话中</span>
                <h2>{currentThread.thread.title}</h2>
              </div>
              <div className="conversation-surface-header-meta">
                <Badge tone="info">{findHumanMember(currentThread)?.actorName ?? "Agent"}</Badge>
                {latestThreadMessage ? (
                  <time
                    className="conversation-thread-time"
                    dateTime={latestThreadMessage.occurredAt}
                    title={formatAbsoluteConversationTime(latestThreadMessage.occurredAt)}
                  >
                    {formatRelativeConversationTime(latestThreadMessage.occurredAt)}
                  </time>
                ) : null}
                <button type="button" className="ghost-button" onClick={resetDemo} disabled={isPending}>
                  重置 Demo
                </button>
              </div>
            </div>

            {conversationStatus}
            {conversationMessages}
            {conversationComposer}
          </section>

          {isDetailOpen ? (
            <section className="conversation-card-detail">
              <div className="conversation-card-detail-actions">
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => setIsDetailOpen(false)}
                >
                  收起详情
                </button>
              </div>
              {detailPanelContent}
            </section>
          ) : null}
        </section>
      </div>
    </div>
  );
}
