import { render, screen } from "@testing-library/react";

import Page from "../../../app/page";

describe("root page", () => {
  it("renders the manager home workspace instead of redirecting in development", async () => {
    render(await Page());

    expect(
      screen.getByRole("heading", { name: "销售主管首页" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "真实线下实录" })).toBeVisible();
  });
});
