import type { Request, Response, NextFunction } from "express";
import { createClient, type RedisClientType } from "redis";

export interface CacheService {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  del(pattern: string): Promise<void>;
  isEnabled(): boolean;
}

/** Optional Redis cache — interview: cache-aside pattern for hot reads */
export async function createCacheService(redisUrl?: string): Promise<CacheService> {
  if (!redisUrl) {
    return {
      isEnabled: () => false,
      async get() { return null; },
      async set() {},
      async del() {},
    };
  }

  const client: RedisClientType = createClient({ url: redisUrl });
  await client.connect();

  return {
    isEnabled: () => true,
    get: (key) => client.get(key),
    set: async (key, value, ttl) => { await client.setEx(key, ttl, value); },
    del: async (pattern) => {
      const keys = await client.keys(pattern);
      if (keys.length > 0) await client.del(keys);
    },
  };
}

export function cacheMiddleware(cache: CacheService, ttlSeconds = 30) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!cache.isEnabled() || req.method !== "GET" || !req.path.includes("/products")) {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    const cached = await cache.get(key);
    if (cached) {
      res.setHeader("X-Cache", "HIT");
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      res.setHeader("X-Cache", "MISS");
      void cache.set(key, JSON.stringify(body), ttlSeconds);
      return originalJson(body);
    };
    next();
  };
}

export function invalidateProductCache(cache: CacheService) {
  return async (_req: Request, _res: Response, next: NextFunction) => {
    if (cache.isEnabled()) {
      await cache.del("cache:/api/products*");
    }
    next();
  };
}
