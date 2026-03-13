"use client";

import clsx from "clsx";

import { Badge } from "@/components/shared/ui";
import type { ConversationThreadPreview } from "@/lib/conversational-os/runtime";
import {
  getThreadRoleLabel,
  groupThreadPreviewsByRole,
} from "@/lib/conversational-os/thread-previews";
import {
  formatAbsoluteConversationTime,
  formatRelativeConversationTime,
} from "@/lib/conversational-os/time";

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
        <span className="conversation-kicker">会话列表</span>
        <strong>按角色查看</strong>
      </div>

      <div className="conversation-thread-group-list">
        {groupThreadPreviewsByRole(threads).map((group) => (
          <section key={group.role} className="conversation-thread-group">
            <h3 className="conversation-thread-group-title">{group.label}</h3>
            <div className="conversation-thread-list">
              {group.threads.map((thread) => (
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
                    <div className="conversation-thread-item-title-stack">
                      <strong>{thread.title}</strong>
                    </div>
                    <div className="conversation-thread-item-meta">
                      {thread.unreadCount > 0 ? (
                        <span className="conversation-thread-unread" aria-label={`${thread.unreadCount} 条未读`}>
                          {thread.unreadCount > 9 ? "9+" : thread.unreadCount}
                        </span>
                      ) : null}
                      <Badge tone={thread.id === selectedThreadId ? "info" : "default"}>
                        {getThreadRoleLabel(thread.primaryRole)}
                      </Badge>
                    </div>
                  </div>
                  {thread.latestMessage ? (
                    <div className="conversation-thread-preview conversation-thread-preview-muted">
                      <div className="conversation-thread-preview-label">
                        <span>最近消息</span>
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
          </section>
        ))}
      </div>
    </aside>
  );
}
