import DataSourcesPage from "../../../app/data-sources/page";

describe("data sources page", () => {
  it("redirects to the root conversational workspace", () => {
    expect(() => DataSourcesPage()).toThrow("NEXT_REDIRECT");
  });
});
