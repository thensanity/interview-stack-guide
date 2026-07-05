import type { AppEvent, EventCategory, EventType, ScenarioId } from "./types.js";

type Listener = (event: AppEvent) => void;

/** In-process pub/sub — interview: compare with Redis pub/sub, SNS/SQS, Kafka */
export class EventBus {
  private listeners = new Set<Listener>();
  private history: AppEvent[] = [];
  private maxHistory = 200;

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  publish(partial: Omit<AppEvent, "id" | "timestamp">): AppEvent {
    const event: AppEvent = {
      ...partial,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    this.history.unshift(event);
    if (this.history.length > this.maxHistory) this.history.pop();
    for (const listener of this.listeners) listener(event);
    return event;
  }

  getHistory(limit = 50): AppEvent[] {
    return this.history.slice(0, limit);
  }

  emitDomain(type: Extract<EventType, "PRODUCT_CREATED" | "PRODUCT_UPDATED" | "PRODUCT_DELETED">, message: string, payload?: Record<string, unknown>) {
    return this.publish({ type, category: "domain", message, payload });
  }

  emitOperational(type: Extract<EventType, "API_DEGRADED" | "API_RECOVERED" | "RATE_LIMITED" | "DB_SLOW" | "DB_ERROR" | "DEPLOY_STARTED" | "DEPLOY_COMPLETED" | "TRAFFIC_SPIKE" | "AUTH_REQUIRED" | "MIGRATION_DUAL_WRITE" | "CICD_STAGE">, message: string, payload?: Record<string, unknown>) {
    return this.publish({ type, category: "operational", message, payload });
  }

  emitScenario(scenarioId: ScenarioId, message: string) {
    return this.publish({
      type: "SCENARIO_TRIGGERED",
      category: "scenario",
      message,
      scenarioId,
    });
  }
}

export * from "./types.js";
