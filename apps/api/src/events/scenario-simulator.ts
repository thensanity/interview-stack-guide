import type { Response } from "express";
import { EventBus, SCENARIOS, type ActiveScenario, type ScenarioId } from "@interview/events";

/** Manages active situational scenarios — interview demo for operational incidents */
export class ScenarioSimulator {
  private active = new Map<ScenarioId, ActiveScenario>();
  private timers = new Map<ScenarioId, NodeJS.Timeout>();

  constructor(private bus: EventBus) {}

  list() {
    return SCENARIOS.map((s) => ({
      ...s,
      active: this.active.has(s.id),
      expiresAt: this.active.get(s.id)?.expiresAt ?? null,
    }));
  }

  getActive(): ScenarioId[] {
    return [...this.active.keys()];
  }

  isActive(id: ScenarioId): boolean {
    return id !== "recover" && this.active.has(id);
  }

  trigger(id: ScenarioId): { ok: boolean; message: string } {
    if (id === "recover") {
      this.clearAll();
      this.bus.emitOperational("API_RECOVERED", "All scenarios cleared — system recovered");
      return { ok: true, message: "All scenarios cleared" };
    }

    const def = SCENARIOS.find((s) => s.id === id);
    if (!def) return { ok: false, message: "Unknown scenario" };

    this.activate(id, def.durationMs);
    this.bus.emitScenario(id, `Scenario triggered: ${def.name}`);

    switch (id) {
      case "traffic_spike":
        this.bus.emitOperational("TRAFFIC_SPIKE", "Simulated 10x traffic spike — latency increased");
        break;
      case "rate_limit":
        this.bus.emitOperational("RATE_LIMITED", "Rate limiting active — expect 429 responses");
        break;
      case "db_slow":
        this.bus.emitOperational("DB_SLOW", "Database operations delayed by 2s");
        break;
      case "db_error":
        this.bus.emitOperational("DB_ERROR", "Next database operation will fail");
        break;
      case "api_degraded":
        this.bus.emitOperational("API_DEGRADED", "Health check reporting degraded status");
        break;
      case "deploy_rolling":
        this.bus.emitOperational("DEPLOY_STARTED", "Rolling deployment started");
        setTimeout(() => {
          this.bus.emitOperational("DEPLOY_COMPLETED", "Rolling deployment completed — zero downtime");
        }, 5000);
        break;
      case "auth_required":
        this.bus.emitOperational("AUTH_REQUIRED", "Mutations require authentication — expect 401");
        break;
      case "dual_write_migration":
        this.bus.emitOperational("MIGRATION_DUAL_WRITE", "Dual-write active — writes go to primary + shadow secondary");
        break;
      case "cicd_pipeline":
        this.simulateCicdPipeline();
        break;
    }

    return { ok: true, message: `Scenario '${def.name}' active for ${def.durationMs / 1000}s` };
  }

  private activate(id: ScenarioId, durationMs: number) {
    const existing = this.timers.get(id);
    if (existing) clearTimeout(existing);

    this.active.set(id, { id, expiresAt: Date.now() + durationMs });

    if (durationMs > 0) {
      const timer = setTimeout(() => {
        this.active.delete(id);
        this.timers.delete(id);
        this.bus.emitOperational("API_RECOVERED", `Scenario '${id}' expired — auto-recovered`);
      }, durationMs);
      this.timers.set(id, timer);
    }
  }

  private clearAll() {
    for (const timer of this.timers.values()) clearTimeout(timer);
    this.timers.clear();
    this.active.clear();
  }

  /** One-shot flag — consumed after check */
  consumeDbError(): boolean {
    if (!this.isActive("db_error")) return false;
    this.active.delete("db_error");
    return true;
  }

  getLatencyMs(): number {
    if (this.isActive("traffic_spike")) return 500 + Math.random() * 500;
    if (this.isActive("db_slow")) return 2000;
    return 0;
  }

  async applyLatency(): Promise<void> {
    const ms = this.getLatencyMs();
    if (ms > 0) await new Promise((r) => setTimeout(r, ms));
  }

  isDualWriteActive(): boolean {
    return this.isActive("dual_write_migration");
  }

  private simulateCicdPipeline() {
    const stages = [
      { stage: "lint", delay: 0 },
      { stage: "test", delay: 2000 },
      { stage: "build", delay: 4000 },
      { stage: "deploy", delay: 6000 },
      { stage: "smoke", delay: 8000 },
    ];
    for (const { stage, delay } of stages) {
      setTimeout(() => {
        this.bus.emitOperational("CICD_STAGE", `CI/CD stage: ${stage}`, { stage, status: "passed" });
        if (stage === "deploy") {
          this.bus.emitOperational("DEPLOY_STARTED", "Pipeline deploying to staging");
        }
        if (stage === "smoke") {
          this.bus.emitOperational("DEPLOY_COMPLETED", "Pipeline complete — smoke tests passed");
        }
      }, delay);
    }
  }

  streamSse(res: Response): () => void {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    for (const event of this.bus.getHistory(20).reverse()) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    const unsub = this.bus.subscribe((event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    const heartbeat = setInterval(() => res.write(": heartbeat\n\n"), 15_000);

    return () => {
      unsub();
      clearInterval(heartbeat);
    };
  }
}
