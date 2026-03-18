import MeetingsPage from "../../../app/meetings/page";

describe("meetings page", () => {
  it("redirects to the root conversational workspace", () => {
    expect(() => MeetingsPage()).toThrow("NEXT_REDIRECT");
  });
});
