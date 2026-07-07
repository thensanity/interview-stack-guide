import { describe, it, expect, beforeEach } from "vitest";
import { authHeaders, clearAuth, getStoredToken, getStoredUser, storeAuth } from "../lib/auth";

describe("auth storage", () => {
  beforeEach(() => {
    clearAuth();
  });

  it("stores and retrieves token and user", () => {
    storeAuth("test-token", { id: "1", email: "a@test.com", role: "admin" });
    expect(getStoredToken()).toBe("test-token");
    expect(getStoredUser()?.email).toBe("a@test.com");
  });

  it("clears auth on logout", () => {
    storeAuth("t", { id: "1", email: "a@test.com", role: "viewer" });
    clearAuth();
    expect(getStoredToken()).toBeNull();
    expect(getStoredUser()).toBeNull();
  });

  it("builds Authorization header when token present", () => {
    expect(authHeaders("abc")).toEqual({ Authorization: "Bearer abc" });
    expect(authHeaders(null)).toEqual({});
  });
});
