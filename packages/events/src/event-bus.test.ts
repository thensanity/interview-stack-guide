import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { EventBus } from "./event-bus.js";

describe("EventBus", () => {
  it("publishes and stores events", () => {
    const bus = new EventBus();
    const event = bus.emitDomain("PRODUCT_CREATED", "Test product", { id: "1" });
    assert.equal(event.type, "PRODUCT_CREATED");
    assert.equal(bus.getHistory().length, 1);
  });

  it("notifies subscribers", () => {
    const bus = new EventBus();
    let received = 0;
    bus.subscribe(() => { received++; });
    bus.emitOperational("TRAFFIC_SPIKE", "Spike!");
    assert.equal(received, 1);
  });
});
