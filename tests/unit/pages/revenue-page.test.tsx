import RevenuePage from "../../../app/revenue/page";

describe("revenue page", () => {
  it("redirects to the root conversational workspace", () => {
    expect(() => RevenuePage()).toThrow("NEXT_REDIRECT");
  });
});
