import { conversationSeed } from "@/lib/conversational-os/seed";
import type {
  ConversationDelivery,
  ConversationDecisionCard,
  ConversationHandoff,
  ConversationMessage,
  ConversationThread,
  ConversationThreadMember,
} from "@/lib/conversational-os/types";

type ConversationRepositoryOptions = {
  dbPath?: string;
};

export type ConversationThreadState = {
  thread: ConversationThread;
  members: ConversationThreadMember[];
  messages: ConversationMessage[];
  cards: ConversationDecisionCard[];
  handoffs: ConversationHandoff[];
  deliveries: ConversationDelivery[];
  unreadCount: number;
};

export type ConversationRepository = {
  listThreads(): ConversationThread[];
  listThreadPreviewsWithUnread(): Array<ConversationThread & { unreadCount: number }>;
  getThreadState(threadId: string): ConversationThreadState;
  appendMessages(messages: ConversationMessage[]): void;
  upsertCard(card: ConversationDecisionCard): void;
  recordHandoff(handoff: ConversationHandoff): void;
  recordDelivery(delivery: ConversationDelivery): void;
  markThreadRead(threadId: string, readAt: string): void;
  resetDemoState(): void;
};

let sqliteAvailable = false;
let DatabaseSyncClass: any = null;
let mkdirSyncFn: typeof import("node:fs").mkdirSync | null = null;
let pathJoin: typeof import("node:path").join | null = null;
let pathDirname: typeof import("node:path").dirname | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  DatabaseSyncClass = require("node:sqlite").DatabaseSync;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const fs = require("node:fs");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("node:path");
  mkdirSyncFn = fs.mkdirSync;
  pathJoin = path.join;
  pathDirname = path.dirname;
  sqliteAvailable = true;
} catch {
  sqliteAvailable = false;
}

const CREATE_THREADS_SQL = `
  CREATE TABLE IF NOT EXISTS conversation_threads (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    thread_type TEXT NOT NULL,
    primary_role TEXT NOT NULL,
    pinned_card_id TEXT NOT NULL
  )
`;

const CREATE_MEMBERS_SQL = `
  CREATE TABLE IF NOT EXISTS conversation_thread_members (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    member_type TEXT NOT NULL,
    role TEXT NOT NULL
  )
`;

const CREATE_MESSAGES_SQL = `
  CREATE TABLE IF NOT EXISTS conversation_messages (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    kind TEXT NOT NULL,
    body TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    visibility TEXT NOT NULL,
    related_card_id TEXT,
    source_items TEXT
  )
`;

const CREATE_CARDS_SQL = `
  CREATE TABLE IF NOT EXISTS conversation_cards (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    detail TEXT NOT NULL,
    trust_note TEXT NOT NULL,
    priority_rank INTEGER NOT NULL,
    primary_action TEXT NOT NULL,
    primary_action_label TEXT NOT NULL,
    created_at TEXT NOT NULL,
    source_meeting_id TEXT,
    source_deal_id TEXT,
    source_agent TEXT NOT NULL DEFAULT 'sales_bp'
  )
`;

const CREATE_HANDOFFS_SQL = `
  CREATE TABLE IF NOT EXISTS conversation_handoffs (
    id TEXT PRIMARY KEY,
    from_thread_id TEXT NOT NULL,
    to_thread_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    detail_visible_to_downstream INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    related_card_id TEXT
  )
`;

const CREATE_DELIVERIES_SQL = `
  CREATE TABLE IF NOT EXISTS conversation_deliveries (
    id TEXT PRIMARY KEY,
    from_thread_id TEXT NOT NULL,
    to_thread_id TEXT NOT NULL,
    delivery_type TEXT NOT NULL,
    summary TEXT NOT NULL,
    created_at TEXT NOT NULL,
    related_card_id TEXT
  )
`;

const CREATE_THREAD_READS_SQL = `
  CREATE TABLE IF NOT EXISTS conversation_thread_reads (
    thread_id TEXT PRIMARY KEY,
    last_read_at TEXT NOT NULL
  )
`;

function resolveDbPath(customPath?: string) {
  if (customPath) return customPath;
  if (process.env.CONVERSATIONAL_OS_DB_PATH) return process.env.CONVERSATIONAL_OS_DB_PATH;

  const base = process.env.NETLIFY ? "/tmp" : pathJoin!(process.cwd(), ".data");
  return pathJoin!(base, "conversational-os.sqlite");
}

function ensureDbDirectory(dbPath: string) {
  mkdirSyncFn!(pathDirname!(dbPath), { recursive: true });
}

function withDatabase<T>(dbPath: string, run: (db: any) => T) {
  ensureDbDirectory(dbPath);

  const db = new DatabaseSyncClass(dbPath);
  db.exec(CREATE_THREADS_SQL);
  db.exec(CREATE_MEMBERS_SQL);
  db.exec(CREATE_MESSAGES_SQL);
  db.exec(CREATE_CARDS_SQL);
  db.exec(CREATE_HANDOFFS_SQL);
  db.exec(CREATE_DELIVERIES_SQL);
  db.exec(CREATE_THREAD_READS_SQL);
  ensureCardCreatedAtColumn(db);
  ensureCardSourceAgentColumn(db);
  ensureMessageSourceItemsColumn(db);
  syncSeedCardCreatedAt(db);

  try {
    return run(db);
  } finally {
    db.close();
  }
}

function ensureCardCreatedAtColumn(db: any) {
  const columns = db.prepare("PRAGMA table_info(conversation_cards)").all() as Array<{
    name: string;
  }>;

  if (columns.some((column) => column.name === "created_at")) {
    return;
  }

  db.exec("ALTER TABLE conversation_cards ADD COLUMN created_at TEXT");
  db.exec("UPDATE conversation_cards SET created_at = COALESCE(created_at, '2026-03-05T00:00:00+08:00')");
}

function syncSeedCardCreatedAt(db: any) {
  const updateStatement = db.prepare(`
    UPDATE conversation_cards
    SET created_at = ?
    WHERE id = ?
      AND (created_at IS NULL OR created_at = '2026-03-05T00:00:00+08:00')
  `);

  for (const card of conversationSeed.cards) {
    updateStatement.run(card.createdAt, card.id);
  }
}

function ensureCardSourceAgentColumn(db: any) {
  const columns = db.prepare("PRAGMA table_info(conversation_cards)").all() as Array<{
    name: string;
  }>;

  if (columns.some((column) => column.name === "source_agent")) {
    return;
  }

  db.exec("ALTER TABLE conversation_cards ADD COLUMN source_agent TEXT NOT NULL DEFAULT 'sales_bp'");
}

function ensureMessageSourceItemsColumn(db: any) {
  const columns = db.prepare("PRAGMA table_info(conversation_messages)").all() as Array<{
    name: string;
  }>;

  if (columns.some((column) => column.name === "source_items")) {
    return;
  }

  db.exec("ALTER TABLE conversation_messages ADD COLUMN source_items TEXT");
}

function bootstrapSeed(db: any) {
  const threadCount = db.prepare("SELECT COUNT(*) as count FROM conversation_threads").get() as {
    count: number;
  };

  if (threadCount.count > 0) {
    return;
  }

  const insertThread = db.prepare(`
    INSERT INTO conversation_threads (id, title, description, thread_type, primary_role, pinned_card_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertMember = db.prepare(`
    INSERT INTO conversation_thread_members (id, thread_id, actor_id, actor_name, member_type, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertMessage = db.prepare(`
    INSERT INTO conversation_messages (id, thread_id, actor_id, actor_name, kind, body, occurred_at, visibility, related_card_id, source_items)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertCard = db.prepare(`
    INSERT INTO conversation_cards (id, thread_id, title, summary, detail, trust_note, priority_rank, primary_action, primary_action_label, created_at, source_meeting_id, source_deal_id, source_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertHandoff = db.prepare(`
    INSERT INTO conversation_handoffs (id, from_thread_id, to_thread_id, summary, detail_visible_to_downstream, created_at, related_card_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertDelivery = db.prepare(`
    INSERT INTO conversation_deliveries (id, from_thread_id, to_thread_id, delivery_type, summary, created_at, related_card_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const insertReadState = db.prepare(`
    INSERT INTO conversation_thread_reads (thread_id, last_read_at)
    VALUES (?, ?)
  `);

  for (const thread of conversationSeed.threads) {
    insertThread.run(
      thread.id,
      thread.title,
      thread.description,
      thread.threadType,
      thread.primaryRole,
      thread.pinnedCardId
    );
  }

  for (const member of conversationSeed.members) {
    insertMember.run(
      member.id,
      member.threadId,
      member.actorId,
      member.actorName,
      member.memberType,
      member.role
    );
  }

  for (const message of conversationSeed.messages) {
    insertMessage.run(
      message.id,
      message.threadId,
      message.actorId,
      message.actorName,
      message.kind,
      message.body,
      message.occurredAt,
      message.visibility,
      message.relatedCardId,
      message.sourceItems ? JSON.stringify(message.sourceItems) : null
    );
  }

  for (const card of conversationSeed.cards) {
    insertCard.run(
      card.id,
      card.threadId,
      card.title,
      card.summary,
      card.detail,
      card.trustNote,
      card.priorityRank,
      card.primaryAction,
      card.primaryActionLabel,
      card.createdAt,
      card.sourceMeetingId,
      card.sourceDealId,
      card.sourceAgent
    );
  }

  for (const handoff of conversationSeed.handoffs) {
    insertHandoff.run(
      handoff.id,
      handoff.fromThreadId,
      handoff.toThreadId,
      handoff.summary,
      handoff.detailVisibleToDownstream ? 1 : 0,
      handoff.createdAt,
      handoff.relatedCardId
    );
  }

  for (const delivery of conversationSeed.deliveries) {
    insertDelivery.run(
      delivery.id,
      delivery.fromThreadId,
      delivery.toThreadId,
      delivery.deliveryType,
      delivery.summary,
      delivery.createdAt,
      delivery.relatedCardId
    );
  }

  for (const readState of conversationSeed.readStates) {
    insertReadState.run(readState.threadId, readState.lastReadAt);
  }
}

function getHumanActorId(db: any, threadId: string) {
  const row = db
    .prepare(
      `
        SELECT actor_id
        FROM conversation_thread_members
        WHERE thread_id = ? AND role != 'agent'
        LIMIT 1
      `
    )
    .get(threadId) as { actor_id: string } | undefined;

  return row?.actor_id ?? null;
}

function getLastReadAt(db: any, threadId: string) {
  const row = db
    .prepare(
      `
        SELECT last_read_at
        FROM conversation_thread_reads
        WHERE thread_id = ?
      `
    )
    .get(threadId) as { last_read_at: string } | undefined;

  return row?.last_read_at ?? null;
}

function getUnreadCount(db: any, threadId: string) {
  const humanActorId = getHumanActorId(db, threadId);
  const lastReadAt = getLastReadAt(db, threadId);

  if (!humanActorId || !lastReadAt) {
    return 0;
  }

  const deliveryRow = db
    .prepare(
      `
        SELECT COUNT(*) as count
        FROM conversation_deliveries
        WHERE to_thread_id = ?
          AND created_at > ?
      `
    )
    .get(threadId, lastReadAt) as { count: number };
  const systemRow = db
    .prepare(
      `
        SELECT COUNT(*) as count
        FROM conversation_messages
        WHERE thread_id = ?
          AND occurred_at > ?
          AND actor_id != ?
          AND kind = 'system_handoff'
      `
    )
    .get(threadId, lastReadAt, humanActorId) as { count: number };

  return Math.max(deliveryRow.count, systemRow.count);
}

export function createConversationRepository(options: ConversationRepositoryOptions = {}): ConversationRepository {
  if (!sqliteAvailable) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createInMemoryConversationRepository } = require("@/lib/conversational-os/persistence-memory");
    return createInMemoryConversationRepository();
  }

  const dbPath = resolveDbPath(options.dbPath);

  function init() {
    withDatabase(dbPath, (db: any) => bootstrapSeed(db));
  }

  init();

  return {
    listThreads() {
      return withDatabase(dbPath, (db) => {
        bootstrapSeed(db);

        return db
          .prepare(
            `
              SELECT id, title, description, thread_type, primary_role, pinned_card_id
              FROM conversation_threads
              ORDER BY CASE id
                WHEN 'thread-rep-yang' THEN 1
                WHEN 'thread-manager-liu' THEN 2
                ELSE 99
              END ASC
            `
          )
          .all()
          .map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            threadType: row.thread_type,
            primaryRole: row.primary_role,
            pinnedCardId: row.pinned_card_id,
          })) as ConversationThread[];
      });
    },
    listThreadPreviewsWithUnread() {
      return withDatabase(dbPath, (db) => {
        bootstrapSeed(db);

        const threads = db
          .prepare(
            `
              SELECT id, title, description, thread_type, primary_role, pinned_card_id
              FROM conversation_threads
              ORDER BY CASE id
                WHEN 'thread-rep-yang' THEN 1
                WHEN 'thread-manager-liu' THEN 2
                ELSE 99
              END ASC
            `
          )
          .all() as any[];

        return threads.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          threadType: row.thread_type,
          primaryRole: row.primary_role,
          pinnedCardId: row.pinned_card_id,
          unreadCount: getUnreadCount(db, row.id),
        }));
      });
    },
    getThreadState(threadId: string): ConversationThreadState {
      return withDatabase(dbPath, (db) => {
        bootstrapSeed(db);

        const threadRow = db
          .prepare(
            `
              SELECT id, title, description, thread_type, primary_role, pinned_card_id
              FROM conversation_threads
              WHERE id = ?
            `
          )
          .get(threadId) as any;

        if (!threadRow) {
          throw new Error("Conversation thread not found.");
        }

        const members = db
          .prepare(
            `
              SELECT id, thread_id, actor_id, actor_name, member_type, role
              FROM conversation_thread_members
              WHERE thread_id = ?
              ORDER BY id ASC
            `
          )
          .all(threadId)
          .map((row: any) => ({
            id: row.id,
            threadId: row.thread_id,
            actorId: row.actor_id,
            actorName: row.actor_name,
            memberType: row.member_type,
            role: row.role,
          })) as ConversationThreadMember[];

        const messages = db
          .prepare(
            `
              SELECT id, thread_id, actor_id, actor_name, kind, body, occurred_at, visibility, related_card_id, source_items
              FROM conversation_messages
              WHERE thread_id = ?
              ORDER BY occurred_at ASC, id ASC
            `
          )
          .all(threadId)
          .map((row: any) => ({
            id: row.id,
            threadId: row.thread_id,
            actorId: row.actor_id,
            actorName: row.actor_name,
            kind: row.kind,
            body: row.body,
            occurredAt: row.occurred_at,
            visibility: row.visibility,
            relatedCardId: row.related_card_id,
            sourceItems: row.source_items ? JSON.parse(row.source_items) : undefined,
          })) as ConversationMessage[];

        const cards = db
          .prepare(
            `
              SELECT id, thread_id, title, summary, detail, trust_note, priority_rank, primary_action, primary_action_label, created_at, source_meeting_id, source_deal_id, source_agent
              FROM conversation_cards
              WHERE thread_id = ?
              ORDER BY priority_rank DESC, id ASC
            `
          )
          .all(threadId)
          .map((row: any) => ({
            id: row.id,
            threadId: row.thread_id,
            title: row.title,
            summary: row.summary,
            detail: row.detail,
            trustNote: row.trust_note,
            priorityRank: row.priority_rank,
            primaryAction: row.primary_action,
            primaryActionLabel: row.primary_action_label,
            createdAt: row.created_at,
            sourceMeetingId: row.source_meeting_id,
            sourceDealId: row.source_deal_id,
            sourceAgent: row.source_agent ?? "sales_bp",
          })) as ConversationDecisionCard[];

        const handoffs = db
          .prepare(
            `
              SELECT id, from_thread_id, to_thread_id, summary, detail_visible_to_downstream, created_at, related_card_id
              FROM conversation_handoffs
              WHERE from_thread_id = ? OR to_thread_id = ?
              ORDER BY created_at ASC, id ASC
            `
          )
          .all(threadId, threadId)
          .map((row: any) => ({
            id: row.id,
            fromThreadId: row.from_thread_id,
            toThreadId: row.to_thread_id,
            summary: row.summary,
            detailVisibleToDownstream: Boolean(row.detail_visible_to_downstream),
            createdAt: row.created_at,
            relatedCardId: row.related_card_id,
          })) as ConversationHandoff[];

        const deliveries = db
          .prepare(
            `
              SELECT id, from_thread_id, to_thread_id, delivery_type, summary, created_at, related_card_id
              FROM conversation_deliveries
              WHERE from_thread_id = ? OR to_thread_id = ?
              ORDER BY created_at ASC, id ASC
            `
          )
          .all(threadId, threadId)
          .map((row: any) => ({
            id: row.id,
            fromThreadId: row.from_thread_id,
            toThreadId: row.to_thread_id,
            deliveryType: row.delivery_type,
            summary: row.summary,
            createdAt: row.created_at,
            relatedCardId: row.related_card_id,
          })) as ConversationDelivery[];

        return {
          thread: {
            id: threadRow.id,
            title: threadRow.title,
            description: threadRow.description,
            threadType: threadRow.thread_type,
            primaryRole: threadRow.primary_role,
            pinnedCardId: threadRow.pinned_card_id,
          },
          members,
          messages,
          cards,
          handoffs,
          deliveries,
          unreadCount: getUnreadCount(db, threadId),
        };
      });
    },
    appendMessages(messages: ConversationMessage[]) {
      withDatabase(dbPath, (db) => {
        bootstrapSeed(db);
        const statement = db.prepare(`
          INSERT OR REPLACE INTO conversation_messages (
            id, thread_id, actor_id, actor_name, kind, body, occurred_at, visibility, related_card_id, source_items
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const message of messages) {
          statement.run(
            message.id,
            message.threadId,
            message.actorId,
            message.actorName,
            message.kind,
            message.body,
            message.occurredAt,
            message.visibility,
            message.relatedCardId,
            message.sourceItems ? JSON.stringify(message.sourceItems) : null
          );
        }
      });
    },
    upsertCard(card: ConversationDecisionCard) {
      withDatabase(dbPath, (db) => {
        bootstrapSeed(db);
        db.prepare(
          `
            INSERT OR REPLACE INTO conversation_cards (
              id, thread_id, title, summary, detail, trust_note, priority_rank, primary_action, primary_action_label, created_at, source_meeting_id, source_deal_id, source_agent
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `
        ).run(
          card.id,
          card.threadId,
          card.title,
          card.summary,
          card.detail,
          card.trustNote,
          card.priorityRank,
          card.primaryAction,
          card.primaryActionLabel,
          card.createdAt,
          card.sourceMeetingId,
          card.sourceDealId,
          card.sourceAgent
        );

        const currentPinnedRow = db
          .prepare("SELECT pinned_card_id FROM conversation_threads WHERE id = ?")
          .get(card.threadId) as { pinned_card_id: string } | undefined;

        if (!currentPinnedRow) {
          return;
        }

        const currentPinnedCard = db
          .prepare("SELECT priority_rank FROM conversation_cards WHERE id = ?")
          .get(currentPinnedRow.pinned_card_id) as { priority_rank: number } | undefined;

        if (!currentPinnedCard || card.priorityRank >= currentPinnedCard.priority_rank) {
          db.prepare("UPDATE conversation_threads SET pinned_card_id = ? WHERE id = ?").run(card.id, card.threadId);
        }
      });
    },
    recordHandoff(handoff: ConversationHandoff) {
      withDatabase(dbPath, (db) => {
        bootstrapSeed(db);
        db.prepare(
          `
            INSERT OR REPLACE INTO conversation_handoffs (
              id, from_thread_id, to_thread_id, summary, detail_visible_to_downstream, created_at, related_card_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `
        ).run(
          handoff.id,
          handoff.fromThreadId,
          handoff.toThreadId,
          handoff.summary,
          handoff.detailVisibleToDownstream ? 1 : 0,
          handoff.createdAt,
          handoff.relatedCardId
        );
      });
    },
    recordDelivery(delivery: ConversationDelivery) {
      withDatabase(dbPath, (db) => {
        bootstrapSeed(db);
        db.prepare(
          `
            INSERT OR REPLACE INTO conversation_deliveries (
              id, from_thread_id, to_thread_id, delivery_type, summary, created_at, related_card_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `
        ).run(
          delivery.id,
          delivery.fromThreadId,
          delivery.toThreadId,
          delivery.deliveryType,
          delivery.summary,
          delivery.createdAt,
          delivery.relatedCardId
        );
      });
    },
    markThreadRead(threadId: string, readAt: string) {
      withDatabase(dbPath, (db) => {
        bootstrapSeed(db);
        db.prepare(
          `
            INSERT OR REPLACE INTO conversation_thread_reads (thread_id, last_read_at)
            VALUES (?, ?)
          `
        ).run(threadId, readAt);
      });
    },
    resetDemoState() {
      withDatabase(dbPath, (db) => {
        db.exec("DELETE FROM conversation_thread_reads");
        db.exec("DELETE FROM conversation_deliveries");
        db.exec("DELETE FROM conversation_handoffs");
        db.exec("DELETE FROM conversation_messages");
        db.exec("DELETE FROM conversation_cards");
        db.exec("DELETE FROM conversation_thread_members");
        db.exec("DELETE FROM conversation_threads");
        bootstrapSeed(db);
      });
    },
  };
}
