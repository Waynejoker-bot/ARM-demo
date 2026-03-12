"use client";

import clsx from "clsx";

import { Badge } from "@/components/shared/ui";
import type { ConversationThreadPreview } from "@/lib/conversational-os/runtime";
import {
  formatAbsoluteConversationTime,
  formatRelativeConversationTime,
} from "@/lib/conversational-os/time";

function roleLabel(role: ConversationThreadPreview["primaryRole"]) {
  if (role === "rep") return "一线销售";
  if (role === "manager") return "销售主管";
  return "CEO";
}

export function ConversationThreadList({
  threads,
  selectedThreadId,
  onSelectThread,
}: {
  threads: ConversationThreadPreview[];
  selectedThreadId: string;
  onSelectThread: (threadId: string) => void;
}) {
  return (
    <aside className="conversation-thread-rail" aria-label="协作线程">
      <div className="conversation-thread-rail-header">
        <span className="conversation-kicker">协作线程</span>
        <strong>秘书与秘书在这里对接</strong>
      </div>

      <div className="conversation-thread-list">
        {threads.map((thread) => (
          <button
            key={thread.id}
            type="button"
            className={clsx(
              "conversation-thread-item",
              thread.id === selectedThreadId && "conversation-thread-item-active"
            )}
            onClick={() => onSelectThread(thread.id)}
          >
            <div className="conversation-thread-item-topline">
              <strong>{thread.title}</strong>
              <div className="conversation-thread-item-meta">
                {thread.unreadCount > 0 ? (
                  <span className="conversation-thread-unread" aria-label={`${thread.unreadCount} 条未读`}>
                    {thread.unreadCount > 9 ? "9+" : thread.unreadCount}
                  </span>
                ) : null}
                <Badge tone={thread.id === selectedThreadId ? "info" : "default"}>
                  {roleLabel(thread.primaryRole)}
                </Badge>
              </div>
            </div>
            <p>{thread.description}</p>
            {thread.pinnedCard ? (
              <div className="conversation-thread-preview">
                <span>当前最重要</span>
                <strong>{thread.pinnedCard.title}</strong>
              </div>
            ) : null}
            {thread.latestMessage ? (
              <div className="conversation-thread-preview conversation-thread-preview-muted">
                <div className="conversation-thread-preview-label">
                  <span>最新消息</span>
                  <time
                    className="conversation-thread-time"
                    dateTime={thread.latestMessage.occurredAt}
                    title={formatAbsoluteConversationTime(thread.latestMessage.occurredAt)}
                  >
                    {formatRelativeConversationTime(thread.latestMessage.occurredAt)}
                  </time>
                </div>
                <p>{thread.latestMessage.body}</p>
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </aside>
  );
}
