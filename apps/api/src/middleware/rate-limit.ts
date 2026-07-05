import rateLimit from "express-rate-limit";

/** Real rate limiting — interview: complement scenario-based 429 with production middleware */
export function createRateLimiter(max = 100, windowMs = 60_000) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Too Many Requests",
      message: `Rate limit exceeded — max ${max} requests per ${windowMs / 1000}s`,
    },
    skip: (req) => req.path.startsWith("/api/events") || req.path.startsWith("/api/scenarios"),
  });
}
