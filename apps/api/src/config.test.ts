import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadConfig } from "./config.js";

describe("loadConfig", () => {
  it("defaults to mongodb provider", () => {
    const config = loadConfig();
    assert.equal(config.db.provider, "mongodb");
    assert.equal(config.port, 4000);
  });

  it("reads DATA_PROVIDER from env", () => {
    const original = process.env.DATA_PROVIDER;
    process.env.DATA_PROVIDER = "dynamodb";
    const config = loadConfig();
    assert.equal(config.db.provider, "dynamodb");
    process.env.DATA_PROVIDER = original;
  });
});
