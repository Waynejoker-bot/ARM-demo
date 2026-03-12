import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { readApiKeyFromLocalFile } from "@/lib/model/glm-client";

describe("glm client local api key lookup", () => {
  it("walks up from a worktree-style directory to find APIkey.md", () => {
    const rootDir = mkdtempSync(join(tmpdir(), "glm-key-"));
    const worktreeDir = join(rootDir, ".worktrees", "feature");

    mkdirSync(worktreeDir, { recursive: true });
    writeFileSync(join(rootDir, "APIkey.md"), "apikey：\nabc.def", "utf8");

    try {
      expect(readApiKeyFromLocalFile(worktreeDir)).toBe("abc.def");
    } finally {
      rmSync(rootDir, { recursive: true, force: true });
    }
  });
});
