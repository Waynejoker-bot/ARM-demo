import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { render, screen } from "@testing-library/react";

import HomePage from "../../../app/home/page";

describe("home page", () => {
  let tempDir = "";

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), "home-page-"));
    process.env.CONVERSATIONAL_OS_DB_PATH = join(tempDir, "conversation.sqlite");
  });

  afterEach(() => {
    delete process.env.CONVERSATIONAL_OS_DB_PATH;
    rmSync(tempDir, { recursive: true, force: true });
  });

  it("renders the conversational homepage instead of the legacy role dashboard", async () => {
    render(await HomePage({ searchParams: Promise.resolve({}) }));

    expect(screen.getByRole("heading", { name: "会话版 Agent OS" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "王豪 CEO 线程" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "销售主管首页" })).not.toBeInTheDocument();
  });
});
