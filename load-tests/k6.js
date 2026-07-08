import http from "k6/http";
import { check, sleep } from "k6";

/** Load test — run: k6 run load-tests/k6.js */
export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
  },
};

const BASE = __ENV.API_URL || "http://localhost:4000";

export default function () {
  const health = http.get(`${BASE}/health`);
  check(health, { "health ok": (r) => r.status === 200 });

  const products = http.get(`${BASE}/api/products?limit=5`);
  check(products, { "products ok": (r) => r.status === 200 });

  sleep(1);
}
