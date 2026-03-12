import { render, screen } from "@testing-library/react";

import DealsPage from "../../../app/deals/page";

describe("deals page", () => {
  it("exposes the deal list as the primary mobile card stream", () => {
    render(<DealsPage />);

    expect(screen.getByRole("heading", { name: "商机列表" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "商机列表" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "cards"
    );
  });
});
