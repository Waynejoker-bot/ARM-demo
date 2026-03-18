import SalesTeamPage from "../../../app/sales-team/page";

describe("sales team page", () => {
  it("redirects to the root conversational workspace", () => {
    expect(() => SalesTeamPage()).toThrow("NEXT_REDIRECT");
  });
});
