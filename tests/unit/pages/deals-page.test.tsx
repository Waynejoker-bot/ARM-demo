import DealsPage from "../../../app/deals/page";

describe("deals page", () => {
  it("redirects to the root conversational workspace", () => {
    expect(() => DealsPage()).toThrow("NEXT_REDIRECT");
  });
});
