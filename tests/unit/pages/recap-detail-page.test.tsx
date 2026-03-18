import RecapDetailPage from "../../../app/recaps/[recapId]/page";

describe("recap detail page", () => {
  it("redirects to the root conversational workspace", () => {
    expect(() => RecapDetailPage()).toThrow("NEXT_REDIRECT");
  });
});
