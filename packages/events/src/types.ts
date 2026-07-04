/** Domain & situational event types — maps to interview scenarios in docs/interview-guide/scenarios.md */
export type EventCategory = "domain" | "operational" | "scenario";

export type DomainEventType =
  | "PRODUCT_CREATED"
  | "PRODUCT_UPDATED"
  | "PRODUCT_DELETED";

export type OperationalEventType =
  | "API_DEGRADED"
  | "API_RECOVERED"
  | "RATE_LIMITED"
  | "DB_SLOW"
  | "DB_ERROR"
  | "DEPLOY_STARTED"
  | "DEPLOY_COMPLETED"
  | "TRAFFIC_SPIKE"
  | "AUTH_REQUIRED";

export type ScenarioId =
  | "traffic_spike"
  | "rate_limit"
  | "db_slow"
  | "db_error"
  | "api_degraded"
  | "deploy_rolling"
  | "auth_required"
  | "recover";

export type EventType = DomainEventType | OperationalEventType | "SCENARIO_TRIGGERED";

export interface AppEvent {
  id: string;
  type: EventType;
  category: EventCategory;
  message: string;
  payload?: Record<string, unknown>;
  scenarioId?: ScenarioId;
  timestamp: string;
}

export interface ScenarioDefinition {
  id: ScenarioId;
  name: string;
  description: string;
  interviewScenario: string;
  durationMs: number;
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: "traffic_spike",
    name: "Traffic Spike (10x)",
    description: "Simulates sudden load — adds latency and emits spike events",
    interviewScenario: "Scenario 5: How do you handle a traffic spike?",
    durationMs: 30_000,
  },
  {
    id: "rate_limit",
    name: "Rate Limiting",
    description: "Returns 429 Too Many Requests on API calls",
    interviewScenario: "Scenario 5: Rate limiting at Ingress/ALB",
    durationMs: 20_000,
  },
  {
    id: "db_slow",
    name: "Slow Database",
    description: "Adds 2s delay to all DB operations",
    interviewScenario: "Scenario 8: Debugging readiness/startup races",
    durationMs: 25_000,
  },
  {
    id: "db_error",
    name: "Database Error",
    description: "Next DB call fails with 503",
    interviewScenario: "Scenario 10: CAP theorem / availability tradeoffs",
    durationMs: 15_000,
  },
  {
    id: "api_degraded",
    name: "API Degraded",
    description: "Health endpoint reports degraded status",
    interviewScenario: "Scenario 7: Zero-downtime / health checks",
    durationMs: 20_000,
  },
  {
    id: "deploy_rolling",
    name: "Rolling Deploy",
    description: "Emits deploy started/completed events",
    interviewScenario: "Scenario 7: Rolling update with maxUnavailable: 0",
    durationMs: 10_000,
  },
  {
    id: "auth_required",
    name: "Auth Required",
    description: "Returns 401 Unauthorized on mutations",
    interviewScenario: "Scenario 9: How would you add authentication?",
    durationMs: 20_000,
  },
  {
    id: "recover",
    name: "Recover All",
    description: "Clears all active situational scenarios",
    interviewScenario: "Recovery / rollback after incident",
    durationMs: 0,
  },
];

export interface ActiveScenario {
  id: ScenarioId;
  expiresAt: number;
}
