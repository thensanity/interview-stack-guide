/** Transactional outbox pattern — interview: reliable event publishing */
export interface OutboxMessage {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
  published: boolean;
}

const outbox: OutboxMessage[] = [];

export function appendOutbox(
  aggregateType: string,
  aggregateId: string,
  eventType: string,
  payload: Record<string, unknown>
): OutboxMessage {
  const msg: OutboxMessage = {
    id: crypto.randomUUID(),
    aggregateType,
    aggregateId,
    eventType,
    payload,
    createdAt: new Date().toISOString(),
    published: false,
  };
  outbox.unshift(msg);
  return msg;
}

export function getPendingOutbox(limit = 50): OutboxMessage[] {
  return outbox.filter((m) => !m.published).slice(0, limit);
}

export function markPublished(id: string): void {
  const msg = outbox.find((m) => m.id === id);
  if (msg) msg.published = true;
}

/** Simulated outbox relay — production would poll and publish to Kafka/SNS */
export function relayOutbox(publish: (msg: OutboxMessage) => void): number {
  let count = 0;
  for (const msg of getPendingOutbox()) {
    publish(msg);
    markPublished(msg.id);
    count++;
  }
  return count;
}
