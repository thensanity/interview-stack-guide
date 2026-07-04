import type { ProductRepository } from "@interview/db";

const SAMPLE_PRODUCTS = [
  {
    name: "Mechanical Keyboard",
    description: "Cherry MX switches, RGB backlight, interview favorite talking point for UX",
    price: 129.99,
    category: "electronics",
    tags: ["peripherals", "coding"],
  },
  {
    name: "System Design Whiteboard",
    description: "4x3 ft magnetic whiteboard for architecture diagrams",
    price: 89.0,
    category: "office",
    tags: ["interview-prep"],
  },
  {
    name: "Cloud Native Handbook",
    description: "Covers Kubernetes, AWS, and CI/CD patterns",
    price: 49.99,
    category: "books",
    tags: ["kubernetes", "aws"],
  },
];

/** Seeds demo data when DB is empty — used by docker compose --profile full */
export async function seedIfEmpty(repo: ProductRepository): Promise<number> {
  const count = await repo.count();
  if (count > 0) return 0;

  for (const product of SAMPLE_PRODUCTS) {
    await repo.create(product);
  }
  return SAMPLE_PRODUCTS.length;
}
