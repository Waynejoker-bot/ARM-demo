import { render, screen } from "@testing-library/react";

import DataSourcesPage from "../../../app/data-sources/page";

describe("data sources page", () => {
  it("marks source health as the primary mobile card list", () => {
    render(<DataSourcesPage />);

    expect(screen.getByRole("heading", { name: "接入源状态" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "接入源状态" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "cards"
    );
    expect(screen.getByRole("heading", { name: "当前断连影响" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "secondary"
    );
  });
});
