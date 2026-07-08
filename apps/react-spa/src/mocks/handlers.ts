import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";

const handlers = [
  http.get("/health", () =>
    HttpResponse.json({ status: "ok", provider: "msw", deployTarget: "mock" })
  ),
  http.get("/api/products", () =>
    HttpResponse.json({
      data: [
        {
          id: "msw-1",
          name: "MSW Mock Product",
          description: "Returned by Mock Service Worker in dev",
          price: 1.0,
          category: "mock",
          tags: ["msw"],
          inStock: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      meta: { total: 1, limit: 20, offset: 0, provider: "msw" },
    })
  ),
];

export async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== "true") return;
  const worker = setupWorker(...handlers);
  await worker.start({ onUnhandledRequest: "bypass" });
  console.info("[MSW] Mock API enabled");
}
