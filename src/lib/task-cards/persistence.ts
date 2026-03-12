import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";

import { applyTaskCardAction, createTaskCardState } from "@/lib/task-cards/selectors";
import type {
  TaskCardActionKind,
  TaskCardActionRequest,
  TaskCardRecord,
  TaskCardState,
} from "@/lib/task-cards/types";

type PersistedTaskCardActionEvent = {
  id: string;
  cardId: string;
  actionKind: TaskCardActionKind;
  actorRole: TaskCardRecord["ownerRole"];
  actorName: string;
  occurredAt: string;
};

type TaskCardFlowRepositoryOptions = {
  dbPath?: string;
};

type PersistedActionRequest = TaskCardActionRequest;

type ActionRow = {
  id: string;
  card_id: string;
  action_kind: string;
  actor_role: string;
  actor_name: string;
  occurred_at: string;
};

const CREATE_EVENTS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS task_card_action_events (
    id TEXT PRIMARY KEY,
    card_id TEXT NOT NULL,
    action_kind TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    occurred_at TEXT NOT NULL,
    UNIQUE(card_id, action_kind)
  )
`;

function resolveDefaultDbPath() {
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return join(tmpdir(), "arm-task-card-flow.test.sqlite");
  }

  return process.env.TASK_CARD_FLOW_DB_PATH ?? join(process.cwd(), ".data", "task-card-flow.sqlite");
}

function ensureDbDirectory(dbPath: string) {
  mkdirSync(dirname(dbPath), { recursive: true });
}

function withDatabase<T>(dbPath: string, run: (db: DatabaseSync) => T) {
  ensureDbDirectory(dbPath);

  const db = new DatabaseSync(dbPath);
  db.exec(CREATE_EVENTS_TABLE_SQL);

  try {
    return run(db);
  } finally {
    db.close();
  }
}

function loadPersistedEvents(dbPath: string): PersistedTaskCardActionEvent[] {
  return withDatabase(dbPath, (db) => {
    const rows = db
      .prepare(
        `
          SELECT id, card_id, action_kind, actor_role, actor_name, occurred_at
          FROM task_card_action_events
          ORDER BY occurred_at ASC, id ASC
        `
      )
      .all() as ActionRow[];

    return rows.map((row) => ({
      id: row.id,
      cardId: row.card_id,
      actionKind: row.action_kind as TaskCardActionKind,
      actorRole: row.actor_role as TaskCardRecord["ownerRole"],
      actorName: row.actor_name,
      occurredAt: row.occurred_at,
    }));
  });
}

function deriveTaskCardState(events: PersistedTaskCardActionEvent[]): TaskCardState {
  return events.reduce((state, event) => {
    return applyTaskCardAction(
      state,
      { cardId: event.cardId, actionKind: event.actionKind },
      {
        occurredAt: event.occurredAt,
        actorRole: event.actorRole,
        actorName: event.actorName,
      }
    );
  }, createTaskCardState());
}

function getActionActor(state: TaskCardState, request: PersistedActionRequest) {
  const card = state.cards.find((candidate) => candidate.id === request.cardId);

  if (!card) {
    throw new Error("找不到对应的任务卡。");
  }

  const action = card.availableActions.find((candidate) => candidate.kind === request.actionKind);

  if (!action) {
    throw new Error("这张任务卡当前不支持该动作。");
  }

  return {
    actorRole: card.ownerRole,
    actorName: card.ownerName,
  };
}

function insertActionEvent(dbPath: string, event: PersistedTaskCardActionEvent) {
  withDatabase(dbPath, (db) => {
    db.prepare(
      `
        INSERT INTO task_card_action_events (
          id,
          card_id,
          action_kind,
          actor_role,
          actor_name,
          occurred_at
        ) VALUES (?, ?, ?, ?, ?, ?)
      `
    ).run(
      event.id,
      event.cardId,
      event.actionKind,
      event.actorRole,
      event.actorName,
      event.occurredAt
    );
  });
}

function findExistingEvent(
  dbPath: string,
  request: PersistedActionRequest
): PersistedTaskCardActionEvent | null {
  return withDatabase(dbPath, (db) => {
    const row = db
      .prepare(
        `
          SELECT id, card_id, action_kind, actor_role, actor_name, occurred_at
          FROM task_card_action_events
          WHERE card_id = ? AND action_kind = ?
          LIMIT 1
        `
      )
      .get(request.cardId, request.actionKind) as ActionRow | undefined;

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      cardId: row.card_id,
      actionKind: row.action_kind as TaskCardActionKind,
      actorRole: row.actor_role as TaskCardRecord["ownerRole"],
      actorName: row.actor_name,
      occurredAt: row.occurred_at,
    };
  });
}

export function createTaskCardFlowRepository(options: TaskCardFlowRepositoryOptions = {}) {
  const dbPath = options.dbPath ?? resolveDefaultDbPath();

  return {
    loadState() {
      return deriveTaskCardState(loadPersistedEvents(dbPath));
    },
    recordAction(request: PersistedActionRequest) {
      const currentState = deriveTaskCardState(loadPersistedEvents(dbPath));
      const existing = findExistingEvent(dbPath, request);

      if (existing) {
        return {
          state: deriveTaskCardState(loadPersistedEvents(dbPath)),
          event: existing,
        };
      }

      const actor = getActionActor(currentState, request);
      const event: PersistedTaskCardActionEvent = {
        id: `task-action-${randomUUID()}`,
        cardId: request.cardId,
        actionKind: request.actionKind,
        actorRole: actor.actorRole,
        actorName: actor.actorName,
        occurredAt: new Date().toISOString(),
      };

      insertActionEvent(dbPath, event);

      return {
        state: deriveTaskCardState(loadPersistedEvents(dbPath)),
        event,
      };
    },
    reset() {
      withDatabase(dbPath, (db) => {
        db.exec("DELETE FROM task_card_action_events");
      });
    },
  };
}

export function loadPersistedTaskCardState(options?: TaskCardFlowRepositoryOptions) {
  return createTaskCardFlowRepository(options).loadState();
}

export function recordPersistedTaskCardAction(
  request: PersistedActionRequest,
  options?: TaskCardFlowRepositoryOptions
) {
  return createTaskCardFlowRepository(options).recordAction(request);
}
