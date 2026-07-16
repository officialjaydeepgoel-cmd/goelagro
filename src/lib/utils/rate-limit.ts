import { Redis } from "ioredis";

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : null;

export async function rateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  if (!redis) {
    return { allowed: true, remaining: maxRequests, resetIn: 0 };
  }

  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, now - windowMs);
  multi.zadd(key, now, `${now}-${Math.random()}`);
  multi.zcard(key);
  multi.expire(key, windowSeconds);
  multi.pttl(key);

  const results = await multi.exec();
  const requestCount = (results?.[2]?.[1] as number) || 0;
  const ttl = (results?.[4]?.[1] as number) || 0;

  return {
    allowed: requestCount <= maxRequests,
    remaining: Math.max(0, maxRequests - requestCount),
    resetIn: Math.ceil(ttl / 1000),
  };
}
