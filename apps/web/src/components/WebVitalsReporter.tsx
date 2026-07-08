"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";

/** Real User Monitoring demo — interview: Core Web Vitals in production */
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      console.log(JSON.stringify({ webVital: metric.name, value: metric.value, id: metric.id }));
    }
  });

  useEffect(() => {
    /* Production: send to analytics endpoint */
  }, []);

  return null;
}
