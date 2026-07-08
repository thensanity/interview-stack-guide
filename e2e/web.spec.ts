import { test, expect } from "@playwright/test";

test.describe("Web UI E2E", () => {
  test.skip(!process.env.E2E_WEB_URL, "Set E2E_WEB_URL=http://localhost:3000 to run web E2E");

  test("home page loads", async ({ page }) => {
    await page.goto(process.env.E2E_WEB_URL!);
    await expect(page.getByRole("heading", { name: /interview stack guide/i })).toBeVisible();
  });

  test("products page lists items", async ({ page }) => {
    await page.goto(`${process.env.E2E_WEB_URL}/products`);
    await expect(page.getByRole("heading", { name: /products/i })).toBeVisible();
  });
});
