import { describe, it, expect } from "vitest";
import { authHeaders, AUTH_COOKIE } from "./auth";

describe("auth helpers", () => {
  it("exports auth cookie name for Server Actions", () => {
    expect(AUTH_COOKIE).toBe("auth_token");
  });

  it("builds Authorization header when token present", () => {
    expect(authHeaders("jwt-123")).toEqual({ Authorization: "Bearer jwt-123" });
    expect(authHeaders(undefined)).toEqual({});
  });
});
