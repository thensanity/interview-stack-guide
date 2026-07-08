/** In-process job queue — interview: async work off the request path (production: Bull/SQS) */
export interface Job<T = unknown> {
  id: string;
  type: string;
  payload: T;
  createdAt: string;
  status: "pending" | "completed" | "failed";
}

type Handler = (payload: unknown) => Promise<void>;

export class JobQueue {
  private handlers = new Map<string, Handler>();
  private jobs: Job[] = [];

  register(type: string, handler: Handler) {
    this.handlers.set(type, handler);
  }

  async enqueue<T>(type: string, payload: T): Promise<Job<T>> {
    const job: Job<T> = {
      id: crypto.randomUUID(),
      type,
      payload,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    this.jobs.unshift(job);
    if (this.jobs.length > 100) this.jobs.pop();

    const handler = this.handlers.get(type);
    if (handler) {
      handler(payload)
        .then(() => { job.status = "completed"; })
        .catch(() => { job.status = "failed"; });
    }

    return job;
  }

  list(limit = 20): Job[] {
    return this.jobs.slice(0, limit);
  }
}

export const jobQueue = new JobQueue();

jobQueue.register("PRODUCT_INDEX", async (payload) => {
  console.log(JSON.stringify({ level: "info", job: "PRODUCT_INDEX", payload }));
});
