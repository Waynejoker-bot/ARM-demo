import { render, screen } from "@testing-library/react";

import SalesTeamPage from "../../../app/sales-team/page";

describe("sales team page", () => {
  it("renders the sales team route as a reporting layer instead of a scorecard table", () => {
    render(<SalesTeamPage />);

    expect(screen.getByRole("heading", { name: "销售团队" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Rep Weekly Snapshot" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "重点介入对象" })).toBeVisible();
    expect(screen.getByRole("link", { name: /林书瑶/i })).toHaveAttribute(
      "href",
      "/sales-team/rep-2"
    );
    expect(screen.getByText(/林书瑶 本周推进 3 个客户/i)).toBeVisible();
  });

  it("keeps the sales team summaries stacked for mobile review", () => {
    render(<SalesTeamPage />);

    expect(screen.getByRole("heading", { name: "Rep Weekly Snapshot" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "Rep Weekly Snapshot" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "重点介入对象" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
  });
});
