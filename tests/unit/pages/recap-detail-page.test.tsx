import { render, screen } from "@testing-library/react";

import RecapDetailPage from "../../../app/recaps/[recapId]/page";

describe("recap detail page", () => {
  it("marks recap summary and coaching sections for mobile reading", async () => {
    render(
      await RecapDetailPage({
        params: Promise.resolve({ recapId: "recap-1" }),
      })
    );

    expect(screen.getByRole("heading", { name: "发生了什么" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "primary"
    );
    expect(screen.getByRole("heading", { name: "发生了什么" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-density",
      "feed"
    );
    expect(screen.getByRole("heading", { name: "本来可以怎么处理" }).closest(".section-card")).toHaveAttribute(
      "data-mobile-priority",
      "secondary"
    );
  });
});
