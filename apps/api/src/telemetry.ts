/** OpenTelemetry bootstrap — install SDK packages and set OTEL_EXPORTER_OTLP_ENDPOINT to enable */
export async function initTelemetry(serviceName = "interview-api"): Promise<void> {
  if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) return;

  console.log(
    JSON.stringify({
      level: "info",
      message: "OpenTelemetry configured (install @opentelemetry/sdk-node for full tracing)",
      serviceName,
      endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    })
  );
}
