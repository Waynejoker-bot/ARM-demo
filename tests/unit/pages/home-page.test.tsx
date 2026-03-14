import { vi } from "vitest";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

import { redirect } from "next/navigation";
import HomePage from "../../../app/home/page";

describe("home page", () => {
  it("redirects to the canonical root route", () => {
    HomePage();
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
