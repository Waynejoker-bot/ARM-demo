import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";

import Page from "../../../app/page";

describe("root page", () => {
  let tempDir = "";

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "root-page-"));
    process.env.CONVERSATIONAL_OS_DB_PATH = join(tempDir, "conversation.sqlite");
  });

  afterEach(() => {
    delete process.env.CONVERSATIONAL_OS_DB_PATH;
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("renders the conversational homepage entry on the root route", async () => {
    render(await Page());

    expect(screen.getByRole("heading", { name: "会话版 Agent OS" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "王豪 CEO 线程" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "销售主管首页" })).not.toBeInTheDocument();
  });
});
