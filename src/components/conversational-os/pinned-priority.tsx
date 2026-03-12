"use client";

import { Badge } from "@/components/shared/ui";
import type { ConversationDecisionCard } from "@/lib/conversational-os/types";

export function PinnedPriorityCard({
  card,
  onOpenDetail,
}: {
  card: ConversationDecisionCard | null;
  onOpenDetail: (cardId: string) => void;
}) {
  if (!card) {
    return (
      <section className="conversation-priority-card">
        <span className="conversation-kicker">当前最重要</span>
        <strong>当前线程还没有可执行的任务卡。</strong>
      </section>
    );
  }

  return (
    <section className="conversation-priority-card" aria-label={`当前最重要：${card.title}`}>
      <div className="conversation-priority-topline">
        <span className="conversation-kicker">当前最重要</span>
        <Badge tone="info">{card.primaryActionLabel}</Badge>
      </div>
      <h2>{card.title}</h2>
      <p>{card.summary}</p>
      <div className="conversation-priority-meta">
        <div>
          <span>为什么是它</span>
          <strong>{card.trustNote}</strong>
        </div>
        <div>
          <span>下一步</span>
          <strong>{card.primaryActionLabel}</strong>
        </div>
      </div>
      <div className="button-row">
        <button type="button" className="primary-button" onClick={() => onOpenDetail(card.id)}>
          查看详情
        </button>
      </div>
    </section>
  );
}
