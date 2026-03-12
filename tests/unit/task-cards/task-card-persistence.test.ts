import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { selectTaskCardsForRole } from "@/lib/task-cards/selectors";
import { createTaskCardFlowRepository } from "@/lib/task-cards/persistence";

describe("task card flow persistence", () => {
  function createTempDbPath() {
    const dir = mkdtempSync(join(tmpdir(), "task-card-flow-"));

    return {
      dir,
      dbPath: join(dir, "flow.sqlite"),
    };
  }

  it("returns the seed task state when the database is empty", () => {
    const { dir, dbPath } = createTempDbPath();

    try {
      const repository = createTaskCardFlowRepository({ dbPath });
      const state = repository.loadState();

      expect(selectTaskCardsForRole(state, "rep")[0]?.title).toBe(
        "广州紫菲网络科技有限公司需要 1 周内二访验证试点切口"
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("replays CEO approval from SQLite so the downstream manager card survives a fresh read", () => {
    const { dir, dbPath } = createTempDbPath();

    try {
      const repository = createTaskCardFlowRepository({ dbPath });
      repository.recordAction({ cardId: "ceo-card-2", actionKind: "approve" });

      const reloaded = createTaskCardFlowRepository({ dbPath }).loadState();

      expect(
        selectTaskCardsForRole(reloaded, "manager").some(
          (card) => card.title === "王豪已批准大臣试点报价边界，刘建明需回收客户确认"
        )
      ).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("replays manager revoke from SQLite so the downstream rep card remains revoked after reload", () => {
    const { dir, dbPath } = createTempDbPath();

    try {
      const repository = createTaskCardFlowRepository({ dbPath });
      repository.recordAction({ cardId: "manager-card-2", actionKind: "revoke" });

      const reloaded = createTaskCardFlowRepository({ dbPath }).loadState();
      const revokedCard = reloaded.cards.find((card) => card.id === "rep-card-2");

      expect(revokedCard?.status).toBe("revoked");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
