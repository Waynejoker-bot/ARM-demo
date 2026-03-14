import { conversationSeed } from "@/lib/conversational-os/seed";
import type {
  ConversationDelivery,
  ConversationDecisionCard,
  ConversationHandoff,
  ConversationMessage,
  ConversationThread,
  ConversationThreadMember,
} from "@/lib/conversational-os/types";
import type { ConversationThreadState } from "@/lib/conversational-os/persistence";

function cloneSeed() {
  return {
    threads: [...conversationSeed.threads],
    members: [...conversationSeed.members],
    messages: conversationSeed.messages.map((m) => ({ ...m })),
    cards: conversationSeed.cards.map((c) => ({ ...c })),
    handoffs: conversationSeed.handoffs.map((h) => ({ ...h })),
    deliveries: conversationSeed.deliveries.map((d) => ({ ...d })),
    readStates: conversationSeed.readStates.map((r) => ({ ...r })),
  };
}

function getUnreadCount(
  store: ReturnType<typeof cloneSeed>,
  threadId: string
): number {
  const humanMember = store.members.find(
    (m) => m.threadId === threadId && m.role !== "agent"
  );
  const readState = store.readStates.find((r) => r.threadId === threadId);

  if (!humanMember || !readState) return 0;

  const deliveryCount = store.deliveries.filter(
    (d) => d.toThreadId === threadId && d.createdAt > readState.lastReadAt
  ).length;
  const systemCount = store.messages.filter(
    (m) =>
      m.threadId === threadId &&
      m.occurredAt > readState.lastReadAt &&
      m.actorId !== humanMember.actorId &&
      m.kind === "system_handoff"
  ).length;

  return Math.max(deliveryCount, systemCount);
}

export function createInMemoryConversationRepository() {
  let store = cloneSeed();

  return {
    listThreads(): ConversationThread[] {
      const order = ["thread-rep-yang", "thread-manager-liu", "thread-ceo-wang"];
      return [...store.threads].sort(
        (a, b) => (order.indexOf(a.id) ?? 99) - (order.indexOf(b.id) ?? 99)
      );
    },
    listThreadPreviewsWithUnread() {
      return this.listThreads().map((t) => ({
        ...t,
        unreadCount: getUnreadCount(store, t.id),
      }));
    },
    getThreadState(threadId: string): ConversationThreadState {
      const thread = store.threads.find((t) => t.id === threadId);
      if (!thread) throw new Error("Conversation thread not found.");

      return {
        thread,
        members: store.members.filter((m) => m.threadId === threadId) as ConversationThreadMember[],
        messages: store.messages
          .filter((m) => m.threadId === threadId)
          .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt)),
        cards: store.cards
          .filter((c) => c.threadId === threadId)
          .sort((a, b) => b.priorityRank - a.priorityRank) as ConversationDecisionCard[],
        handoffs: store.handoffs.filter(
          (h) => h.fromThreadId === threadId || h.toThreadId === threadId
        ) as ConversationHandoff[],
        deliveries: store.deliveries.filter(
          (d) => d.fromThreadId === threadId || d.toThreadId === threadId
        ),
        unreadCount: getUnreadCount(store, threadId),
      };
    },
    appendMessages(messages: ConversationMessage[]) {
      store.messages.push(...messages);
    },
    upsertCard(card: ConversationDecisionCard) {
      const idx = store.cards.findIndex((c) => c.id === card.id);
      if (idx >= 0) {
        store.cards[idx] = card;
      } else {
        store.cards.push(card);
      }

      const thread = store.threads.find((t) => t.id === card.threadId);
      if (!thread) return;

      const currentPinned = store.cards.find((c) => c.id === thread.pinnedCardId);
      if (!currentPinned || card.priorityRank >= currentPinned.priorityRank) {
        thread.pinnedCardId = card.id;
      }
    },
    recordHandoff(handoff: ConversationHandoff) {
      store.handoffs.push(handoff);
    },
    recordDelivery(delivery: ConversationDelivery) {
      store.deliveries.push(delivery);
    },
    markThreadRead(threadId: string, readAt: string) {
      const existing = store.readStates.find((r) => r.threadId === threadId);
      if (existing) {
        existing.lastReadAt = readAt;
      } else {
        store.readStates.push({ threadId, lastReadAt: readAt });
      }
    },
    resetDemoState() {
      store = cloneSeed();
    },
  };
}
